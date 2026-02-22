import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, MapPin, DollarSign, AlertTriangle, Sparkles } from 'lucide-react-native';
import type { AdminTabParamList } from './types';
import { colors } from '../theme/colors';
import { AdminProvider } from '../context/AdminContext';
import AdminOverviewScreen from '../screens/admin/AdminOverviewScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminFieldsScreen from '../screens/admin/AdminFieldsScreen';
import AdminRevenueScreen from '../screens/admin/AdminRevenueScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';
import AdminAIScreen from '../screens/admin/AdminAIScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminTabs() {
  return (
    <AdminProvider>
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
        <Tab.Screen name="Overview" component={AdminOverviewScreen} options={{ tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }} />
        <Tab.Screen name="Users" component={AdminUsersScreen} options={{ tabBarIcon: ({ color, size }) => <Users size={size} color={color} /> }} />
        <Tab.Screen name="Fields" component={AdminFieldsScreen} options={{ tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} /> }} />
        <Tab.Screen name="Revenue" component={AdminRevenueScreen} options={{ tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} /> }} />
        <Tab.Screen name="Reports" component={AdminReportsScreen} options={{ tabBarIcon: ({ color, size }) => <AlertTriangle size={size} color={color} /> }} />
        <Tab.Screen name="AI" component={AdminAIScreen} options={{ tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} /> }} />
      </Tab.Navigator>
    </AdminProvider>
  );
}
