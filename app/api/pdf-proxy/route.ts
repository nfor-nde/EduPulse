import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side PDF proxy to bypass CORS restrictions on external PDF URLs.
 * react-pdf cannot fetch external PDFs directly due to CORS.
 * This route fetches the PDF server-side and re-serves it with proper headers.
 *
 * Usage: /api/pdf-proxy?url=ENCODED_PDF_URL
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');

  if (!pdfUrl) {
    return NextResponse.json({ error: 'Missing ?url parameter' }, { status: 400 });
  }

  // Basic URL validation — only allow http/https
  let targetUrl: URL;
  try {
    targetUrl = new URL(pdfUrl);
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const upstream = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EduPulse/1.0; +https://edupulse.edu)',
        'Accept': 'application/pdf, */*',
      },
      // 30 second timeout
      signal: AbortSignal.timeout(30000),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: upstream.status }
      );
    }

    const pdfBuffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('content-type') || 'application/pdf';

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('PDF proxy error:', err);
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 502 });
  }
}
