/**
 * Shared utility functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize phone or email for verification
 */
export function normalizeTarget(target: string): string {
  const trimmed = target.trim().toLowerCase();
  
  // If it's a phone number, remove all non-digits
  if (/^[\d\s\-\+\(\)]+$/.test(trimmed)) {
    return trimmed.replace(/\D/g, '');
  }
  
  // Otherwise treat as email
  return trimmed;
}

/**
 * Generate random 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check if target is email or phone
 */
export function isEmail(target: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target);
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format time in minutes from midnight to HH:MM
 */
export function formatTimeFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Parse HH:MM to minutes from midnight
 */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format price in cents to display string
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(cents / 100);
}

