import type { SportId } from "./mockData";

export type LeagueStatus = "active" | "upcoming" | "completed";

export interface LeagueMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: "scheduled" | "live" | "completed";
}

export interface LeagueTeam {
  pos: number;
  team: string;
  logo: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export interface League {
  id: string;
  name: string;
  sport: SportId;
  season: string;
  status: LeagueStatus;
  teams: LeagueTeam[];
  upcomingMatches: LeagueMatch[];
  description: string;
}

export const MOCK_LEAGUES: League[] = [
  {
    id: "lg1", name: "Albanian Super League", sport: "football", season: "2025-26", status: "active",
    description: "The top tier of Albanian football competition.",
    teams: [
      { pos: 1, team: "FC Tirana", logo: "https://i.pravatar.cc/40?img=40", p: 22, w: 16, d: 3, l: 3, gf: 48, ga: 18, gd: 30, pts: 51 },
      { pos: 2, team: "KF Vllaznia", logo: "https://i.pravatar.cc/40?img=41", p: 22, w: 14, d: 4, l: 4, gf: 41, ga: 22, gd: 19, pts: 46 },
      { pos: 3, team: "KF Laçi", logo: "https://i.pravatar.cc/40?img=48", p: 22, w: 13, d: 5, l: 4, gf: 38, ga: 20, gd: 18, pts: 44 },
      { pos: 4, team: "KF Teuta", logo: "https://i.pravatar.cc/40?img=49", p: 22, w: 12, d: 4, l: 6, gf: 35, ga: 25, gd: 10, pts: 40 },
      { pos: 5, team: "KF Partizani", logo: "https://i.pravatar.cc/40?img=50", p: 22, w: 11, d: 5, l: 6, gf: 32, ga: 24, gd: 8, pts: 38 },
      { pos: 6, team: "KF Skënderbeu", logo: "https://i.pravatar.cc/40?img=51", p: 22, w: 10, d: 6, l: 6, gf: 30, ga: 25, gd: 5, pts: 36 },
      { pos: 7, team: "KF Bylis", logo: "https://i.pravatar.cc/40?img=52", p: 22, w: 8, d: 5, l: 9, gf: 25, ga: 30, gd: -5, pts: 29 },
      { pos: 8, team: "KF Kukësi", logo: "https://i.pravatar.cc/40?img=53", p: 22, w: 7, d: 6, l: 9, gf: 22, ga: 28, gd: -6, pts: 27 },
      { pos: 9, team: "KF Egnatia", logo: "https://i.pravatar.cc/40?img=44", p: 22, w: 5, d: 5, l: 12, gf: 18, ga: 35, gd: -17, pts: 20 },
      { pos: 10, team: "KF Kastrioti", logo: "https://i.pravatar.cc/40?img=45", p: 22, w: 3, d: 4, l: 15, gf: 14, ga: 42, gd: -28, pts: 13 },
    ],
    upcomingMatches: [
      { id: "m1", homeTeam: "FC Tirana", awayTeam: "KF Vllaznia", date: "2026-02-22", time: "20:00", venue: "Arena Sport Tirana", status: "scheduled" },
      { id: "m2", homeTeam: "KF Laçi", awayTeam: "KF Teuta", date: "2026-02-22", time: "17:00", venue: "Stadiumi Loro Boriçi", status: "scheduled" },
      { id: "m3", homeTeam: "KF Partizani", awayTeam: "KF Bylis", date: "2026-02-23", time: "19:00", venue: "Fusha e Madhe Elbasan", status: "scheduled" },
      { id: "m4", homeTeam: "KF Kukësi", awayTeam: "KF Skënderbeu", date: "2026-02-23", time: "16:00", venue: "Multisport Korçë", status: "scheduled" },
    ],
  },
  {
    id: "lg2", name: "Basketball Super Liga", sport: "basketball", season: "2025-26", status: "active",
    description: "Albania's premier basketball competition.",
    teams: [
      { pos: 1, team: "BC Tirana", logo: "https://i.pravatar.cc/40?img=42", p: 18, w: 15, d: 0, l: 3, gf: 1560, ga: 1380, gd: 180, pts: 33 },
      { pos: 2, team: "BC Vlorë", logo: "https://i.pravatar.cc/40?img=43", p: 18, w: 13, d: 0, l: 5, gf: 1480, ga: 1350, gd: 130, pts: 31 },
      { pos: 3, team: "BC Shkodër", logo: "https://i.pravatar.cc/40?img=50", p: 18, w: 11, d: 0, l: 7, gf: 1420, ga: 1400, gd: 20, pts: 29 },
      { pos: 4, team: "BC Korçë", logo: "https://i.pravatar.cc/40?img=51", p: 18, w: 10, d: 0, l: 8, gf: 1390, ga: 1410, gd: -20, pts: 28 },
      { pos: 5, team: "BC Durrës", logo: "https://i.pravatar.cc/40?img=46", p: 18, w: 8, d: 0, l: 10, gf: 1350, ga: 1430, gd: -80, pts: 26 },
      { pos: 6, team: "BC Elbasan", logo: "https://i.pravatar.cc/40?img=47", p: 18, w: 5, d: 0, l: 13, gf: 1280, ga: 1510, gd: -230, pts: 23 },
    ],
    upcomingMatches: [
      { id: "m5", homeTeam: "BC Tirana", awayTeam: "BC Korçë", date: "2026-02-21", time: "19:30", venue: "Basketball Center Vlorë", status: "scheduled" },
      { id: "m6", homeTeam: "BC Shkodër", awayTeam: "BC Durrës", date: "2026-02-22", time: "18:00", venue: "Multisport Korçë", status: "scheduled" },
    ],
  },
  {
    id: "lg3", name: "Padel National Series", sport: "padel", season: "2026", status: "upcoming",
    description: "First ever Albanian national padel league.",
    teams: [
      { pos: 1, team: "Padel Tirana", logo: "https://i.pravatar.cc/40?img=44", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { pos: 2, team: "Padel Durrës", logo: "https://i.pravatar.cc/40?img=45", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { pos: 3, team: "Padel Vlorë", logo: "https://i.pravatar.cc/40?img=46", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { pos: 4, team: "Padel Shkodër", logo: "https://i.pravatar.cc/40?img=47", p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    ],
    upcomingMatches: [],
  },
];
