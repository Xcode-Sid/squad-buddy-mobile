export type UserRole = "individual" | "business" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface IndividualProfile extends AuthUser {
  role: "individual";
  username: string;
  location: string;
  bio: string;
  favoriteSport: string;
  gamesPlayed: number;
  winRate: number;
  totalHours: number;
  totalSpent: number;
  rating: number;
  sports: string[];
  achievements: string[];
  friends: string[];
  pendingFriends: string[];
  sentRequests: string[];
}

export interface BusinessProfile extends AuthUser {
  role: "business";
  businessName: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  totalRevenue: number;
  totalBookings: number;
  fieldsCount: number;
  rating: number;
  verified: boolean;
}

export interface AdminProfile extends AuthUser {
  role: "admin";
}

export type AnyProfile = IndividualProfile | BusinessProfile | AdminProfile;

export type SquadStatus = "none" | "pending_sent" | "pending_received" | "teammates";
