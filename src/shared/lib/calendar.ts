/**
 * Calendar utilities for .ics generation and Google Calendar URLs
 */

/**
 * Format date for iCalendar (YYYYMMDDTHHMMSSZ)
 */
export function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generate .ics file content
 */
export function generateICS(params: {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
}): string {
  const { uid, title, description, location, startTime, endTime } = params;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nails Service//PWA//RU',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICalDate(new Date())}`,
    `DTSTART:${formatICalDate(startTime)}`,
    `DTEND:${formatICalDate(endTime)}`,
    `SUMMARY:${title}`,
  ];

  if (description) {
    lines.push(`DESCRIPTION:${description.replace(/\n/g, '\\n')}`);
  }

  if (location) {
    lines.push(`LOCATION:${location}`);
  }

  lines.push('STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarURL(params: {
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
}): string {
  const { title, description, location, startTime, endTime } = params;

  const baseURL = 'https://calendar.google.com/calendar/r/eventedit';
  const searchParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatICalDate(startTime)}/${formatICalDate(endTime)}`,
  });

  if (description) {
    searchParams.set('details', description);
  }

  if (location) {
    searchParams.set('location', location);
  }

  return `${baseURL}?${searchParams.toString()}`;
}

