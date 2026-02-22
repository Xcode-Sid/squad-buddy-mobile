export type SportId =
  | "football" | "basketball" | "tennis" | "volleyball" | "padel"
  | "swimming" | "table-tennis" | "badminton" | "rugby" | "handball"
  | "futsal" | "beach-volleyball" | "cricket" | "baseball" | "hockey"
  | "golf" | "boxing" | "mma";

export interface Sport {
  id: SportId;
  name: string;
  emoji: string;
  icon: string;
}

export type AvailabilityStatus = "available" | "few-slots" | "fully-booked";
export type BookingType = "single" | "recurring";
export type BookingStatus = "confirmed" | "pending" | "cancelled";
export type TournamentStatus = "registration" | "in-progress" | "completed";
export type SlotStatus = "available" | "few" | "booked";
export type NotificationType =
  | "booking" | "reminder" | "squad" | "achievement"
  | "live" | "tournament" | "payment";

export interface Field {
  id: string;
  name: string;
  location: string;
  city: string;
  sports: SportId[];
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  peakPricePerHour: number;
  image: string;
  images: string[];
  availability: AvailabilityStatus;
  amenities: string[];
  surface: string;
  dimensions: string;
  indoor: boolean;
  description: string;
  lat?: number;
  lng?: number;
}

export interface Player {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  bio: string;
  favoriteSport: SportId;
  gamesPlayed: number;
  winRate: number;
  totalHours: number;
  rating: number;
  memberSince: string;
  achievements: string[];
  sports: SportId[];
}

export type GameTeam = { name: string; logo: string; score: number };
export type GameEvent = {
  time: string;
  type: string;
  team: "A" | "B";
  player: string;
  description: string;
};
export type GameStats = Record<string, [number, number]>;

export interface LiveGame {
  id: string;
  sport: SportId;
  teamA: GameTeam;
  teamB: GameTeam;
  gameTime: string;
  period: string;
  fieldName: string;
  fieldLocation: string;
  viewers: number;
  isLive: boolean;
  events: GameEvent[];
  stats: GameStats;
}

export interface Booking {
  id: string;
  field: Field;
  date: string;
  time: string;
  duration: number;
  sport: SportId;
  players: Player[];
  status: BookingStatus;
}

export interface Tournament {
  id: string;
  name: string;
  sport: SportId;
  teamsCount: number;
  prizePool: string;
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  teams: { name: string; seed: number }[];
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  emoji: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

export interface TimeSlot {
  time: string;
  label: string;
  status?: SlotStatus;
}

export interface DayAvailability {
  day: string;
  slots: TimeSlot[];
}
