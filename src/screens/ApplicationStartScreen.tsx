/**
 * Application Start Screen
 * Shows the application form for users who haven't applied yet
 */

import React, { useState } from 'react';
import { ApplicationFormScreen, ApplicationFormData } from './Auth/ApplicationFormScreen';
import { useAuth } from '../providers/AuthProvider';
import { validateMembershipApplication } from '../utils/validation';
import { showAlert } from '../utils/alert';
import { useRoute } from '@react-navigation/native';
import { getUserByInviteCode } from '../services/firebase/users';

export const ApplicationStartScreen: React.FC = () => {
  const { updateUser, userDoc } = useAuth();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const inviteCode = (route.params as any)?.inviteCode;

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
    <ApplicationFormScreen
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};
