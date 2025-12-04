/**
 * Profile Screen - Casa Latina Premium
 * User profile with upcoming and past events
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useUserEvents } from '../hooks/useUserEvents';
import { EventCard } from '../components/EventCard';
import { ProfileDetailsSection } from '../components/ProfileDetailsSection';
import { ProfileScreenProps } from '../navigation/types';
import { t } from '../i18n';
import { mockEvents } from '../data/mockEvents';

const tabs = ['upcoming', 'past', 'profile'] as const;
type TabType = typeof tabs[number];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const { upcomingEvents, pastEvents, loading } = useUserEvents();
  const styles = createStyles(theme, insets.top, insets.bottom);

  // Fallback to mock events if no user events found
  const getDisplayEvents = () => {
    if (activeTab === 'upcoming') {
      if (upcomingEvents.length > 0) {
        return upcomingEvents;
      }
      // Fallback: show mock events with 'going' status
      return mockEvents
        .filter(e => e.rsvpStatus === 'going')
        .map(mock => ({
          id: mock.id,
          title: mock.title,
          city: mock.city,
          neighborhood: mock.neighborhood,
          category: mock.type.toUpperCase().replace(/\s+/g, '_').replace(/&/g, '_').replace(/_+/g, '_') as any,
          date: mock.date.split('·')[0]?.trim() || 'Vie, 15 Dic',
          time: mock.date.split('·')[1]?.trim() || '8:00 PM',
          membersOnly: mock.isMembersOnly,
          totalSpots: mock.membersCount + mock.remainingSpots,
          spotsRemaining: mock.remainingSpots,
          attendingCount: mock.membersCount,
          imageUrl: mock.imageUrl,
          rsvpStatus: 'going' as const,
        }));
    } else {
      if (pastEvents.length > 0) {
        return pastEvents;
      }
      // Fallback: show mock events with 'went' status
      return mockEvents
        .filter(e => e.rsvpStatus === 'went')
        .map(mock => ({
          id: mock.id,
          title: mock.title,
          city: mock.city,
          neighborhood: mock.neighborhood,
          category: mock.type.toUpperCase().replace(/\s+/g, '_').replace(/&/g, '_').replace(/_+/g, '_') as any,
          date: mock.date.split('·')[0]?.trim() || 'Vie, 15 Dic',
          time: mock.date.split('·')[1]?.trim() || '8:00 PM',
          membersOnly: mock.isMembersOnly,
          totalSpots: mock.membersCount + mock.remainingSpots,
          spotsRemaining: mock.remainingSpots,
          attendingCount: mock.membersCount,
          imageUrl: mock.imageUrl,
          rsvpStatus: 'went' as const,
        }));
    }
  };

  const displayEvents = getDisplayEvents();
  const hasEvents = displayEvents.length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.name}>{user?.name || 'Guest'}</Text>
        <Text style={styles.tagline}>{user?.city || 'Miami'}</Text>
        
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === 'upcoming' 
                ? t('profile_upcoming') 
                : tab === 'past' 
                ? t('profile_past')
                : 'Profile'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content based on active tab */}
      {activeTab === 'profile' ? (
        <ProfileDetailsSection />
      ) : loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : hasEvents ? (
        <View style={styles.eventsContainer}>
          {displayEvents.map((event) => (
            <EventCard
              key={event.id}
              {...event}
              rsvpStatus={activeTab === 'upcoming' ? 'going' : 'went'}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="calendar-outline"
            size={48}
            color={theme.colors.textTertiary}
          />
          <Text style={styles.emptyText}>{t('profile_no_events')}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const createStyles = (theme: any, topInset: number, bottomInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: bottomInset + 100,
    },
    header: {
      paddingTop: topInset + theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      alignItems: 'center',
      position: 'relative',
    },
    avatarContainer: {
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 84,
      height: 84,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.softCream + '15',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1, // Thin 1px gold ring
      borderColor: theme.colors.warmGold, // #CBB890
    },
    avatarText: {
      ...theme.typography.heroTitle,
      color: theme.colors.softCream,
      fontSize: 38,
    },
    name: {
      ...theme.typography.sectionTitle,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs + 2,
    },
    tagline: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },
    settingsButton: {
      position: 'absolute',
      top: topInset + theme.spacing.lg,
      right: theme.spacing.md,
      padding: theme.spacing.sm,
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg + 4, // More spacing
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      paddingVertical: theme.spacing.md + 2,
      paddingHorizontal: theme.spacing.lg + 4,
      borderBottomWidth: 1, // Thin underline
      borderBottomColor: 'transparent',
      marginBottom: -1,
    },
    tabActive: {
      borderBottomColor: theme.colors.warmGold, // Gold underline animation
      borderBottomWidth: 1,
    },
    tabText: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
    },
    tabTextActive: {
      ...theme.typography.label,
      color: theme.colors.softCream,
      fontWeight: '500', // Not heavy
    },
    eventsContainer: {
      paddingHorizontal: 0,
    },
    emptyContainer: {
      paddingVertical: theme.spacing.xxxl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textTertiary,
      marginTop: theme.spacing.md,
    },
  });
