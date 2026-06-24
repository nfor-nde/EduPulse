import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/tickets - Fetch all tickets, optionally filtered by studentMatricule
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const matricule = searchParams.get('matricule') || '';

  try {
    const tickets = await prisma.ticket.findMany({
      where: matricule ? { studentMatricule: matricule } : {},
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error('GET /api/tickets error:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentMatricule, subject, description } = body;

    if (!studentMatricule || !subject || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const ticket = await prisma.ticket.create({
      data: {
        studentMatricule,
        subject,
        description,
        status: 'open',
        date: today,
        messages: {
          create: {
            sender: 'student',
            text: description,
            date: new Date().toLocaleString(),
          },
        },
      },
      include: { messages: true },
    });

    // Log activity
    const student = await prisma.student.findUnique({ where: { matricule: studentMatricule } });
    if (student) {
      await prisma.activityFeed.create({
        data: {
          action: `opened a support ticket: "${subject}"`,
          user: student.name,
          time: 'Just now',
        },
      });
    }

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('POST /api/tickets error:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
