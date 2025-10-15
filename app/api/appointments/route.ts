/**
 * GET /api/appointments?masterId=... or clientId=...
 * Get appointments for master or client
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/shared/lib/prisma';
import { verifyToken } from '@/src/shared/lib/jwt';
import { JWT_COOKIE_NAME } from '@/src/shared/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(JWT_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const masterId = searchParams.get('masterId');
    const clientId = searchParams.get('clientId');

    const whereClause: any = {};

    if (masterId) {
      whereClause.masterId = masterId;
    } else if (clientId) {
      whereClause.clientId = clientId;
    } else {
      // Default to current user's appointments
      whereClause[payload.role === 'MASTER' ? 'masterId' : 'clientId'] = payload.userId;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        service: {
          select: {
            title: true,
            durationMin: true,
            priceCents: true,
          },
        },
        client: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        master: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        dateTime: 'desc',
      },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('[appointments] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

