import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import * as SplashScreenNative from 'expo-splash-screen';

// Keep splash screen visible until fonts are loaded
SplashScreenNative.preventAutoHideAsync();

import { ThemeProvider } from './src/hooks/useTheme';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { ApplicationStartScreen } from './src/screens/ApplicationStartScreen';
import { ApplicationReviewScreen } from './src/screens/ApplicationReviewScreen';
import { MembershipRejectedScreen } from './src/screens/MembershipRejectedScreen';
import { InviteLandingScreen } from './src/screens/InviteLandingScreen';
import { AlertManager } from './src/utils/alert';

function AppContent() {
  const { user, userDoc, loading } = useAuth();
  const [showSplash, setShowSplash] = React.useState(true);
  const [showAuth, setShowAuth] = React.useState(false);
  const [inviteUrl, setInviteUrl] = React.useState<string | null>(null);

  // Configure basic URL handling for invitations
  React.useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      if (url && url.includes('/invite/')) {
        setInviteUrl(url);
      }
    };

    // Check for initial URL when app is opened
    Linking.getInitialURL().then((url) => {
      if (url && url.includes('/invite/')) {
        setInviteUrl(url);
      }
    }).catch((err) => {
      console.log('Error getting initial URL:', err);
    });

    // Listen for incoming links when app is already open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Show splash screen while loading or during initial animation
  if (showSplash || loading) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
        showContinueButton={!loading && !user}
        onContinue={() => {
          setShowSplash(false);
          setShowAuth(true);
        }}
      />
    );
  }

  // Unauthenticated: show auth navigator (login/signup)
  if (!user || showAuth) {
    return (
      <AuthNavigator
        onAuthSuccess={() => {
          setShowAuth(false);
          // After successful auth, App.tsx will re-render and route based on membershipStatus
        }}
        onRegisterSuccess={() => {
          setShowAuth(false);
          // After registration, user will be authenticated and App.tsx will route to ApplicationStartScreen
        }}
      />
    );
  }

  // Authenticated but no userDoc yet (shouldn't happen, but handle gracefully)
  if (!userDoc) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D5C4A1" />
      </View>
    );
  }

  // Handle invite URLs - show invite landing screen
  if (inviteUrl) {
    return <InviteLandingScreen inviteUrl={inviteUrl} onClose={() => setInviteUrl(null)} />;
  }

  // Route based on membership status
  switch (userDoc.membershipStatus) {
    case 'not_applied':
      return <ApplicationStartScreen />;

    case 'pending':
      return <ApplicationReviewScreen />;

    case 'approved':
      return <AppNavigator />;

    case 'rejected':
      return <MembershipRejectedScreen />;

    default:
      return <AppNavigator />;
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    // Premium editorial fonts - loaded from local assets
    CormorantGaramond_300Light: require('./assets/fonts/CormorantGaramond_300Light.ttf'),
    CormorantGaramond_400Regular: require('./assets/fonts/CormorantGaramond_400Regular.ttf'),
    CormorantGaramond_600SemiBold: require('./assets/fonts/CormorantGaramond_600SemiBold.ttf'),
    CormorantGaramond_700Bold: require('./assets/fonts/CormorantGaramond_700Bold.ttf'),
    // Body fonts - loaded from local assets
    Inter_300Light: require('./assets/fonts/Inter_300Light.ttf'),
    Inter_400Regular: require('./assets/fonts/Inter_400Regular.ttf'),
    Inter_500Medium: require('./assets/fonts/Inter_500Medium.ttf'),
    Inter_600SemiBold: require('./assets/fonts/Inter_600SemiBold.ttf'),
    Inter_700Bold: require('./assets/fonts/Inter_700Bold.ttf'),
  });

  // Hide native splash once fonts are loaded
  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreenNative.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NavigationContainer>
              <AppContent />
              <StatusBar style="light" />
            </NavigationContainer>
            <AlertManager />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
