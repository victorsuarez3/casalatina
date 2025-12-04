/**
 * Casa Latina Ultra-Premium Typography System
 * Editorial-grade typography inspired by high-end magazines
 * Cormorant Garamond for titles, SF Pro/Inter for body
 */

export const typography = {
  // Hero Titles - Cormorant Garamond Bold
  heroTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: -0.3,
  },
  
  // Section Titles - Cormorant Garamond SemiBold
  sectionTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 26,
    fontWeight: '600' as const,
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  
  // Subsection Titles
  subsectionTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 30,
    letterSpacing: -0.1,
  },
  
  // Body - SF Pro Text / Inter (Light to Medium)
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  
  bodyMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  
  bodySmall: {
    fontFamily: 'Inter_300Light',
    fontSize: 14,
    fontWeight: '300' as const,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  
  // Labels and Metadata
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  
  labelSmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  
  // Buttons - Weight 600 but not heavy
  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  
  // Caption
  caption: {
    fontFamily: 'Inter_300Light',
    fontSize: 11,
    fontWeight: '300' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  
  // Legacy support (will be deprecated)
  headingXL: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: -0.3,
  },
  headingL: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 26,
    fontWeight: '600' as const,
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  headingM: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 30,
    letterSpacing: -0.1,
  },
};

export type TypographyVariant = keyof typeof typography;
