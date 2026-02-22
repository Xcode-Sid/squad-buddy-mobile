import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CalendarCheck, MessageSquare, BarChart3, User } from 'lucide-react-native';
import type { BusinessTabParamList } from './types';
import { colors } from '../theme/colors';
import DashboardScreen from '../screens/DashboardScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ChatScreen from '../screens/ChatScreen';
import BusinessStatsScreen from '../screens/BusinessStatsScreen';
import BusinessProfileScreen from '../screens/BusinessProfileScreen';

const Tab = createBottomTabNavigator<BusinessTabParamList>();

export default function BusinessTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: { fontSize: 9, fontWeight: '500' },
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} options={{ tabBarIcon: ({ color, size }) => <CalendarCheck size={size} color={color} /> }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} /> }} />
      <Tab.Screen name="Revenue" component={BusinessStatsScreen} options={{ tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} /> }} />
      <Tab.Screen name="BizProfile" component={BusinessProfileScreen} options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}
