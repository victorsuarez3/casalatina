/**
 * Application Form Screen - Casa Latina Premium
 * Form to complete after registration - VALIDATION FIELDS ONLY
 * These fields are used to evaluate membership approval
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ASSETS } from '../../constants/assets';

interface ApplicationFormScreenProps {
  onSubmit: (formData: ApplicationFormData) => Promise<void>;
  loading?: boolean;
}

export interface ApplicationFormData {
  // Required fields for validation
  position: string;
  company: string;
  industry: string;
  educationLevel: string;
  incomeRange: string;
  city: string;
  age: string;
  instagramHandle: string;
  // Optional fields
  university?: string;
  referralSource?: string;
}

const INDUSTRY_OPTIONS = [
  'Tech',
  'Finance',
  'Law',
  'Medicine',
  'Real Estate',
  'Consulting',
  'Media',
  'Arts',
  'Entrepreneurship',
  'Other',
];

const EDUCATION_OPTIONS = [
  'High School',
  'Some College',
  "Bachelor's",
  "Master's",
  'MBA',
  'PhD',
  'Other',
];

const INCOME_RANGES = [
  '$50k - $75k',
  '$75k - $100k',
  '$100k - $150k',
  '$150k - $200k',
  '$200k - $300k',
  '$300k+',
  'Prefer not to say',
];

const REFERRAL_OPTIONS = [
  'Friend referral',
  'Instagram',
  'LinkedIn',
  'Event',
  'Other',
];

export const ApplicationFormScreen: React.FC<ApplicationFormScreenProps> = ({
  onSubmit,
  loading = false,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.top, insets.bottom);
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    position: '',
    company: '',
    industry: '',
    educationLevel: '',
    incomeRange: '',
    city: 'Miami',
    age: '',
    instagramHandle: '',
    university: '',
    referralSource: '',
  });

  const [showDropdown, setShowDropdown] = useState<{
    industry?: boolean;
    educationLevel?: boolean;
    incomeRange?: boolean;
    referralSource?: boolean;
  }>({});

  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});

  const updateField = (field: keyof ApplicationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Close dropdown after selection
    setShowDropdown({});
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Position validation: required
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    // Company validation: required
    if (!formData.company.trim()) {
      newErrors.company = 'Company/Employer is required';
    }
    
    // Industry validation: required dropdown
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    
    // Education level validation: required dropdown
    if (!formData.educationLevel) {
      newErrors.educationLevel = 'Education level is required';
    }
    
    // Income range validation: required dropdown
    if (!formData.incomeRange) {
      newErrors.incomeRange = 'Income range is required';
    }
    
    // City validation: required
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    // Age validation: must be >= 21
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 21) {
        newErrors.age = 'Must be 21 or older';
      }
    }
    
    // Instagram handle validation: just the username (without @)
    if (!formData.instagramHandle.trim()) {
      newErrors.instagramHandle = 'Instagram handle is required';
    } else {
      const handle = formData.instagramHandle.trim();
      // Remove @ if user typed it (we add it automatically)
      const cleanHandle = handle.replace(/^@+/, '');
      if (cleanHandle.length < 1) {
        newErrors.instagramHandle = 'Please enter a valid Instagram handle';
      }
    }
    
    // University is optional, no validation needed
    // referralSource is optional, no validation needed
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        // Error handling will be done by parent
      }
    }
  };

  const formatInstagramHandle = (handle: string) => {
    // Remove @ if user types it, we'll add it in display
    return handle.replace(/^@+/, '').trim();
  };

  const renderDropdown = (
    field: 'industry' | 'educationLevel' | 'incomeRange' | 'referralSource',
    options: string[],
    label: string
  ) => {
    const isOpen = showDropdown[field];
    const value = formData[field] || '';

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            errors[field] && styles.inputError,
            isOpen && styles.dropdownButtonOpen,
          ]}
          onPress={() =>
            setShowDropdown((prev) => ({ ...prev, [field]: !isOpen }))
          }
        >
          <Text
            style={[
              styles.dropdownButtonText,
              !value && styles.dropdownButtonPlaceholder,
            ]}
          >
            {value || `Select ${label.toLowerCase()}`}
          </Text>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    updateField(field, option);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      value === option && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {value === option && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={ASSETS.backgrounds.premiumLounge}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
          style={StyleSheet.absoluteFillObject}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Complete your application</Text>
            <Text style={styles.subtitle}>
              Help us get to know you better
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Professional Information Section */}
            <Text style={styles.sectionTitle}>Professional Information</Text>

            {/* Position */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Position / Title *</Text>
              <TextInput
                style={[styles.textInput, errors.position && styles.inputError]}
                placeholder="e.g. Product Manager, Senior Designer"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={formData.position}
                onChangeText={(value) => updateField('position', value)}
              />
              {errors.position && <Text style={styles.errorText}>{errors.position}</Text>}
            </View>

            {/* Company */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Company / Employer *</Text>
              <TextInput
                style={[styles.textInput, errors.company && styles.inputError]}
                placeholder="e.g. Google, Self-employed"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={formData.company}
                onChangeText={(value) => updateField('company', value)}
              />
              {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}
            </View>

            {/* Industry */}
            {renderDropdown('industry', INDUSTRY_OPTIONS, 'Industry / Sector *')}

            {/* Education Level */}
            {renderDropdown('educationLevel', EDUCATION_OPTIONS, 'Education Level *')}

            {/* University (Optional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>University (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. University of Miami"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={formData.university}
                onChangeText={(value) => updateField('university', value)}
              />
            </View>

            {/* Income Range */}
            {renderDropdown('incomeRange', INCOME_RANGES, 'Annual Income Range *')}

            {/* Demographics Section */}
            <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>Demographics</Text>

            {/* City */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={[styles.textInput, errors.city && styles.inputError]}
                placeholder="Miami"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={formData.city}
                onChangeText={(value) => updateField('city', value)}
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            {/* Age */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={[styles.textInput, errors.age && styles.inputError]}
                placeholder="Must be 21 or older"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={formData.age}
                onChangeText={(value) => {
                  // Only allow numbers
                  const numericValue = value.replace(/[^0-9]/g, '');
                  updateField('age', numericValue);
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            {/* Social Verification Section */}
            <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>Social Verification</Text>

            {/* Instagram Handle */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Instagram Handle *</Text>
              <View style={[styles.inputWrapper, errors.instagramHandle && styles.inputError]}>
                <Text style={styles.instagramPrefix}>@</Text>
                <TextInput
                  style={styles.textInputInline}
                  placeholder="username"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={formatInstagramHandle(formData.instagramHandle)}
                  onChangeText={(value) => updateField('instagramHandle', value)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.instagramHandle && (
                <Text style={styles.errorText}>{errors.instagramHandle}</Text>
              )}
            </View>

            {/* Referral Source (Optional) */}
            {renderDropdown('referralSource', REFERRAL_OPTIONS, 'How did you hear about us? (optional)')}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Submitting...' : 'Submit application'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: any, topInset: number, bottomInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundImage: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingTop: topInset + 40,
      paddingBottom: bottomInset + 40,
      paddingHorizontal: 24,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl + 8,
    },
    title: {
      ...theme.typography.heroTitle,
      fontSize: 32,
      color: theme.colors.softCream,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.bodyMedium,
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    form: {
      width: '100%',
    },
    sectionTitle: {
      ...theme.typography.subsectionTitle,
      color: theme.colors.text,
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.lg + 4,
      fontSize: 22,
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
    inputError: {
      borderColor: theme.colors.errorRed + '80',
    },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.errorRed,
      marginTop: theme.spacing.xs,
      fontSize: 12,
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary + '40',
      paddingVertical: theme.spacing.md + 2,
      paddingHorizontal: theme.spacing.md + 4,
    },
    dropdownButtonOpen: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderColor: theme.colors.primary + '60',
    },
    dropdownButtonText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontSize: 15,
      flex: 1,
    },
    dropdownButtonPlaceholder: {
      color: 'rgba(255,255,255,0.35)',
    },
    dropdownList: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: theme.colors.primary + '60',
      borderBottomLeftRadius: theme.borderRadius.md,
      borderBottomRightRadius: theme.borderRadius.md,
      maxHeight: 200,
      ...theme.shadows.md,
    },
    dropdownScroll: {
      maxHeight: 200,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md + 2,
      paddingHorizontal: theme.spacing.md + 4,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    dropdownItemText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontSize: 15,
      flex: 1,
    },
    dropdownItemTextSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    submitButton: {
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      marginTop: theme.spacing.xl + 8,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.md,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonGradient: {
      paddingVertical: theme.spacing.md + 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButtonText: {
      ...theme.typography.button,
      color: theme.colors.background,
      fontSize: 16,
    },
  });
