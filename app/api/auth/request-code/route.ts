/**
 * POST /api/auth/request-code
 * Request OTP verification code
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/shared/lib/prisma';
import { normalizeTarget, generateOTP } from '@/src/shared/lib/utils';
import { OTP_TTL_MINUTES } from '@/src/shared/lib/constants';

// Simple in-memory rate limiter (for MVP; use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }

  if (record.count >= 3) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target } = body;

    if (!target || typeof target !== 'string') {
      return NextResponse.json(
        { error: 'Target (phone or email) is required' },
        { status: 400 }
      );
    }

    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const normalizedTarget = normalizeTarget(target);
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    // Invalidate previous codes for this target
    await prisma.verificationCode.updateMany({
      where: {
        target: normalizedTarget,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Create new verification code
    await prisma.verificationCode.create({
      data: {
        target: normalizedTarget,
        code,
        expiresAt,
      },
    });

    // TODO: Send code via SMS/Email (for MVP, just log it)
    console.log(`[OTP] Code for ${normalizedTarget}: ${code} (expires at ${expiresAt.toISOString()})`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      // In development, return code for testing
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
  } catch (error) {
    console.error('[request-code] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

