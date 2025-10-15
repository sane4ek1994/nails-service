/**
 * POST /api/appointments/create
 * Create new appointment with conflict protection
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/shared/lib/prisma';
import { verifyToken } from '@/src/shared/lib/jwt';
import { JWT_COOKIE_NAME } from '@/src/shared/lib/constants';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
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

    const body = await request.json();
    const { masterId, serviceId, startTime, notes } = body;

    if (!masterId || !serviceId || !startTime) {
      return NextResponse.json(
        { error: 'masterId, serviceId, and startTime are required' },
        { status: 400 }
      );
    }

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        durationMin: true,
        masterId: true,
        isActive: true,
      },
    });

    if (!service || !service.isActive) {
      return NextResponse.json(
        { error: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    if (service.masterId !== masterId) {
      return NextResponse.json(
        { error: 'Service does not belong to this master' },
        { status: 400 }
      );
    }

    const appointmentStart = new Date(startTime);
    const appointmentEnd = new Date(appointmentStart.getTime() + service.durationMin * 60000);

    // Use transaction to prevent race conditions
    const appointment = await prisma.$transaction(async (tx) => {
      // Check for conflicts
      const conflicts = await tx.appointment.findMany({
        where: {
          masterId,
          status: {
            in: ['booked', 'confirmed'],
          },
          OR: [
            // New appointment starts during existing appointment
            {
              dateTime: {
                lte: appointmentStart,
              },
              // dateTime + durationMin > appointmentStart
            },
            // New appointment ends during existing appointment
            {
              dateTime: {
                gte: appointmentStart,
                lt: appointmentEnd,
              },
            },
          ],
        },
        select: {
          id: true,
          dateTime: true,
          durationMin: true,
        },
      });

      // Manual conflict check (more precise)
      const hasConflict = conflicts.some((apt) => {
        const aptStart = apt.dateTime;
        const aptEnd = new Date(aptStart.getTime() + apt.durationMin * 60000);

        return (
          (appointmentStart >= aptStart && appointmentStart < aptEnd) ||
          (appointmentEnd > aptStart && appointmentEnd <= aptEnd) ||
          (appointmentStart <= aptStart && appointmentEnd >= aptEnd)
        );
      });

      if (hasConflict) {
        throw new Error('Time slot is already booked');
      }

      // Create appointment
      return tx.appointment.create({
        data: {
          masterId,
          clientId: payload.userId,
          serviceId,
          dateTime: appointmentStart,
          durationMin: service.durationMin,
          status: 'booked',
          notes: notes || null,
        },
        include: {
          service: {
            select: {
              title: true,
              priceCents: true,
            },
          },
          master: {
            select: {
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        dateTime: appointment.dateTime.toISOString(),
        durationMin: appointment.durationMin,
        status: appointment.status,
        service: appointment.service,
        master: appointment.master,
      },
    });
  } catch (error) {
    console.error('[create-appointment] Error:', error);

    if (error instanceof Error && error.message === 'Time slot is already booked') {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please choose another time.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

