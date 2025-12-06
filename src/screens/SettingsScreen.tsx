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
      onPress: () => console.log('FAQ pressed'),
    },
    {
      id: 'terms',
      icon: 'document-text-outline',
      label: 'Terms and Conditions',
      onPress: () => console.log('Terms pressed'),
    },
    {
      id: 'privacy',
      icon: 'shield-checkmark-outline',
      label: 'Privacy Policy',
      onPress: () => console.log('Privacy pressed'),
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
  });

