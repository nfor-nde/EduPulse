import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/auth/login - Authenticate a student by matricule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matricule, password } = body;

    if (!matricule || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Simulate password check - in a real app, you'd hash compare
    if (password !== 'password') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { matricule: matricule.trim() },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 401 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
