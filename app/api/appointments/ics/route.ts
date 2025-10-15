/**
 * GET /api/appointments/ics?id=...
 * Generate .ics file for appointment
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/shared/lib/prisma';
import { generateICS } from '@/src/shared/lib/calendar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment id is required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            title: true,
            description: true,
          },
        },
        master: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const startTime = appointment.dateTime;
    const endTime = new Date(startTime.getTime() + appointment.durationMin * 60000);

    const masterName = appointment.master.name || 'Мастер';
    const title = `${appointment.service.title} - ${masterName}`;
    const description = appointment.service.description || appointment.notes || '';
    const location = appointment.location || '';

    const icsContent = generateICS({
      uid: `appointment-${appointment.id}@nails-service.app`,
      title,
      description,
      location,
      startTime,
      endTime,
    });

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="appointment-${appointment.id}.ics"`,
      },
    });
  } catch (error) {
    console.error('[ics] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

