import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-key'
);
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  studentId: string;
  matricule: string;
  name: string;
}

/**
 * Sign a JWT token for a given student
 */
export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token. Returns null if invalid or expired.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      studentId: payload.studentId as string,
      matricule: payload.matricule as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export const COOKIE_NAME = 'edupulse_session';
