// navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../components/OnboardingScreen/OnboardingScreen';  // Correct import for OnboardingScreen
import DashboardScreen from '../components/DashboardScreen/DashboardScreen';  // Correct import for DashboardScreen
import SignUp from '../components/SignupScreen/SignupScreen';
import LoginScreen from '../components/LoginScreen/LoginScreen';
import CreateEventScreen from '../components/CreateEvent/CreateEvent';
import '../Firebase'
import EditEvent from '../components/EditScreen/EditScreen';
import FavouriteEvents from '../components/FavouriteScreen/FavouriteScreen';
import EventList from '../components/EventListScreen/EventListScreen';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
     <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
     <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
     <Stack.Screen name="EditEvent" component={EditEvent} />
     <Stack.Screen name="Favourite" component={FavouriteEvents} />
     <Stack.Screen name="EventList" component={EventList} />
    </Stack.Navigator>
  );
}
