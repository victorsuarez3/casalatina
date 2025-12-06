/**
 * Application Review Screen - Casa Latina Premium
 * Waiting for admin approval after application submission
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import { showAlert } from '../utils/alert';

export const ApplicationReviewScreen: React.FC = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.top, insets.bottom);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error('Error signing out:', error);
      showAlert('Error', 'Failed to sign out. Please try again.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=90',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name="hourglass-outline"
              size={64}
              color={theme.colors.primary}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Application under review</Text>

          {/* Description */}
          <Text style={styles.description}>
            Thank you for applying to Casa Latina. Your application is being reviewed by our team.
          </Text>

          <Text style={styles.description}>
            We'll notify you via email once your application has been approved. This usually takes 24-48 hours.
          </Text>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.colors.primary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              You'll receive an email notification when your membership is approved.
            </Text>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.85}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const createStyles = (theme: any, topInset: number, bottomInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundImage: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: topInset + 40,
      paddingBottom: bottomInset + 40,
      paddingHorizontal: 32,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.primary + '15',
      borderWidth: 2,
      borderColor: theme.colors.primary + '30',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl + 8,
    },
    title: {
      ...theme.typography.heroTitle,
      fontSize: 32,
      color: theme.colors.softCream,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    description: {
      ...theme.typography.body,
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.primary + '30',
      width: '100%',
    },
    infoIcon: {
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    infoText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      flex: 1,
      lineHeight: 20,
    },
    signOutButton: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginTop: theme.spacing.lg,
    },
    signOutText: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
  });

