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
import { Timestamp } from 'firebase/firestore';
import { useTheme } from '../hooks/useTheme';
import { HomeHeader } from '../components/HomeHeader';
import { RsvpFilterChips, RsvpFilter } from '../components/RsvpFilterChips';
import { EventCard } from '../components/EventCard';
import { SearchBar } from '../components/SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreenProps } from '../navigation/types';
import { useEventsWithRsvp, EventWithStatus } from '../hooks/useEvents';
import { useAuth } from '../providers/AuthProvider';
import { reserveEvent, cancelReservation, CancelReservationResult } from '../services/events';
import { showAlert } from '../utils/alert';
import { sortUpcoming, filterGoing, filterWent } from '../utils/events';
import { getEventStatus, isEventPast, isUserAttending } from '../utils/eventStatus';
import { EventDoc } from '../models/firestore';
import { t } from '../i18n';

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, userDoc } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<RsvpFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const city = userDoc?.city || 'Miami';
  
  const { events, loading } = useEventsWithRsvp(city);
  const styles = createStyles(theme, insets.bottom);

  // Filter events based on RSVP status and search
  const filteredEvents = useMemo(() => {
    // Convert EventWithStatus[] to EventDoc[] for utility functions
    const eventDocs: EventDoc[] = events.map((e) => ({
      id: e.id,
      title: e.title,
      subtitle: e.subtitle,
      image: e.image || e.coverImageUrl || '',
      date: e.date,
      location: e.location || '',
      price: e.price,
      capacity: e.capacity,
      attendees: e.attendees || [],
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      city: e.city,
      type: e.type,
      membersOnly: e.membersOnly,
    }));

    let filteredDocs: EventDoc[] = [];

    // Apply RSVP filter using utility functions
    if (selectedFilter === 'all') {
      // "All" = upcoming events only (future events)
      filteredDocs = sortUpcoming(eventDocs);
    } else if (selectedFilter === 'going') {
      // "Going" = user attending upcoming events
      filteredDocs = filterGoing(eventDocs, user?.uid || null);
    } else if (selectedFilter === 'went') {
      // "Went" = user attended past events
      filteredDocs = filterWent(eventDocs, user?.uid || null);
    } else {
      filteredDocs = eventDocs;
    }

    // Convert back to EventWithStatus[] and enrich with status
    let filtered: EventWithStatus[] = filteredDocs.map((eventDoc) => {
      // Find original event to preserve eventStatus and rsvpStatus
      const originalEvent = events.find((e) => e.id === eventDoc.id);
      if (originalEvent) {
        return originalEvent;
      }

      // If not found, compute status
      const eventStatus = getEventStatus(eventDoc, user?.uid || null);
      const isPast = isEventPast(eventDoc);
      const isAttending = isUserAttending(eventDoc, user?.uid || null);
      const rsvpStatus: 'going' | 'went' | null = isAttending 
        ? (isPast ? 'went' : 'going')
        : null;

      return {
        ...eventDoc,
        eventStatus,
        rsvpStatus,
      };
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          (event.location && event.location.toLowerCase().includes(query)) ||
          (event.city && event.city.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [events, selectedFilter, searchQuery, user?.uid]);

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const handleRsvpPress = async (event: EventWithStatus) => {
    if (!user) {
      showAlert('Sign In Required', 'Please sign in to reserve a spot', 'info');
      return;
    }

    try {
      if (event.eventStatus === 'attending') {
        // Cancel reservation
        const result = await cancelReservation(event.id, user.uid);
        if (result === 'canceled') {
          // Event will update via real-time listener
          showAlert('Reservation Canceled', 'Your reservation has been canceled', 'success');
        } else if (result === 'not_attending') {
          showAlert('Not Attending', 'You are not registered for this event', 'info');
        } else {
          showAlert('Error', 'Failed to cancel reservation. Please try again.', 'error');
        }
      } else if (event.eventStatus === 'full') {
        showAlert('Event Full', 'This event is at capacity', 'info');
      } else {
        // Reserve spot with retry mechanism
        const result = await reserveEvent(event.id, user.uid);
        if (result === 'reserved') {
          // Event will update via real-time listener
          showAlert('Reservation Confirmed', 'You have successfully reserved a spot', 'success');
        } else if (result === 'already_reserved') {
          showAlert('Already Reserved', 'You already have a reservation for this event', 'info');
        } else if (result === 'full') {
          showAlert('Event Full', 'This event is now at capacity', 'info');
        } else {
          showAlert('Error', 'Failed to reserve spot. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      showAlert('Error', 'An unexpected error occurred. Please try again.', 'error');
    }
  };

  const renderEventCard = ({ item }: { item: EventWithStatus }) => {
    // Format date and time from Firestore Timestamp
    const eventDate = item.date instanceof Timestamp 
      ? item.date.toDate() 
      : new Date(item.date);
    const formattedDate = eventDate.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
    const formattedTime = eventDate.toLocaleTimeString('es-ES', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });

    const attendeesCount = item.attendees?.length || 0;
    const spotsRemaining = Math.max(0, item.capacity - attendeesCount);

    // Convert EventDoc to EventCard props format
    const eventCardProps = {
      id: item.id,
      title: item.title,
      city: item.city || 'Miami',
      neighborhood: item.location || '',
      date: formattedDate,
      time: formattedTime,
      category: item.type || 'EVENT',
      membersOnly: item.membersOnly || false,
      totalSpots: item.capacity,
      spotsRemaining,
      attendingCount: attendeesCount,
      rsvpStatus: item.rsvpStatus === 'going' ? 'going' as const : 
                  item.rsvpStatus === 'went' ? 'went' as const : 
                  null,
      imageUrl: item.image || item.coverImageUrl || '',
    };

    return (
      <EventCard
        {...eventCardProps}
        onPress={() => handleEventPress(item.id)}
        onRsvpPress={() => handleRsvpPress(item)}
      />
    );
  };

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
              userName={userDoc?.fullName || 'Guest'}
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
