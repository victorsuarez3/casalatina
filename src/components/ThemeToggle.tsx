/**
 * Theme Toggle Component - Example of how to switch between dark/light mode
 * You can add this to your settings screen or header
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colorScheme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Ionicons
        name={colorScheme === 'dark' ? 'sunny' : 'moon'}
        size={24}
        color={theme.colors.text}
      />
      <Text style={styles.text}>
        {colorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  text: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
});


