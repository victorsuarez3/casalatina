/**
 * Casa Latina Ultra-Premium Color System
 * Final palette matching Aerman Luxury Hotels & Soho House
 */

export const colors = {
  dark: {
    // Core Colors
    pureBlack: '#000000',
    richBlack: '#0B0B0B',
    
    // Premium Accents
    softCream: '#E7DCC0', // Primary accent
    deepCream: '#DACFB5', // Buttons
    warmGold: '#CBB890', // Tiny accents only
    
    // Neutrals
    pureWhite: 'rgba(255, 255, 255, 0.85)', // Max 85% opacity
    softWhite: '#F3F1EC',
    
    // Status Colors
    errorRed: '#CC5C6C', // Members badge
    successGreen: '#7AB48B', // Premium green for badges
    darkGreen: '#0D2E1F', // Deep dark green for Members only badge background (premium)
    premiumGold: '#D4AF37', // Bright metallic gold for Members only text
    // Legacy primary colors (for buttons and tab bar)
    primary: '#D5C4A1', // Champagne Gold - original button color
    primaryDark: '#C8A86A', // Deep Luxe Gold
    
    // Background Hierarchy
    background: '#000000', // Pure black
    surface: '#0B0B0B', // Rich black
    surfaceElevated: '#151515',
    
    // Text Hierarchy (WCAG AA compliant - 4.5:1 contrast)
    text: '#F3F1EC', // Soft white
    textSecondary: '#B9B2A3', // Warm stone
    textTertiary: '#8A8578', // Muted
    
    // Borders
    border: '#2A2824',
    divider: '#1F1F1F',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.75)',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
  
  light: {
    // Light mode (for future)
    pureBlack: '#000000',
    richBlack: '#0B0B0B',
    softCream: '#E7DCC0',
    deepCream: '#DACFB5',
    warmGold: '#CBB890',
    pureWhite: '#FFFFFF',
    softWhite: '#F3F1EC',
    errorRed: '#CC5C6C',
    successGreen: '#7AB48B',
    darkGreen: '#0D2E1F', // Deep dark green for Members only badge background (premium)
    premiumGold: '#D4AF37', // Bright metallic gold for Members only text
    // Legacy primary colors (for buttons and tab bar)
    primary: '#D5C4A1', // Champagne Gold - original button color
    primaryDark: '#C8A86A', // Deep Luxe Gold
    
    background: '#F3F1EC',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAF8',
    
    text: '#0B0B0B',
    textSecondary: '#5A5750',
    textTertiary: '#8A8578',
    
    border: '#E5E0D8',
    divider: '#D5D0C8',
    
    overlay: 'rgba(243, 241, 236, 0.95)',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
};

export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof colors.dark;

