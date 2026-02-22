export type ChallengeCategory = "daily" | "weekly" | "monthly" | "special";
export type ChallengeStatus = "active" | "completed" | "expired" | "locked";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  emoji: string;
  progress: number;
  target: number;
  reward: number;
  rewardType: "points" | "badge" | "coupon" | "wallet";
  status: ChallengeStatus;
  expiresAt: string;
  sport?: string;
}

export const MOCK_CHALLENGES: Challenge[] = [
  { id: "ch1", title: "Morning Warrior", description: "Book 3 games before 9 AM this week", category: "weekly", emoji: "🌅", progress: 2, target: 3, reward: 500, rewardType: "points", status: "active", expiresAt: "2026-02-23" },
  { id: "ch2", title: "Social Scorer", description: "Play with 5 different teammates today", category: "daily", emoji: "🤝", progress: 3, target: 5, reward: 200, rewardType: "points", status: "active", expiresAt: "2026-02-19" },
  { id: "ch3", title: "Multi-Sport Master", description: "Play 3 different sports this month", category: "monthly", emoji: "🎯", progress: 2, target: 3, reward: 2000, rewardType: "wallet", status: "active", expiresAt: "2026-02-28", sport: "any" },
  { id: "ch4", title: "Padel Pro", description: "Win 5 padel matches", category: "monthly", emoji: "🏓", progress: 5, target: 5, reward: 1500, rewardType: "wallet", status: "completed", expiresAt: "2026-02-28", sport: "padel" },
  { id: "ch5", title: "Field Explorer", description: "Play at 4 different venues this month", category: "monthly", emoji: "🗺️", progress: 3, target: 4, reward: 1000, rewardType: "points", status: "active", expiresAt: "2026-02-28" },
  { id: "ch6", title: "Marathon Week", description: "Play 7 days in a row", category: "weekly", emoji: "⚡", progress: 4, target: 7, reward: 3000, rewardType: "wallet", status: "active", expiresAt: "2026-02-23" },
  { id: "ch7", title: "Review Guru", description: "Write 5 field reviews", category: "monthly", emoji: "⭐", progress: 2, target: 5, reward: 800, rewardType: "points", status: "active", expiresAt: "2026-02-28" },
  { id: "ch8", title: "Night Owl", description: "Play 3 games after 9 PM", category: "weekly", emoji: "🦉", progress: 1, target: 3, reward: 400, rewardType: "points", status: "active", expiresAt: "2026-02-23" },
  { id: "ch9", title: "First Timer", description: "Complete your first booking", category: "special", emoji: "🎉", progress: 1, target: 1, reward: 1000, rewardType: "wallet", status: "completed", expiresAt: "2027-12-31" },
  { id: "ch10", title: "Tournament Champion", description: "Win a tournament this month", category: "monthly", emoji: "🏆", progress: 0, target: 1, reward: 5000, rewardType: "wallet", status: "active", expiresAt: "2026-02-28" },
  { id: "ch11", title: "Booking Streak", description: "Book at least one game for 14 consecutive days", category: "special", emoji: "🔥", progress: 4, target: 14, reward: 5000, rewardType: "wallet", status: "active", expiresAt: "2026-12-31" },
  { id: "ch12", title: "Team Builder", description: "Recruit 10 teammates to your squad", category: "special", emoji: "👥", progress: 7, target: 10, reward: 3000, rewardType: "points", status: "active", expiresAt: "2026-12-31" },
];
