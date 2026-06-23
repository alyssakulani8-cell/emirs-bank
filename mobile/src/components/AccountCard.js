import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, borderRadius, spacing, shadows } from '../theme';
import Card from './Card';

export default function AccountCard({ account, onPress, frozen }) {
  const isNegative = account.balance < 0;

  return (
    <TouchableOpacity onPress={() => onPress?.(account)} activeOpacity={0.8}>
      <Card style={[styles.card, frozen && styles.frozen]}>
        <View style={styles.top}>
          <Text style={styles.type}>{account.type}</Text>
          {frozen && <Text style={styles.frozenTag}>Frozen</Text>}
        </View>
        <Text style={styles.number}>{account.number}</Text>
        <Text style={[styles.balance, isNegative && styles.negative]}>
          {isNegative ? '-$' : '$'}
          {Math.abs(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.label}>{isNegative ? 'Outstanding' : 'Balance'}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  frozen: {
    opacity: 0.7,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    ...fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  frozenTag: {
    ...fonts.semiBold,
    fontSize: 11,
    color: colors.error,
  },
  number: {
    ...fonts.regular,
    fontSize: 16,
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: 4,
  },
  balance: {
    ...fonts.bold,
    fontSize: 28,
    color: colors.primary,
    marginTop: 8,
  },
  negative: {
    color: colors.error,
  },
  label: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
