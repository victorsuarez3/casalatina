/**
 * Navigation types for TypeScript
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  HomeMain: undefined;
  EventDetails: { eventId: string };
  ProfileMain: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Invite: undefined;
  Profile: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeMain'>;
export type EventDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileMain'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

