/**
 * Application Start Screen
 * Shows the application form for users who haven't applied yet
 */

import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { ApplicationFormScreen, ApplicationFormData } from './Auth/ApplicationFormScreen';
import { useAuth } from '../providers/AuthProvider';
import { validateMembershipApplication } from '../utils/validation';
import { showAlert } from '../utils/alert';
import { getUserByInviteCode } from '../services/firebase/users';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const ApplicationStartScreen: React.FC = () => {
  const { updateUser, userDoc } = useAuth();
  const [loading, setLoading] = useState(false);
  // inviteCode is not available when rendered directly from App.tsx
  const inviteCode = undefined;

  // Reset loading if membershipStatus changes (user was redirected)
  React.useEffect(() => {
    if (userDoc?.membershipStatus === 'pending') {
      setLoading(false);
    }
  }, [userDoc?.membershipStatus]);

  const handleSubmit = async (formData: ApplicationFormData) => {
    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 30000);

    try {
      setLoading(true);

      // Validate the application
      const validationErrors = validateMembershipApplication({
        age: parseInt(formData.age),
        city: formData.city,
        educationLevel: formData.educationLevel,
        university: formData.university,
        position: formData.position,
        employer: formData.company,
        industry: formData.industry,
        incomeRange: formData.incomeRange,
        instagramHandle: formData.instagramHandle,
        howDidYouHearAboutUs: formData.referralSource,
      });

      if (Object.keys(validationErrors).length > 0) {
        clearTimeout(timeoutId);
        setLoading(false);
        const errorMessages = Object.values(validationErrors);
        showAlert('Validation Error', errorMessages.join('\n'), 'error');
        return;
      }

      // Format Instagram handle: remove any @ and add it back
      const cleanHandle = formData.instagramHandle.replace(/^@+/, '').trim();
      const instagramHandleValue = `@${cleanHandle}`;

      // Update user document with application data
      try {
        const updateData: any = {
          positionTitle: formData.position,
          company: formData.company,
          industry: formData.industry,
          educationLevel: formData.educationLevel,
          university: formData.university || undefined,
          annualIncomeRange: formData.incomeRange,
          city: formData.city,
          age: parseInt(formData.age),
          instagramHandle: instagramHandleValue,
          heardAboutUs: formData.referralSource || undefined,
          membershipStatus: 'pending',
        };

        // Process invite code if provided
        if (inviteCode) {
          const inviter = await getUserByInviteCode(inviteCode);
          if (inviter) {
            updateData.invitedBy = inviter.id;
            updateData.invitedAt = new Date().toISOString();
            // Update referral source to show it was via invitation
            updateData.heardAboutUs = `Invited by ${inviter.name || 'Casa Latina member'}`;
          }
        }

        await updateUser(updateData);
        
        clearTimeout(timeoutId);
        setLoading(false);
      } catch (updateError: any) {
        clearTimeout(timeoutId);
        setLoading(false);
        const errorMessage = updateError?.message || updateError?.code || 'Failed to update user document. Please check your connection and try again.';
        showAlert('Update Error', errorMessage, 'error');
        return;
      }

      clearTimeout(timeoutId);
      setLoading(false);
      
      setTimeout(() => {
        showAlert('Application Submitted', 'Your application has been submitted for review', 'success');
      }, 100);
    } catch (error: any) {
      clearTimeout(timeoutId);
      setLoading(false);
      const errorMessage = error?.message || error?.code || 'Failed to submit application. Please try again.';
      showAlert('Error', errorMessage, 'error');
    }
  };

  return (
    <ErrorBoundary
      fallback={(error, resetError) => (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to load application form</Text>
          <Text style={styles.errorMessage}>
            {error.message || 'An unexpected error occurred'}
          </Text>
        </View>
      )}
    >
      <ApplicationFormScreen
        onSubmit={handleSubmit}
        loading={loading}
      />
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F5F1E8',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
});
