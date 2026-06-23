import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert,
} from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { Card } from '../components';
import { useAuth } from '../data/AuthContext';

export default function CardsScreen() {
  const { customer } = useAuth();
  const [frozenCards, setFrozenCards] = useState({});

  if (!customer) return null;
  const accounts = customer.accounts || [];

  const toggleFreeze = (id) => {
    setFrozenCards(prev => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.screenTitle}>Cards & Accounts</Text>
        <Text style={styles.screenSubtitle}>Manage your cards, freeze/unfreeze, and view details</Text>

        {accounts.map((a, idx) => {
          const isFrozen = frozenCards[a.id];
          return (
            <Card key={a.id} style={[styles.cardItem, isFrozen && styles.frozen, { marginBottom: idx < accounts.length - 1 ? spacing.md : spacing.xxl }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: isFrozen ? '#1a1a2e' : '#1a2a4a' }]}>
                  <Text style={styles.cardIconText}>💳</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardType}>{a.type}</Text>
                  <Text style={styles.cardNumber}>{a.number}</Text>
                </View>
                {isFrozen && <Text style={styles.frozenBadge}>FROZEN</Text>}
              </View>

              <View style={styles.cardBalance}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={[styles.balanceAmount, a.balance < 0 && { color: colors.error }]}>
                  {a.balance < 0 ? '-$' : '$'}{Math.abs(a.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, isFrozen ? styles.actionUnfreeze : styles.actionFreeze]}
                  onPress={() => toggleFreeze(a.id)}
                >
                  <Text style={[styles.actionText, { color: isFrozen ? colors.success : colors.error }]}>
                    {isFrozen ? '🔓 Unfreeze' : '❄️ Freeze'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionSecondary]}
                  onPress={() => Alert.alert('Coming Soon', 'Card settings and limits coming soon!')}
                >
                  <Text style={[styles.actionText, { color: colors.textSecondary }]}>⚙️ Settings</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  scroll: { flex: 1 },
  screenTitle: {
    ...fonts.bold,
    fontSize: 24,
    color: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  screenSubtitle: {
    ...fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  cardItem: {
    marginHorizontal: spacing.md,
  },
  frozen: {
    opacity: 0.75,
    borderWidth: 1,
    borderColor: colors.error,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardType: {
    ...fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  cardNumber: {
    ...fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  frozenBadge: {
    ...fonts.bold,
    fontSize: 10,
    color: colors.error,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  cardBalance: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  balanceLabel: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  balanceAmount: {
    ...fonts.bold,
    fontSize: 24,
    color: colors.primary,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  actionFreeze: {
    backgroundColor: '#fef2f2',
  },
  actionUnfreeze: {
    backgroundColor: '#d1fae5',
  },
  actionSecondary: {
    backgroundColor: colors.borderLight,
  },
  actionText: {
    ...fonts.semiBold,
    fontSize: 13,
  },
});
