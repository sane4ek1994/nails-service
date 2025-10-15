/**
 * GET /api/slots?masterId=...&serviceId=...&date=YYYY-MM-DD
 * Get available time slots
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateSlots } from '@/src/shared/lib/slots';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const masterId = searchParams.get('masterId');
    const serviceId = searchParams.get('serviceId');
    const date = searchParams.get('date');

    if (!masterId || !serviceId || !date) {
      return NextResponse.json(
        { error: 'masterId, serviceId, and date are required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const slots = await generateSlots({ masterId, serviceId, date });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('[slots] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

