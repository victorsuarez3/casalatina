/**
 * Casa Latina Ultra-Premium Theme Configuration
 * Complete design system for luxury experience
 */

import { colors, ColorScheme, ThemeColors } from './colors';
import { typography, TypographyVariant } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export interface Theme {
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  isDark: boolean;
}

export const createTheme = (scheme: ColorScheme = 'dark'): Theme => ({
  colors: colors[scheme],
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: scheme === 'dark',
});

export const darkTheme = createTheme('dark');
export const lightTheme = createTheme('light');

export type { TypographyVariant, ColorScheme };
