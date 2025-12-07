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
      {/* CASA LATINA - Premium typography */}
      <Text style={styles.brandLabel}>
        {t('home_location_label')}
      </Text>

      {/* Good evening, {firstName} - Primary hero heading */}
      <Text style={styles.primaryGreeting}>
        {t('home_greeting', { name: userName })}
      </Text>

      {/* Home of Latin Culture & Creators - Subheadline */}
      <Text style={styles.cultureSubtitle}>
        {t('home_subtitle')}
      </Text>

      {/* City Pill - Location selector */}
      <TouchableOpacity
        style={styles.cityPill}
        onPress={onCityPress}
        activeOpacity={0.7}
      >
        <Ionicons name="location" size={13} color={theme.colors.primary} />
        <Text style={styles.cityPillText}>{city}</Text>
      </TouchableOpacity>

      {/* Founding member badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.memberBadge}>
          <Text style={styles.memberBadgeText}>{t('member_founder')}</Text>
        </View>
      </View>
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
  // CASA LATINA - Premium typography with small caps effect
  brandLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.5, // Premium letter spacing
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
    opacity: 0.85, // Slightly reduced opacity for luxury feel
  },
  // Primary hero heading - "Good evening, Victor"
  primaryGreeting: {
    ...theme.typography.heroTitle,
    color: '#FFFFFF',
    fontSize: 40,
    lineHeight: 48, // Increased line-height for elegance
    letterSpacing: -0.5,
    marginBottom: 14, // 12-16px spacing to subheadline
  },
  // "Home of Latin Culture & Creators" - New subheadline
  cultureSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
    marginBottom: 18, // 16-20px spacing to city selector
    opacity: 0.85, // Slightly reduced opacity for luxury feel
  },
  // City selector pill
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
    marginBottom: 12, // 12px spacing to badge
  },
  cityPillText: {
    ...theme.typography.label,
    color: theme.colors.text,
    fontSize: 13,
  },
  // Founding member badge
  badgeContainer: {
    alignItems: 'flex-start',
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
  // Legacy styles (keeping for compatibility)
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...theme.typography.heroTitle,
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: theme.spacing.xs + 4,
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
});
