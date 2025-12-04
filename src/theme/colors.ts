/**
 * Casa Latina Ultra-Premium Color Palette
 * Inspired by Aman Resorts, Cartier, Soho House
 * Champagne Noir aesthetic
 */

export const colors = {
  dark: {
    // Premium Champagne Golds
    primary: '#D5C4A1', // Champagne Gold - primary actions
    primaryDark: '#C8A86A', // Deep Luxe Gold - accents
    primaryLight: '#E5D9C4', // Light champagne
    
    // Neutrals
    warmStone: '#B9B2A3', // Warm Stone - subtle borders
    smokedBlack: '#0B0B0B', // Smoked Black - main background
    pureNoir: '#000000', // Pure Noir - deepest shadows
    softWhite: '#F3F1EC', // Soft White - premium text
    
    // Background hierarchy
    background: '#0B0B0B', // Smoked Black
    surface: '#151515', // Elevated surfaces
    surfaceElevated: '#1A1A1A', // Highest elevation
    
    // Text hierarchy
    text: '#F3F1EC', // Soft White
    textSecondary: '#B9B2A3', // Warm Stone
    textTertiary: '#8A8578', // Muted stone
    
    // Borders and dividers
    border: '#2A2824', // Subtle warm border
    divider: '#1F1F1F', // Soft divider
    
    // Status colors (refined)
    error: '#C8A86A', // Use gold for errors (luxury)
    success: '#D5C4A1',
    warning: '#C8A86A',
    info: '#D5C4A1',
    
    // Overlays and shadows
    overlay: 'rgba(0, 0, 0, 0.75)', // Rich overlay
    shadow: 'rgba(0, 0, 0, 0.4)', // Premium shadow
    
    // Accent for special badges
    accentWine: '#7A1633', // Deep wine (minimal use)
  },
  
  light: {
    // Light mode (for future use)
    primary: '#D5C4A1',
    primaryDark: '#C8A86A',
    primaryLight: '#E5D9C4',
    
    warmStone: '#B9B2A3',
    smokedBlack: '#0B0B0B',
    pureNoir: '#000000',
    softWhite: '#F3F1EC',
    
    background: '#F3F1EC',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAF8',
    
    text: '#0B0B0B',
    textSecondary: '#5A5750',
    textTertiary: '#8A8578',
    
    border: '#E5E0D8',
    divider: '#D5D0C8',
    
    error: '#C8A86A',
    success: '#D5C4A1',
    warning: '#C8A86A',
    info: '#D5C4A1',
    
    overlay: 'rgba(243, 241, 236, 0.95)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    
    accentWine: '#7A1633',
  },
};

export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof colors.dark;
