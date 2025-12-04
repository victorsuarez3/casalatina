/**
 * Profile Details Section - Casa Latina Premium
 * Social/visible fields that other members can see
 * These are NOT used for membership validation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface ProfileFormData {
  // Basic visible info (converges with application)
  position: string;
  company: string;
  // Social/visible fields (NOT for validation)
  bio: string;
  instagramHandle: string;
  hobbies: string;
  favoriteMovie: string;
  favoriteRestaurant: string;
  favoriteCoffeeSpot: string;
}

export const ProfileDetailsSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [formData, setFormData] = useState<ProfileFormData>({
    position: '',
    company: '',
    bio: '',
    instagramHandle: '',
    hobbies: '',
    favoriteMovie: '',
    favoriteRestaurant: '',
    favoriteCoffeeSpot: '',
  });

  const handleSave = () => {
    console.log('Profile form data:', formData);
    // TODO: Wire to backend
  };

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInstagramPress = () => {
    if (formData.instagramHandle) {
      const handle = formData.instagramHandle.replace('@', '');
      const url = `https://instagram.com/${handle}`;
      Linking.openURL(url).catch((err) =>
        console.error('Failed to open Instagram:', err)
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Basic Information Section */}
      <Text style={styles.sectionTitle}>Basic Information</Text>

      {/* Position */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Position</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Product Manager"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.position}
          onChangeText={(value) => updateField('position', value)}
        />
      </View>

      {/* Company */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Company</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Tech Corp"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.company}
          onChangeText={(value) => updateField('company', value)}
        />
      </View>

      {/* Social Section */}
      <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>
        Social Profile
      </Text>

      {/* Bio */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Short Bio</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Tell others about yourself..."
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.bio}
          onChangeText={(value) => updateField('bio', value)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Instagram Handle */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Instagram Handle</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.instagramPrefix}>@</Text>
          <TextInput
            style={styles.textInputInline}
            placeholder="username"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={formData.instagramHandle.replace('@', '')}
            onChangeText={(value) => updateField('instagramHandle', value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {formData.instagramHandle && (
            <TouchableOpacity
              style={styles.instagramButton}
              onPress={handleInstagramPress}
            >
              <Ionicons name="open-outline" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        {formData.instagramHandle && (
          <Text style={styles.helperText}>
            Tap the icon to open Instagram profile
          </Text>
        )}
      </View>

      {/* Interests Section */}
      <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>
        Interests
      </Text>

      {/* Hobbies */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hobbies / Interests</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Travel, Fitness, Wine, Tech"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.hobbies}
          onChangeText={(value) => updateField('hobbies', value)}
        />
        <Text style={styles.helperText}>
          Separate multiple interests with commas
        </Text>
      </View>

      {/* Favorites Section */}
      <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>
        Favorites
      </Text>

      {/* Favorite Movie */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Favorite Movie</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. The Godfather"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.favoriteMovie}
          onChangeText={(value) => updateField('favoriteMovie', value)}
        />
      </View>

      {/* Favorite Restaurant */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Favorite Restaurant</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Zuma"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.favoriteRestaurant}
          onChangeText={(value) => updateField('favoriteRestaurant', value)}
        />
      </View>

      {/* Favorite Coffee Spot */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Favorite Coffee Spot</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Panther Coffee"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={formData.favoriteCoffeeSpot}
          onChangeText={(value) => updateField('favoriteCoffeeSpot', value)}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.saveButtonGradient}
        >
          <Text style={styles.saveButtonText}>Save changes</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    sectionTitle: {
      ...theme.typography.subsectionTitle,
      color: theme.colors.text,
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.lg + 4,
      fontSize: 20,
    },
    sectionTitleMargin: {
      marginTop: 32,
    },
    inputContainer: {
      marginBottom: theme.spacing.lg + 4,
    },
    label: {
      ...theme.typography.label,
      color: 'rgba(255,255,255,0.7)',
      marginBottom: theme.spacing.xs + 2,
      fontSize: 13,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary + '40',
      paddingVertical: theme.spacing.md + 2,
      paddingHorizontal: theme.spacing.md + 4,
      ...theme.typography.body,
      color: theme.colors.text,
      fontSize: 15,
    },
    textArea: {
      minHeight: 100,
      paddingTop: theme.spacing.md + 2,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary + '40',
      paddingHorizontal: theme.spacing.md + 4,
    },
    instagramPrefix: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontSize: 15,
      marginRight: 4,
    },
    textInputInline: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      fontSize: 15,
      paddingVertical: theme.spacing.md + 2,
    },
    instagramButton: {
      padding: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },
    helperText: {
      ...theme.typography.caption,
      color: theme.colors.textTertiary,
      marginTop: theme.spacing.xs,
      fontSize: 11,
    },
    saveButton: {
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      marginTop: theme.spacing.xl + 8,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.md,
    },
    saveButtonGradient: {
      paddingVertical: theme.spacing.md + 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonText: {
      ...theme.typography.button,
      color: theme.colors.background,
      fontSize: 16,
    },
  });
