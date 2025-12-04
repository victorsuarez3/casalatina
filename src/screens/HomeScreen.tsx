/**
 * Home Screen - Casa Latina Premium MVP
 * Premium events feed with Firebase integration
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { HomeHeader } from '../components/HomeHeader';
import { RsvpFilterChips, RsvpFilter } from '../components/RsvpFilterChips';
import { EventCard } from '../components/EventCard';
import { SearchBar } from '../components/SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreenProps } from '../navigation/types';
import { useEventsWithRsvp } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import { createOrUpdateRsvp } from '../services/firebase/rsvps';
import { t } from '../i18n';
import { Event } from '../services/firebase/types';

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<RsvpFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const city = user?.city || 'Miami';
  
  const { events, loading } = useEventsWithRsvp(city);
  const styles = createStyles(theme, insets.bottom);

  // Filter events based on RSVP status and search
  const filteredEvents = useMemo(() => {
    console.log('HomeScreen - Total events:', events.length);
    console.log('HomeScreen - Selected filter:', selectedFilter);
    console.log('HomeScreen - Search query:', searchQuery);
    
    let filtered = events;

    // Apply RSVP filter
    if (selectedFilter === 'going') {
      filtered = filtered.filter((event) => event.rsvpStatus === 'going');
    } else if (selectedFilter === 'went') {
      filtered = filtered.filter((event) => event.rsvpStatus === 'went');
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.neighborhood.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query)
      );
    }

    console.log('HomeScreen - Filtered events:', filtered.length);
    return filtered;
  }, [events, selectedFilter, searchQuery]);

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const handleRsvpPress = async (event: Event & { rsvpStatus?: 'going' | 'waitlist' | 'went' | null }) => {
    if (!user) {
      // TODO: Show login prompt
      return;
    }

    try {
      // Toggle RSVP: if going, remove; if not, set to going
      const newStatus = event.rsvpStatus === 'going' ? null : 'going';
      if (newStatus) {
        await createOrUpdateRsvp(user.id, event.id, newStatus);
      }
      // TODO: Handle removal of RSVP
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  const renderEventCard = ({ item }: { item: Event & { rsvpStatus?: 'going' | 'waitlist' | 'went' | null } }) => (
    <EventCard
      {...item}
      onPress={() => handleEventPress(item.id)}
      onRsvpPress={() => handleRsvpPress(item)}
    />
  );

  const renderListFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {t('footer_message')}
      </Text>
    </View>
  );

  const renderListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? 'Loading events...' : 'No events found'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderListEmpty}
        ListHeaderComponent={
          <>
            <HomeHeader
              userName={user?.name || 'Guest'}
              city={city}
              onNotificationPress={() => console.log('Notifications pressed')}
              onCityPress={() => console.log('City pressed')}
            />

            <SearchBar
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <RsvpFilterChips
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t('section_upcoming_events', { city })}
              </Text>
            </View>
          </>
        }
        ListFooterComponent={renderListFooter}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const createStyles = (theme: any, bottomInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: bottomInset + 100,
    },
    sectionHeader: {
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.section, // Premium section spacing
      marginBottom: theme.spacing.titleMargin, // Editorial spacing
    },
    sectionTitle: {
      ...theme.typography.sectionTitle,
      color: theme.colors.text,
    },
    footer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xl,
      alignItems: 'center',
    },
    footerText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    emptyContainer: {
      paddingVertical: theme.spacing.xxxl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });
