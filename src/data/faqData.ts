export type FaqCategory = "general" | "booking" | "payments" | "account" | "technical";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  helpful: number;
}

export const MOCK_FAQS: FaqItem[] = [
  { id: "f1", question: "How do I book a field?", answer: "Browse fields on the Explore page, select one you like, choose your date, time, and sport, then complete the payment. You'll receive a confirmation notification instantly.", category: "booking", helpful: 156 },
  { id: "f2", question: "Can I cancel a booking?", answer: "Yes, you can cancel up to 24 hours before your booking time for a full refund. Cancellations within 24 hours may incur a 50% fee. Go to My Bookings and tap the booking you want to cancel.", category: "booking", helpful: 234 },
  { id: "f3", question: "How do recurring bookings work?", answer: "When booking, select 'Recurring' as the booking type. Choose your frequency (weekly/bi-weekly) and duration. The same time slot will be reserved automatically. You can manage or cancel recurring bookings from My Bookings.", category: "booking", helpful: 89 },
  { id: "f4", question: "What payment methods are accepted?", answer: "We accept credit/debit cards (Visa, Mastercard), wallet balance, and gift cards. You can top up your wallet via Stripe for faster checkout.", category: "payments", helpful: 312 },
  { id: "f5", question: "How do refunds work?", answer: "Refunds for cancelled bookings are processed to your Squad Buddy wallet within 24 hours. For card refunds, it may take 5-10 business days depending on your bank.", category: "payments", helpful: 178 },
  { id: "f6", question: "What are loyalty points?", answer: "You earn loyalty points for every booking, review, and challenge completed. Points can be redeemed for discounts, free hours of play, equipment rentals, and exclusive rewards.", category: "general", helpful: 145 },
  { id: "f7", question: "How do I join a tournament?", answer: "Go to the Tournaments page, find one that interests you, and tap 'Register'. Some tournaments require a team — you can create one from your squad or join an existing team.", category: "general", helpful: 98 },
  { id: "f8", question: "How do I add teammates to my squad?", answer: "Go to Social > Scout to discover players. Tap 'Recruit' to send a squad invite. Once they accept, they'll appear in your squad. You can also search by username.", category: "account", helpful: 201 },
  { id: "f9", question: "Can I change my account type?", answer: "Individual accounts cannot be directly converted to Business accounts. Please contact support to assist with account type changes.", category: "account", helpful: 67 },
  { id: "f10", question: "How do subscriptions work?", answer: "We offer Free, Pro, and Elite tiers for individuals, and Starter, Growth, and Enterprise for businesses. Each tier unlocks additional features. You can upgrade or downgrade anytime from Settings > Subscription.", category: "general", helpful: 256 },
  { id: "f11", question: "What is the weather feature?", answer: "For outdoor fields, we show real-time weather forecasts so you can plan your games accordingly. You'll also get weather alerts before your booking if conditions change.", category: "technical", helpful: 54 },
  { id: "f12", question: "How does live scoring work?", answer: "Field owners can enable live scoring for games. Scores are updated in real-time via our SignalR connection. You can watch live scores on the Live page.", category: "technical", helpful: 112 },
  { id: "f13", question: "Is my data secure?", answer: "Yes, we use industry-standard encryption (TLS 1.3) for all data in transit and AES-256 for data at rest. We never share your personal information with third parties.", category: "technical", helpful: 89 },
  { id: "f14", question: "How do I rent equipment?", answer: "Go to Equipment, browse available gear, and reserve it along with your field booking. Equipment is available at the venue when you arrive.", category: "general", helpful: 76 },
  { id: "f15", question: "How do challenges work?", answer: "Challenges are daily, weekly, and monthly goals that reward you with loyalty points or wallet credits. Check the Challenges page to see active challenges and track progress.", category: "general", helpful: 134 },
];

export const FAQ_CATEGORIES: { id: FaqCategory; label: string; emoji: string }[] = [
  { id: "general", label: "General", emoji: "📋" },
  { id: "booking", label: "Bookings", emoji: "📅" },
  { id: "payments", label: "Payments", emoji: "💳" },
  { id: "account", label: "Account", emoji: "👤" },
  { id: "technical", label: "Technical", emoji: "⚙️" },
];
