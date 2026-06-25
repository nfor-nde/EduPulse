import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const [pastPapersCount, videoTutorialsCount, activeStudentsCount, distinctFaculties] = await Promise.all([
      prisma.resource.count({
        where: { type: 'pastpaper' }
      }),
      prisma.resource.count({
        where: { type: 'youtube' }
      }),
      prisma.student.count(),
      prisma.student.findMany({
        select: { faculty: true },
        distinct: ['faculty']
      })
    ]);

    return NextResponse.json({
      pastPapers: pastPapersCount,
      videoTutorials: videoTutorialsCount,
      activeStudents: activeStudentsCount,
      faculties: distinctFaculties.length
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch database stats' }, { status: 500 });
  }
}
