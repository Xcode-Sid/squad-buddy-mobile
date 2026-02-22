import type { SportId } from "./mockData";

export type EquipmentCondition = "new" | "like-new" | "good" | "fair";

export interface Equipment {
  id: string;
  name: string;
  description: string;
  sport: SportId;
  image: string;
  pricePerHour: number;
  pricePerDay: number;
  condition: EquipmentCondition;
  available: boolean;
  location: string;
  rating: number;
  rentCount: number;
}

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: "eq1", name: "Adidas Predator Football Boots", description: "Professional-grade football boots, sizes 40-45", sport: "football", image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&h=300&fit=crop", pricePerHour: 300, pricePerDay: 1500, condition: "new", available: true, location: "Arena Sport Tirana", rating: 4.8, rentCount: 156 },
  { id: "eq2", name: "Wilson Tennis Racket Pro", description: "Tournament-grade racket with cover", sport: "tennis", image: "https://images.unsplash.com/photo-1617883861744-13b534e1a5e0?w=400&h=300&fit=crop", pricePerHour: 400, pricePerDay: 2000, condition: "like-new", available: true, location: "Tennis Academy Shkodër", rating: 4.9, rentCount: 89 },
  { id: "eq3", name: "Spalding Basketball Official", description: "NBA official match ball", sport: "basketball", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&h=300&fit=crop", pricePerHour: 200, pricePerDay: 800, condition: "good", available: true, location: "Basketball Center Vlorë", rating: 4.5, rentCount: 234 },
  { id: "eq4", name: "Babolat Padel Racket", description: "Professional padel racket with bag", sport: "padel", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop", pricePerHour: 350, pricePerDay: 1800, condition: "new", available: true, location: "Padel Club Durrës", rating: 4.7, rentCount: 67 },
  { id: "eq5", name: "Mikasa Volleyball V200W", description: "FIVB official match ball", sport: "volleyball", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop", pricePerHour: 150, pricePerDay: 600, condition: "good", available: true, location: "Volleyball Beach Durrës", rating: 4.6, rentCount: 178 },
  { id: "eq6", name: "Boxing Gloves 12oz", description: "Professional training gloves, various sizes", sport: "boxing", image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop", pricePerHour: 250, pricePerDay: 1000, condition: "like-new", available: true, location: "FitBox Arena", rating: 4.4, rentCount: 112 },
  { id: "eq7", name: "Swim Goggles Pro", description: "Anti-fog competition goggles", sport: "swimming", image: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=400&h=300&fit=crop", pricePerHour: 100, pricePerDay: 400, condition: "new", available: true, location: "Aqua Sport Center", rating: 4.8, rentCount: 89 },
  { id: "eq8", name: "Football Kit (Full)", description: "Jersey, shorts, socks — team set available", sport: "football", image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=300&fit=crop", pricePerHour: 500, pricePerDay: 2500, condition: "good", available: false, location: "Arena Sport Tirana", rating: 4.3, rentCount: 345 },
  { id: "eq9", name: "Badminton Set (2 Rackets + Shuttles)", description: "Complete badminton set for casual play", sport: "badminton", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop", pricePerHour: 200, pricePerDay: 800, condition: "like-new", available: true, location: "Badminton Hub", rating: 4.5, rentCount: 56 },
  { id: "eq10", name: "Table Tennis Set (2 Paddles + Balls)", description: "Professional paddles with case", sport: "table-tennis", image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400&h=300&fit=crop", pricePerHour: 150, pricePerDay: 600, condition: "new", available: true, location: "Table Tennis Club", rating: 4.6, rentCount: 98 },
  { id: "eq11", name: "Goalkeeper Gloves Pro", description: "Grip-technology goalkeeper gloves, sizes S-XL", sport: "football", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop", pricePerHour: 200, pricePerDay: 800, condition: "like-new", available: true, location: "Arena Sport Tirana", rating: 4.7, rentCount: 78 },
  { id: "eq12", name: "Rugby Ball Gilbert", description: "Match-grade rugby ball", sport: "rugby", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop", pricePerHour: 150, pricePerDay: 600, condition: "good", available: true, location: "Rugby Field Tirana", rating: 4.3, rentCount: 34 },
];

export const CONDITION_COLORS: Record<EquipmentCondition, string> = {
  new: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  "like-new": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  good: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  fair: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
};
