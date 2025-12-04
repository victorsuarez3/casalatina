/**
 * Chat Screen (placeholder)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/Header';

export const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Header title="Chat" />
      <View style={styles.content}>
        <Text style={styles.text}>Chat Screen</Text>
        <Text style={styles.subtext}>Coming soon...</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  text: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});


