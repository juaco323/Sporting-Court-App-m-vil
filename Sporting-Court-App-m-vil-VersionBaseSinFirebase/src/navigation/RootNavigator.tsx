import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CourtDetailScreen from '../screens/CourtDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import ReservationsScreen from '../screens/ReservationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Canchas',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏟️</Text>,
        }}
      />
      <Tab.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{
          tabBarLabel: 'Mis Reservas',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>📅</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={HomeTabs} />
      <Stack.Screen
        name="CourtDetail"
        component={CourtDetailScreen}
        options={{ headerShown: true, title: 'Detalle de Cancha' }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerShown: true, title: 'Reservar' }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
        Cargando...
      </Text>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
