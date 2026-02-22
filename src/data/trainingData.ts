import type { SportId } from "./mockData";

export type ProgramLevel = "beginner" | "intermediate" | "advanced" | "elite";
export type ProgramStatus = "enrolled" | "available" | "completed";

export interface TrainingSession {
  id: string;
  title: string;
  day: string;
  time: string;
  duration: number;
  completed: boolean;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  sport: SportId;
  level: ProgramLevel;
  durationWeeks: number;
  sessionsPerWeek: number;
  coach: string;
  coachAvatar: string;
  rating: number;
  enrolledCount: number;
  price: number;
  image: string;
  status: ProgramStatus;
  progress?: number;
  sessions?: TrainingSession[];
}

export const MOCK_TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: "tp1", title: "Football Fundamentals", description: "Master the basics of football — passing, shooting, dribbling, and tactical awareness.", sport: "football", level: "beginner", durationWeeks: 8, sessionsPerWeek: 3, coach: "Fatos Llagami", coachAvatar: "https://i.pravatar.cc/150?img=31", rating: 4.9, enrolledCount: 45, price: 12000, image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&h=400&fit=crop", status: "enrolled", progress: 62,
    sessions: [
      { id: "ts1", title: "Passing Drills", day: "Mon", time: "17:00", duration: 90, completed: true },
      { id: "ts2", title: "Shooting Technique", day: "Wed", time: "17:00", duration: 90, completed: true },
      { id: "ts3", title: "Match Practice", day: "Fri", time: "18:00", duration: 120, completed: false },
    ],
  },
  {
    id: "tp2", title: "Tennis Masterclass", description: "Improve your serve, backhand, and net play with professional coaching.", sport: "tennis", level: "intermediate", durationWeeks: 6, sessionsPerWeek: 2, coach: "Viola Mema", coachAvatar: "https://i.pravatar.cc/150?img=21", rating: 4.8, enrolledCount: 28, price: 15000, image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop", status: "available",
  },
  {
    id: "tp3", title: "Padel for Beginners", description: "Learn padel from scratch — grip, positioning, and basic shots.", sport: "padel", level: "beginner", durationWeeks: 4, sessionsPerWeek: 2, coach: "Elira Murati", coachAvatar: "https://i.pravatar.cc/150?img=5", rating: 4.7, enrolledCount: 32, price: 8000, image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop", status: "available",
  },
  {
    id: "tp4", title: "Boxing Conditioning", description: "Build strength, speed, and endurance with professional boxing training.", sport: "boxing", level: "advanced", durationWeeks: 12, sessionsPerWeek: 4, coach: "Fatjon Hyseni", coachAvatar: "https://i.pravatar.cc/150?img=18", rating: 4.9, enrolledCount: 18, price: 20000, image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop", status: "available",
  },
  {
    id: "tp5", title: "Basketball Skills Academy", description: "Develop your shooting, dribbling, and court vision.", sport: "basketball", level: "intermediate", durationWeeks: 8, sessionsPerWeek: 3, coach: "Dritan Leka", coachAvatar: "https://i.pravatar.cc/150?img=3", rating: 4.6, enrolledCount: 22, price: 14000, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop", status: "available",
  },
  {
    id: "tp6", title: "Swimming Technique", description: "Perfect your freestyle, backstroke, and butterfly technique.", sport: "swimming", level: "beginner", durationWeeks: 6, sessionsPerWeek: 3, coach: "Besa Kuqi", coachAvatar: "https://i.pravatar.cc/150?img=24", rating: 4.8, enrolledCount: 35, price: 10000, image: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&h=400&fit=crop", status: "completed", progress: 100,
  },
  {
    id: "tp7", title: "Volleyball Attack Strategy", description: "Master spiking, blocking, and team formations.", sport: "volleyball", level: "advanced", durationWeeks: 6, sessionsPerWeek: 2, coach: "Ornela Çela", coachAvatar: "https://i.pravatar.cc/150?img=23", rating: 4.5, enrolledCount: 16, price: 12000, image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop", status: "available",
  },
  {
    id: "tp8", title: "Table Tennis Elite", description: "Advanced spin techniques, footwork, and match strategy.", sport: "table-tennis", level: "elite", durationWeeks: 10, sessionsPerWeek: 4, coach: "Luana Aliaj", coachAvatar: "https://i.pravatar.cc/150?img=26", rating: 4.9, enrolledCount: 12, price: 18000, image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&h=400&fit=crop", status: "available",
  },
];

export const LEVEL_COLORS: Record<ProgramLevel, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  advanced: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  elite: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};
