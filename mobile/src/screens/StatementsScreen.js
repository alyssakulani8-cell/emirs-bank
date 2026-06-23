import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { Card } from '../components';
import { useAuth } from '../data/AuthContext';

const mockStatements = [
  {
    id: 'stmt-jun2026',
    month: 'June 2026',
    accounts: [
      { accountName: 'Premium Checking', accountNumber: '****4829', startingBalance: 11250.30, endingBalance: 12480.50, downloadAvailable: true },
      { accountName: 'High-Yield Savings', accountNumber: '****2190', startingBalance: 43800.00, endingBalance: 45200.00, downloadAvailable: true },
    ],
  },
  {
    id: 'stmt-may2026',
    month: 'May 2026',
    accounts: [
      { accountName: 'Premium Checking', accountNumber: '****4829', startingBalance: 13890.00, endingBalance: 11250.30, downloadAvailable: true },
      { accountName: 'High-Yield Savings', accountNumber: '****2190', startingBalance: 42500.00, endingBalance: 43800.00, downloadAvailable: true },
    ],
  },
  {
    id: 'stmt-apr2026',
    month: 'April 2026',
    accounts: [
      { accountName: 'Premium Checking', accountNumber: '****4829', startingBalance: 10200.75, endingBalance: 13890.00, downloadAvailable: true },
      { accountName: 'High-Yield Savings', accountNumber: '****2190', startingBalance: 41200.00, endingBalance: 42500.00, downloadAvailable: true },
    ],
  },
  {
    id: 'stmt-mar2026',
    month: 'March 2026',
    accounts: [
      { accountName: 'Premium Checking', accountNumber: '****4829', startingBalance: 12670.40, endingBalance: 10200.75, downloadAvailable: true },
      { accountName: 'High-Yield Savings', accountNumber: '****2190', startingBalance: 40000.00, endingBalance: 41200.00, downloadAvailable: true },
    ],
  },
  {
    id: 'stmt-feb2026',
    month: 'February 2026',
    accounts: [
      { accountName: 'Premium Checking', accountNumber: '****4829', startingBalance: 14120.60, endingBalance: 12670.40, downloadAvailable: true },
      { accountName: 'High-Yield Savings', accountNumber: '****2190', startingBalance: 38800.00, endingBalance: 40000.00, downloadAvailable: true },
    ],
  },
  {
    id: 'stmt-jan2026',
    month: 'January 2026',
    accounts: [
      { accountName: 'Premium Checking', accountNumber: '****4829', startingBalance: 11500.00, endingBalance: 14120.60, downloadAvailable: true },
      { accountName: 'High-Yield Savings', accountNumber: '****2190', startingBalance: 37500.00, endingBalance: 38800.00, downloadAvailable: true },
    ],
  },
];

const formatCurrency = (amount) => {
  const sign = amount < 0 ? '-$' : '$';
  return sign + Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 });
};

const handleDownload = () => {
  Alert.alert('Download Statement', 'Statement PDF will be downloaded');
};

export default function StatementsScreen() {
  const { customer } = useAuth();

  if (!customer) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.screenTitle}>Statements</Text>
        <Text style={styles.screenSubtitle}>Download your account statements</Text>

        {mockStatements.map((stmt) => (
          <View key={stmt.id} style={styles.monthSection}>
            <Text style={styles.monthLabel}>{stmt.month}</Text>
            <Card style={styles.card}>
              {stmt.accounts.map((acc, idx) => (
                <View
                  key={`${stmt.id}-${acc.accountNumber}`}
                  style={[styles.accountRow, idx < stmt.accounts.length - 1 && styles.accountRowBorder]}
                >
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{acc.accountName}</Text>
                    <Text style={styles.accountNumber}>{acc.accountNumber}</Text>
                    <View style={styles.balanceRow}>
                      <Text style={styles.balanceText}>
                        Start: <Text style={styles.balanceValue}>{formatCurrency(acc.startingBalance)}</Text>
                      </Text>
                      <Text style={styles.balanceText}>
                        End: <Text style={styles.balanceValue}>{formatCurrency(acc.endingBalance)}</Text>
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={handleDownload}
                  >
                    <Text style={styles.downloadIcon}>⬇️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Card>
          </View>
        ))}
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
  monthSection: {
    marginBottom: spacing.md,
  },
  monthLabel: {
    ...fonts.semiBold,
    fontSize: 13,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    marginHorizontal: spacing.md,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  accountRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    ...fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  accountNumber: {
    ...fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 6,
  },
  balanceText: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  balanceValue: {
    ...fonts.semiBold,
    color: colors.primary,
  },
  downloadBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  downloadIcon: {
    fontSize: 20,
  },
});
