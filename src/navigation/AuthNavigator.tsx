/**
 * Auth Navigator - Casa Latina Premium
 * Handles authentication flow routing
 */

import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { showAlert } from '../utils/alert';
import { SplashScreen } from '../screens/Auth/SplashScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';
import { ApplicationFormScreen, ApplicationFormData } from '../screens/Auth/ApplicationFormScreen';
import { PendingApprovalScreen } from '../screens/Auth/PendingApprovalScreen';
import { signUp, signIn } from '../services/auth';
import { useAuth } from '../providers/AuthProvider';
import { UserDoc } from '../models/firestore';
import { getUserByInviteCode } from '../services/firebase/users';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ApplicationForm: { inviteCode?: string };
  PendingApproval: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

type AuthNavigatorProps = NativeStackScreenProps<AuthStackParamList>;

interface AuthNavigatorContainerProps {
  onAuthSuccess: () => void;
  onRegisterSuccess?: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorContainerProps> = ({ onAuthSuccess, onRegisterSuccess }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { theme } = useTheme();

  // Simulate splash screen delay
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreenWrapper
            {...props}
            onAuthSuccess={onAuthSuccess}
            setLoading={setLoading}
            loading={loading}
            onShowTermsModal={() => setShowTermsModal(true)}
            onShowPrivacyModal={() => setShowPrivacyModal(true)}
            showTermsModal={showTermsModal}
            showPrivacyModal={showPrivacyModal}
            onCloseTermsModal={() => setShowTermsModal(false)}
            onClosePrivacyModal={() => setShowPrivacyModal(false)}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => (
          <RegisterScreenWrapper
            {...props}
            setLoading={setLoading}
            loading={loading}
            onRegisterSuccess={onRegisterSuccess}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ApplicationForm">
        {(props) => (
          <ApplicationFormScreenWrapper
            {...props}
            setLoading={setLoading}
            loading={loading}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PendingApproval">
        {(props) => (
          <PendingApprovalScreenWrapper
            {...props}
            onAuthSuccess={onAuthSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>

    {/* Terms and Conditions Modal */}
    <Modal
      visible={showTermsModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowTermsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.infoModalContent}>
          <View style={styles.infoModalHeader}>
            <Ionicons name="document-text" size={32} color={theme.colors.primary} />
            <Text style={styles.infoModalTitle}>Terms and Conditions</Text>
          </View>
          <ScrollView style={styles.infoModalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.legalSection}>1. Membership Agreement</Text>
            <Text style={styles.legalText}>
              By using Casa Latina, you agree to these terms. Membership is personal and non-transferable. You must be 21 years or older to join.
            </Text>

            <Text style={styles.legalSection}>2. Code of Conduct</Text>
            <Text style={styles.legalText}>
              Members are expected to conduct themselves professionally at all events. Harassment, discrimination, or inappropriate behavior will result in immediate membership revocation without refund.
            </Text>

            <Text style={styles.legalSection}>3. Event Reservations</Text>
            <Text style={styles.legalText}>
              Reservations are confirmed on a first-come, first-served basis. Cancellations must be made at least 24 hours before the event. No-shows may result in restrictions on future reservations.
            </Text>

            <Text style={styles.legalSection}>4. Membership Fees</Text>
            <Text style={styles.legalText}>
              Membership fees are billed annually and are non-refundable. Founding Member pricing is locked for the lifetime of continuous membership.
            </Text>

            <Text style={styles.legalSection}>5. Intellectual Property</Text>
            <Text style={styles.legalText}>
              All content, branding, and materials within the Casa Latina app are proprietary. Photography at events may be used for promotional purposes.
            </Text>

            <Text style={styles.legalSection}>6. Liability</Text>
            <Text style={styles.legalText}>
              Casa Latina is not liable for any injuries, damages, or losses incurred during events. Members participate at their own risk.
            </Text>

            <Text style={styles.legalSection}>7. Modifications</Text>
            <Text style={styles.legalText}>
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.
            </Text>

            <Text style={styles.legalUpdated}>Last updated: December 2025</Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.infoModalButton}
            onPress={() => setShowTermsModal(false)}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.modalButtonGradient}
            >
              <Text style={styles.modalButtonConfirmText}>Close</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    {/* Privacy Policy Modal */}
    <Modal
      visible={showPrivacyModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowPrivacyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.infoModalContent}>
          <View style={styles.infoModalHeader}>
            <Ionicons name="shield-checkmark" size={32} color={theme.colors.primary} />
            <Text style={styles.infoModalTitle}>Privacy Policy</Text>
          </View>
          <ScrollView style={styles.infoModalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.legalSection}>Information We Collect</Text>
            <Text style={styles.legalText}>
              We collect information you provide during registration including your name, email, profession, company, city, and Instagram handle. This helps us curate a quality community.
            </Text>

            <Text style={styles.legalSection}>How We Use Your Data</Text>
            <Text style={styles.legalText}>
              Your information is used to verify membership applications, personalize your experience, send event notifications, and improve our services. We never sell your personal data.
            </Text>

            <Text style={styles.legalSection}>Data Security</Text>
            <Text style={styles.legalText}>
              We use industry-standard encryption and security measures to protect your data. Your information is stored securely on Firebase's infrastructure.
            </Text>

            <Text style={styles.legalSection}>Member Directory</Text>
            <Text style={styles.legalText}>
              Your name, profession, and city may be visible to other members at events. Your email and contact information remain private unless you choose to share.
            </Text>

            <Text style={styles.legalSection}>Third-Party Services</Text>
            <Text style={styles.legalText}>
              We use Firebase for authentication and data storage, and Stripe for payment processing. These services have their own privacy policies.
            </Text>

            <Text style={styles.legalSection}>Your Rights</Text>
            <Text style={styles.legalText}>
              You can request to view, update, or delete your personal data at any time by contacting us at privacy@casalatina.club.
            </Text>

            <Text style={styles.legalSection}>Contact</Text>
            <Text style={styles.legalText}>
              For privacy inquiries, email privacy@casalatina.club. We respond to all requests within 30 days.
            </Text>

            <Text style={styles.legalUpdated}>Last updated: December 2025</Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.infoModalButton}
            onPress={() => setShowPrivacyModal(false)}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.modalButtonGradient}
            >
              <Text style={styles.modalButtonConfirmText}>Close</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </>
  );
};

// Wrapper components to handle navigation
const LoginScreenWrapper: React.FC<AuthNavigatorProps & {
  onAuthSuccess: () => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  onShowTermsModal: () => void;
  onShowPrivacyModal: () => void;
  showTermsModal: boolean;
  showPrivacyModal: boolean;
  onCloseTermsModal: () => void;
  onClosePrivacyModal: () => void;
}> = ({ navigation, onAuthSuccess, setLoading, loading, onShowTermsModal, onShowPrivacyModal, showTermsModal, showPrivacyModal, onCloseTermsModal, onClosePrivacyModal }) => {

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signIn(email, password);
      // onAuthStateChanged will automatically load userDoc, no need to refresh
      // Navigation will be handled by App.tsx based on membershipStatus
      onAuthSuccess();
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error.code === 'auth/user-not-found'
          ? 'No account found with this email'
          : error.code === 'auth/wrong-password'
          ? 'Incorrect password'
          : error.code === 'auth/invalid-email'
          ? 'Invalid email address'
          : 'Failed to sign in. Please try again.';
      showAlert('Sign In Error', errorMessage, 'error');
    }
  };

  return (
    <LoginScreen
      onLogin={handleLogin}
      onNavigateToRegister={() => navigation.navigate('Register')}
      loading={loading}
      onShowTermsModal={onShowTermsModal}
      onShowPrivacyModal={onShowPrivacyModal}
    />
  );
};

const RegisterScreenWrapper: React.FC<AuthNavigatorProps & {
  setLoading: (loading: boolean) => void;
  loading: boolean;
  onRegisterSuccess?: () => void;
}> = ({ navigation, setLoading, loading, onRegisterSuccess }) => {
  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await signUp(email, password, name);
      // onAuthStateChanged will automatically load userDoc via snapshot
      // No need to manually refresh - this is faster
      setLoading(false);
      // Notify parent that registration was successful
      // App.tsx will detect the user and route to ApplicationStartScreen
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists'
          : error.code === 'auth/invalid-email'
          ? 'Invalid email address'
          : error.code === 'auth/weak-password'
          ? 'Password is too weak. Please use at least 6 characters'
          : 'Failed to create account. Please try again.';
      showAlert('Sign Up Error', errorMessage, 'error');
    }
  };

  return (
    <RegisterScreen
      onRegister={handleRegister}
      onNavigateToLogin={() => navigation.navigate('Login')}
      loading={loading}
    />
  );
};

const ApplicationFormScreenWrapper: React.FC<AuthNavigatorProps & {
  setLoading: (loading: boolean) => void;
  loading: boolean;
}> = ({ navigation, setLoading, loading, route }) => {
  const routeParams = route.params as { inviteCode?: string };
  const { user, updateUser } = useAuth();
  const inviteCode = routeParams?.inviteCode;

  const handleApplicationSubmit = async (formData: ApplicationFormData) => {
    if (!user) {
      showAlert('Error', 'You must be logged in to submit an application', 'error');
      return;
    }

    try {
      setLoading(true);

      // Convert form data to the format expected by Firestore
      const ageValue = typeof formData.age === 'string' ? parseInt(formData.age, 10) : formData.age;
      // Instagram handle: remove any @ and add it back (user only types username)
      const cleanHandle = formData.instagramHandle.replace(/^@+/, '').trim();
      const instagramHandleValue = `@${cleanHandle}`;

      const applicationData: Partial<UserDoc> = {
        positionTitle: formData.position,
        company: formData.company,
        industry: formData.industry,
        educationLevel: formData.educationLevel,
        university: formData.university || undefined,
        annualIncomeRange: formData.incomeRange,
        city: formData.city,
        age: ageValue,
        instagramHandle: instagramHandleValue,
        heardAboutUs: formData.referralSource || undefined,
        membershipStatus: 'pending' as const,
      };

      // Process invite code if provided
      if (inviteCode) {
        const inviter = await getUserByInviteCode(inviteCode);
        if (inviter) {
          applicationData.invitedBy = inviter.id;
          applicationData.invitedAt = new Date().toISOString();
          // Update referral source to show it was via invitation
          applicationData.heardAboutUs = `Invited by ${inviter.name || 'Casa Latina member'}`;
        }
      }

      // Update user document with application data
      await updateUser(applicationData);

      setLoading(false);
      navigation.navigate('PendingApproval');
    } catch (error: any) {
      setLoading(false);
      showAlert('Error', 'Failed to submit application. Please try again.', 'error');
      console.error('Error submitting application:', error);
    }
  };

  return (
    <ApplicationFormScreen
      onSubmit={handleApplicationSubmit}
      loading={loading}
    />
  );
};

const PendingApprovalScreenWrapper: React.FC<AuthNavigatorProps & {
  onAuthSuccess: () => void;
}> = ({ navigation, onAuthSuccess }) => {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      showAlert('Error', 'Failed to sign out. Please try again.', 'error');
    }
  };

  return <PendingApprovalScreen onSignOut={handleSignOut} />;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  infoModalContent: {
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderRadius: 20,
    padding: 24,
    width: '92%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(139, 90, 60, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  infoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  infoModalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F5F1E8',
    flex: 1,
  },
  infoModalScroll: {
    maxHeight: 400,
    marginBottom: 20,
  },
  infoModalButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  legalSection: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F5F1E8',
    marginTop: 20,
    marginBottom: 4,
  },
  legalText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
  },
  legalUpdated: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

