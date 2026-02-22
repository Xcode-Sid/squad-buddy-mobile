import type { SportId } from "./mockData";

export interface VenueAmenity {
  id: string;
  name: string;
  emoji: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  sports: SportId[];
  fieldsCount: number;
  amenities: VenueAmenity[];
  openTime: string;
  closeTime: string;
  phone: string;
  email: string;
  website?: string;
  lat: number;
  lng: number;
  isPartner: boolean;
}

export const ALL_AMENITIES: VenueAmenity[] = [
  { id: "parking", name: "Parking", emoji: "🅿️" },
  { id: "lights", name: "Floodlights", emoji: "💡" },
  { id: "changing-rooms", name: "Changing Rooms", emoji: "🚿" },
  { id: "cafe", name: "Café / Bar", emoji: "☕" },
  { id: "shop", name: "Sports Shop", emoji: "🏪" },
  { id: "coaching", name: "Coaching", emoji: "🎓" },
  { id: "vip", name: "VIP Area", emoji: "👑" },
  { id: "wifi", name: "Free Wi-Fi", emoji: "📶" },
  { id: "sauna", name: "Sauna", emoji: "🧖" },
  { id: "physio", name: "Physiotherapy", emoji: "💆" },
  { id: "lockers", name: "Lockers", emoji: "🔐" },
  { id: "kids", name: "Kids Area", emoji: "👶" },
];

export const MOCK_VENUES: Venue[] = [
  {
    id: "v1", name: "Arena Sport Complex", description: "Tirana's premier multi-sport complex featuring FIFA-standard football pitches, tennis courts, and a fully equipped gym. The complex hosts regular tournaments and has hosted international events.",
    address: "Rruga e Elbasanit 45, Tirana", city: "Tirana",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=500&fit=crop", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop"],
    rating: 4.8, reviewCount: 342, sports: ["football", "futsal", "tennis", "basketball"], fieldsCount: 6,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[1], ALL_AMENITIES[2], ALL_AMENITIES[3], ALL_AMENITIES[7], ALL_AMENITIES[10]],
    openTime: "06:00", closeTime: "23:00", phone: "+355 69 123 4567", email: "info@arenasport.al", website: "https://arenasport.al",
    lat: 41.3275, lng: 19.8187, isPartner: true,
  },
  {
    id: "v2", name: "Kompleksi Dinamo", description: "Historic sports complex with character and tradition. Home to some of Albania's most legendary sporting moments. Features multiple courts and a classic atmosphere.",
    address: "Rruga Muhamet Gjollesha, Tirana", city: "Tirana",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=500&fit=crop"],
    rating: 4.6, reviewCount: 256, sports: ["football", "basketball", "tennis", "volleyball"], fieldsCount: 8,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[1], ALL_AMENITIES[2], ALL_AMENITIES[4]],
    openTime: "07:00", closeTime: "22:00", phone: "+355 69 234 5678", email: "info@dinamo.al",
    lat: 41.3317, lng: 19.8172, isPartner: true,
  },
  {
    id: "v3", name: "Bregdeti Sports Village", description: "Beachfront sports paradise in Durrës. Features padel courts, beach volleyball, and swimming facilities with stunning Adriatic views.",
    address: "Rruga Taulantia 12, Durrës", city: "Durrës",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=500&fit=crop", "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=500&fit=crop"],
    rating: 4.9, reviewCount: 198, sports: ["padel", "tennis", "beach-volleyball", "swimming"], fieldsCount: 5,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[1], ALL_AMENITIES[2], ALL_AMENITIES[3], ALL_AMENITIES[8], ALL_AMENITIES[11]],
    openTime: "06:00", closeTime: "22:00", phone: "+355 69 345 6789", email: "info@bregdeti.al", website: "https://bregdeti.al",
    lat: 41.3236, lng: 19.4482, isPartner: true,
  },
  {
    id: "v4", name: "Shkodra Sports Hub", description: "Northern Albania's largest sports facility. Known for its tennis academy and world-class clay courts. Also features badminton and football facilities.",
    address: "Rruga 13 Dhjetori, Shkodër", city: "Shkodër",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=500&fit=crop"],
    rating: 4.7, reviewCount: 178, sports: ["tennis", "badminton", "football", "rugby"], fieldsCount: 7,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[1], ALL_AMENITIES[5], ALL_AMENITIES[4], ALL_AMENITIES[2]],
    openTime: "07:00", closeTime: "21:00", phone: "+355 69 456 7890", email: "info@shkodrasports.al",
    lat: 42.0693, lng: 19.5126, isPartner: false,
  },
  {
    id: "v5", name: "FitBox Arena", description: "The ultimate combat sports destination. Professional boxing ring, MMA octagon, and training facilities for all levels.",
    address: "Rruga Barrikadave 8, Tirana", city: "Tirana",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=500&fit=crop"],
    rating: 4.6, reviewCount: 134, sports: ["boxing", "mma"], fieldsCount: 3,
    amenities: [ALL_AMENITIES[2], ALL_AMENITIES[5], ALL_AMENITIES[9], ALL_AMENITIES[10]],
    openTime: "06:00", closeTime: "22:00", phone: "+355 69 567 8901", email: "info@fitbox.al", website: "https://fitbox.al",
    lat: 41.3262, lng: 19.8208, isPartner: true,
  },
  {
    id: "v6", name: "Aqua Sport Center", description: "Olympic-standard swimming facility with heated pools, sauna, and wellness center. Perfect for competitive swimmers and casual visitors alike.",
    address: "Rruga e Kavajës 120, Tirana", city: "Tirana",
    image: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&h=500&fit=crop"],
    rating: 4.8, reviewCount: 210, sports: ["swimming"], fieldsCount: 2,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[2], ALL_AMENITIES[8], ALL_AMENITIES[3], ALL_AMENITIES[9], ALL_AMENITIES[10]],
    openTime: "06:00", closeTime: "22:00", phone: "+355 69 678 9012", email: "info@aquasport.al",
    lat: 41.3290, lng: 19.8120, isPartner: true,
  },
];
