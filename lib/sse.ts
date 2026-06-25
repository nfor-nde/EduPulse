/**
 * In-process Server-Sent Events pub/sub for real-time ticket updates.
 * Works well for single-instance deployments (dev + typical self-hosted production).
 * For multi-instance production, replace with Redis pub/sub.
 */

type SSEClient = {
  id: string;
  stream: ReadableStreamDefaultController;
};

// Global store of active SSE connections
const clients = new Map<string, SSEClient>();

let clientCounter = 0;

/**
 * Register a new SSE client and return its ID.
 */
export function registerSSEClient(controller: ReadableStreamDefaultController): string {
  const id = `sse-${++clientCounter}-${Date.now()}`;
  clients.set(id, { id, stream: controller });
  return id;
}

/**
 * Remove a client when the connection closes.
 */
export function removeSSEClient(id: string): void {
  clients.delete(id);
}

/**
 * Broadcast a JSON event to ALL connected SSE clients.
 */
export function broadcastSSE(event: string, data: unknown): void {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const encoded = new TextEncoder().encode(message);

  const deadClients: string[] = [];
  for (const [id, client] of clients) {
    try {
      client.stream.enqueue(encoded);
    } catch {
      // Client disconnected
      deadClients.push(id);
    }
  }
  // Clean up dead connections
  for (const id of deadClients) clients.delete(id);
}

/**
 * Send a keep-alive ping to prevent connection timeouts.
 */
export function pingAllClients(): void {
  const ping = new TextEncoder().encode(': ping\n\n');
  const deadClients: string[] = [];
  for (const [id, client] of clients) {
    try {
      client.stream.enqueue(ping);
    } catch {
      deadClients.push(id);
    }
  }
  for (const id of deadClients) clients.delete(id);
}

// Keep-alive every 25 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(pingAllClients, 25000);
}
