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
  AdminIndex: undefined;
  AdminEvents: undefined;
  AdminEventCreate: undefined;
  AdminEventEdit: { eventId: string };
  AdminMembers: undefined;
  AdminMemberDetail: { userId: string };
};

export type TabParamList = {
  Home: undefined;
  Invite: undefined;
  Profile: undefined;
};

export type AuthFlowParamList = {
  Welcome: undefined;
  ApplicationStart: { inviteCode?: string };
  ApplicationReview: undefined;
  Home: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeMain'>;
export type EventDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileMain'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
export type WelcomeScreenProps = NativeStackScreenProps<AuthFlowParamList, 'Welcome'>;
export type ApplicationStartScreenProps = NativeStackScreenProps<AuthFlowParamList, 'ApplicationStart'>;
export type ApplicationReviewScreenProps = NativeStackScreenProps<AuthFlowParamList, 'ApplicationReview'>;

