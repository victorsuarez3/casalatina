/**
 * Protected Route Component
 * Guards routes based on membership status
 */

import React, { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { ApplicationStartScreen } from '../screens/ApplicationStartScreen';
import { ApplicationReviewScreen } from '../screens/ApplicationReviewScreen';
import { MembershipRejectedScreen } from '../screens/MembershipRejectedScreen';
import { AuthNavigator } from '../navigation/AuthNavigator';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route that only allows approved members
 * Redirects based on membership status
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, userDoc, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return null; // Or a loading spinner
  }

  // Unauthenticated: redirect to auth
  if (!user) {
    return <AuthNavigator onAuthSuccess={() => {}} />;
  }

  // No userDoc: shouldn't happen, but handle gracefully
  if (!userDoc) {
    return <AuthNavigator onAuthSuccess={() => {}} />;
  }

  // Route based on membership status
  switch (userDoc.membershipStatus) {
    case 'not_applied':
      return <ApplicationStartScreen />;

    case 'pending':
      return <ApplicationReviewScreen />;

    case 'approved':
      return <>{children}</>;

    case 'rejected':
      return <MembershipRejectedScreen />;

    default:
      return <AuthNavigator onAuthSuccess={() => {}} />;
  }
};

