import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail, buildCampaignEmail } from '@/lib/email';

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

// POST /api/campaigns - Create and broadcast a new campaign with email delivery
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, audience, message } = body;

    if (!title || !audience || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sentDate = new Date().toISOString().split('T')[0];

    // Create campaign record in DB
    const campaign = await prisma.campaign.create({
      data: { title, audience, message, sentDate, status: 'Sent' },
    });

    // Log activity
    await prisma.activityFeed.create({
      data: {
        action: `broadcasted campaign: "${title}" to ${audience}`,
        user: 'Administrator',
        time: 'Just now',
      },
    });

    // --- Build recipient query based on audience filter ---
    // Fire-and-forget: don't await so the API response is instant
    buildAndSendEmails(campaign.id, title, message, sentDate, audience).catch((err) =>
      console.error('Campaign email error (background):', err)
    );

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('POST /api/campaigns error:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

/**
 * Asynchronously fetch matching students and send campaign emails.
 * Runs in the background so the API response is not delayed.
 */
async function buildAndSendEmails(
  campaignId: string,
  title: string,
  message: string,
  sentDate: string,
  audience: string
) {
  // Build a prisma where clause based on audience string
  type StudentsWhere = {
    faculty?: string;
    level?: number;
  };
  const where: StudentsWhere = {};

  if (audience !== 'All Students') {
    // Try matching by faculty name
    const facultyMatch = await prisma.student.findFirst({
      where: { faculty: { contains: audience } },
      select: { faculty: true },
    });
    if (facultyMatch) {
      where.faculty = facultyMatch.faculty;
    } else if (audience.startsWith('Level')) {
      const level = parseInt(audience.replace(/\D/g, ''));
      if (!isNaN(level)) where.level = level;
    }
  }

  const students = await prisma.student.findMany({
    where,
    select: { instEmail: true, personalEmail: true, name: true },
    take: 5000, // cap per send
  });

  if (students.length === 0) {
    console.log(`[Campaign ${campaignId}] No matching students for audience: ${audience}`);
    return;
  }

  console.log(`[Campaign ${campaignId}] Sending to ${students.length} students...`);

  const html = buildCampaignEmail({ title, message, sentDate });

  // Send to all unique email addresses (both personal and institutional)
  const allEmails = new Set<string>();
  for (const s of students) {
    if (s.instEmail) allEmails.add(s.instEmail);
    if (s.personalEmail) allEmails.add(s.personalEmail);
  }

  // Batch send in chunks to avoid memory/connection issues
  const emailList = Array.from(allEmails);
  const CHUNK_SIZE = 50;
  for (let i = 0; i < emailList.length; i += CHUNK_SIZE) {
    const chunk = emailList.slice(i, i + CHUNK_SIZE);
    await sendEmail({ to: chunk, subject: `[EduPulse] ${title}`, html });
    console.log(
      `[Campaign ${campaignId}] Sent batch ${Math.ceil((i + 1) / CHUNK_SIZE)} / ${Math.ceil(emailList.length / CHUNK_SIZE)}`
    );
  }

  console.log(`[Campaign ${campaignId}] Email broadcast complete.`);
}
