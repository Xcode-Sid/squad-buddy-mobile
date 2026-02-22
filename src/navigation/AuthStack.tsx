import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import ExploreScreen from '../screens/ExploreScreen';
import FieldDetailScreen from '../screens/FieldDetailScreen';
import LiveScoresScreen from '../screens/LiveScoresScreen';
import LiveStreamScreen from '../screens/LiveStreamScreen';
import TournamentsScreen from '../screens/TournamentsScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
      <Stack.Screen name="LiveScores" component={LiveScoresScreen} />
      <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
      <Stack.Screen name="Tournaments" component={TournamentsScreen} />
    </Stack.Navigator>
  );
}
