/**
 * GET /api/services?masterId=...
 * Get active services for a master
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/shared/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const masterId = searchParams.get('masterId');

    if (!masterId) {
      return NextResponse.json(
        { error: 'masterId is required' },
        { status: 400 }
      );
    }

    const services = await prisma.service.findMany({
      where: {
        masterId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        durationMin: true,
        priceCents: true,
      },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('[services] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

