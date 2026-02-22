import type { UserPlan, BizPlan } from "../types/subscription";

export const USER_PLANS: UserPlan[] = [
  {
    id: "free", name: "Free", price: 0, yearlyPrice: 0,
    color: "text-muted-foreground", accentClass: "text-muted-foreground", bgClass: "bg-muted/30", borderClass: "border-border",
    features: ["Book fields", "Basic profile", "View match results", "Recruit teammates"],
    locked: ["live_stream", "advanced_stats", "priority_booking", "tournaments_join"],
  },
  {
    id: "pro", name: "Pro", price: 590, yearlyPrice: 5900,
    color: "text-primary", accentClass: "text-primary", bgClass: "bg-primary/5", borderClass: "border-primary/40",
    features: ["Everything in Free", "Watch live streams", "Advanced statistics", "Priority booking slots", "Join tournaments"],
    locked: ["ai_matchmaking", "exclusive_events", "custom_jersey"],
  },
  {
    id: "elite", name: "Elite", price: 1190, yearlyPrice: 11900,
    color: "text-accent", accentClass: "text-accent", bgClass: "bg-accent/5", borderClass: "border-accent/40",
    features: ["Everything in Pro", "AI matchmaking", "Exclusive events access", "Custom jersey badge", "Dedicated support", "Early feature access"],
    locked: [],
  },
];

export const BIZ_PLANS: BizPlan[] = [
  {
    id: "starter", name: "Starter", price: 2900, yearlyPrice: 29000,
    color: "text-muted-foreground", accentClass: "text-muted-foreground", bgClass: "bg-muted/30", borderClass: "border-border",
    maxFields: 2,
    features: ["List up to 2 fields", "Basic booking calendar", "Customer messaging", "Basic analytics"],
    locked: ["advanced_analytics", "priority_listing", "bulk_scheduling", "api_access"],
  },
  {
    id: "growth", name: "Growth", price: 5900, yearlyPrice: 58000,
    color: "text-primary", accentClass: "text-primary", bgClass: "bg-primary/5", borderClass: "border-primary/40",
    maxFields: 8,
    features: ["List up to 8 fields", "Advanced calendar & bulk edit", "Advanced analytics", "Priority listing in search", "Promo codes & discounts"],
    locked: ["api_access", "white_label"],
  },
  {
    id: "premium", name: "Premium", price: 9900, yearlyPrice: 98000,
    color: "text-accent", accentClass: "text-accent", bgClass: "bg-accent/5", borderClass: "border-accent/40",
    maxFields: Infinity,
    features: ["Unlimited fields", "API access", "White-label booking widget", "Dedicated account manager", "Custom reports & export", "Multi-location dashboard"],
    locked: [],
  },
];
