/**
 * Event Details Screen - Ultra-Premium Casa Latina
 * Luxury event details with editorial-grade design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EventDetailsScreenProps } from '../navigation/types';
import { getEventById } from '../services/firebase/events';
import { Event } from '../services/firebase/types';
import { t } from '../i18n';
import { mockEvents } from '../data/mockEvents';

const tabs = ['Our Story', 'Order of the day', 'Dinning'];

const CATEGORY_LABELS: Record<string, string> = {
  COCTEL_INTIMO: 'CÓCTEL ÍNTIMO',
  CENA_PRIVADA: 'CENA PRIVADA',
  ARTE_VINO: 'ARTE & VINO',
  NETWORKING: 'NETWORKING',
  MUSICA_EN_VIVO: 'MÚSICA EN VIVO',
  BRUNCH: 'BRUNCH',
};

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [event, setEvent] = React.useState<Event | null>(null);
  const [loading, setLoading] = React.useState(true);
  const styles = createStyles(theme, insets.bottom);

  const { eventId } = route.params;

  // Fade in animation
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const imageOpacity = React.useRef(new Animated.Value(0)).current;

  // Helper function to convert mock event to Event format
  const convertMockToEvent = (mockEvent: any): Event => {
    const dateParts = mockEvent.date.split('·');
    const dateStr = dateParts[0]?.trim() || 'Vie, 15 Dic';
    const timeStr = dateParts[1]?.trim() || '8:00 PM';
    
    return {
      id: mockEvent.id,
      title: mockEvent.title,
      city: mockEvent.city,
      neighborhood: mockEvent.neighborhood,
      category: mockEvent.type.toUpperCase().replace(/\s+/g, '_').replace(/&/g, '_').replace(/_+/g, '_'),
      date: dateStr,
      time: timeStr,
      membersOnly: mockEvent.isMembersOnly,
      totalSpots: mockEvent.membersCount + mockEvent.remainingSpots,
      spotsRemaining: mockEvent.remainingSpots,
      attendingCount: mockEvent.membersCount,
      imageUrl: mockEvent.imageUrl,
    };
  };

  React.useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      
      // For MVP Phase 1, always use mockEvents
      // Firebase integration will be added when backend is ready
      const mockEvent = mockEvents.find(e => e.id === eventId);
      
      if (mockEvent) {
        const convertedEvent = convertMockToEvent(mockEvent);
        setEvent(convertedEvent);
        
        // Animate in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(imageOpacity, {
            toValue: 1,
            duration: 280,
            delay: 50,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Try Firebase as fallback (for future use)
        try {
          const fetchedEvent = await getEventById(eventId);
          if (fetchedEvent) {
            setEvent(fetchedEvent);
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(imageOpacity, {
                toValue: 1,
                duration: 280,
                delay: 50,
                useNativeDriver: true,
              }),
            ]).start();
          }
        } catch (error) {
          // Silently handle Firebase errors - we're using mocks for MVP
          console.log('Firebase offline or error, using mock data');
        }
      }
      
      setLoading(false);
    };
    
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Events"
          showBack
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Header
          title="Events"
          showBack
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </View>
    );
  }

  const handleEnroll = () => {
    console.log('Enroll pressed for event:', event.id);
    // TODO: Implement enroll logic
  };

  // Generate member avatars - Fixed: use attendingCount
  const memberAvatars = Array.from({ length: Math.min(event.attendingCount, 5) }, (_, i) => ({
    id: i,
    initial: String.fromCharCode(65 + (i % 26)),
  }));

  // Clean category label
  const cleanCategory = event.category.replace(/_+/g, ' ').trim();
  const categoryLabel = CATEGORY_LABELS[event.category] || cleanCategory.toUpperCase();

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Header
        title="Events"
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Event Image - Premium */}
        <View style={styles.imageContainer}>
          <Animated.Image 
            source={{ uri: event.imageUrl }} 
            style={[styles.image, { opacity: imageOpacity }]} 
            resizeMode="cover"
          />
          
          {/* Soft vignette overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.85)']}
            locations={[0, 0.5, 1]}
            style={styles.imageGradient}
          />
          
          {/* Category Pill */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{categoryLabel}</Text>
          </View>
          
          {/* Price/Members Badge */}
          {(event.membersOnly || event.spotsRemaining > 0) && (
            <View style={[
              styles.priceBadge,
              event.membersOnly && styles.priceBadgeMembersOnly
            ]}>
              <Text style={[
                styles.priceText,
                event.membersOnly && styles.priceTextMembersOnly
              ]}>
                {event.membersOnly ? t('event_members_only') : `${event.spotsRemaining} spots`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Event Title - Premium typography */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Event Info */}
          <View style={styles.eventInfo}>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.infoText}>{event.date} · {event.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.infoText}>
                {event.city} · {event.neighborhood}
              </Text>
            </View>
          </View>

          {/* Organizer Card - Premium */}
          <View style={styles.organizerCard}>
            <View style={styles.organizerAvatar}>
              <Text style={styles.organizerAvatarText}>A</Text>
            </View>
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerName}>Andrew Ainsley</Text>
              <Text style={styles.organizerLocation}>
                {event.city} · {event.neighborhood}
              </Text>
              <Text style={styles.organizerEvents}>25 Event</Text>
            </View>
          </View>

          {/* Tabs - Premium */}
          <View style={styles.tabs}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tab, activeTab === index && styles.tabActive]}
                onPress={() => setActiveTab(index)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === index && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </Text>
          </View>

          {/* Members Section - Premium */}
          <View style={styles.membersSection}>
            <Text style={styles.membersTitle}>{t('event_details_member')}</Text>
            <View style={styles.membersContainer}>
              <View style={styles.memberAvatars}>
                {memberAvatars.map((member) => (
                  <View key={member.id} style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>{member.initial}</Text>
                  </View>
                ))}
                {event.attendingCount > 5 && (
                  <View style={styles.moreMembers}>
                    <Text style={styles.moreMembersText}>
                      {event.attendingCount - 5}+
                    </Text>
                  </View>
                )}
              </View>
              <Button
                title={t('event_details_enroll')}
                onPress={handleEnroll}
                variant="primary"
                fullWidth={false}
                style={styles.enrollButton}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const createStyles = (theme: any, bottomInset: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: bottomInset + 120,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 320, // Generous height
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  categoryPill: {
    position: 'absolute',
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: theme.colors.warmGold,
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borderRadius.round,
  },
  categoryPillText: {
    ...theme.typography.labelSmall,
    color: theme.colors.softCream,
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  priceBadge: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.softCream,
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.sm,
  },
  priceBadgeMembersOnly: {
    backgroundColor: theme.colors.darkGreen || '#0D2E1F', // Deep dark green background
    borderWidth: 1,
    borderColor: theme.colors.premiumGold || '#D4AF37', // Bright gold border
  },
  priceText: {
    ...theme.typography.label,
    color: theme.colors.pureBlack,
    fontSize: 12,
  },
  priceTextMembersOnly: {
    color: theme.colors.premiumGold || '#D4AF37', // Bright metallic gold text
  },
  content: {
    padding: theme.spacing.lg, // Premium padding
  },
  title: {
    ...theme.typography.sectionTitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.titleMargin, // Editorial spacing
  },
  eventInfo: {
    gap: theme.spacing.sm + 2,
    marginBottom: theme.spacing.lg + 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg + 4,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  organizerAvatar: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.softCream + '25',
    borderWidth: 1.5,
    borderColor: theme.colors.warmGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerAvatarText: {
    ...theme.typography.subsectionTitle,
    color: theme.colors.softCream,
    fontSize: 26,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    ...theme.typography.subsectionTitle,
    color: theme.colors.text,
    fontSize: 20,
    marginBottom: theme.spacing.xs,
  },
  organizerLocation: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs / 2,
  },
  organizerEvents: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  tabs: {
    flexDirection: 'row',
    gap: theme.spacing.sm + 2,
    marginBottom: theme.spacing.lg + 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.md,
  },
  tab: {
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: theme.colors.surface,
  },
  tabText: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  tabTextActive: {
    ...theme.typography.label,
    color: theme.colors.softCream,
    fontWeight: '500',
  },
  description: {
    marginBottom: theme.spacing.xl + 4,
  },
  descriptionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 26,
  },
  membersSection: {
    marginTop: theme.spacing.md + 4,
    marginBottom: theme.spacing.xl,
  },
  membersTitle: {
    ...theme.typography.subsectionTitle,
    color: theme.colors.text,
    fontSize: 20,
    marginBottom: theme.spacing.lg,
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -theme.spacing.sm,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.softCream + '30',
    borderWidth: 1.5,
    borderColor: theme.colors.softCream + '50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -6,
  },
  memberAvatarText: {
    ...theme.typography.label,
    color: theme.colors.softCream,
    fontSize: 13,
    fontWeight: '600',
  },
  moreMembers: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    marginLeft: -6,
  },
  moreMembersText: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  enrollButton: {
    minWidth: 150,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
