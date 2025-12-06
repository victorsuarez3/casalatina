/**
 * Splash Screen - Casa Latina Premium
 * Elegant entry point with premium branding
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SplashScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.top);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://plus.unsplash.com/premium_photo-1725889036084-b7874a628773?q=80&w=1040&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Cinematic gradient overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.logo}>Casa Latina</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Your Exclusive Latin Social Club</Text>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const createStyles = (theme: any, topInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    logo: {
      ...theme.typography.heroTitle,
      fontSize: 48,
      color: theme.colors.softCream,
      letterSpacing: -1,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    divider: {
      width: 80,
      height: 1,
      backgroundColor: theme.colors.primary + '60',
      marginBottom: theme.spacing.lg,
    },
    tagline: {
      ...theme.typography.bodyMedium,
      fontSize: 16,
      color: theme.colors.textSecondary,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      textAlign: 'center',
    },
  });



