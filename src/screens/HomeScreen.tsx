/**
 * Home Screen - Casa Latina Premium MVP
 * Premium events feed with Firebase integration and Featured Experiences
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { reserveEvent, cancelReservation } from '../services/events';
import { showAlert } from '../utils/alert';
import { sortUpcoming, filterGoing, filterWent } from '../utils/events';
import { getEventStatus, isEventPast, isUserAttending } from '../utils/eventStatus';
import { EventDoc } from '../models/firestore';
import { showcaseEvents, EventData } from '../data/mockEvents';
import { t } from '../i18n';

const FEATURED_RSVPS_KEY = '@casa_latina_featured_rsvps';

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, userDoc } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<RsvpFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRsvps, setFeaturedRsvps] = useState<string[]>([]);
  const city = userDoc?.city || 'Miami';

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

  // Save featured RSVP
  const saveFeaturedRsvp = async (eventId: string) => {
    try {
      const newRsvps = [...featuredRsvps, eventId];
      setFeaturedRsvps(newRsvps);
      await AsyncStorage.setItem(FEATURED_RSVPS_KEY, JSON.stringify(newRsvps));
    } catch (error) {
      console.error('Error saving featured RSVP:', error);
    }
  };

  // Remove featured RSVP
  const removeFeaturedRsvp = async (eventId: string) => {
    try {
      const newRsvps = featuredRsvps.filter(id => id !== eventId);
      setFeaturedRsvps(newRsvps);
      await AsyncStorage.setItem(FEATURED_RSVPS_KEY, JSON.stringify(newRsvps));
    } catch (error) {
      console.error('Error removing featured RSVP:', error);
    }
  };
  
  const { events, loading } = useEventsWithRsvp(city);
  const styles = createStyles(theme, insets.bottom);

  // Filter real events based on RSVP status and search
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

  // Filter showcase events based on search and RSVP filter
  const filteredShowcaseEvents = useMemo(() => {
    let filtered = showcaseEvents;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.neighborhood.toLowerCase().includes(query) ||
          event.city.toLowerCase().includes(query) ||
          (event.venueName && event.venueName.toLowerCase().includes(query))
      );
    }
    
    // Apply RSVP filter for "going"
    if (selectedFilter === 'going') {
      filtered = filtered.filter(event => featuredRsvps.includes(event.id));
    }
    
    return filtered;
  }, [searchQuery, selectedFilter, featuredRsvps]);
  
  // Get featured events that user is going to (for "Going" tab)
  const goingFeaturedEvents = useMemo(() => {
    return showcaseEvents.filter(event => featuredRsvps.includes(event.id));
  }, [featuredRsvps]);

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const handleRsvpPress = async (event: EventWithStatus | EventData) => {
    if (!user) {
      showAlert('Sign In Required', 'Please sign in to reserve a spot', 'info');
      return;
    }

    // For featured events, toggle local RSVP state
    if ('isShowcase' in event && event.isShowcase) {
      const isCurrentlyGoing = featuredRsvps.includes(event.id);
      if (isCurrentlyGoing) {
        await removeFeaturedRsvp(event.id);
        showAlert('Reservation Canceled', 'Your reservation has been canceled', 'success');
      } else {
        await saveFeaturedRsvp(event.id);
        showAlert('Reservation Confirmed', 'You have successfully reserved a spot for this experience.', 'success');
      }
      return;
    }

    const eventWithStatus = event as EventWithStatus;

    try {
      if (eventWithStatus.eventStatus === 'attending') {
        // Cancel reservation
        const result = await cancelReservation(eventWithStatus.id, user.uid);
        if (result === 'canceled') {
          showAlert('Reservation Canceled', 'Your reservation has been canceled', 'success');
        } else if (result === 'not_attending') {
          showAlert('Not Attending', 'You are not registered for this event', 'info');
        } else {
          showAlert('Error', 'Failed to cancel reservation. Please try again.', 'error');
        }
      } else if (eventWithStatus.eventStatus === 'full') {
        showAlert('Event Full', 'This event is at capacity', 'info');
      } else {
        // Reserve spot
        const result = await reserveEvent(eventWithStatus.id, user.uid);
        if (result === 'reserved') {
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
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });

    const attendeesCount = item.attendees?.length || 0;
    const spotsRemaining = Math.max(0, item.capacity - attendeesCount);

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

  const renderShowcaseEventCard = ({ item }: { item: EventData }) => {
    // Check if user has RSVP'd to this featured event
    const isGoing = featuredRsvps.includes(item.id);
    
    return (
      <EventCard
        id={item.id}
        title={item.title}
        city={item.city}
        neighborhood={item.neighborhood}
        date={item.date.split(' · ')[0]}
        time={item.date.split(' · ')[1]}
        category={item.type}
        membersOnly={item.isMembersOnly}
        totalSpots={item.capacity}
        spotsRemaining={item.remainingSpots}
        attendingCount={item.membersCount + (isGoing ? 1 : 0)}
        rsvpStatus={isGoing ? 'going' : null}
        imageUrl={item.imageUrl}
        isShowcase={true}
        vibe={item.vibe}
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

  const renderEmptyRealEvents = () => (
    <View style={styles.emptyRealEvents}>
      <Text style={styles.emptyText}>
        {loading ? 'Loading events...' : 'No upcoming events in your area'}
      </Text>
      <Text style={styles.emptySubtext}>
        Browse our featured experiences below
      </Text>
    </View>
  );

  // Show all events in a single list with sections
  const hasRealEvents = filteredEvents.length > 0;
  const hasShowcaseEvents = filteredShowcaseEvents.length > 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={[]} // We'll use ListHeaderComponent for all content
        renderItem={() => null}
        keyExtractor={() => 'header'}
        ListHeaderComponent={
          <>
            <HomeHeader
              userName={userDoc?.fullName?.split(' ')[0] || 'Guest'}
              city={city}
              onNotificationPress={() => {}}
              onCityPress={() => {}}
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

            {/* Real Events Section */}
            {selectedFilter !== 'went' && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    {t('section_upcoming_events', { city })}
                  </Text>
                </View>

                {hasRealEvents ? (
                  filteredEvents.map((event) => (
                    <View key={event.id}>
                      {renderEventCard({ item: event })}
                    </View>
                  ))
                ) : (
                  renderEmptyRealEvents()
                )}
              </>
            )}

            {/* Featured Experiences Section - Show on 'all' filter */}
            {selectedFilter === 'all' && hasShowcaseEvents && (
              <>
                <View style={styles.showcaseSectionHeader}>
                  <Text style={styles.showcaseSectionTitle}>
                    Featured Experiences
                  </Text>
                  <Text style={styles.showcaseSectionSubtitle}>
                    Curated members-only events in Miami
                  </Text>
                </View>

                {filteredShowcaseEvents.map((event) => (
                  <View key={event.id}>
                    {renderShowcaseEventCard({ item: event })}
                  </View>
                ))}
              </>
            )}

            {/* Featured events user is going to - Show on 'going' filter */}
            {selectedFilter === 'going' && goingFeaturedEvents.length > 0 && (
              <>
                {goingFeaturedEvents.map((event) => (
                  <View key={event.id}>
                    {renderShowcaseEventCard({ item: event })}
                  </View>
                ))}
              </>
            )}
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
      marginTop: theme.spacing.md, // Closer to filters, less top spacing
      marginBottom: theme.spacing.lg + 4, // Increased spacing between header and card
    },
    sectionTitle: {
      ...theme.typography.sectionTitle,
      color: theme.colors.text,
    },
    showcaseSectionHeader: {
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.xxxl,
      marginBottom: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    showcaseSectionTitle: {
      ...theme.typography.sectionTitle,
      color: theme.colors.softCream,
      fontSize: 20,
    },
    showcaseSectionSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
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
    emptyRealEvents: {
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    emptySubtext: {
      ...theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
  });
