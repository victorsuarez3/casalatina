/**
 * Auth Navigator - Casa Latina Premium
 * Handles authentication flow routing
 */

import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { showAlert } from '../utils/alert';
import { SplashScreen } from '../screens/Auth/SplashScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';
import { ApplicationFormScreen, ApplicationFormData } from '../screens/Auth/ApplicationFormScreen';
import { PendingApprovalScreen } from '../screens/Auth/PendingApprovalScreen';
import { signUp, signIn } from '../services/auth';
import { useAuth } from '../providers/AuthProvider';
import { UserDoc } from '../models/firestore';
import { getUserByInviteCode } from '../services/firebase/users';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ApplicationForm: { inviteCode?: string };
  PendingApproval: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

type AuthNavigatorProps = NativeStackScreenProps<AuthStackParamList>;

interface AuthNavigatorContainerProps {
  onAuthSuccess: () => void;
  onRegisterSuccess?: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorContainerProps> = ({ onAuthSuccess, onRegisterSuccess }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);

  // Simulate splash screen delay
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreenWrapper
            {...props}
            onAuthSuccess={onAuthSuccess}
            setLoading={setLoading}
            loading={loading}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => (
          <RegisterScreenWrapper
            {...props}
            setLoading={setLoading}
            loading={loading}
            onRegisterSuccess={onRegisterSuccess}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ApplicationForm">
        {(props) => (
          <ApplicationFormScreenWrapper
            {...props}
            setLoading={setLoading}
            loading={loading}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PendingApproval">
        {(props) => (
          <PendingApprovalScreenWrapper
            {...props}
            onAuthSuccess={onAuthSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Wrapper components to handle navigation
const LoginScreenWrapper: React.FC<AuthNavigatorProps & {
  onAuthSuccess: () => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}> = ({ navigation, onAuthSuccess, setLoading, loading }) => {

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signIn(email, password);
      // onAuthStateChanged will automatically load userDoc, no need to refresh
      // Navigation will be handled by App.tsx based on membershipStatus
      onAuthSuccess();
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error.code === 'auth/user-not-found'
          ? 'No account found with this email'
          : error.code === 'auth/wrong-password'
          ? 'Incorrect password'
          : error.code === 'auth/invalid-email'
          ? 'Invalid email address'
          : 'Failed to sign in. Please try again.';
      showAlert('Sign In Error', errorMessage, 'error');
    }
  };

  return (
    <LoginScreen
      onLogin={handleLogin}
      onNavigateToRegister={() => navigation.navigate('Register')}
      loading={loading}
    />
  );
};

const RegisterScreenWrapper: React.FC<AuthNavigatorProps & {
  setLoading: (loading: boolean) => void;
  loading: boolean;
  onRegisterSuccess?: () => void;
}> = ({ navigation, setLoading, loading, onRegisterSuccess }) => {
  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await signUp(email, password, name);
      // onAuthStateChanged will automatically load userDoc via snapshot
      // No need to manually refresh - this is faster
      setLoading(false);
      // Notify parent that registration was successful
      // App.tsx will detect the user and route to ApplicationStartScreen
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists'
          : error.code === 'auth/invalid-email'
          ? 'Invalid email address'
          : error.code === 'auth/weak-password'
          ? 'Password is too weak. Please use at least 6 characters'
          : 'Failed to create account. Please try again.';
      showAlert('Sign Up Error', errorMessage, 'error');
    }
  };

  return (
    <RegisterScreen
      onRegister={handleRegister}
      onNavigateToLogin={() => navigation.navigate('Login')}
      loading={loading}
    />
  );
};

const ApplicationFormScreenWrapper: React.FC<AuthNavigatorProps & {
  setLoading: (loading: boolean) => void;
  loading: boolean;
}> = ({ navigation, setLoading, loading, route }) => {
  const { user, updateUser } = useAuth();
  const inviteCode = route?.params?.inviteCode;

  const handleApplicationSubmit = async (formData: ApplicationFormData) => {
    if (!user) {
      showAlert('Error', 'You must be logged in to submit an application', 'error');
      return;
    }

    try {
      setLoading(true);

      // Convert form data to the format expected by Firestore
      const ageValue = typeof formData.age === 'string' ? parseInt(formData.age, 10) : formData.age;
      // Instagram handle: remove any @ and add it back (user only types username)
      const cleanHandle = formData.instagramHandle.replace(/^@+/, '').trim();
      const instagramHandleValue = `@${cleanHandle}`;

      const applicationData: Partial<UserDoc> = {
        positionTitle: formData.position,
        company: formData.company,
        industry: formData.industry,
        educationLevel: formData.educationLevel,
        university: formData.university || undefined,
        annualIncomeRange: formData.incomeRange,
        city: formData.city,
        age: ageValue,
        instagramHandle: instagramHandleValue,
        heardAboutUs: formData.referralSource || undefined,
        membershipStatus: 'pending' as const,
      };

      // Process invite code if provided
      if (inviteCode) {
        const inviter = await getUserByInviteCode(inviteCode);
        if (inviter) {
          applicationData.invitedBy = inviter.id;
          applicationData.invitedAt = new Date().toISOString();
          // Update referral source to show it was via invitation
          applicationData.heardAboutUs = `Invited by ${inviter.fullName || 'Casa Latina member'}`;
        }
      }

      // Update user document with application data
      await updateUser(applicationData);

      setLoading(false);
      navigation.navigate('PendingApproval');
    } catch (error: any) {
      setLoading(false);
      showAlert('Error', 'Failed to submit application. Please try again.', 'error');
      console.error('Error submitting application:', error);
    }
  };

  return (
    <ApplicationFormScreen
      onSubmit={handleApplicationSubmit}
      loading={loading}
    />
  );
};

const PendingApprovalScreenWrapper: React.FC<AuthNavigatorProps & {
  onAuthSuccess: () => void;
}> = ({ navigation, onAuthSuccess }) => {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      showAlert('Error', 'Failed to sign out. Please try again.', 'error');
    }
  };

  return <PendingApprovalScreen onSignOut={handleSignOut} />;
};

