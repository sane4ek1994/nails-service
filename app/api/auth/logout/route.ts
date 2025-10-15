/**
 * POST /api/auth/logout
 * Clear session cookie
 */

import { NextResponse } from 'next/server';
import { JWT_COOKIE_NAME } from '@/src/shared/lib/constants';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.delete(JWT_COOKIE_NAME);
  
  return response;
}

