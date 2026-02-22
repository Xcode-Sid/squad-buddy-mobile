export const SPORTS = [
  { id: "football", name: "Football", emoji: "⚽", icon: "circle-dot" },
  { id: "basketball", name: "Basketball", emoji: "🏀", icon: "circle" },
  { id: "tennis", name: "Tennis", emoji: "🎾", icon: "circle" },
  { id: "volleyball", name: "Volleyball", emoji: "🏐", icon: "circle" },
  { id: "padel", name: "Padel", emoji: "🏓", icon: "circle" },
  { id: "swimming", name: "Swimming", emoji: "🏊", icon: "waves" },
  { id: "table-tennis", name: "Table Tennis", emoji: "🏓", icon: "circle" },
  { id: "badminton", name: "Badminton", emoji: "🏸", icon: "circle" },
  { id: "rugby", name: "Rugby", emoji: "🏈", icon: "circle" },
  { id: "handball", name: "Handball", emoji: "🤾", icon: "circle" },
  { id: "futsal", name: "Futsal", emoji: "⚽", icon: "circle-dot" },
  { id: "beach-volleyball", name: "Beach Volleyball", emoji: "🏐", icon: "circle" },
  { id: "cricket", name: "Cricket", emoji: "🏏", icon: "circle" },
  { id: "baseball", name: "Baseball", emoji: "⚾", icon: "circle" },
  { id: "hockey", name: "Hockey", emoji: "🏑", icon: "circle" },
  { id: "golf", name: "Golf", emoji: "⛳", icon: "circle" },
  { id: "boxing", name: "Boxing", emoji: "🥊", icon: "circle" },
  { id: "mma", name: "MMA", emoji: "🤼", icon: "circle" },
] as const;

export type SportId = typeof SPORTS[number]["id"];

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
  availability: "available" | "few-slots" | "fully-booked";
  amenities: string[];
  surface: string;
  dimensions: string;
  indoor: boolean;
  description: string;
}

export const FIELDS: Field[] = [
  {
    id: "1", name: "Arena Sport Tirana", location: "Rruga e Elbasanit, Tirana", city: "Tirana",
    sports: ["football", "futsal"], rating: 4.8, reviewCount: 234, pricePerHour: 3000, peakPricePerHour: 4500,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=500&fit=crop", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "lights", "changing-rooms", "cafe"],
    surface: "Artificial Turf", dimensions: "100m × 60m", indoor: false,
    description: "Premium football facility in the heart of Tirana with FIFA-standard artificial turf."
  },
  {
    id: "2", name: "Kompleksi Sportiv Dinamo", location: "Rruga Muhamet Gjollesha, Tirana", city: "Tirana",
    sports: ["football", "basketball", "tennis"], rating: 4.6, reviewCount: 189, pricePerHour: 2500, peakPricePerHour: 4000,
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=500&fit=crop"],
    availability: "few-slots", amenities: ["parking", "lights", "changing-rooms"],
    surface: "Natural Grass", dimensions: "105m × 68m", indoor: false,
    description: "Historic sports complex with multiple courts and fields."
  },
  {
    id: "3", name: "Padel Club Durrës", location: "Rruga Taulantia, Durrës", city: "Durrës",
    sports: ["padel", "tennis"], rating: 4.9, reviewCount: 156, pricePerHour: 3500, peakPricePerHour: 5000,
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "lights", "changing-rooms", "shop"],
    surface: "Glass Court", dimensions: "20m × 10m", indoor: true,
    description: "State-of-the-art padel courts with glass walls and professional lighting."
  },
  {
    id: "4", name: "Basketball Center Vlorë", location: "Bulevardi Ismail Qemali, Vlorë", city: "Vlorë",
    sports: ["basketball"], rating: 4.5, reviewCount: 98, pricePerHour: 2000, peakPricePerHour: 3000,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "indoor", "changing-rooms"],
    surface: "Hardwood", dimensions: "28m × 15m", indoor: true,
    description: "Professional indoor basketball court with NBA-standard dimensions."
  },
  {
    id: "5", name: "Tennis Academy Shkodër", location: "Rruga 13 Dhjetori, Shkodër", city: "Shkodër",
    sports: ["tennis", "badminton"], rating: 4.7, reviewCount: 167, pricePerHour: 2800, peakPricePerHour: 4000,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=500&fit=crop"],
    availability: "few-slots", amenities: ["parking", "lights", "coaching", "shop"],
    surface: "Clay", dimensions: "23.77m × 10.97m", indoor: false,
    description: "Professional clay tennis courts with coaching programs available."
  },
  {
    id: "6", name: "Fusha e Madhe Elbasan", location: "Bulevardi Qemal Stafa, Elbasan", city: "Elbasan",
    sports: ["football"], rating: 4.3, reviewCount: 76, pricePerHour: 1800, peakPricePerHour: 2500,
    image: "https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "lights"],
    surface: "Artificial Turf", dimensions: "90m × 45m", indoor: false,
    description: "Community football field with floodlights for evening games."
  },
  {
    id: "7", name: "Aqua Sport Center", location: "Rruga e Kavajës, Tirana", city: "Tirana",
    sports: ["swimming"], rating: 4.8, reviewCount: 210, pricePerHour: 1500, peakPricePerHour: 2000,
    image: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "indoor", "changing-rooms", "sauna", "cafe"],
    surface: "Olympic Pool", dimensions: "50m × 25m", indoor: true,
    description: "Olympic-size indoor swimming pool with heated water and sauna facilities."
  },
  {
    id: "8", name: "FitBox Arena", location: "Rruga Barrikadave, Tirana", city: "Tirana",
    sports: ["boxing", "mma"], rating: 4.6, reviewCount: 134, pricePerHour: 2000, peakPricePerHour: 3000,
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=500&fit=crop"],
    availability: "few-slots", amenities: ["indoor", "changing-rooms", "coaching"],
    surface: "Mat", dimensions: "12m × 12m", indoor: true,
    description: "Professional boxing and MMA training facility with ring and octagon."
  },
  {
    id: "9", name: "Volleyball Beach Durrës", location: "Plazhi i Durrësit, Durrës", city: "Durrës",
    sports: ["beach-volleyball", "volleyball"], rating: 4.4, reviewCount: 89, pricePerHour: 1500, peakPricePerHour: 2500,
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["lights", "changing-rooms", "cafe"],
    surface: "Sand", dimensions: "16m × 8m", indoor: false,
    description: "Beachfront volleyball courts with stunning Adriatic Sea views."
  },
  {
    id: "10", name: "Multisport Korçë", location: "Bulevardi Republika, Korçë", city: "Korçë",
    sports: ["football", "basketball", "handball"], rating: 4.2, reviewCount: 67, pricePerHour: 1500, peakPricePerHour: 2200,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "lights", "changing-rooms"],
    surface: "Artificial Turf", dimensions: "40m × 20m", indoor: false,
    description: "Versatile multi-sport complex in the cultural heart of Korçë."
  },
  {
    id: "11", name: "Stadiumi Loro Boriçi", location: "Rruga Skënderbeu, Shkodër", city: "Shkodër",
    sports: ["football"], rating: 4.9, reviewCount: 312, pricePerHour: 5000, peakPricePerHour: 8000,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=500&fit=crop"],
    availability: "fully-booked", amenities: ["parking", "lights", "changing-rooms", "vip", "cafe"],
    surface: "Natural Grass", dimensions: "105m × 68m", indoor: false,
    description: "Professional stadium with premium facilities for competitive matches."
  },
  {
    id: "12", name: "Futsal Arena Fier", location: "Rruga Brigada IX, Fier", city: "Fier",
    sports: ["futsal"], rating: 4.4, reviewCount: 95, pricePerHour: 2000, peakPricePerHour: 3000,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["indoor", "changing-rooms", "parking"],
    surface: "Hardwood", dimensions: "40m × 20m", indoor: true,
    description: "Indoor futsal arena with professional-grade flooring."
  },
  {
    id: "13", name: "Golf & Country Tirana", location: "Rruga e Lungomares, Tirana", city: "Tirana",
    sports: ["golf"], rating: 4.7, reviewCount: 45, pricePerHour: 8000, peakPricePerHour: 12000,
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "cafe", "shop", "coaching", "vip"],
    surface: "Grass", dimensions: "18 Holes", indoor: false,
    description: "Exclusive golf course with 18 holes and panoramic mountain views."
  },
  {
    id: "14", name: "Table Tennis Club", location: "Rruga Ibrahim Rugova, Tirana", city: "Tirana",
    sports: ["table-tennis"], rating: 4.5, reviewCount: 78, pricePerHour: 800, peakPricePerHour: 1200,
    image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["indoor", "coaching"],
    surface: "Indoor", dimensions: "2.74m × 1.525m", indoor: true,
    description: "Professional table tennis club with 8 competition tables."
  },
  {
    id: "15", name: "Rugby Field Tirana", location: "Parku i Liqenit, Tirana", city: "Tirana",
    sports: ["rugby", "cricket"], rating: 4.1, reviewCount: 34, pricePerHour: 2500, peakPricePerHour: 3500,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "lights", "changing-rooms"],
    surface: "Natural Grass", dimensions: "100m × 70m", indoor: false,
    description: "Open grass field suitable for rugby and cricket near the artificial lake."
  },
  {
    id: "16", name: "Handball Arena Vlorë", location: "Rruga Sadik Zotaj, Vlorë", city: "Vlorë",
    sports: ["handball"], rating: 4.3, reviewCount: 56, pricePerHour: 2200, peakPricePerHour: 3200,
    image: "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800&h=500&fit=crop"],
    availability: "few-slots", amenities: ["indoor", "changing-rooms", "parking"],
    surface: "Hardwood", dimensions: "40m × 20m", indoor: true,
    description: "Indoor handball arena with professional court markings."
  },
  {
    id: "17", name: "Sport Center Berat", location: "Bulevardi Republika, Berat", city: "Berat",
    sports: ["football", "basketball", "volleyball"], rating: 4.0, reviewCount: 42, pricePerHour: 1500, peakPricePerHour: 2000,
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "lights"],
    surface: "Artificial Turf", dimensions: "60m × 40m", indoor: false,
    description: "Community sports center in the UNESCO city of Berat."
  },
  {
    id: "18", name: "Badminton Hub", location: "Rruga Myslym Shyri, Tirana", city: "Tirana",
    sports: ["badminton"], rating: 4.6, reviewCount: 112, pricePerHour: 1200, peakPricePerHour: 1800,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["indoor", "coaching", "shop"],
    surface: "Synthetic", dimensions: "13.4m × 6.1m", indoor: true,
    description: "Dedicated badminton facility with 6 courts and coaching programs."
  },
  {
    id: "19", name: "Baseball Diamond Durrës", location: "Rruga Egnatia, Durrës", city: "Durrës",
    sports: ["baseball"], rating: 3.9, reviewCount: 23, pricePerHour: 2000, peakPricePerHour: 2800,
    image: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&h=500&fit=crop"],
    availability: "available", amenities: ["parking", "lights"],
    surface: "Clay/Grass", dimensions: "90ft diamond", indoor: false,
    description: "One of Albania's few dedicated baseball diamonds."
  },
  {
    id: "20", name: "Hockey Rink Tirana", location: "Rruga Don Bosko, Tirana", city: "Tirana",
    sports: ["hockey"], rating: 4.4, reviewCount: 67, pricePerHour: 3500, peakPricePerHour: 5000,
    image: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800&h=500&fit=crop"],
    availability: "few-slots", amenities: ["indoor", "changing-rooms", "parking", "cafe"],
    surface: "Synthetic Ice", dimensions: "61m × 30m", indoor: true,
    description: "Indoor hockey rink with synthetic ice surface."
  },
];

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

export const PLAYERS: Player[] = [
  { id: "1", name: "Andi Hoxha", username: "@andihoxha", avatar: "https://i.pravatar.cc/150?img=1", location: "Tirana", bio: "Football enthusiast. Captain of FC Tirana U21.", favoriteSport: "football", gamesPlayed: 234, winRate: 68, totalHours: 456, rating: 4.8, memberSince: "2023-01", achievements: ["first-booking", "10-games", "tournament-winner", "hat-trick"], sports: ["football", "futsal"] },
  { id: "2", name: "Elira Murati", username: "@eliramurati", avatar: "https://i.pravatar.cc/150?img=5", location: "Durrës", bio: "Tennis pro. Love padel too!", favoriteSport: "tennis", gamesPlayed: 189, winRate: 72, totalHours: 320, rating: 4.9, memberSince: "2023-03", achievements: ["first-booking", "10-games", "50-friends"], sports: ["tennis", "padel"] },
  { id: "3", name: "Dritan Leka", username: "@dritanleka", avatar: "https://i.pravatar.cc/150?img=3", location: "Vlorë", bio: "Basketball is life 🏀", favoriteSport: "basketball", gamesPlayed: 156, winRate: 61, totalHours: 280, rating: 4.5, memberSince: "2023-05", achievements: ["first-booking", "10-games", "night-owl"], sports: ["basketball"] },
  { id: "4", name: "Sara Basha", username: "@sarabasha", avatar: "https://i.pravatar.cc/150?img=9", location: "Tirana", bio: "Swimmer & volleyball player", favoriteSport: "swimming", gamesPlayed: 98, winRate: 70, totalHours: 190, rating: 4.6, memberSince: "2023-06", achievements: ["first-booking", "10-games"], sports: ["swimming", "volleyball"] },
  { id: "5", name: "Arben Krasniqi", username: "@arbenkr", avatar: "https://i.pravatar.cc/150?img=8", location: "Shkodër", bio: "Football & rugby. Always on the field.", favoriteSport: "football", gamesPlayed: 312, winRate: 75, totalHours: 620, rating: 4.9, memberSince: "2022-09", achievements: ["first-booking", "10-games", "tournament-winner", "hat-trick", "100-games"], sports: ["football", "rugby"] },
  { id: "6", name: "Rina Dervishi", username: "@rinadervishi", avatar: "https://i.pravatar.cc/150?img=10", location: "Tirana", bio: "Badminton champion 2024 🏸", favoriteSport: "badminton", gamesPlayed: 245, winRate: 82, totalHours: 390, rating: 4.8, memberSince: "2023-02", achievements: ["first-booking", "10-games", "tournament-winner", "50-friends"], sports: ["badminton", "table-tennis"] },
  { id: "7", name: "Blerim Gashi", username: "@blerimgashi", avatar: "https://i.pravatar.cc/150?img=11", location: "Elbasan", bio: "MMA fighter. Train hard.", favoriteSport: "mma", gamesPlayed: 78, winRate: 65, totalHours: 400, rating: 4.4, memberSince: "2023-07", achievements: ["first-booking", "10-games"], sports: ["mma", "boxing"] },
  { id: "8", name: "Fjolla Berisha", username: "@fjollab", avatar: "https://i.pravatar.cc/150?img=16", location: "Tirana", bio: "Padel addict 🎾 Let's play!", favoriteSport: "padel", gamesPlayed: 167, winRate: 58, totalHours: 210, rating: 4.3, memberSince: "2023-08", achievements: ["first-booking", "10-games", "social-butterfly"], sports: ["padel", "tennis"] },
  { id: "9", name: "Ermal Shehu", username: "@ermalshehu", avatar: "https://i.pravatar.cc/150?img=12", location: "Korçë", bio: "Goalkeeper. Saving everything.", favoriteSport: "football", gamesPlayed: 198, winRate: 64, totalHours: 380, rating: 4.7, memberSince: "2023-01", achievements: ["first-booking", "10-games", "night-owl", "hat-trick"], sports: ["football", "handball"] },
  { id: "10", name: "Albana Topalli", username: "@albanatopalli", avatar: "https://i.pravatar.cc/150?img=20", location: "Durrës", bio: "Beach volleyball & swimming 🌊", favoriteSport: "beach-volleyball", gamesPlayed: 134, winRate: 69, totalHours: 245, rating: 4.5, memberSince: "2023-04", achievements: ["first-booking", "10-games", "50-friends"], sports: ["beach-volleyball", "volleyball", "swimming"] },
  { id: "11", name: "Gentian Xhafa", username: "@gentianx", avatar: "https://i.pravatar.cc/150?img=13", location: "Tirana", bio: "Football manager & player", favoriteSport: "football", gamesPlayed: 287, winRate: 71, totalHours: 520, rating: 4.8, memberSince: "2022-11", achievements: ["first-booking", "10-games", "tournament-winner", "100-games"], sports: ["football"] },
  { id: "12", name: "Viola Mema", username: "@violamema", avatar: "https://i.pravatar.cc/150?img=21", location: "Vlorë", bio: "Tennis instructor & player", favoriteSport: "tennis", gamesPlayed: 345, winRate: 78, totalHours: 680, rating: 4.9, memberSince: "2022-06", achievements: ["first-booking", "10-games", "tournament-winner", "100-games", "50-friends"], sports: ["tennis"] },
  { id: "13", name: "Klajdi Rexhepi", username: "@klajdir", avatar: "https://i.pravatar.cc/150?img=14", location: "Tirana", bio: "Futsal player. Quick feet!", favoriteSport: "futsal", gamesPlayed: 156, winRate: 62, totalHours: 290, rating: 4.4, memberSince: "2023-09", achievements: ["first-booking", "10-games"], sports: ["futsal", "football"] },
  { id: "14", name: "Ornela Çela", username: "@ornelacela", avatar: "https://i.pravatar.cc/150?img=23", location: "Shkodër", bio: "Volleyball captain 🏐", favoriteSport: "volleyball", gamesPlayed: 178, winRate: 66, totalHours: 310, rating: 4.6, memberSince: "2023-03", achievements: ["first-booking", "10-games", "tournament-winner"], sports: ["volleyball", "beach-volleyball"] },
  { id: "15", name: "Taulant Pasha", username: "@taulantp", avatar: "https://i.pravatar.cc/150?img=15", location: "Fier", bio: "Football is my religion ⚽", favoriteSport: "football", gamesPlayed: 423, winRate: 73, totalHours: 890, rating: 4.9, memberSince: "2022-03", achievements: ["first-booking", "10-games", "tournament-winner", "hat-trick", "100-games", "night-owl", "social-butterfly"], sports: ["football"] },
  { id: "16", name: "Besa Kuqi", username: "@besakuqi", avatar: "https://i.pravatar.cc/150?img=24", location: "Tirana", bio: "Swimmer turned triathlete 🏊‍♀️", favoriteSport: "swimming", gamesPlayed: 89, winRate: 74, totalHours: 450, rating: 4.7, memberSince: "2023-05", achievements: ["first-booking", "10-games"], sports: ["swimming"] },
  { id: "17", name: "Ilir Dema", username: "@ilirdema", avatar: "https://i.pravatar.cc/150?img=17", location: "Berat", bio: "Golf & cricket. Gentleman sports.", favoriteSport: "golf", gamesPlayed: 67, winRate: 55, totalHours: 340, rating: 4.2, memberSince: "2023-10", achievements: ["first-booking"], sports: ["golf", "cricket"] },
  { id: "18", name: "Anisa Malaj", username: "@anisamalaj", avatar: "https://i.pravatar.cc/150?img=25", location: "Tirana", bio: "Handball player. Strong arms 💪", favoriteSport: "handball", gamesPlayed: 145, winRate: 67, totalHours: 270, rating: 4.5, memberSince: "2023-04", achievements: ["first-booking", "10-games"], sports: ["handball"] },
  { id: "19", name: "Fatjon Hyseni", username: "@fatjonh", avatar: "https://i.pravatar.cc/150?img=18", location: "Durrës", bio: "Boxing champ 🥊", favoriteSport: "boxing", gamesPlayed: 56, winRate: 80, totalHours: 500, rating: 4.8, memberSince: "2023-01", achievements: ["first-booking", "10-games", "tournament-winner"], sports: ["boxing", "mma"] },
  { id: "20", name: "Luana Aliaj", username: "@luanaa", avatar: "https://i.pravatar.cc/150?img=26", location: "Tirana", bio: "Table tennis national team 🏓", favoriteSport: "table-tennis", gamesPlayed: 289, winRate: 85, totalHours: 560, rating: 4.9, memberSince: "2022-08", achievements: ["first-booking", "10-games", "tournament-winner", "100-games"], sports: ["table-tennis", "badminton"] },
  { id: "21", name: "Kreshnik Bytyçi", username: "@kreshnikb", avatar: "https://i.pravatar.cc/150?img=19", location: "Tirana", bio: "All-round athlete. Any sport, anytime.", favoriteSport: "football", gamesPlayed: 356, winRate: 70, totalHours: 700, rating: 4.7, memberSince: "2022-05", achievements: ["first-booking", "10-games", "100-games", "social-butterfly", "night-owl"], sports: ["football", "basketball", "tennis"] },
  { id: "22", name: "Dorina Hyka", username: "@dorinahyka", avatar: "https://i.pravatar.cc/150?img=27", location: "Vlorë", bio: "Beach sports lover 🏖️", favoriteSport: "beach-volleyball", gamesPlayed: 112, winRate: 63, totalHours: 180, rating: 4.3, memberSince: "2023-06", achievements: ["first-booking", "10-games"], sports: ["beach-volleyball", "swimming"] },
  { id: "23", name: "Altin Osmani", username: "@altino", avatar: "https://i.pravatar.cc/150?img=22", location: "Tirana", bio: "Hockey player. Ice cold ❄️", favoriteSport: "hockey", gamesPlayed: 89, winRate: 58, totalHours: 200, rating: 4.2, memberSince: "2023-08", achievements: ["first-booking"], sports: ["hockey"] },
  { id: "24", name: "Mira Çuni", username: "@miracuni", avatar: "https://i.pravatar.cc/150?img=28", location: "Shkodër", bio: "Yoga instructor & swimmer", favoriteSport: "swimming", gamesPlayed: 45, winRate: 0, totalHours: 300, rating: 4.6, memberSince: "2023-11", achievements: ["first-booking"], sports: ["swimming"] },
  { id: "25", name: "Besnik Kola", username: "@besnikkola", avatar: "https://i.pravatar.cc/150?img=30", location: "Tirana", bio: "Rugby veteran. 10 years on the pitch.", favoriteSport: "rugby", gamesPlayed: 234, winRate: 71, totalHours: 780, rating: 4.8, memberSince: "2021-09", achievements: ["first-booking", "10-games", "100-games", "tournament-winner"], sports: ["rugby"] },
  { id: "26", name: "Ema Brahimi", username: "@emabrahimi", avatar: "https://i.pravatar.cc/150?img=29", location: "Elbasan", bio: "Basketball point guard 🏀", favoriteSport: "basketball", gamesPlayed: 167, winRate: 65, totalHours: 310, rating: 4.5, memberSince: "2023-02", achievements: ["first-booking", "10-games"], sports: ["basketball"] },
  { id: "27", name: "Fatos Llagami", username: "@fatosll", avatar: "https://i.pravatar.cc/150?img=31", location: "Tirana", bio: "Football referee & player", favoriteSport: "football", gamesPlayed: 445, winRate: 0, totalHours: 1200, rating: 4.9, memberSince: "2021-01", achievements: ["first-booking", "10-games", "100-games", "social-butterfly"], sports: ["football"] },
  { id: "28", name: "Anxhela Nika", username: "@anxhela", avatar: "https://i.pravatar.cc/150?img=32", location: "Tirana", bio: "Padel newcomer. Improving every day!", favoriteSport: "padel", gamesPlayed: 34, winRate: 45, totalHours: 50, rating: 3.8, memberSince: "2024-01", achievements: ["first-booking"], sports: ["padel"] },
  { id: "29", name: "Olsi Braho", username: "@olsibraho", avatar: "https://i.pravatar.cc/150?img=33", location: "Durrës", bio: "Cricket & baseball. Bat sports!", favoriteSport: "cricket", gamesPlayed: 78, winRate: 56, totalHours: 150, rating: 4.1, memberSince: "2023-09", achievements: ["first-booking", "10-games"], sports: ["cricket", "baseball"] },
  { id: "30", name: "Teuta Hoxhaj", username: "@teutah", avatar: "https://i.pravatar.cc/150?img=34", location: "Korçë", bio: "Handball goalkeeper. Can't score on me!", favoriteSport: "handball", gamesPlayed: 189, winRate: 68, totalHours: 350, rating: 4.6, memberSince: "2023-01", achievements: ["first-booking", "10-games", "tournament-winner"], sports: ["handball"] },
];

export const CURRENT_PLAYER = PLAYERS[0];

export interface LiveGame {
  id: string;
  sport: SportId;
  teamA: { name: string; logo: string; score: number };
  teamB: { name: string; logo: string; score: number };
  gameTime: string;
  period: string;
  fieldName: string;
  fieldLocation: string;
  viewers: number;
  isLive: boolean;
  events: { time: string; type: string; team: "A" | "B"; player: string; description: string }[];
  stats: Record<string, [number, number]>;
}

export const LIVE_GAMES: LiveGame[] = [
  {
    id: "lg1", sport: "football",
    teamA: { name: "FC Tirana", logo: "https://i.pravatar.cc/40?img=40", score: 2 },
    teamB: { name: "KF Vllaznia", logo: "https://i.pravatar.cc/40?img=41", score: 1 },
    gameTime: "67'", period: "2nd Half", fieldName: "Arena Sport Tirana", fieldLocation: "Tirana",
    viewers: 1234, isLive: true,
    events: [
      { time: "12'", type: "goal", team: "A", player: "A. Hoxha", description: "Goal! Header from corner" },
      { time: "34'", type: "goal", team: "B", player: "B. Kola", description: "Goal! Long range shot" },
      { time: "56'", type: "goal", team: "A", player: "K. Bytyçi", description: "Goal! Penalty kick" },
      { time: "62'", type: "yellow-card", team: "B", player: "E. Shehu", description: "Yellow card for foul" },
    ],
    stats: { "Possession": [62, 38], "Shots": [12, 7], "Shots on Target": [6, 3], "Corners": [5, 2], "Fouls": [8, 11] },
  },
  {
    id: "lg2", sport: "basketball",
    teamA: { name: "BC Tirana", logo: "https://i.pravatar.cc/40?img=42", score: 78 },
    teamB: { name: "BC Vlorë", logo: "https://i.pravatar.cc/40?img=43", score: 72 },
    gameTime: "Q3 8:24", period: "3rd Quarter", fieldName: "Basketball Center Vlorë", fieldLocation: "Vlorë",
    viewers: 567, isLive: true,
    events: [
      { time: "Q1", type: "score", team: "A", player: "D. Leka", description: "3-pointer!" },
      { time: "Q2", type: "score", team: "B", player: "E. Brahimi", description: "Slam dunk!" },
    ],
    stats: { "FG%": [48, 44], "3PT%": [38, 32], "FT%": [85, 78], "Rebounds": [34, 29], "Assists": [18, 14] },
  },
  {
    id: "lg3", sport: "tennis",
    teamA: { name: "E. Murati", logo: "https://i.pravatar.cc/40?img=5", score: 2 },
    teamB: { name: "V. Mema", logo: "https://i.pravatar.cc/40?img=21", score: 1 },
    gameTime: "Set 3", period: "3rd Set", fieldName: "Tennis Academy Shkodër", fieldLocation: "Shkodër",
    viewers: 342, isLive: true,
    events: [],
    stats: { "Aces": [6, 4], "Double Faults": [2, 3], "1st Serve %": [67, 72], "Winners": [24, 18] },
  },
  {
    id: "lg4", sport: "volleyball",
    teamA: { name: "VC Durrës", logo: "https://i.pravatar.cc/40?img=44", score: 2 },
    teamB: { name: "VC Tirana", logo: "https://i.pravatar.cc/40?img=45", score: 2 },
    gameTime: "Set 5", period: "5th Set", fieldName: "Volleyball Beach Durrës", fieldLocation: "Durrës",
    viewers: 445, isLive: true,
    events: [],
    stats: { "Points": [89, 87], "Aces": [8, 6], "Blocks": [12, 10], "Kills": [45, 42] },
  },
  {
    id: "lg5", sport: "futsal",
    teamA: { name: "Futsal Fier", logo: "https://i.pravatar.cc/40?img=46", score: 5 },
    teamB: { name: "Futsal Elbasan", logo: "https://i.pravatar.cc/40?img=47", score: 3 },
    gameTime: "38'", period: "2nd Half", fieldName: "Futsal Arena Fier", fieldLocation: "Fier",
    viewers: 289, isLive: true,
    events: [],
    stats: { "Possession": [55, 45], "Shots": [18, 12], "Fouls": [6, 9] },
  },
];

export const RECENT_GAMES: LiveGame[] = [
  {
    id: "rg1", sport: "football",
    teamA: { name: "KF Laçi", logo: "https://i.pravatar.cc/40?img=48", score: 3 },
    teamB: { name: "KF Teuta", logo: "https://i.pravatar.cc/40?img=49", score: 2 },
    gameTime: "FT", period: "Full Time", fieldName: "Stadiumi Loro Boriçi", fieldLocation: "Shkodër",
    viewers: 2100, isLive: false, events: [], stats: {},
  },
  {
    id: "rg2", sport: "basketball",
    teamA: { name: "BC Shkodër", logo: "https://i.pravatar.cc/40?img=50", score: 95 },
    teamB: { name: "BC Korçë", logo: "https://i.pravatar.cc/40?img=51", score: 88 },
    gameTime: "FT", period: "Full Time", fieldName: "Multisport Korçë", fieldLocation: "Korçë",
    viewers: 430, isLive: false, events: [], stats: {},
  },
  {
    id: "rg3", sport: "padel",
    teamA: { name: "F. Berisha", logo: "https://i.pravatar.cc/40?img=16", score: 6 },
    teamB: { name: "A. Nika", logo: "https://i.pravatar.cc/40?img=32", score: 3 },
    gameTime: "FT", period: "Full Time", fieldName: "Padel Club Durrës", fieldLocation: "Durrës",
    viewers: 180, isLive: false, events: [], stats: {},
  },
  {
    id: "rg4", sport: "handball",
    teamA: { name: "HC Vlorë", logo: "https://i.pravatar.cc/40?img=52", score: 28 },
    teamB: { name: "HC Tirana", logo: "https://i.pravatar.cc/40?img=53", score: 25 },
    gameTime: "FT", period: "Full Time", fieldName: "Handball Arena Vlorë", fieldLocation: "Vlorë",
    viewers: 320, isLive: false, events: [], stats: {},
  },
  {
    id: "rg5", sport: "tennis",
    teamA: { name: "I. Dema", logo: "https://i.pravatar.cc/40?img=17", score: 2 },
    teamB: { name: "O. Braho", logo: "https://i.pravatar.cc/40?img=33", score: 0 },
    gameTime: "FT", period: "Full Time", fieldName: "Tennis Academy Shkodër", fieldLocation: "Shkodër",
    viewers: 156, isLive: false, events: [], stats: {},
  },
];

export interface Tournament {
  id: string;
  name: string;
  sport: SportId;
  teamsCount: number;
  prizePool: string;
  status: "registration" | "in-progress" | "completed";
  startDate: string;
  endDate: string;
  teams: { name: string; seed: number }[];
}

export const TOURNAMENTS: Tournament[] = [
  {
    id: "t1", name: "Tirana Football Cup 2026", sport: "football", teamsCount: 16, prizePool: "500,000 ALL",
    status: "in-progress", startDate: "2026-02-01", endDate: "2026-03-15",
    teams: Array.from({ length: 16 }, (_, i) => ({ name: [`FC Tirana`, `KF Vllaznia`, `KF Laçi`, `KF Teuta`, `KF Partizani`, `KF Skënderbeu`, `KF Bylis`, `KF Kukësi`, `KF Egnatia`, `KF Kastrioti`, `KF Apolonia`, `KF Besa`, `KF Flamurtari`, `KF Luftëtari`, `KF Tomori`, `KF Dinamo`][i], seed: i + 1 })),
  },
  {
    id: "t2", name: "Albanian Basketball League", sport: "basketball", teamsCount: 8, prizePool: "300,000 ALL",
    status: "in-progress", startDate: "2026-01-15", endDate: "2026-04-30",
    teams: Array.from({ length: 8 }, (_, i) => ({ name: [`BC Tirana`, `BC Vlorë`, `BC Shkodër`, `BC Korçë`, `BC Durrës`, `BC Elbasan`, `BC Fier`, `BC Berat`][i], seed: i + 1 })),
  },
  {
    id: "t3", name: "Durrës Padel Open", sport: "padel", teamsCount: 8, prizePool: "200,000 ALL",
    status: "registration", startDate: "2026-03-01", endDate: "2026-03-10",
    teams: Array.from({ length: 8 }, (_, i) => ({ name: [`Team Alpha`, `Team Beta`, `Team Gamma`, `Team Delta`, `Team Epsilon`, `Team Zeta`, `Team Eta`, `Team Theta`][i], seed: i + 1 })),
  },
  {
    id: "t4", name: "Volleyball Championship", sport: "volleyball", teamsCount: 8, prizePool: "250,000 ALL",
    status: "in-progress", startDate: "2026-02-10", endDate: "2026-03-20",
    teams: Array.from({ length: 8 }, (_, i) => ({ name: [`VC Durrës`, `VC Tirana`, `VC Vlorë`, `VC Shkodër`, `VC Korçë`, `VC Elbasan`, `VC Fier`, `VC Berat`][i], seed: i + 1 })),
  },
  {
    id: "t5", name: "Table Tennis Masters", sport: "table-tennis", teamsCount: 8, prizePool: "100,000 ALL",
    status: "completed", startDate: "2026-01-05", endDate: "2026-01-20",
    teams: Array.from({ length: 8 }, (_, i) => ({ name: [`L. Aliaj`, `R. Dervishi`, `Player 3`, `Player 4`, `Player 5`, `Player 6`, `Player 7`, `Player 8`][i], seed: i + 1 })),
  },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-booking", name: "First Booking", description: "Complete your first field booking", emoji: "🎯", unlocked: true },
  { id: "10-games", name: "10 Games", description: "Play 10 games on the platform", emoji: "🔥", unlocked: true },
  { id: "tournament-winner", name: "Tournament Winner", description: "Win a tournament", emoji: "🏆", unlocked: true },
  { id: "hat-trick", name: "Hat-trick Hero", description: "Score 3 goals in a single game", emoji: "⚽", unlocked: true },
  { id: "night-owl", name: "Night Owl", description: "Play 10 games after 9 PM", emoji: "🦉", unlocked: false },
  { id: "social-butterfly", name: "Squad Builder", description: "Recruit 50+ teammates", emoji: "🦋", unlocked: false },
  { id: "100-games", name: "Century", description: "Play 100 games", emoji: "💯", unlocked: false },
  { id: "50-friends", name: "Captain Material", description: "Have 50 teammates in your squad", emoji: "👥", unlocked: false },
  { id: "streak-7", name: "Weekly Warrior", description: "Play 7 days in a row", emoji: "⚡", unlocked: false },
  { id: "all-sports", name: "Multi-Sport", description: "Play 5 different sports", emoji: "🎽", unlocked: false },
  { id: "early-bird", name: "Early Bird", description: "Book a 6 AM game", emoji: "🌅", unlocked: false },
  { id: "review-master", name: "Review Master", description: "Write 20 field reviews", emoji: "⭐", unlocked: false },
];

export interface Notification {
  id: string;
  type: "booking" | "reminder" | "squad" | "achievement" | "live" | "tournament" | "payment";
  title: string;
  message: string;
  time: string;
  read: boolean;
  emoji: string;
}

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "booking", title: "Booking Confirmed", message: "Arena Sport Tirana — Tomorrow at 18:00", time: "2 min ago", read: false, emoji: "✅" },
  { id: "n2", type: "live", title: "Live Game Starting", message: "FC Tirana vs KF Vllaznia is about to start!", time: "5 min ago", read: false, emoji: "🔴" },
  { id: "n3", type: "achievement", title: "Achievement Unlocked!", message: "You earned 'Hat-trick Hero' badge!", time: "1 hour ago", read: false, emoji: "🏆" },
  { id: "n4", type: "squad", title: "Squad Invite", message: "Elira Murati wants to join your squad", time: "2 hours ago", read: false, emoji: "👥" },
  { id: "n5", type: "tournament", title: "Tournament Update", message: "Tirana Football Cup — Round 2 schedule released", time: "3 hours ago", read: false, emoji: "🏅" },
  { id: "n6", type: "reminder", title: "Game Reminder", message: "Your game at Padel Club Durrës starts in 2 hours", time: "4 hours ago", read: true, emoji: "⏰" },
  { id: "n7", type: "payment", title: "Payment Received", message: "3,000 ALL payment for booking #1234", time: "5 hours ago", read: true, emoji: "💰" },
  { id: "n8", type: "booking", title: "Booking Confirmed", message: "Basketball Center Vlorë — Friday at 20:00", time: "Yesterday", read: true, emoji: "✅" },
  { id: "n9", type: "live", title: "Live Game Alert", message: "BC Tirana vs BC Vlorë — Exciting 4th quarter!", time: "Yesterday", read: true, emoji: "🔴" },
  { id: "n10", type: "squad", title: "New Teammate", message: "Arben Krasniqi joined your squad", time: "Yesterday", read: true, emoji: "👥" },
  { id: "n11", type: "achievement", title: "Almost There!", message: "You're 2 games away from 'Century' badge", time: "Yesterday", read: true, emoji: "🏆" },
  { id: "n12", type: "tournament", title: "Registration Open", message: "Durrës Padel Open — Register now!", time: "2 days ago", read: true, emoji: "🏅" },
  { id: "n13", type: "reminder", title: "Weekly Summary", message: "You played 5 games this week. Great job!", time: "2 days ago", read: true, emoji: "⏰" },
  { id: "n14", type: "payment", title: "Refund Processed", message: "1,500 ALL refunded for cancelled booking", time: "2 days ago", read: true, emoji: "💰" },
  { id: "n15", type: "booking", title: "Booking Cancelled", message: "Futsal Arena Fier booking cancelled by host", time: "3 days ago", read: true, emoji: "❌" },
  { id: "n16", type: "squad", title: "Squad Invite", message: "Sara Basha wants to recruit you", time: "3 days ago", read: true, emoji: "👥" },
  { id: "n17", type: "live", title: "Game Highlight", message: "Watch the best moments from last night's game!", time: "3 days ago", read: true, emoji: "🔴" },
  { id: "n18", type: "tournament", title: "Match Result", message: "Your team won 3-1 in Round 1!", time: "4 days ago", read: true, emoji: "🏅" },
  { id: "n19", type: "achievement", title: "Achievement Unlocked!", message: "You earned '10 Games' badge!", time: "5 days ago", read: true, emoji: "🏆" },
  { id: "n20", type: "payment", title: "Payment Successful", message: "2,500 ALL for Dinamo Complex booking", time: "5 days ago", read: true, emoji: "💰" },
];

export const REVIEWS = [
  { id: "r1", fieldId: "1", player: PLAYERS[1], rating: 5, comment: "Best football field in Tirana! The turf is amazing and the lights are perfect for evening games.", date: "2026-02-10" },
  { id: "r2", fieldId: "1", player: PLAYERS[4], rating: 5, comment: "Great facilities. Parking is convenient and the changing rooms are clean.", date: "2026-02-08" },
  { id: "r3", fieldId: "1", player: PLAYERS[10], rating: 4, comment: "Love playing here. Only issue is it gets crowded on weekends.", date: "2026-02-05" },
  { id: "r4", fieldId: "2", player: PLAYERS[8], rating: 4, comment: "Historic venue with character. Could use some renovation though.", date: "2026-02-09" },
  { id: "r5", fieldId: "3", player: PLAYERS[7], rating: 5, comment: "World-class padel courts! The glass walls make it feel professional.", date: "2026-02-12" },
];

export const TIME_SLOTS = [
  { time: "06:00", label: "6:00 AM" },
  { time: "07:00", label: "7:00 AM" },
  { time: "08:00", label: "8:00 AM" },
  { time: "09:00", label: "9:00 AM" },
  { time: "10:00", label: "10:00 AM" },
  { time: "11:00", label: "11:00 AM" },
  { time: "12:00", label: "12:00 PM" },
  { time: "13:00", label: "1:00 PM" },
  { time: "14:00", label: "2:00 PM" },
  { time: "15:00", label: "3:00 PM" },
  { time: "16:00", label: "4:00 PM" },
  { time: "17:00", label: "5:00 PM" },
  { time: "18:00", label: "6:00 PM" },
  { time: "19:00", label: "7:00 PM" },
  { time: "20:00", label: "8:00 PM" },
  { time: "21:00", label: "9:00 PM" },
  { time: "22:00", label: "10:00 PM" },
];

// Generate availability for the week
export const generateWeekAvailability = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map(day => ({
    day,
    slots: TIME_SLOTS.map(slot => ({
      ...slot,
      status: Math.random() > 0.7 ? "booked" as const : Math.random() > 0.5 ? "few" as const : "available" as const,
    })),
  }));
};

export const LEAGUE_STANDINGS = [
  { pos: 1, team: "FC Tirana", p: 18, w: 14, d: 2, l: 2, gd: 28, pts: 44 },
  { pos: 2, team: "KF Vllaznia", p: 18, w: 12, d: 3, l: 3, gd: 22, pts: 39 },
  { pos: 3, team: "KF Laçi", p: 18, w: 11, d: 4, l: 3, gd: 18, pts: 37 },
  { pos: 4, team: "KF Teuta", p: 18, w: 10, d: 3, l: 5, gd: 12, pts: 33 },
  { pos: 5, team: "KF Partizani", p: 18, w: 9, d: 4, l: 5, gd: 10, pts: 31 },
  { pos: 6, team: "KF Skënderbeu", p: 18, w: 8, d: 5, l: 5, gd: 8, pts: 29 },
  { pos: 7, team: "KF Bylis", p: 18, w: 7, d: 4, l: 7, gd: 2, pts: 25 },
  { pos: 8, team: "KF Kukësi", p: 18, w: 6, d: 5, l: 7, gd: -2, pts: 23 },
  { pos: 9, team: "KF Egnatia", p: 18, w: 5, d: 4, l: 9, gd: -8, pts: 19 },
  { pos: 10, team: "KF Kastrioti", p: 18, w: 4, d: 3, l: 11, gd: -15, pts: 15 },
];

export const UPCOMING_BOOKINGS = [
  { id: "b1", field: FIELDS[0], date: "2026-02-18", time: "18:00", duration: 1, sport: "football" as SportId, players: [PLAYERS[0], PLAYERS[4], PLAYERS[10]], status: "confirmed" as const },
  { id: "b2", field: FIELDS[2], date: "2026-02-20", time: "19:00", duration: 1, sport: "padel" as SportId, players: [PLAYERS[0], PLAYERS[7]], status: "confirmed" as const },
  { id: "b3", field: FIELDS[3], date: "2026-02-22", time: "20:00", duration: 2, sport: "basketball" as SportId, players: [PLAYERS[0], PLAYERS[2], PLAYERS[25]], status: "pending" as const },
];

export const PAST_BOOKINGS = [
  { id: "bp1", field: FIELDS[0], date: "2026-02-10", time: "18:00", duration: 1, sport: "football" as SportId, players: [PLAYERS[0], PLAYERS[4]], status: "confirmed" as const },
  { id: "bp2", field: FIELDS[2], date: "2026-02-08", time: "19:00", duration: 1, sport: "padel" as SportId, players: [PLAYERS[0], PLAYERS[7]], status: "confirmed" as const },
  { id: "bp3", field: FIELDS[1], date: "2026-02-05", time: "20:00", duration: 2, sport: "basketball" as SportId, players: [PLAYERS[0], PLAYERS[2]], status: "cancelled" as const },
];
