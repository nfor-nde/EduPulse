import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/activity - Fetch recent activity feed
export async function GET() {
  try {
    const activities = await prisma.activityFeed.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to last 20 entries
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.error('GET /api/activity error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
