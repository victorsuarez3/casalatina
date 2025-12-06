/**
 * Admin Event Edit Screen
 * Form to edit an existing event
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { AdminGuard } from '../../components/AdminGuard';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getEventById, updateEvent, deleteEvent, UpdateEventData } from '../../services/admin';
import { EventDoc } from '../../models/firestore';
import { Timestamp } from 'firebase/firestore';
import { showAlert } from '../../utils/alert';
import DateTimePicker from '@react-native-community/datetimepicker';

export const AdminEventEditScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params as { eventId: string };
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [formData, setFormData] = useState<UpdateEventData>({});
  const styles = createStyles(theme);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    setLoading(true);
    const fetchedEvent = await getEventById(eventId);
    if (fetchedEvent) {
      setEvent(fetchedEvent);
      const eventDate = fetchedEvent.date instanceof Timestamp
        ? fetchedEvent.date.toDate()
        : new Date(fetchedEvent.date);
      
      setFormData({
        title: fetchedEvent.title,
        subtitle: fetchedEvent.subtitle,
        image: fetchedEvent.image || fetchedEvent.coverImageUrl || '',
        date: eventDate,
        location: fetchedEvent.location || fetchedEvent.locationName || '',
        price: fetchedEvent.price,
        capacity: fetchedEvent.capacity,
        city: fetchedEvent.city,
        type: fetchedEvent.type,
        membersOnly: fetchedEvent.membersOnly,
        description: fetchedEvent.description,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.location || !formData.capacity) {
      showAlert('Error', 'Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      await updateEvent(eventId, formData);
      showAlert('Success', 'Event updated successfully', 'success');
      navigation.goBack();
    } catch (error) {
      showAlert('Error', 'Failed to update event', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(eventId);
      showAlert('Success', 'Event deleted successfully', 'success');
      navigation.goBack();
    } catch (error) {
      showAlert('Error', 'Failed to delete event', 'error');
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </AdminGuard>
    );
  }

  if (!event) {
    return (
      <AdminGuard>
        <View style={styles.container}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Edit Event</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Subtitle</Text>
          <TextInput
            style={styles.input}
            value={formData.subtitle}
            onChangeText={(text) => setFormData({ ...formData, subtitle: text })}
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Image URL *</Text>
          <TextInput
            style={styles.input}
            value={formData.image}
            onChangeText={(text) => setFormData({ ...formData, image: text })}
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date & Time *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formData.date instanceof Date
                ? formData.date.toLocaleString()
                : formData.date
                ? (formData.date instanceof Timestamp
                    ? formData.date.toDate().toLocaleString()
                    : new Date(formData.date).toLocaleString())
                : 'Select date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={
                formData.date instanceof Date
                  ? formData.date
                  : formData.date instanceof Timestamp
                  ? formData.date.toDate()
                  : formData.date
                  ? new Date(formData.date)
                  : new Date()
              }
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData({ ...formData, date: selectedDate });
                }
              }}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Type</Text>
          <TextInput
            style={styles.input}
            value={formData.type}
            onChangeText={(text) => setFormData({ ...formData, type: text })}
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={formData.price?.toString() || ''}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                price: text ? parseFloat(text) : undefined,
              })
            }
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Capacity *</Text>
          <TextInput
            style={styles.input}
            value={formData.capacity?.toString() || ''}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                capacity: parseInt(text) || 0,
              })
            }
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={theme.colors.pureBlack} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AdminGuard>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    title: {
      ...theme.typography.sectionTitle,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
    },
    formGroup: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      color: theme.colors.text,
      ...theme.typography.body,
    },
    dateText: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    saveButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      ...theme.typography.label,
      color: theme.colors.pureBlack,
      textAlign: 'center',
      fontWeight: '600',
    },
    deleteButton: {
      flex: 1,
      backgroundColor: theme.colors.errorRed || '#CC5C6C',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    deleteButtonText: {
      ...theme.typography.label,
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: '600',
    },
    errorText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
  });

