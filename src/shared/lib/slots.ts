/**
 * Slot generation utilities
 */

import { prisma } from './prisma';
import { SLOT_STEP_MINUTES } from './constants';

export interface SlotParams {
  masterId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
}

export interface Slot {
  startTime: string; // ISO string
  endTime: string;   // ISO string
  available: boolean;
}

/**
 * Generate available time slots for a given date
 */
export async function generateSlots(params: SlotParams): Promise<Slot[]> {
  const { masterId, serviceId, date } = params;

  // Get service duration
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { durationMin: true },
  });

  if (!service) {
    return [];
  }

  const serviceDuration = service.durationMin;

  // Parse date
  const targetDate = new Date(date + 'T00:00:00.000Z');

  // Get availability for this date
  const availabilities = await prisma.availability.findMany({
    where: {
      masterId,
      date: targetDate,
      isBlocked: false,
    },
  });

  if (availabilities.length === 0) {
    return [];
  }

  // Get existing appointments for this date
  const startOfDay = new Date(date + 'T00:00:00.000Z');
  const endOfDay = new Date(date + 'T23:59:59.999Z');

  const appointments = await prisma.appointment.findMany({
    where: {
      masterId,
      dateTime: {
        gte: startOfDay,
        lt: endOfDay,
      },
      status: {
        in: ['booked', 'confirmed'],
      },
    },
    select: {
      dateTime: true,
      durationMin: true,
    },
  });

  // Generate all possible slots
  const slots: Slot[] = [];

  for (const availability of availabilities) {
    let currentMin = availability.startMin;

    while (currentMin + serviceDuration <= availability.endMin) {
      const slotStart = new Date(targetDate);
      slotStart.setUTCMinutes(currentMin);

      const slotEnd = new Date(slotStart);
      slotEnd.setUTCMinutes(slotStart.getUTCMinutes() + serviceDuration);

      // Check if slot conflicts with any appointment
      const hasConflict = appointments.some((apt) => {
        const aptStart = apt.dateTime;
        const aptEnd = new Date(aptStart.getTime() + apt.durationMin * 60000);
        
        return (
          (slotStart >= aptStart && slotStart < aptEnd) ||
          (slotEnd > aptStart && slotEnd <= aptEnd) ||
          (slotStart <= aptStart && slotEnd >= aptEnd)
        );
      });

      slots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        available: !hasConflict,
      });

      currentMin += SLOT_STEP_MINUTES;
    }
  }

  return slots;
}

