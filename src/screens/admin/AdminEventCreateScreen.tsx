/**
 * Admin Event Create Screen
 * Form to create a new event
 */

import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { createEvent, CreateEventData } from '../../services/admin';
import { showAlert } from '../../utils/alert';
import DateTimePicker from '@react-native-community/datetimepicker';

export const AdminEventCreateScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    subtitle: '',
    image: '',
    date: new Date() as Date,
    location: '',
    price: undefined,
    capacity: 50,
    city: '',
    type: '',
    membersOnly: false,
    description: '',
  });
  const styles = createStyles(theme);

  const handleSubmit = async () => {
    if (!formData.title || !formData.location || !formData.capacity) {
      showAlert('Error', 'Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await createEvent(formData);
      showAlert('Success', 'Event created successfully', 'success');
      navigation.goBack();
    } catch (error) {
      showAlert('Error', 'Failed to create event', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Create Event</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Event title"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Subtitle</Text>
          <TextInput
            style={styles.input}
            value={formData.subtitle}
            onChangeText={(text) => setFormData({ ...formData, subtitle: text })}
            placeholder="Event subtitle"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Image URL *</Text>
          <TextInput
            style={styles.input}
            value={formData.image}
            onChangeText={(text) => setFormData({ ...formData, image: text })}
            placeholder="https://..."
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
              {formData.date.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={
                formData.date instanceof Date
                  ? formData.date
                  : (formData.date as any)?.toDate
                  ? (formData.date as any).toDate()
                  : new Date(formData.date as any)
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
            placeholder="Event location"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="Miami"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Type</Text>
          <TextInput
            style={styles.input}
            value={formData.type}
            onChangeText={(text) => setFormData({ ...formData, type: text })}
            placeholder="COCTEL_INTIMO"
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
            placeholder="0"
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
            placeholder="50"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.pureBlack} />
          ) : (
            <Text style={styles.submitButtonText}>Create Event</Text>
          )}
        </TouchableOpacity>
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
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.lg,
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      ...theme.typography.label,
      color: theme.colors.pureBlack,
      textAlign: 'center',
      fontWeight: '600',
    },
  });

