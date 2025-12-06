/**
 * Profile Screen - Casa Latina Premium
 * User profile with upcoming and past events
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import { useUserEvents } from '../hooks/useUserEvents';
import { EventCard } from '../components/EventCard';
import { ProfileDetailsSection } from '../components/ProfileDetailsSection';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { ProfileScreenProps } from '../navigation/types';
import { t } from '../i18n';
import { showcaseEvents } from '../data/mockEvents';
import { uploadProfilePhoto } from '../services/storageService';
import { showAlert } from '../utils/alert';

const FEATURED_RSVPS_KEY = '@casa_latina_featured_rsvps';

const tabs = ['upcoming', 'past', 'profile'] as const;
type TabType = typeof tabs[number];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, userDoc, updateUser } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [featuredRsvps, setFeaturedRsvps] = useState<string[]>([]);
  const { upcomingEvents, pastEvents, loading } = useUserEvents();
  const styles = createStyles(theme, insets.top, insets.bottom);

  // Handle profile photo upload
  const handleImageSelected = useCallback(async (uri: string) => {
    if (!user?.uid) {
      showAlert('Error', 'You must be logged in to change your profile photo', 'error');
      return;
    }

    try {
      // Upload to Firebase Storage (and delete old photo if it exists)
      const oldPhotoUrl = userDoc?.photoUrl;
      const downloadUrl = await uploadProfilePhoto(user.uid, uri, oldPhotoUrl);

      // Update user document with new photo URL
      await updateUser({ photoUrl: downloadUrl });

      showAlert('Success', 'Profile photo updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile photo:', error);
      throw error; // Re-throw to let ProfileAvatar handle the error UI
    }
  }, [user?.uid, userDoc?.photoUrl, updateUser]);

  // Load featured RSVPs from storage
  useEffect(() => {
    const loadFeaturedRsvps = async () => {
      try {
        const stored = await AsyncStorage.getItem(FEATURED_RSVPS_KEY);
        if (stored) {
          setFeaturedRsvps(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading featured RSVPs:', error);
      }
    };
    loadFeaturedRsvps();
  }, []);

  // Get featured events user is going to
  const goingFeaturedEvents = showcaseEvents
    .filter(event => featuredRsvps.includes(event.id))
    .map(mock => ({
      id: mock.id,
      title: mock.title,
      city: mock.city,
      neighborhood: mock.neighborhood,
      category: mock.type.toUpperCase().replace(/\s+/g, '_').replace(/&/g, '_').replace(/_+/g, '_') as any,
      date: mock.date.split('·')[0]?.trim() || 'Sat, Jan 18',
      time: mock.date.split('·')[1]?.trim() || '8:00 PM',
      membersOnly: mock.isMembersOnly,
      totalSpots: mock.capacity,
      spotsRemaining: mock.remainingSpots,
      attendingCount: mock.membersCount + 1, // +1 for user
      imageUrl: mock.imageUrl,
      rsvpStatus: 'going' as const,
    }));

  // Get display events based on active tab
  const getDisplayEvents = () => {
    if (activeTab === 'upcoming') {
      // Combine Firestore events with featured events user is going to
      return [...upcomingEvents, ...goingFeaturedEvents];
    } else {
      return pastEvents;
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
          <ProfileAvatar
            imageUrl={userDoc?.photoUrl}
            name={userDoc?.fullName || 'Guest'}
            size={100}
            editable
            onImageSelected={handleImageSelected}
            theme={theme}
            enableEnlarge
          />
        </View>
        
        <Text style={styles.name}>{userDoc?.fullName || 'Guest'}</Text>
        <Text style={styles.tagline}>{userDoc?.city || 'Miami'}</Text>
        
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
