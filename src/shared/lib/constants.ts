/**
 * Application-wide constants
 */

// OTP Configuration
export const OTP_CODE_LENGTH = 6;
export const OTP_TTL_MINUTES = 10;
export const OTP_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const OTP_MAX_REQUESTS_PER_WINDOW = 3;

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRY_DAYS = 30;
export const JWT_COOKIE_NAME = 'session';

// Booking Configuration
export const SLOT_STEP_MINUTES = 15; // Slot intervals (15 minutes)
export const DEFAULT_SERVICE_DURATION = 60; // Default service duration in minutes

// UI Configuration
export const THEME_COLOR = '#111827'; // gray-900 for PWA manifest

