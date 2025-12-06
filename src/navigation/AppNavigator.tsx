/**
 * Main App Navigator with Bottom Tabs
 */

import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from './types';
import { CustomTabBar } from '../components/CustomTabBar';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { EventDetailsScreen } from '../screens/EventDetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { InviteScreen } from '../screens/InviteScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
// Admin Screens
import { AdminIndexScreen } from '../screens/admin/AdminIndexScreen';
import { AdminEventsScreen } from '../screens/admin/AdminEventsScreen';
import { AdminEventCreateScreen } from '../screens/admin/AdminEventCreateScreen';
import { AdminEventEditScreen } from '../screens/admin/AdminEventEditScreen';
import { AdminMembersScreen } from '../screens/admin/AdminMembersScreen';
import { AdminMemberDetailScreen } from '../screens/admin/AdminMemberDetailScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
};

const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminIndex" component={AdminIndexScreen} />
      <Stack.Screen name="AdminEvents" component={AdminEventsScreen} />
      <Stack.Screen name="AdminEventCreate" component={AdminEventCreateScreen} />
      <Stack.Screen name="AdminEventEdit" component={AdminEventEditScreen} />
      <Stack.Screen name="AdminMembers" component={AdminMembersScreen} />
      <Stack.Screen name="AdminMemberDetail" component={AdminMemberDetailScreen} />
    </Stack.Navigator>
  );
};

// Add admin routes to ProfileStack for easy access
const ProfileStackWithAdmin = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="AdminIndex" component={AdminIndexScreen} />
      <Stack.Screen name="AdminEvents" component={AdminEventsScreen} />
      <Stack.Screen name="AdminEventCreate" component={AdminEventCreateScreen} />
      <Stack.Screen name="AdminEventEdit" component={AdminEventEditScreen} />
      <Stack.Screen name="AdminMembers" component={AdminMembersScreen} />
      <Stack.Screen name="AdminMemberDetail" component={AdminMemberDetailScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <ProtectedRoute>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: 'rgba(0,0,0,0)', // Transparente total
            position: 'absolute',
            borderTopWidth: 0, // NO borde
            elevation: 0, // Android: NO sombra
            shadowOpacity: 0, // iOS: NO sombra
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 0,
          },
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          ),
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Invite" component={InviteScreen} />
        <Tab.Screen name="Profile" component={ProfileStackWithAdmin} />
      </Tab.Navigator>
    </ProtectedRoute>
  );
};

