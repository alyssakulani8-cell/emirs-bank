import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../theme';

export default function Card({ children, style, variant = 'elevated' }) {
  return (
    <View style={[
      styles.card,
      variant === 'elevated' && shadows.md,
      variant === 'outlined' && styles.outlined,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
});
