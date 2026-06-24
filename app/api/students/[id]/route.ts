import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH /api/students/[id] - Update tuition or medical status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tuitionStatus, medicalStatus } = body;

    const updateData: { tuitionStatus?: string; medicalStatus?: string } = {};
    if (tuitionStatus) updateData.tuitionStatus = tuitionStatus;
    if (medicalStatus) updateData.medicalStatus = medicalStatus;

    const student = await prisma.student.update({
      where: { id },
      data: updateData,
    });

    // Log to activity feed
    if (tuitionStatus === 'Paid') {
      await prisma.activityFeed.create({
        data: {
          action: 'updated tuition status to PAID',
          user: student.name,
          time: 'Just now',
        },
      });
    }
    if (medicalStatus === 'Cleared') {
      await prisma.activityFeed.create({
        data: {
          action: 'approved medical clearance',
          user: student.name,
          time: 'Just now',
        },
      });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('PATCH /api/students/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
