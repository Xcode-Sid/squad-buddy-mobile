import { colors } from '../theme/colors';
import type { AvailabilityStatus, BookingStatus, TournamentStatus, SlotStatus } from '../types';

export function getAvailabilityColor(status: AvailabilityStatus): { bg: string; text: string } {
  const map: Record<AvailabilityStatus, { bg: string; text: string }> = {
    available: { bg: colors.primary + '1A', text: colors.primary },
    "few-slots": { bg: colors.accent + '1A', text: colors.accent },
    "fully-booked": { bg: colors.destructive + '1A', text: colors.destructive },
  };
  return map[status];
}

export function getAvailabilityLabel(status: AvailabilityStatus): string {
  const map: Record<AvailabilityStatus, string> = {
    available: "Available",
    "few-slots": "Few Slots",
    "fully-booked": "Fully Booked",
  };
  return map[status];
}

export function getBookingStatusColor(status: BookingStatus): { bg: string; text: string } {
  const map: Record<BookingStatus, { bg: string; text: string }> = {
    confirmed: { bg: colors.primary + '1A', text: colors.primary },
    pending: { bg: colors.accent + '1A', text: colors.accent },
    cancelled: { bg: colors.destructive + '1A', text: colors.destructive },
  };
  return map[status];
}

export function getTournamentStatusColor(status: TournamentStatus): { bg: string; text: string } {
  const map: Record<TournamentStatus, { bg: string; text: string }> = {
    registration: { bg: colors.accent + '1A', text: colors.accent },
    "in-progress": { bg: colors.primary + '1A', text: colors.primary },
    completed: { bg: colors.muted, text: colors.mutedForeground },
  };
  return map[status];
}

export function getTournamentStatusLabel(status: TournamentStatus): string {
  const map: Record<TournamentStatus, string> = {
    registration: "Open",
    "in-progress": "In Progress",
    completed: "Completed",
  };
  return map[status];
}

export function getSlotColor(status: SlotStatus): { bg: string; text: string } {
  const map: Record<SlotStatus, { bg: string; text: string }> = {
    available: { bg: colors.primary + '33', text: colors.primary },
    few: { bg: colors.accent + '33', text: colors.accent },
    booked: { bg: colors.destructive + '1A', text: colors.destructive + '80' },
  };
  return map[status];
}
