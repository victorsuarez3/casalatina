/**
 * CategoryFilter component for filtering events by category
 * Enhanced with smooth animations
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Category {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = category.id === selectedCategory;
        const scaleAnim = React.useRef(new Animated.Value(1)).current;
        
        const handlePressIn = () => {
          Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            damping: 15,
          }).start();
        };

        const handlePressOut = () => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            damping: 15,
          }).start();
        };

        return (
          <Animated.View
            key={category.id}
            style={[
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.pill,
                isSelected && styles.pillSelected,
              ]}
              onPress={() => onSelectCategory(category.id)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  pill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  pillSelected: {
    backgroundColor: theme.colors.softCream,
    borderColor: theme.colors.softCream,
    ...theme.shadows.sm,
  },
  pillText: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
  pillTextSelected: {
    color: theme.colors.pureBlack,
    fontWeight: '600',
  },
});
