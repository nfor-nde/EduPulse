import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/jwt';

// GET /api/auth/me - Restore session from cookie
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      // Token invalid or expired — clear the cookie
      const response = NextResponse.json({ error: 'Session expired' }, { status: 401 });
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    // Fetch fresh student data from DB (to get latest tuition/medical status)
    const student = await prisma.student.findUnique({
      where: { id: payload.studentId },
    });

    if (!student) {
      const response = NextResponse.json({ error: 'Student not found' }, { status: 401 });
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('GET /api/auth/me error:', error);
    return NextResponse.json({ error: 'Session verification failed' }, { status: 500 });
  }
}
