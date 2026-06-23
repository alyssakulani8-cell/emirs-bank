import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, borderRadius, spacing } from '../theme';

const getIcon = (type, desc) => {
  const descLower = (desc || '').toLowerCase();
  if (type === 'credit') return { icon: '↓', bg: '#d1fae5', color: colors.success };
  if (descLower.includes('transfer')) return { icon: '⇄', bg: '#dbeafe', color: colors.info };
  return { icon: '↑', bg: '#fee2e2', color: colors.error };
};

export default function TransactionRow({ transaction }) {
  const { icon, bg, color } = getIcon(transaction.type, transaction.desc);
  const isCredit = transaction.type === 'credit';

  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: bg }]}>
        <Text style={[styles.iconText, { color }]}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.desc} numberOfLines={1}>{transaction.desc}</Text>
        <Text style={styles.meta}>
          {transaction.date} · {transaction.status === 'pending' ? 'Pending' : transaction.receiverName || transaction.senderName}
        </Text>
      </View>
      <Text style={[styles.amount, isCredit ? styles.credit : styles.debit]}>
        {isCredit ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  desc: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  meta: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  amount: {
    ...fonts.semiBold,
    fontSize: 14,
  },
  credit: {
    color: colors.success,
  },
  debit: {
    color: colors.error,
  },
});
