/**
 * Admin Events Screen
 * List all events with Edit/Delete buttons
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AdminGuard } from '../../components/AdminGuard';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { getAllEventsAdmin, deleteEvent } from '../../services/admin';
import { EventDoc } from '../../models/firestore';
import { Timestamp } from 'firebase/firestore';
import { showAlert } from '../../utils/alert';

export const AdminEventsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const styles = createStyles(theme);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const fetchedEvents = await getAllEventsAdmin();
    setEvents(fetchedEvents);
    setLoading(false);
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      showAlert('Success', 'Event deleted successfully', 'success');
      loadEvents();
    } catch (error) {
      showAlert('Error', 'Failed to delete event', 'error');
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderEvent = ({ item }: { item: EventDoc }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
        <Text style={styles.eventCapacity}>
          {item.attendees?.length || 0} / {item.capacity} attendees
        </Text>
      </View>
      <View style={styles.eventActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            (navigation as any).navigate('AdminEventEdit', { eventId: item.id });
          }}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <AdminGuard>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Events</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              (navigation as any).navigate('AdminEventCreate');
            }}
          >
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No events found</Text>
              </View>
            }
          />
        )}
      </View>
    </AdminGuard>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      ...theme.typography.sectionTitle,
      color: theme.colors.text,
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    createButtonText: {
      ...theme.typography.label,
      color: theme.colors.pureBlack,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventCard: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    eventInfo: {
      flex: 1,
    },
    eventTitle: {
      ...theme.typography.subsectionTitle,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    eventDate: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs / 2,
    },
    eventLocation: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs / 2,
    },
    eventCapacity: {
      ...theme.typography.caption,
      color: theme.colors.textTertiary,
    },
    eventActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    editButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    editButtonText: {
      ...theme.typography.labelSmall,
      color: theme.colors.pureBlack,
    },
    deleteButton: {
      backgroundColor: theme.colors.errorRed || '#CC5C6C',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    deleteButtonText: {
      ...theme.typography.labelSmall,
      color: '#FFFFFF',
    },
    emptyContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
  });

