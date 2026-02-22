export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  emoji: string;
  pointsCost: number;
  category: "discount" | "freebie" | "upgrade" | "exclusive";
  available: boolean;
}

export interface LoyaltyProfile {
  points: number;
  totalEarned: number;
  tier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  pointsToNextTier: number;
  memberSince: string;
  streakDays: number;
  multiplier: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minBookingAmount?: number;
  expiresAt: string;
  isUsed: boolean;
  sport?: string;
}

export const MOCK_LOYALTY: LoyaltyProfile = {
  points: 4850,
  totalEarned: 12400,
  tier: "gold",
  nextTier: "platinum",
  pointsToNextTier: 5150,
  memberSince: "2023-01",
  streakDays: 12,
  multiplier: 1.5,
};

export const MOCK_REWARDS: LoyaltyReward[] = [
  { id: "lr1", name: "10% Off Next Booking", description: "Get 10% off your next field booking", emoji: "🏷️", pointsCost: 500, category: "discount", available: true },
  { id: "lr2", name: "Free Hour of Play", description: "1 free hour at any standard field", emoji: "🎁", pointsCost: 2000, category: "freebie", available: true },
  { id: "lr3", name: "Equipment Rental Free", description: "Free equipment rental for your next game", emoji: "🎽", pointsCost: 800, category: "freebie", available: true },
  { id: "lr4", name: "VIP Locker Room", description: "Access VIP changing room at premium venues", emoji: "👑", pointsCost: 1500, category: "upgrade", available: true },
  { id: "lr5", name: "Priority Booking", description: "Get priority booking for peak hours for 1 week", emoji: "⚡", pointsCost: 3000, category: "upgrade", available: true },
  { id: "lr6", name: "25% Off Tournament Entry", description: "Discounted tournament registration", emoji: "🏆", pointsCost: 1200, category: "discount", available: true },
  { id: "lr7", name: "Free Training Session", description: "1 free session with a professional coach", emoji: "🏋️", pointsCost: 4000, category: "freebie", available: true },
  { id: "lr8", name: "Exclusive Team Jersey", description: "Squad Buddy branded team jersey", emoji: "👕", pointsCost: 5000, category: "exclusive", available: true },
  { id: "lr9", name: "Stadium Tour", description: "Exclusive tour of premium stadium facilities", emoji: "🏟️", pointsCost: 8000, category: "exclusive", available: false },
  { id: "lr10", name: "Meet & Greet", description: "Meet a local sports celebrity", emoji: "🤝", pointsCost: 15000, category: "exclusive", available: false },
];

export const MOCK_COUPONS: Coupon[] = [
  { id: "c1", code: "SQUAD10", description: "10% off any booking", discountType: "percentage", discountValue: 10, expiresAt: "2026-03-31", isUsed: false },
  { id: "c2", code: "PADEL500", description: "500 ALL off padel bookings", discountType: "fixed", discountValue: 500, minBookingAmount: 2000, expiresAt: "2026-03-15", isUsed: false, sport: "padel" },
  { id: "c3", code: "WELCOME20", description: "20% off first booking", discountType: "percentage", discountValue: 20, expiresAt: "2026-04-30", isUsed: true },
  { id: "c4", code: "WEEKEND15", description: "15% off weekend bookings", discountType: "percentage", discountValue: 15, minBookingAmount: 1500, expiresAt: "2026-02-28", isUsed: false },
  { id: "c5", code: "FRIEND1000", description: "1,000 ALL off when you refer a friend", discountType: "fixed", discountValue: 1000, expiresAt: "2026-06-30", isUsed: false },
];

export const TIER_INFO: Record<LoyaltyTier, { emoji: string; color: string; bg: string; min: number }> = {
  bronze: { emoji: "🥉", color: "text-amber-700", bg: "bg-amber-100 dark:bg-amber-950", min: 0 },
  silver: { emoji: "🥈", color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800", min: 2000 },
  gold: { emoji: "🥇", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-950", min: 5000 },
  platinum: { emoji: "💎", color: "text-cyan-600", bg: "bg-cyan-100 dark:bg-cyan-950", min: 10000 },
  diamond: { emoji: "💠", color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-950", min: 25000 },
};
