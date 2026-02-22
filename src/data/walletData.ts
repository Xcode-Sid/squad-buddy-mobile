import { PLAYERS, FIELDS } from "./mockData";

export interface WalletTransaction {
  id: string;
  type: "topup" | "payment" | "refund" | "reward" | "gift";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  relatedBookingId?: string;
}

export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  remainingAmount: number;
  expiresAt: string;
  fromPlayer?: string;
  isRedeemed: boolean;
}

export interface Wallet {
  balance: number;
  currency: string;
  totalSpent: number;
  totalTopUp: number;
  transactions: WalletTransaction[];
  giftCards: GiftCard[];
}

export const MOCK_WALLET: Wallet = {
  balance: 12500,
  currency: "ALL",
  totalSpent: 87400,
  totalTopUp: 99900,
  transactions: [
    { id: "wt1", type: "payment", amount: -3000, description: "Booking — Arena Sport Tirana", date: "2026-02-19", status: "completed", relatedBookingId: "b1" },
    { id: "wt2", type: "topup", amount: 10000, description: "Wallet Top-up via Stripe", date: "2026-02-18", status: "completed" },
    { id: "wt3", type: "refund", amount: 1500, description: "Refund — Futsal Arena Fier (cancelled)", date: "2026-02-17", status: "completed" },
    { id: "wt4", type: "reward", amount: 500, description: "Loyalty reward — 10 games milestone", date: "2026-02-16", status: "completed" },
    { id: "wt5", type: "payment", amount: -3500, description: "Booking — Padel Club Durrës", date: "2026-02-15", status: "completed", relatedBookingId: "b2" },
    { id: "wt6", type: "gift", amount: 2000, description: "Gift card from Elira Murati", date: "2026-02-14", status: "completed" },
    { id: "wt7", type: "payment", amount: -2000, description: "Booking — Basketball Center Vlorë", date: "2026-02-13", status: "completed" },
    { id: "wt8", type: "topup", amount: 5000, description: "Wallet Top-up via Stripe", date: "2026-02-12", status: "completed" },
    { id: "wt9", type: "payment", amount: -2500, description: "Booking — Kompleksi Sportiv Dinamo", date: "2026-02-10", status: "completed" },
    { id: "wt10", type: "payment", amount: -1800, description: "Booking — Fusha e Madhe Elbasan", date: "2026-02-08", status: "completed" },
    { id: "wt11", type: "reward", amount: 1000, description: "Tournament winner bonus", date: "2026-02-06", status: "completed" },
    { id: "wt12", type: "topup", amount: 15000, description: "Wallet Top-up via Stripe", date: "2026-02-01", status: "completed" },
    { id: "wt13", type: "payment", amount: -5000, description: "Booking — Stadiumi Loro Boriçi", date: "2026-01-28", status: "completed" },
    { id: "wt14", type: "payment", amount: -3000, description: "Equipment rental — Football boots", date: "2026-01-25", status: "completed" },
    { id: "wt15", type: "gift", amount: 3000, description: "Gift card redeemed — Birthday gift", date: "2026-01-20", status: "completed" },
  ],
  giftCards: [
    { id: "gc1", code: "SQUAD-GIFT-2026", amount: 5000, remainingAmount: 5000, expiresAt: "2026-06-30", fromPlayer: "Elira Murati", isRedeemed: false },
    { id: "gc2", code: "BDAY-ANDI-26", amount: 3000, remainingAmount: 0, expiresAt: "2026-03-15", fromPlayer: "Arben Krasniqi", isRedeemed: true },
    { id: "gc3", code: "WELCOME-NEW", amount: 1000, remainingAmount: 1000, expiresAt: "2026-12-31", isRedeemed: false },
  ],
};
