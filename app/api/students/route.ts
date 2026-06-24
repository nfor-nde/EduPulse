import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/students - Fetch all students
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get('search') || '';
  const faculty = searchParams.get('faculty') || '';
  const dept = searchParams.get('dept') || '';
  const level = searchParams.get('level') || '';
  const tuitionStatus = searchParams.get('tuitionStatus') || '';
  const medicalStatus = searchParams.get('medicalStatus') || '';

  try {
    const students = await prisma.student.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search } },
                  { matricule: { contains: search } },
                  { instEmail: { contains: search } },
                ],
              }
            : {},
          faculty ? { faculty: { equals: faculty } } : {},
          dept ? { dept: { equals: dept } } : {},
          level ? { level: { equals: parseInt(level) } } : {},
          tuitionStatus ? { tuitionStatus: { equals: tuitionStatus } } : {},
          medicalStatus ? { medicalStatus: { equals: medicalStatus } } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error('GET /api/students error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
