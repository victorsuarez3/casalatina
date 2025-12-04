/**
 * Events Hook
 * Fetches and manages events data
 */

import { useState, useEffect } from 'react';
import { getEventsByCity, getAllEvents } from '../services/firebase/events';
import { Event } from '../services/firebase/types';
import { getUserEventRsvp } from '../services/firebase/rsvps';
import { useAuth } from './useAuth';
import { mockEvents } from '../data/mockEvents';

// Convert mock events to Firebase Event format
const convertMockToEvent = (mock: any): Event => {
  // Parse date string like "Vie, 15 Dic · 8:00 PM"
  const dateParts = mock.date.split('·');
  const dateStr = dateParts[0]?.trim() || 'Vie, 15 Dic';
  const timeStr = dateParts[1]?.trim() || '8:00 PM';
  
  return {
    id: mock.id,
    title: mock.title,
    city: mock.city,
    neighborhood: mock.neighborhood,
    category: mock.type.toUpperCase().replace(/\s+/g, '_').replace(/&/g, '_').replace(/_+/g, '_'),
    date: dateStr, // Keep the formatted date string
    time: timeStr,
    membersOnly: mock.isMembersOnly,
    totalSpots: mock.membersCount + mock.remainingSpots,
    spotsRemaining: mock.remainingSpots,
    attendingCount: mock.membersCount,
    imageUrl: mock.imageUrl,
  };
};

export const useEventsByCity = (city: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const fetchedEvents = await getEventsByCity(city);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [city]);

  return { events, loading };
};

/**
 * Get events with RSVP status for current user
 */
export const useEventsWithRsvp = (city: string) => {
  const [events, setEvents] = useState<(Event & { rsvpStatus?: 'going' | 'waitlist' | 'went' | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEventsWithRsvp = async () => {
      setLoading(true);
      
      // For MVP Phase 1, always use mock events
      // TODO: Replace with Firebase once data is seeded
      const mockForCity = mockEvents.filter(e => e.city === city);
      const convertedEvents = mockForCity.map(convertMockToEvent);
      
      console.log('Loading events for city:', city);
      console.log('Mock events found:', mockForCity.length);
      console.log('Converted events:', convertedEvents.length);
      
      try {
        // Try to enrich with RSVP status if user is logged in
        if (user) {
          const eventsWithRsvp = await Promise.all(
            convertedEvents.map(async (event) => {
              try {
                const rsvp = await getUserEventRsvp(user.id, event.id);
                return {
                  ...event,
                  rsvpStatus: rsvp?.status || null,
                };
              } catch {
                // If RSVP fetch fails, use mock RSVP status
                const mockEvent = mockEvents.find(m => m.id === event.id);
                return {
                  ...event,
                  rsvpStatus: (mockEvent?.rsvpStatus === 'going' ? 'going' : 
                             mockEvent?.rsvpStatus === 'went' ? 'went' : 
                             mockEvent?.rsvpStatus === 'waitlist' ? 'waitlist' : null) as 'going' | 'went' | 'waitlist' | null,
                };
              }
            })
          );
          console.log('Events with RSVP:', eventsWithRsvp.length);
          setEvents(eventsWithRsvp);
        } else {
          // If no user, use mock RSVP status
          const eventsWithMockRsvp = convertedEvents.map((event) => {
            const mockEvent = mockEvents.find(m => m.id === event.id);
            return {
              ...event,
              rsvpStatus: (mockEvent?.rsvpStatus === 'going' ? 'going' : 
                         mockEvent?.rsvpStatus === 'went' ? 'went' : 
                         mockEvent?.rsvpStatus === 'waitlist' ? 'waitlist' : null) as 'going' | 'went' | 'waitlist' | null,
            };
          });
          console.log('Events without user:', eventsWithMockRsvp.length);
          setEvents(eventsWithMockRsvp);
        }
      } catch (error) {
        console.error('Error processing events:', error);
        // Fallback: just use events without RSVP enrichment
        setEvents(convertedEvents.map(event => ({ ...event, rsvpStatus: null })));
      } finally {
        setLoading(false);
      }
    };

    fetchEventsWithRsvp();
  }, [city, user]);

  return { events, loading };
};

