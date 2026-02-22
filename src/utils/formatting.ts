import { colors } from '../theme/colors';

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString()} ALL`;
}

export function formatViewers(count: number): string {
  return count.toLocaleString();
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export function getBookingStatusStyle(status: BookingStatus): { backgroundColor: string; color: string } {
  const map: Record<BookingStatus, { backgroundColor: string; color: string }> = {
    confirmed: { backgroundColor: colors.primary + '1A', color: colors.primary },
    pending: { backgroundColor: colors.accent + '1A', color: colors.accent },
    cancelled: { backgroundColor: colors.destructive + '1A', color: colors.destructive },
  };
  return map[status] ?? map.pending;
}
