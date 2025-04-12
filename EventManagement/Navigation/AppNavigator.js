import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingScreen from '../components/OnboardingScreen/OnboardingScreen';
import DashboardScreen from '../components/DashboardScreen/DashboardScreen';
import SignUp from '../components/SignupScreen/SignupScreen';
import LoginScreen from '../components/LoginScreen/LoginScreen';
import CreateEventScreen from '../components/CreateEvent/CreateEvent';
import EditEvent from '../components/EditScreen/EditScreen';
import FavouriteEvents from '../components/FavouriteScreen/FavouriteScreen';
import EventList from '../components/EventListScreen/EventListScreen';
import '../Firebase';
import Dashboard from '../components/DashboardScreen/DashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // ✅ Show labels under icons
        tabBarActiveTintColor: '#5E60CE',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
        },
        tabBarStyle: {
          position: 'absolute',
          height: 80,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={({ navigation }) => ({
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Icon name="calendar" size={28} color={color} />
          ),
          header: () => <Dashboard navigation={navigation} />,
        })}
      />

      <Tab.Screen
        name="EventList"
        component={EventList}
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: ({ color }) => (
            <Icon name="list" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color }) => (
            <Icon name="plus" size={32} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Favourite"
        component={FavouriteEvents}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ color }) => (
            <Icon name="star" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}



export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Dashboard" component={MainTabNavigator} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="EditEvent" component={EditEvent} />
      <Stack.Screen name="Favourite" component={FavouriteEvents} />
      <Stack.Screen name="EventList" component={EventList} />
    </Stack.Navigator>
  );
}




