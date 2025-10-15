/**
 * POST /api/auth/verify-code
 * Verify OTP code and create session
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/shared/lib/prisma';
import { normalizeTarget, isEmail } from '@/src/shared/lib/utils';
import { createToken } from '@/src/shared/lib/jwt';
import { JWT_COOKIE_NAME, JWT_EXPIRY_DAYS } from '@/src/shared/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target, code } = body;

    if (!target || !code) {
      return NextResponse.json(
        { error: 'Target and code are required' },
        { status: 400 }
      );
    }

    const normalizedTarget = normalizeTarget(target);

    // Find valid verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        target: normalizedTarget,
        code: code.toString(),
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verificationCode) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 401 }
      );
    }

    // Mark code as used
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true },
    });

    // Find or create user
    const targetIsEmail = isEmail(target);
    let user = await prisma.user.findFirst({
      where: targetIsEmail
        ? { email: normalizedTarget }
        : { phone: normalizedTarget },
    });

    if (!user) {
      // Create new user (default role: CLIENT)
      user = await prisma.user.create({
        data: {
          role: 'CLIENT',
          ...(targetIsEmail
            ? { email: normalizedTarget }
            : { phone: normalizedTarget }),
        },
      });
    }

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      role: user.role,
    });

    // Set httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    });

    response.cookies.set(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: JWT_EXPIRY_DAYS * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[verify-code] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

