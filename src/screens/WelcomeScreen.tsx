/**
 * Welcome Screen
 * Placeholder screen for unauthenticated users
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const WelcomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});



