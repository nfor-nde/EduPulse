import { NextRequest } from 'next/server';
import { registerSSEClient, removeSSEClient } from '@/lib/sse';

/**
 * GET /api/tickets/stream — Server-Sent Events endpoint for real-time ticket updates.
 *
 * Clients connect with EventSource and receive events whenever:
 * - A new reply is added to a ticket
 * - A ticket status changes (open/closed)
 *
 * Events:
 *   event: ticket_updated
 *   data: { ticketId, type: "reply" | "status", ticket: Ticket }
 */
export async function GET(request: NextRequest) {
  let clientId: string;

  const stream = new ReadableStream({
    start(controller) {
      clientId = registerSSEClient(controller);

      // Send initial connected event
      const connected = new TextEncoder().encode(
        `event: connected\ndata: {"message":"SSE connection established"}\n\n`
      );
      controller.enqueue(connected);
    },
    cancel() {
      // Client disconnected
      if (clientId) removeSSEClient(clientId);
    },
  });

  // Detect client disconnect via request abort signal
  request.signal.addEventListener('abort', () => {
    if (clientId) removeSSEClient(clientId);
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}
