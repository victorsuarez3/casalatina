import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreenNative from 'expo-splash-screen';

// Keep splash screen visible until fonts are loaded
SplashScreenNative.preventAutoHideAsync();
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { ThemeProvider } from './src/hooks/useTheme';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { ApplicationStartScreen } from './src/screens/ApplicationStartScreen';
import { ApplicationReviewScreen } from './src/screens/ApplicationReviewScreen';
import { MembershipRejectedScreen } from './src/screens/MembershipRejectedScreen';
import { AlertManager } from './src/utils/alert';

function AppContent() {
  const { user, userDoc, loading } = useAuth();
  const [showSplash, setShowSplash] = React.useState(true);
  const [showAuth, setShowAuth] = React.useState(false);

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
    // Premium editorial fonts
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    // Body fonts
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
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
