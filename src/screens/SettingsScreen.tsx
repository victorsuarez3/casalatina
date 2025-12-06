/**
 * Settings Screen - Casa Latina Premium
 * Premium settings with subscription info and account management
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import { SettingsScreenProps } from '../navigation/types';

interface SettingsItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.top, insets.bottom);
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Subscription data based on current date
  const today = new Date();
  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  const subscriptionData = {
    status: 'active' as 'active' | 'expired' | 'trial',
    startDate: today.toISOString().split('T')[0],
    endDate: oneYearFromNow.toISOString().split('T')[0],
    plan: 'Founding Member',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout();
      // Navigation will be handled by App.tsx auth state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    // TODO: Implement delete account logic
    console.log('Delete account');
    // For now, just sign out
    await logout();
  };

  const settingsItems: SettingsItem[] = [
    {
      id: 'faq',
      icon: 'help-circle-outline',
      label: 'FAQ',
      onPress: () => setShowFaqModal(true),
    },
    {
      id: 'terms',
      icon: 'document-text-outline',
      label: 'Terms and Conditions',
      onPress: () => setShowTermsModal(true),
    },
    {
      id: 'privacy',
      icon: 'shield-checkmark-outline',
      label: 'Privacy Policy',
      onPress: () => setShowPrivacyModal(true),
    },
    {
      id: 'logout',
      icon: 'log-out-outline',
      label: 'Logout',
      onPress: () => setShowLogoutModal(true),
      danger: true,
    },
    {
      id: 'delete',
      icon: 'trash-outline',
      label: 'Delete Account',
      onPress: () => setShowDeleteModal(true),
      danger: true,
    },
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=90',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Subscription Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Membership</Text>
            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <View style={styles.subscriptionIcon}>
                  <Ionicons name="diamond-outline" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.subscriptionInfo}>
                  <Text style={styles.subscriptionPlan}>{subscriptionData.plan}</Text>
                  <View style={styles.subscriptionBadge}>
                    <View style={styles.subscriptionBadgeDot} />
                    <Text style={styles.subscriptionBadgeText}>
                      {subscriptionData.status === 'active' ? 'Active' : 
                       subscriptionData.status === 'trial' ? 'Trial' : 'Expired'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.subscriptionDetails}>
                <View style={styles.subscriptionDetailRow}>
                  <Text style={styles.subscriptionDetailLabel}>Started</Text>
                  <Text style={styles.subscriptionDetailValue}>
                    {formatDate(subscriptionData.startDate)}
                  </Text>
                </View>
                <View style={styles.subscriptionDetailRow}>
                  <Text style={styles.subscriptionDetailLabel}>Valid until</Text>
                  <Text style={styles.subscriptionDetailValue}>
                    {formatDate(subscriptionData.endDate)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Settings Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.settingsContainer}>
              {settingsItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingsItem,
                    index === 0 && styles.settingsItemFirst,
                    index === settingsItems.length - 1 && styles.settingsItemLast,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                <View style={styles.settingsItemLeft}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={item.danger ? theme.colors.errorRed : theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.settingsItemLabel,
                      item.danger && styles.settingsItemLabelDanger,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.textTertiary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout from Casa Latina?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleLogout}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.primaryDark]}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonConfirmText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={48} color={theme.colors.errorRed} />
            </View>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalMessage}>
              This action cannot be undone. All your data will be permanently deleted.
            </Text>
            <Text style={styles.modalWarning}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.modalButtonDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FAQ Modal */}
      <Modal
        visible={showFaqModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFaqModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoModalHeader}>
              <Ionicons name="help-circle" size={32} color={theme.colors.primary} />
              <Text style={styles.infoModalTitle}>Frequently Asked Questions</Text>
            </View>
            <ScrollView style={styles.infoModalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.faqQuestion}>What is Casa Latina?</Text>
              <Text style={styles.faqAnswer}>
                Casa Latina is an exclusive members-only social club for ambitious Latinos in Miami. We curate premium experiences including private dinners, yacht gatherings, art soirées, and networking events.
              </Text>

              <Text style={styles.faqQuestion}>How do I become a member?</Text>
              <Text style={styles.faqAnswer}>
                Membership is by application only. We review each application to ensure our community maintains its high standards and curated experience.
              </Text>

              <Text style={styles.faqQuestion}>What's included in my membership?</Text>
              <Text style={styles.faqAnswer}>
                As a Founding Member, you get access to all Casa Latina events, priority reservations, exclusive member pricing, and the ability to invite guests to select experiences.
              </Text>

              <Text style={styles.faqQuestion}>How do I RSVP to events?</Text>
              <Text style={styles.faqAnswer}>
                Simply browse our curated events in the Home tab and tap "Reserve spot" on any event you'd like to attend. Spots are limited and available on a first-come basis.
              </Text>

              <Text style={styles.faqQuestion}>Can I bring guests?</Text>
              <Text style={styles.faqAnswer}>
                Select events allow members to bring one guest. Check each event's details for guest policies. Guests must meet Casa Latina's standards.
              </Text>

              <Text style={styles.faqQuestion}>How do I contact support?</Text>
              <Text style={styles.faqAnswer}>
                Email us at hello@casalatina.club or reach out via Instagram @casalatina.club. We typically respond within 24 hours.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={() => setShowFaqModal(false)}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonConfirmText}>Got it</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    </View>
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: topInset + 16,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...theme.typography.sectionTitle,
      color: theme.colors.text,
      fontSize: 24,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: bottomInset + 100,
      paddingHorizontal: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.xl + 8,
    },
    sectionTitle: {
      ...theme.typography.subsectionTitle,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      fontSize: 20,
    },
    subscriptionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg + 4,
      borderWidth: 1,
      borderColor: theme.colors.primary + '30',
      ...theme.shadows.md,
    },
    subscriptionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    subscriptionIcon: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.primary + '15',
      borderWidth: 1.5,
      borderColor: theme.colors.primary + '40',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    subscriptionInfo: {
      flex: 1,
    },
    subscriptionPlan: {
      ...theme.typography.subsectionTitle,
      color: theme.colors.text,
      fontSize: 20,
      marginBottom: theme.spacing.xs,
    },
    subscriptionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.successGreen + '20',
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
    },
    subscriptionBadgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.successGreen,
      marginRight: theme.spacing.xs,
    },
    subscriptionBadgeText: {
      ...theme.typography.labelSmall,
      color: theme.colors.successGreen,
      fontSize: 11,
      fontWeight: '600',
    },
    subscriptionDetails: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.md,
      gap: theme.spacing.sm + 2,
    },
    subscriptionDetailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    subscriptionDetailLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    subscriptionDetailValue: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontSize: 14,
    },
    settingsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md + 4,
      paddingHorizontal: theme.spacing.md + 4,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingsItemFirst: {
      borderTopLeftRadius: theme.borderRadius.md,
      borderTopRightRadius: theme.borderRadius.md,
    },
    settingsItemLast: {
      borderBottomWidth: 0,
      borderBottomLeftRadius: theme.borderRadius.md,
      borderBottomRightRadius: theme.borderRadius.md,
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingsItemLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontSize: 15,
    },
    settingsItemLabelDanger: {
      color: theme.colors.errorRed,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl + 8,
      width: '100%',
      maxWidth: 400,
      borderWidth: 1,
      borderColor: theme.colors.primary + '30',
      ...theme.shadows.lg,
    },
    modalIconContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    modalTitle: {
      ...theme.typography.sectionTitle,
      color: theme.colors.text,
      fontSize: 24,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    modalMessage: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    modalWarning: {
      ...theme.typography.bodyMedium,
      color: theme.colors.errorRed,
      fontWeight: '600',
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    modalButton: {
      flex: 1,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    },
    modalButtonCancel: {
      backgroundColor: theme.colors.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: theme.spacing.md + 2,
    },
    modalButtonConfirm: {
      overflow: 'hidden',
    },
    modalButtonDelete: {
      backgroundColor: theme.colors.errorRed,
      paddingVertical: theme.spacing.md + 2,
    },
    modalButtonGradient: {
      paddingVertical: theme.spacing.md + 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalButtonCancelText: {
      ...theme.typography.button,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontSize: 15,
    },
    modalButtonConfirmText: {
      ...theme.typography.button,
      color: theme.colors.background,
      textAlign: 'center',
      fontSize: 15,
    },
    modalButtonDeleteText: {
      ...theme.typography.button,
      color: '#FFFFFF',
      textAlign: 'center',
      fontSize: 15,
    },
    // Info Modal Styles (FAQ, Terms, Privacy)
    infoModalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      width: '92%',
      maxHeight: '80%',
      borderWidth: 1,
      borderColor: theme.colors.primary + '30',
      ...theme.shadows.lg,
    },
    infoModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    infoModalTitle: {
      ...theme.typography.sectionTitle,
      color: theme.colors.text,
      fontSize: 22,
      flex: 1,
    },
    infoModalScroll: {
      maxHeight: 400,
      marginBottom: theme.spacing.lg,
    },
    infoModalButton: {
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    },
    faqQuestion: {
      ...theme.typography.subsectionTitle,
      color: theme.colors.softCream,
      fontSize: 15,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xs,
    },
    faqAnswer: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 22,
    },
    legalSection: {
      ...theme.typography.subsectionTitle,
      color: theme.colors.softCream,
      fontSize: 15,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xs,
    },
    legalText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 22,
    },
    legalUpdated: {
      ...theme.typography.caption,
      color: theme.colors.textTertiary,
      fontSize: 12,
      marginTop: theme.spacing.xl,
      textAlign: 'center',
      fontStyle: 'italic',
    },
  });

