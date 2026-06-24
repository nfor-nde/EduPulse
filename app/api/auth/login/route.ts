import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signToken, COOKIE_NAME } from '@/lib/jwt';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matricule, password } = body;

    if (!matricule || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Password check (in production this would be a hash comparison)
    if (password !== 'password') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { matricule: matricule.trim() },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 401 });
    }

    // Sign JWT token
    const token = await signToken({
      studentId: student.id,
      matricule: student.matricule,
      name: student.name,
    });

    // Set as httpOnly cookie (7 days)
    const response = NextResponse.json(student);
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
