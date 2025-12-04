/**
 * Home Header Component - Ultra-Premium Casa Latina
 * Editorial-grade header with luxury typography and spacing
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../i18n';

interface HomeHeaderProps {
  userName?: string;
  city?: string;
  onNotificationPress?: () => void;
  onCityPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = 'Victor',
  city = 'Miami',
  onNotificationPress,
  onCityPress,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.top);

  return (
    <View style={styles.container}>
      {/* Top Label - Premium spacing */}
      <Text style={styles.topLabel}>
        {t('home_location_label', { city: city.toUpperCase() })}
      </Text>

      {/* Main Header Row - Editorial spacing */}
      <View style={styles.headerRow}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            {t('home_greeting', { name: userName })}
          </Text>
          <Text style={styles.subtitle}>{t('home_subtitle')}</Text>
        </View>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Member Badge - Premium */}
      <View style={styles.badgeContainer}>
        <View style={styles.memberBadge}>
          <Text style={styles.memberBadgeText}>{t('member_founder')}</Text>
        </View>
      </View>

      {/* City Pill - Refined */}
      <TouchableOpacity
        style={styles.cityPill}
        onPress={onCityPress}
        activeOpacity={0.7}
      >
        <Ionicons name="location" size={13} color={theme.colors.primary} />
        <Text style={styles.cityPillText}>{city}</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any, topInset: number) => StyleSheet.create({
  container: {
    paddingTop: topInset + theme.spacing.lg, // More breathing room
    paddingBottom: theme.spacing.lg, // Increased
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  topLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md, // More space
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg, // Increased spacing
  },
  greetingContainer: {
    flex: 1,
    marginRight: theme.spacing.lg,
  },
  greeting: {
    ...theme.typography.heroTitle,
    color: theme.colors.text,
    fontSize: 36,
    marginBottom: theme.spacing.xs + 4, // More space
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs + 2,
  },
  notificationButton: {
    padding: theme.spacing.xs + 2,
    marginTop: theme.spacing.xs,
  },
  badgeContainer: {
    marginBottom: theme.spacing.md + 4, // More space
  },
  memberBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '15', // More subtle
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    paddingHorizontal: theme.spacing.md + 4,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borderRadius.round,
  },
  memberBadgeText: {
    ...theme.typography.labelSmall,
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md + 4,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.borderRadius.round,
    gap: theme.spacing.xs + 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cityPillText: {
    ...theme.typography.label,
    color: theme.colors.text,
    fontSize: 13,
  },
});
