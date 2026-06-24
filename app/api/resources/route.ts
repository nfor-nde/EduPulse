import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/resources - Fetch resources with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get('search') || '';
  const faculty = searchParams.get('faculty') || '';
  const dept = searchParams.get('dept') || '';
  const level = searchParams.get('level') || '';
  const type = searchParams.get('type') || '';

  try {
    const resources = await prisma.resource.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } },
                ],
              }
            : {},
          faculty ? { faculty: { equals: faculty } } : {},
          dept ? { dept: { equals: dept } } : {},
          level ? { level: { equals: parseInt(level) } } : {},
          type ? { type: { equals: type } } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('GET /api/resources error:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

// POST /api/resources - Create a new resource (Admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, url, faculty, dept, level } = body;

    const resource = await prisma.resource.create({
      data: { title, description, type, url, faculty, dept, level: parseInt(level) },
    });
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('POST /api/resources error:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
