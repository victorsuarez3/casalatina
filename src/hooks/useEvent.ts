/**
 * useEvent Hook
 * Real-time subscription to a single event with local caching
 */

import { useState, useEffect, useRef } from 'react';
import { subscribeToEvent } from '../services/events';
import { EventDoc } from '../models/firestore';
import { getEventStatus, isUserAttending } from '../utils/eventStatus';
import { useAuth } from '../providers/AuthProvider';

export interface UseEventReturn {
  event: EventDoc | null;
  attendees: string[];
  capacityLeft: number;
  isAttending: boolean;
  status: 'attending' | 'full' | 'available';
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to subscribe to a single event in real-time
 * Includes local caching for instant display
 */
export const useEvent = (eventId: string | null): UseEventReturn => {
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Local cache ref for instant display
  const cacheRef = useRef<EventDoc | null>(null);

  useEffect(() => {
    if (!eventId) {
      setEvent(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToEvent(
      eventId,
      (firestoreEvent) => {
        if (firestoreEvent) {
          // Update cache
          cacheRef.current = firestoreEvent;
          setEvent(firestoreEvent);
        } else {
          setEvent(null);
        }
        setLoading(false);
      }
    );

    // If we have cached data, show it immediately
    if (cacheRef.current && cacheRef.current.id === eventId) {
      setEvent(cacheRef.current);
      setLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, [eventId]);

  // Compute derived values
  const attendees = event?.attendees || [];
  const capacity = event?.capacity || 0;
  const capacityLeft = Math.max(0, capacity - attendees.length);
  const isAttending = user && event ? isUserAttending(event, user.uid) : false;
  const status = event ? getEventStatus(event, user?.uid || null) : 'available';

  return {
    event,
    attendees,
    capacityLeft,
    isAttending,
    status,
    loading,
    error,
  };
};

