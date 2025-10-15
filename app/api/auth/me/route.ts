/**
 * GET /api/auth/me
 * Get current user session
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/shared/lib/prisma';
import { verifyToken } from '@/src/shared/lib/jwt';
import { JWT_COOKIE_NAME } from '@/src/shared/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(JWT_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        role: true,
        name: true,
        phone: true,
        email: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('[me] Error:', error);
    return NextResponse.json({ user: null });
  }
}

