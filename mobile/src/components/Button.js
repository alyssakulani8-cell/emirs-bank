import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, fonts, borderRadius, spacing, shadows } from '../theme';

export default function Button({
  title, onPress, variant = 'primary', size = 'md', loading, disabled, icon, style, textStyle,
}) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        isDanger && styles.danger,
        isSmall && styles.small,
        isLarge && styles.large,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.accent : colors.white} size="small" />
      ) : (
        <Text style={[
          styles.text,
          isPrimary && styles.primaryText,
          isOutline && styles.outlineText,
          isDanger && styles.dangerText,
          isSmall && styles.smallText,
          isLarge && styles.largeText,
          disabled && styles.disabledText,
          textStyle,
        ]}>
          {icon} {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    gap: 8,
  },
  primary: {
    backgroundColor: colors.accent,
    ...shadows.md,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  danger: {
    backgroundColor: colors.error,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.sm,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: borderRadius.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...fonts.semiBold,
    fontSize: 15,
  },
  primaryText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.accent,
  },
  dangerText: {
    color: colors.white,
  },
  smallText: {
    fontSize: 13,
  },
  largeText: {
    fontSize: 17,
  },
  disabledText: {
    opacity: 0.7,
  },
});
