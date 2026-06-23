import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { Button, Card } from '../components';
import { useAuth } from '../data/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { customer, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (!customer) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: spacing.lg }]}>
        <Text style={{ ...fonts.medium, fontSize: 16, color: colors.textMuted, textAlign: 'center' }}>
          Please sign in to view your profile.
        </Text>
        <Button
          title="Go to Login"
          variant="primary"
          onPress={() => navigation.navigate('Banking')}
          style={{ marginTop: spacing.md }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{customer.initials}</Text>
          </View>
          <Text style={styles.profileName}>{customer.name}</Text>
          <Text style={styles.profileEmail}>{customer.email}</Text>
        </View>

        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Number</Text>
            <Text style={styles.infoValue}>{customer.account}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{customer.dob}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Accounts</Text>
            <Text style={styles.infoValue}>{customer.accounts?.length || 0}</Text>
          </View>
        </Card>

        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <Text style={styles.sectionLabel}>Account Summary</Text>
          {(customer.accounts || []).map((a, i) => (
            <View key={a.id}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.accountRow}>
                <View>
                  <Text style={styles.accountName}>{a.type}</Text>
                  <Text style={styles.accountNumber}>{a.number}</Text>
                </View>
                <Text style={[styles.accountBalance, a.balance < 0 && { color: colors.error }]}>
                  {a.balance < 0 ? '-$' : '$'}{Math.abs(a.balance).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.xxl }}>
          <Button title="Sign Out" variant="danger" size="lg" onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  scroll: { flex: 1 },
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarLargeText: {
    ...fonts.bold,
    fontSize: 32,
    color: colors.primary,
  },
  profileName: {
    ...fonts.bold,
    fontSize: 22,
    color: colors.white,
  },
  profileEmail: {
    ...fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  sectionLabel: {
    ...fonts.semiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    ...fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    ...fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 4,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  accountName: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.primary,
  },
  accountNumber: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  accountBalance: {
    ...fonts.bold,
    fontSize: 16,
    color: colors.success,
  },
});
