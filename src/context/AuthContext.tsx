import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { AnyProfile, UserRole, IndividualProfile, BusinessProfile } from '../types/auth';
import { CURRENT_PLAYER, FIELDS } from '../data/mockData';

const MOCK_INDIVIDUAL: IndividualProfile = {
  id: CURRENT_PLAYER.id,
  name: CURRENT_PLAYER.name,
  email: 'john@example.com',
  avatar: CURRENT_PLAYER.avatar,
  role: 'individual',
  username: CURRENT_PLAYER.username,
  location: CURRENT_PLAYER.location,
  bio: CURRENT_PLAYER.bio,
  favoriteSport: CURRENT_PLAYER.favoriteSport,
  gamesPlayed: CURRENT_PLAYER.gamesPlayed,
  winRate: CURRENT_PLAYER.winRate,
  totalHours: CURRENT_PLAYER.totalHours,
  totalSpent: 45200,
  rating: CURRENT_PLAYER.rating,
  sports: CURRENT_PLAYER.sports,
  achievements: CURRENT_PLAYER.achievements,
  friends: ['player-2', 'player-3'],
  pendingFriends: ['player-4'],
  sentRequests: ['player-5'],
};

const MOCK_BUSINESS: BusinessProfile = {
  id: 'biz-1',
  name: 'Artan Koci',
  email: 'artan@kompleksi.al',
  avatar: FIELDS[0].image,
  role: 'business',
  businessName: 'Kompleksi Sportiv Tirana',
  description: 'Premium sports complex in the heart of Tirana',
  address: 'Rruga Myslym Shyri 42',
  city: 'Tirana',
  phone: '+355 69 123 4567',
  totalRevenue: 1280000,
  totalBookings: 342,
  fieldsCount: FIELDS.slice(0, 3).length,
  rating: 4.8,
  verified: true,
};

interface AuthContextValue {
  user: AnyProfile | null;
  login: (role: UserRole) => void;
  logout: () => void;
  updateProfile: (updates: Partial<AnyProfile>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AnyProfile | null>(null);

  const login = (role: UserRole) => {
    if (role === 'individual') setUser(MOCK_INDIVIDUAL);
    else if (role === 'business') setUser(MOCK_BUSINESS);
    else setUser({ id: 'admin-1', name: 'Admin', email: 'admin@squadbuddy.al', avatar: '', role: 'admin' });
  };

  const logout = () => setUser(null);

  const updateProfile = (updates: Partial<AnyProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } as AnyProfile : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
