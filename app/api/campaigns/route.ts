import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/campaigns - Fetch all campaigns
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('GET /api/campaigns error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// POST /api/campaigns - Create and "send" a new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, audience, message } = body;

    if (!title || !audience || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        audience,
        message,
        sentDate: new Date().toISOString().split('T')[0],
        status: 'Sent',
      },
    });

    // Log activity
    await prisma.activityFeed.create({
      data: {
        action: `broadcasted campaign: "${title}" to ${audience}`,
        user: 'Administrator',
        time: 'Just now',
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('POST /api/campaigns error:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
