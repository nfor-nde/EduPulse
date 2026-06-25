import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/jwt';

// POST /api/interactions — record a student interaction with a resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resourceId, action, duration, metadata } = body;

    if (!resourceId || !action) {
      return NextResponse.json({ error: 'Missing resourceId or action' }, { status: 400 });
    }

    const validActions = ['view', 'click', 'download', 'complete', 'search'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get studentId from JWT cookie if logged in (optional — anonymous interactions are still useful)
    let studentId: string | null = null;
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) studentId = payload.studentId;
    }

    // If no studentId and no body studentId, skip (we need at least one)
    if (!studentId && body.studentId) {
      studentId = body.studentId;
    }

    if (!studentId) {
      // Anonymous interaction — skip silently (don't expose errors to guest users)
      return NextResponse.json({ ok: true, note: 'anonymous' }, { status: 200 });
    }

    // Verify resource exists before inserting
    const resource = await prisma.resource.findUnique({ where: { id: resourceId }, select: { id: true } });
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const interaction = await prisma.studentInteraction.create({
      data: {
        studentId,
        resourceId,
        action,
        duration: typeof duration === 'number' ? duration : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({ ok: true, id: interaction.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/interactions error:', err);
    return NextResponse.json({ error: 'Failed to record interaction' }, { status: 500 });
  }
}

// GET /api/interactions?studentId=... — for analytics / future recommendation engine
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const resourceId = searchParams.get('resourceId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

    const where: Record<string, string> = {};
    if (studentId) where.studentId = studentId;
    if (resourceId) where.resourceId = resourceId;

    const interactions = await prisma.studentInteraction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(interactions);
  } catch (err) {
    console.error('GET /api/interactions error:', err);
    return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 });
  }
}
