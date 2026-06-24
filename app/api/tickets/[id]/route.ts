import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH /api/tickets/[id] - Update ticket status or add a message reply
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, replyText, replyFrom } = body;

    // Handle status update
    if (status) {
      const ticket = await prisma.ticket.update({
        where: { id },
        data: { status },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });

      await prisma.activityFeed.create({
        data: {
          action: `${status === 'closed' ? 'resolved' : 'reopened'} ticket "${id}"`,
          user: 'Administrator',
          time: 'Just now',
        },
      });

      return NextResponse.json(ticket);
    }

    // Handle reply message
    if (replyText && replyFrom) {
      const newMessage = await prisma.message.create({
        data: {
          sender: replyFrom,
          text: replyText,
          date: new Date().toLocaleString(),
          ticketId: id,
        },
      });

      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });

      return NextResponse.json(ticket);
    }

    return NextResponse.json({ error: 'No valid action provided' }, { status: 400 });
  } catch (error) {
    console.error('PATCH /api/tickets/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

// GET /api/tickets/[id] - Get a specific ticket with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('GET /api/tickets/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}
