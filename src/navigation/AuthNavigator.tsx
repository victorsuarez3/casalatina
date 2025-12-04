/**
 * Auth Navigator - Casa Latina Premium
 * Handles authentication flow routing
 */

import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/Auth/SplashScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';
import { ApplicationFormScreen, ApplicationFormData } from '../screens/Auth/ApplicationFormScreen';
import { PendingApprovalScreen } from '../screens/Auth/PendingApprovalScreen';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ApplicationForm: undefined;
  PendingApproval: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

type AuthNavigatorProps = NativeStackScreenProps<AuthStackParamList>;

interface AuthNavigatorContainerProps {
  onAuthSuccess: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorContainerProps> = ({ onAuthSuccess }) => {
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
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Login attempt:', { email, password });
    setLoading(false);
    // For now, just navigate to main app
    onAuthSuccess();
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
}> = ({ navigation, setLoading, loading }) => {
  const handleRegister = async (email: string, password: string, name: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Register attempt:', { email, password, name });
    setLoading(false);
    navigation.navigate('ApplicationForm');
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
}> = ({ navigation, setLoading, loading }) => {
  const handleApplicationSubmit = async (formData: ApplicationFormData) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Application submitted:', formData);
    setLoading(false);
    navigation.navigate('PendingApproval');
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
  const handleSignOut = async () => {
    console.log('Sign out');
    navigation.navigate('Login');
  };

  return <PendingApprovalScreen onSignOut={handleSignOut} />;
};

