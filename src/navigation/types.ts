import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Auth: undefined;
  IndividualTabs: undefined;
  BusinessTabs: undefined;
  AdminMain: undefined;
  FieldDetail: { id: string };
  Booking: { id: string };
  LiveScores: undefined;
  LiveStream: { id: string };
  Wallet: undefined;
  Challenges: undefined;
  Badges: undefined;
  Loyalty: undefined;
  Equipment: undefined;
  Training: undefined;
  Leagues: undefined;
  Venues: undefined;
  HelpCenter: undefined;
  Notifications: undefined;
  Settings: undefined;
  Subscription: undefined;
  IndividualStats: undefined;
  Community: undefined;
  Compare: undefined;
  Tournaments: undefined;
  Social: undefined;
  EditProfile: undefined;
  BusinessStats: undefined;
  BusinessProfile: undefined;
  FieldManagement: undefined;
  LiveManagement: undefined;
};

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Explore: undefined;
  FieldDetail: { id: string };
  LiveScores: undefined;
  LiveStream: { id: string };
  Tournaments: undefined;
};

export type IndividualTabParamList = {
  Home: undefined;
  Explore: undefined;
  Bookings: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type BusinessTabParamList = {
  Home: undefined;
  Bookings: undefined;
  Chat: undefined;
  Revenue: undefined;
  BizProfile: undefined;
};

export type AdminTabParamList = {
  Overview: undefined;
  Users: undefined;
  Fields: undefined;
  Revenue: undefined;
  Reports: undefined;
  AI: undefined;
};

export type RootStackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
export type AuthStackProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;
