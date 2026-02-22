import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import IndividualTabs from './IndividualTabs';
import BusinessTabs from './BusinessTabs';
import AdminTabs from './AdminTabs';
import FieldDetailScreen from '../screens/FieldDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import LiveStreamScreen from '../screens/LiveStreamScreen';
import LiveScoresScreen from '../screens/LiveScoresScreen';
import WalletScreen from '../screens/WalletScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import BadgesScreen from '../screens/BadgesScreen';
import LoyaltyScreen from '../screens/LoyaltyScreen';
import EquipmentScreen from '../screens/EquipmentScreen';
import TrainingScreen from '../screens/TrainingScreen';
import LeaguesScreen from '../screens/LeaguesScreen';
import VenuesScreen from '../screens/VenuesScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import IndividualStatsScreen from '../screens/IndividualStatsScreen';
import CommunityScreen from '../screens/CommunityScreen';
import CompareScreen from '../screens/CompareScreen';
import TournamentsScreen from '../screens/TournamentsScreen';
import SocialScreen from '../screens/SocialScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import BusinessStatsScreen from '../screens/BusinessStatsScreen';
import BusinessProfileScreen from '../screens/BusinessProfileScreen';
import FieldManagementScreen from '../screens/FieldManagementScreen';
import LiveManagementScreen from '../screens/LiveManagementScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : user?.role === 'admin' ? (
        <Stack.Screen name="AdminMain" component={AdminTabs} />
      ) : user?.role === 'business' ? (
        <>
          <Stack.Screen name="BusinessTabs" component={BusinessTabs} />
          <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="LiveScores" component={LiveScoresScreen} />
          <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="Equipment" component={EquipmentScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="FieldManagement" component={FieldManagementScreen} />
          <Stack.Screen name="LiveManagement" component={LiveManagementScreen} />
          <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="IndividualTabs" component={IndividualTabs} />
          <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="LiveScores" component={LiveScoresScreen} />
          <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="Challenges" component={ChallengesScreen} />
          <Stack.Screen name="Badges" component={BadgesScreen} />
          <Stack.Screen name="Loyalty" component={LoyaltyScreen} />
          <Stack.Screen name="Equipment" component={EquipmentScreen} />
          <Stack.Screen name="Training" component={TrainingScreen} />
          <Stack.Screen name="Leagues" component={LeaguesScreen} />
          <Stack.Screen name="Venues" component={VenuesScreen} />
          <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="IndividualStats" component={IndividualStatsScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          <Stack.Screen name="Compare" component={CompareScreen} />
          <Stack.Screen name="Tournaments" component={TournamentsScreen} />
          <Stack.Screen name="Social" component={SocialScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
