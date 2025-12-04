/**
 * Profile Details Section - Casa Latina Premium
 * Form for user profile details
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

type RelationshipOption = 'single' | 'married' | 'prefer-not-to-say';

interface ProfileFormData {
  position: string;
  company: string;
  city: string;
  university: string;
  relationship: RelationshipOption;
  favoriteJob: string;
  favoriteRestaurant: string;
  favoriteCoffeePlace: string;
  favoriteMovie: string;
}

export const ProfileDetailsSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [formData, setFormData] = useState<ProfileFormData>({
    position: '',
    company: '',
    city: 'Miami',
    university: '',
    relationship: 'single',
    favoriteJob: '',
    favoriteRestaurant: '',
    favoriteCoffeePlace: '',
    favoriteMovie: '',
  });

  const handleSave = () => {
    console.log('Profile form data:', formData);
    // TODO: Wire to backend
  };

  const updateField = (field: keyof ProfileFormData, value: string | RelationshipOption) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const relationshipOptions: { value: RelationshipOption; label: string }[] = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  return (
    <View style={styles.container}>
      {/* About you section */}
      <Text style={styles.sectionTitle}>About you</Text>

      {/* Position */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Position</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Product Manager"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.position}
          onChangeText={(value) => updateField('position', value)}
        />
      </View>

      {/* Company */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Company</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Tech Corp"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.company}
          onChangeText={(value) => updateField('company', value)}
        />
      </View>

      {/* City */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>City</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Miami"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.city}
          onChangeText={(value) => updateField('city', value)}
        />
      </View>

      {/* University (optional) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>University (optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. University of Miami"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.university}
          onChangeText={(value) => updateField('university', value)}
        />
      </View>

      {/* Relationship */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Relationship</Text>
        <View style={styles.pillsContainer}>
          {relationshipOptions.map((option) => {
            const isActive = formData.relationship === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.pill,
                  isActive && styles.pillActive,
                ]}
                onPress={() => updateField('relationship', option.value)}
              >
                <Text
                  style={[
                    styles.pillText,
                    isActive && styles.pillTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Favorites section */}
      <Text style={[styles.sectionTitle, styles.favoritesTitle]}>Favorites</Text>

      {/* Favorite job */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Favorite job</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Designer"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.favoriteJob}
          onChangeText={(value) => updateField('favoriteJob', value)}
        />
      </View>

      {/* Favorite restaurant */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Favorite restaurant</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Zuma"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.favoriteRestaurant}
          onChangeText={(value) => updateField('favoriteRestaurant', value)}
        />
      </View>

      {/* Favorite coffee place */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Favorite coffee place</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Panther Coffee"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.favoriteCoffeePlace}
          onChangeText={(value) => updateField('favoriteCoffeePlace', value)}
        />
      </View>

      {/* Favorite movie */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Favorite movie</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. The Godfather"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.favoriteMovie}
          onChangeText={(value) => updateField('favoriteMovie', value)}
        />
      </View>

      {/* Save button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        activeOpacity={0.85}
      >
        <Text style={styles.saveButtonText}>Save changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    sectionTitle: {
      ...theme.typography.subsectionTitle,
      color: theme.colors.text,
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.lg + 4,
    },
    favoritesTitle: {
      marginTop: 32, // Extra spacing before Favorites section
    },
    fieldContainer: {
      marginBottom: theme.spacing.lg + 4,
    },
    fieldLabel: {
      ...theme.typography.labelSmall,
      color: 'rgba(255,255,255,0.7)',
      marginBottom: theme.spacing.xs + 2,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary + '40', // Subtle gold tint
      paddingVertical: theme.spacing.md + 2,
      paddingHorizontal: theme.spacing.md + 4,
      ...theme.typography.body,
      color: theme.colors.text,
      fontSize: 15,
    },
    pillsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm + 2,
      flexWrap: 'wrap',
    },
    pill: {
      paddingVertical: theme.spacing.sm + 2,
      paddingHorizontal: theme.spacing.md + 4,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.primary + '60', // Gold border
    },
    pillActive: {
      backgroundColor: theme.colors.primary, // Gold background
      borderColor: theme.colors.primary,
    },
    pillText: {
      ...theme.typography.labelSmall,
      color: theme.colors.textSecondary,
      fontSize: 13,
    },
    pillTextActive: {
      color: theme.colors.background, // Dark text on gold
      fontWeight: '600',
    },
    saveButton: {
      backgroundColor: theme.colors.primary, // Gold background
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md + 4,
      paddingHorizontal: theme.spacing.lg + 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.xl + 8,
      ...theme.shadows.sm,
    },
    saveButtonText: {
      ...theme.typography.button,
      color: theme.colors.background, // Dark text
    },
  });

