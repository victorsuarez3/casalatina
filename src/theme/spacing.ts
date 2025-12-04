/**
 * Casa Latina Ultra-Premium Spacing System
 * High-end editorial rhythm with generous breathing room
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  // Premium spacing additions
  section: 40, // Space between major sections
  cardGap: 16, // Gap between event cards
  titleMargin: 20, // Margin above/below titles
};

export const borderRadius = {
  sm: 10,
  md: 14,
  lg: 20, // Increased for premium feel
  xl: 24, // Increased for premium feel
  xxl: 28,
  round: 9999,
};

export const shadows = {
  // Ultra-subtle luxury shadows
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, // Very subtle
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, // Subtle
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, // Still subtle
    shadowRadius: 16,
    elevation: 6,
  },
  // Premium glass effect
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};
