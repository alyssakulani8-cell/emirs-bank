import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { AccountCard, TransactionRow, Card } from '../components';
import { useAuth } from '../data/AuthContext';
import { categorize } from '../data/customers';

export default function DashboardScreen({ navigation }) {
  const { customer, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!customer) return null;

  const accounts = customer.accounts || [];
  const transactions = customer.transactions || [];
  const credits = transactions.filter(t => t.type === 'credit');
  const debits = transactions.filter(t => t.type === 'debit');
  const totalIncome = credits.reduce((s, t) => s + t.amount, 0);
  const totalSpending = debits.reduce((s, t) => s + t.amount, 0);
  const savings = totalIncome - totalSpending;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome * 100) : 0;
  const netWorth = accounts.reduce((s, a) => s + a.balance, 0);

  const spendingByCat = {};
  debits.forEach(t => {
    const cat = categorize(t.desc);
    spendingByCat[cat] = (spendingByCat[cat] || 0) + t.amount;
  });
  const maxCat = Math.max(...Object.values(spendingByCat), 1);

  const catLabels = { food: 'Food & Dining', transport: 'Transport', bills: 'Bills & Utilities', shopping: 'Shopping', other: 'Other' };
  const catColors = { food: '#10b981', transport: '#3b82f6', bills: '#f59e0b', shopping: '#8b5cf6', other: '#64748b' };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderOverview = () => (
    <>
      <View style={styles.welcomeSection}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{customer.name.split(' ')[0]}!</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{customer.initials}</Text>
        </View>
      </View>

      <View style={styles.netWorthCard}>
        <Text style={styles.netWorthLabel}>Total Net Worth</Text>
        <Text style={styles.netWorthAmount}>
          ${Math.abs(netWorth).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your Accounts</Text>
      {accounts.map((a) => (
        <AccountCard key={a.id} account={a} />
      ))}

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>+${totalIncome.toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Spending</Text>
          <Text style={[styles.statValue, { color: colors.error }]}>-${totalSpending.toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Saved</Text>
          <Text style={[styles.statValue, { color: colors.accent }]}>{savingsRate.toFixed(0)}%</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Spending Breakdown</Text>
      <Card style={{ marginHorizontal: spacing.md }}>
        {Object.entries(spendingByCat).map(([cat, amount]) => (
          <View key={cat} style={styles.catRow}>
            <View style={styles.catLabelRow}>
              <View style={[styles.catDot, { backgroundColor: catColors[cat] || colors.textMuted }]} />
              <Text style={styles.catLabel}>{catLabels[cat] || cat}</Text>
            </View>
            <View style={styles.catBarWrap}>
              <View style={[styles.catBar, { width: `${(amount / maxCat * 100)}%`, backgroundColor: catColors[cat] || colors.textMuted }]} />
            </View>
            <Text style={styles.catAmount}>${amount.toLocaleString()}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.xl }}>
        {transactions.slice(0, 5).map((t, i) => (
          <TransactionRow key={i} transaction={t} />
        ))}
      </Card>
    </>
  );

  const renderTransactions = () => (
    <>
      <Text style={styles.sectionTitle}>All Transactions</Text>
      <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.xl }}>
        {transactions.map((t, i) => (
          <TransactionRow key={i} transaction={t} />
        ))}
      </Card>
    </>
  );

  const renderInsights = () => (
    <>
      <Text style={styles.sectionTitle}>Insights</Text>
      <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.xl, padding: spacing.lg }}>
        <View style={{ marginBottom: spacing.md }}>
          <Text style={styles.insightLabel}>Monthly Savings Rate</Text>
          <View style={styles.insightBar}>
            <View style={[styles.insightFill, { width: `${Math.min(savingsRate, 100)}%`, backgroundColor: savingsRate > 30 ? colors.success : colors.warning }]} />
          </View>
          <Text style={styles.insightValue}>{savingsRate.toFixed(0)}% saved</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.insightLabel}>Total Income</Text>
            <Text style={[styles.insightNumber, { color: colors.success }]}>+${totalIncome.toLocaleString()}</Text>
          </View>
          <View>
            <Text style={styles.insightLabel}>Total Spending</Text>
            <Text style={[styles.insightNumber, { color: colors.error }]}>-${totalSpending.toLocaleString()}</Text>
          </View>
        </View>
      </Card>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        style={styles.scroll}
      >
        <View style={styles.tabRow}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'transactions', label: 'Transactions' },
            { key: 'insights', label: 'Insights' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'transactions' && renderTransactions()}
        {selectedTab === 'insights' && renderInsights()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  scroll: { flex: 1 },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  greeting: {
    ...fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  userName: {
    ...fonts.bold,
    fontSize: 24,
    color: colors.white,
    marginTop: 2,
  },
  date: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...fonts.bold,
    fontSize: 18,
    color: colors.primary,
  },
  netWorthCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: '#0f1d35',
    borderWidth: 1,
    borderColor: '#1a2744',
  },
  netWorthLabel: {
    ...fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  netWorthAmount: {
    ...fonts.bold,
    fontSize: 32,
    color: colors.accent,
    marginTop: 4,
  },
  sectionTitle: {
    ...fonts.semiBold,
    fontSize: 16,
    color: colors.white,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0f1d35',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    ...fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  statValue: {
    ...fonts.bold,
    fontSize: 16,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: '#0f1d35',
    borderRadius: borderRadius.sm,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.sm - 2,
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    ...fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  activeTabText: {
    color: colors.primary,
    ...fonts.semiBold,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  catLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 110,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  catLabel: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  catBarWrap: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  catBar: {
    height: 6,
    borderRadius: 3,
  },
  catAmount: {
    ...fonts.semiBold,
    fontSize: 12,
    color: colors.text,
    width: 70,
    textAlign: 'right',
  },
  insightLabel: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  insightBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  insightFill: {
    height: 8,
    borderRadius: 4,
  },
  insightValue: {
    ...fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  insightNumber: {
    ...fonts.bold,
    fontSize: 18,
    marginTop: 4,
  },
});
