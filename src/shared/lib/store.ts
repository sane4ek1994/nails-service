/**
 * Zustand stores for global state management
 */

import { create } from 'zustand';

// Auth Store
export interface AuthUser {
  id: string;
  role: 'MASTER' | 'CLIENT';
  name?: string;
  phone?: string;
  email?: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
}));

// Booking Store
export interface Service {
  id: string;
  title: string;
  description?: string;
  durationMin: number;
  priceCents: number;
}

export interface TimeSlot {
  startTime: string; // ISO string
  endTime: string;   // ISO string
  available: boolean;
}

interface BookingStore {
  selectedService: Service | null;
  selectedDate: string | null; // YYYY-MM-DD
  selectedSlot: TimeSlot | null;
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedService: null,
  selectedDate: null,
  selectedSlot: null,
  setSelectedService: (selectedService) => set({ selectedService }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedSlot: (selectedSlot) => set({ selectedSlot }),
  reset: () => set({ selectedService: null, selectedDate: null, selectedSlot: null }),
}));

