export type BadgeRarity = "common" | "rare" | "epic" | "legendary";
export type BadgeCategory = "games" | "social" | "tournaments" | "sports" | "streaks" | "special";

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: BadgeRarity;
  category: BadgeCategory;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export const MOCK_BADGES: Badge[] = [
  { id: "b1", name: "Rookie", description: "Play your first game", emoji: "🎯", rarity: "common", category: "games", unlocked: true, unlockedAt: "2023-01-15" },
  { id: "b2", name: "10 Games", description: "Play 10 games", emoji: "🔥", rarity: "common", category: "games", unlocked: true, unlockedAt: "2023-02-20" },
  { id: "b3", name: "Century Club", description: "Play 100 games", emoji: "💯", rarity: "rare", category: "games", unlocked: true, unlockedAt: "2024-06-10" },
  { id: "b4", name: "500 Club", description: "Play 500 games", emoji: "🏅", rarity: "epic", category: "games", unlocked: false, progress: 234, target: 500 },
  { id: "b5", name: "Legend", description: "Play 1000 games", emoji: "👑", rarity: "legendary", category: "games", unlocked: false, progress: 234, target: 1000 },
  { id: "b6", name: "Squad Leader", description: "Have 10 teammates", emoji: "👥", rarity: "common", category: "social", unlocked: true, unlockedAt: "2023-05-01" },
  { id: "b7", name: "Captain", description: "Have 50 teammates", emoji: "🫡", rarity: "rare", category: "social", unlocked: false, progress: 32, target: 50 },
  { id: "b8", name: "Community Star", description: "Get 100 likes on community posts", emoji: "⭐", rarity: "rare", category: "social", unlocked: true, unlockedAt: "2024-01-15" },
  { id: "b9", name: "Tournament Victor", description: "Win a tournament", emoji: "🏆", rarity: "rare", category: "tournaments", unlocked: true, unlockedAt: "2024-03-20" },
  { id: "b10", name: "Triple Crown", description: "Win 3 tournaments", emoji: "👑", rarity: "epic", category: "tournaments", unlocked: false, progress: 1, target: 3 },
  { id: "b11", name: "Grand Slam", description: "Win tournaments in 4 different sports", emoji: "🌟", rarity: "legendary", category: "tournaments", unlocked: false, progress: 1, target: 4 },
  { id: "b12", name: "Multi-Sport", description: "Play 5 different sports", emoji: "🎽", rarity: "rare", category: "sports", unlocked: false, progress: 3, target: 5 },
  { id: "b13", name: "All-Rounder", description: "Play all 18 sports", emoji: "🌈", rarity: "legendary", category: "sports", unlocked: false, progress: 3, target: 18 },
  { id: "b14", name: "Football Fanatic", description: "Play 50 football games", emoji: "⚽", rarity: "rare", category: "sports", unlocked: true, unlockedAt: "2024-08-05" },
  { id: "b15", name: "Weekly Warrior", description: "Play 7 days in a row", emoji: "⚡", rarity: "rare", category: "streaks", unlocked: true, unlockedAt: "2024-04-12" },
  { id: "b16", name: "Monthly Monster", description: "Play 30 days in a row", emoji: "🔥", rarity: "epic", category: "streaks", unlocked: false, progress: 12, target: 30 },
  { id: "b17", name: "Night Owl", description: "Play 10 games after 9 PM", emoji: "🦉", rarity: "common", category: "special", unlocked: true, unlockedAt: "2023-11-20" },
  { id: "b18", name: "Early Bird", description: "Play 10 games before 8 AM", emoji: "🌅", rarity: "common", category: "special", unlocked: false, progress: 4, target: 10 },
  { id: "b19", name: "Review Master", description: "Write 20 reviews", emoji: "📝", rarity: "rare", category: "special", unlocked: false, progress: 8, target: 20 },
  { id: "b20", name: "Founding Member", description: "Join Squad Buddy in 2023", emoji: "🏛️", rarity: "legendary", category: "special", unlocked: true, unlockedAt: "2023-01-01" },
];

export const RARITY_COLORS: Record<BadgeRarity, { bg: string; text: string; border: string }> = {
  common: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-600 dark:text-zinc-400", border: "border-zinc-300 dark:border-zinc-600" },
  rare: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400", border: "border-blue-300 dark:border-blue-600" },
  epic: { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-600 dark:text-purple-400", border: "border-purple-300 dark:border-purple-600" },
  legendary: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400", border: "border-amber-300 dark:border-amber-600" },
};
