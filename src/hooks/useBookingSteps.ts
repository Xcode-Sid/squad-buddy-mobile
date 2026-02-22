import { useState, useCallback } from 'react';
import type { BookingType } from '../types';

export const BOOKING_STEPS = ['Date & Time', 'Booking Type', 'Players', 'Payment', 'Confirmed'] as const;
export type BookingStep = 0 | 1 | 2 | 3 | 4;

export interface BookingState {
  step: BookingStep;
  selectedDate: string;
  selectedTime: string;
  bookingType: BookingType;
  selectedPlayers: string[];
}

export function useBookingSteps() {
  const [state, setState] = useState<BookingState>({
    step: 0,
    selectedDate: '',
    selectedTime: '',
    bookingType: 'single',
    selectedPlayers: [],
  });

  const nextStep = useCallback(() =>
    setState((s) => ({ ...s, step: Math.min(s.step + 1, 4) as BookingStep })), []);
  const prevStep = useCallback(() =>
    setState((s) => ({ ...s, step: Math.max(s.step - 1, 0) as BookingStep })), []);
  const setDate = useCallback((date: string) =>
    setState((s) => ({ ...s, selectedDate: date })), []);
  const setTime = useCallback((time: string) =>
    setState((s) => ({ ...s, selectedTime: time })), []);
  const setBookingType = useCallback((bookingType: BookingType) =>
    setState((s) => ({ ...s, bookingType })), []);
  const togglePlayer = useCallback((playerId: string) =>
    setState((s) => ({
      ...s,
      selectedPlayers: s.selectedPlayers.includes(playerId)
        ? s.selectedPlayers.filter((id) => id !== playerId)
        : [...s.selectedPlayers, playerId],
    })), []);

  return { ...state, nextStep, prevStep, setDate, setTime, setBookingType, togglePlayer };
}
