import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, StatusBar,
  TouchableOpacity, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { Button, Card } from '../components';
import { useAuth } from '../data/AuthContext';
import { getCustomerByAccount } from '../data/customers';
import { sb } from '../api';

export default function TransferScreen({ navigation }) {
  const { customer } = useAuth();
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState(null);

  if (!customer) return null;

  const accounts = customer.accounts || [];

  const formatAmount = (val) => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
    if (parts[1] && parts[1].length > 2) return parts[0] + '.' + parts[1].slice(0, 2);
    return cleaned;
  };

  const lookupAccount = useCallback((val) => {
    setToAccount(val);
    if (val.length >= 4) {
      const found = getCustomerByAccount(val);
      setRecipient(found);
    } else {
      setRecipient(null);
    }
  }, []);

  const handleTransfer = () => {
    if (!fromAccount) { Alert.alert('Error', 'Select a source account'); return; }
    if (!toAccount) { Alert.alert('Error', 'Enter a recipient account number'); return; }
    if (!recipient) { Alert.alert('Error', 'Account not found. Enter a valid Ameris Global account.'); return; }
    if (fromAccount === recipient.account) {
      Alert.alert('Error', 'Cannot transfer to your own account');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Enter a valid amount'); return; }
    const fromAcct = accounts.find(a => a.id === fromAccount);
    if (!fromAcct || fromAcct.balance < parseFloat(amount)) {
      Alert.alert('Error', 'Insufficient funds');
      return;
    }
    if (customer.status === 'restricted') {
      Alert.alert('Transfer Failed', 'Your account has been restricted. Please contact support or customer care for assistance.');
      return;
    }
    setLoading(true);
    const refId = 'TFR-' + Date.now().toString(36).toUpperCase();
    const now = new Date().toISOString();

    const recipientAccount = recipient.accounts ? recipient.accounts[0] : { number: toAccount };
    const toNum = recipientAccount.number || toAccount;

    const transferData = {
      id: refId,
      fromAccount: fromAcct.number,
      fromAccountId: fromAccount,
      fromName: customer.name,
      toAccount: toNum,
      toName: recipient.name,
      toBank: 'Ameris Global',
      amount: parseFloat(amount),
      memo: memo || 'Transfer',
      status: 'pending',
      date: now,
      transferType: 'internal',
    };

    AsyncStorage.getItem('ameris_pending_transfers').then(existing => {
      const pending = existing ? JSON.parse(existing) : [];
      pending.push(transferData);
      return AsyncStorage.setItem('ameris_pending_transfers', JSON.stringify(pending));
    }).catch(() => {});

    sb.insert('applications', {
      id: refId, name: customer.name, type: 'pending_transfer',
      product: 'internal', status: 'pending', date: now,
      phone: JSON.stringify({ fromAccount: fromAcct.number, toAccount: toNum, toName: recipient.name, memo: memo || 'Transfer', amount: parseFloat(amount) })
    }).catch(() => {});

    setLoading(false);
    Alert.alert(
      'Transfer Initiated',
      `${parseFloat(amount).toFixed(2)} transfer to ${recipient.name} is pending approval.\n\nReference: ${refId}\n\nAn admin will review and approve your transfer shortly.`,
      [{ text: 'OK', style: 'default' }]
    );
    setAmount('');
    setMemo('');
    setToAccount('');
    setFromAccount('');
    setRecipient(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.screenTitle}>Send Money</Text>
        <Text style={styles.screenSubtitle}>Transfer to any Ameris Global account</Text>

        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From Account</Text>
            {accounts.map(a => (
              <TouchableOpacity
                key={a.id}
                style={[styles.accountOption, fromAccount === a.id && styles.accountOptionActive]}
                onPress={() => setFromAccount(a.id)}
              >
                <View>
                  <Text style={styles.accountOptionType}>{a.type}</Text>
                  <Text style={styles.accountOptionNumber}>{a.number}</Text>
                </View>
                <Text style={[styles.accountOptionBalance, { color: a.balance < 0 ? colors.error : colors.success }]}>
                  ${Math.abs(a.balance).toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Ameris Global account number"
              placeholderTextColor={colors.textMuted}
              value={toAccount}
              onChangeText={lookupAccount}
              autoCapitalize="none"
            />
            {recipient ? (
              <View style={styles.recipientCard}>
                <View style={styles.recipientAvatar}>
                  <Text style={styles.recipientAvatarText}>{recipient.initials}</Text>
                </View>
                <View>
                  <Text style={styles.recipientName}>{recipient.name}</Text>
                  <Text style={styles.recipientAccount}>{recipient.account}</Text>
                </View>
                <Text style={styles.verifiedBadge}>Verified</Text>
              </View>
            ) : toAccount.length >= 4 ? (
              <Text style={styles.notFound}>Account not found</Text>
            ) : null}
          </View>
        </Card>

        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              placeholder="$0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={v => setAmount(formatAmount(v))}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Memo (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="What's this for?"
              placeholderTextColor={colors.textMuted}
              value={memo}
              onChangeText={setMemo}
            />
          </View>
        </Card>

        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.xxl }}>
          <Button
            title={loading ? 'Processing...' : 'Send Money'}
            variant="primary"
            size="lg"
            onPress={handleTransfer}
            loading={loading}
          />
        </View>
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
    marginBottom: spacing.md,
  },
  inputGroup: { marginBottom: spacing.sm },
  label: {
    ...fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    ...fonts.regular,
  },
  amountInput: {
    fontSize: 24,
    ...fonts.bold,
    textAlign: 'center',
    paddingVertical: 20,
  },
  accountOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.sm,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  accountOptionActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(212,168,67,0.08)',
  },
  accountOptionType: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  accountOptionNumber: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  accountOptionBalance: {
    ...fonts.semiBold,
    fontSize: 14,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: borderRadius.sm,
    padding: 12,
    marginTop: 8,
    gap: 10,
  },
  recipientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientAvatarText: {
    ...fonts.semiBold,
    fontSize: 13,
    color: '#0a1628',
  },
  recipientName: {
    ...fonts.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  recipientAccount: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  verifiedBadge: {
    ...fonts.semiBold,
    fontSize: 11,
    color: colors.success,
    marginLeft: 'auto',
  },
  notFound: {
    ...fonts.regular,
    fontSize: 13,
    color: colors.error,
    marginTop: 6,
  },
});
