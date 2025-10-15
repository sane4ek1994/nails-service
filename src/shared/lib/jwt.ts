/**
 * JWT utilities for session management
 */

import { SignJWT, jwtVerify } from 'jose';
import { JWT_SECRET, JWT_EXPIRY_DAYS } from './constants';

const secret = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  userId: string;
  role: 'MASTER' | 'CLIENT';
}

/**
 * Create JWT token for user session
 */
export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRY_DAYS}d`)
    .sign(secret);
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

