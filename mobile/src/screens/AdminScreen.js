import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity,
  RefreshControl, Alert, Modal, TextInput, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { Button, Card } from '../components';
import { CUSTOMER_DB, SEED_USERS } from '../data/customers';
import { sb } from '../api';

const STATS = [
  { icon: '💰', label: 'Total Assets', value: '$26.5B', change: '+3.2%', color: colors.info },
  { icon: '👥', label: 'Active Customers', value: '502.4K', change: '+1.8%', color: colors.success },
  { icon: '📊', label: 'Loan Portfolio', value: '$1.8B', change: '+5.4%', color: colors.accent },
  { icon: '✅', label: 'Approval Rate', value: '98.7%', change: '+0.5%', color: colors.success },
];

const safe = (val) => {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

export default function AdminScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [applications, setApplications] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showAppModal, setShowAppModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passOverrides, setPassOverrides] = useState({});

  const loadPassOverrides = async () => {
    try {
      const stored = await AsyncStorage.getItem('ameris_pass_overrides');
      if (stored) setPassOverrides(JSON.parse(stored));
    } catch (e) {}
  };

  const getEffectivePassword = (username) => {
    if (passOverrides[username]) return passOverrides[username];
    return SEED_USERS[username]?.password || '-';
  };

  const handleResetPassword = async () => {
    if (!passwordTarget || !newPassword.trim()) return;
    if (newPassword.trim().length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    const updated = { ...passOverrides, [passwordTarget]: newPassword.trim() };
    setPassOverrides(updated);
    await AsyncStorage.setItem('ameris_pass_overrides', JSON.stringify(updated));
    setShowPasswordModal(false);
    setNewPassword('');
    setPasswordTarget(null);
    Alert.alert('Success', `Password for "${passwordTarget}" has been updated`);
  };

  const totalBalance = (customer) =>
    customer.accounts.reduce((sum, a) => sum + a.balance, 0);

  const fromSB = (rec) => {
    if (!rec || typeof rec !== 'object') return rec
    const out = {}
    const map = {
      annualincome: 'annualIncome', initialdeposit: 'initialDeposit',
      employmentstatus: 'employmentStatus', idtype: 'idType', idnumber: 'idNumber',
      fromaccount: 'fromAccount', fromname: 'fromName', toaccount: 'toAccount',
      toname: 'toName', tobank: 'toBank', transfertype: 'transferType',
      fromaccountid: 'fromAccountId',
    }
    Object.entries(rec).forEach(([k, v]) => {
      const key = map[k.toLowerCase()] || k
      if (key === 'fid') out.id = v
      else out[key] = v
    })
    if (!out.id && rec.fid) out.id = rec.fid
    if (out.phone && typeof out.phone === 'string') {
      try {
        const parsed = JSON.parse(out.phone)
        Object.entries(parsed).forEach(([k, v]) => { if (!out[k]) out[k] = v })
      } catch (e) {}
    }
    return out
  }

  const loadData = async () => {
    try {
      const remote = await sb.list('applications')
      if (Array.isArray(remote) && remote.length > 0) {
        const all = remote.map(fromSB)
        setApplications(all.filter(r => r.type === 'Account Opening'))
        setTransfers(all.filter(r => r.type === 'pending_transfer'))
        setMessages(all.filter(r => r.type === 'contact_submission'))
        return
      }
    } catch (e) {}
    try {
      let apps = JSON.parse(await AsyncStorage.getItem('ameris_applications') || '[]');
      let tfrs = JSON.parse(await AsyncStorage.getItem('ameris_pending_transfers') || '[]');
      let msgs = JSON.parse(await AsyncStorage.getItem('ameris_contact_messages') || '[]');
      apps = Array.isArray(apps) ? apps : [];
      tfrs = Array.isArray(tfrs) ? tfrs : [];
      msgs = Array.isArray(msgs) ? msgs : [];
      setApplications(apps);
      setTransfers(tfrs);
      setMessages(msgs);
    } catch (e) {}
  };

  useEffect(() => { loadData(); loadPassOverrides(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const syncToSB = (records, type, storageKey) => {
    sb.upsert('applications', records.map(r => ({ ...r, type })), 'id').catch(() => {})
    AsyncStorage.setItem(storageKey, JSON.stringify(records)).catch(() => {})
  }

  const approveTransfer = async (refId) => {
    const updated = transfers.filter(t => t.id !== refId);
    setTransfers(updated);
    sb.update('applications', 'id', refId, { status: 'approved' }).catch(() => {})
    await AsyncStorage.setItem('ameris_pending_transfers', JSON.stringify(updated));
    Alert.alert('Approved', 'Transfer has been approved');
  };

  const rejectTransfer = async (refId) => {
    const updated = transfers.filter(t => t.id !== refId);
    setTransfers(updated);
    sb.update('applications', 'id', refId, { status: 'rejected' }).catch(() => {})
    await AsyncStorage.setItem('ameris_pending_transfers', JSON.stringify(updated));
    Alert.alert('Rejected', 'Transfer has been rejected');
  };

  const approveApp = async (id) => {
    const updated = applications.map(a => a.id === id ? { ...a, status: 'approved' } : a);
    setApplications(updated);
    sb.update('applications', 'id', id, { status: 'approved' }).catch(() => {})
    await AsyncStorage.setItem('ameris_applications', JSON.stringify(updated));
    setShowAppModal(false);
    Alert.alert('Approved', 'Application has been approved');
  };

  const rejectApp = async (id) => {
    const updated = applications.map(a => a.id === id ? { ...a, status: 'rejected' } : a);
    setApplications(updated);
    sb.update('applications', 'id', id, { status: 'rejected' }).catch(() => {})
    await AsyncStorage.setItem('ameris_applications', JSON.stringify(updated));
    setShowAppModal(false);
    Alert.alert('Rejected', 'Application has been rejected');
  };

  const pendingApps = applications.filter(a => a.status === 'pending');
  const unreadMsgs = messages.filter(m => m.status === 'unread');
  const totalPending = pendingApps.length + transfers.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#060e1a" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerBadge}>System Dashboard</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <TouchableOpacity key={i} style={styles.statCard} onPress={() => Alert.alert(s.label, `${s.label}: ${s.value} (${s.change})`)}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statChange, { color: s.color }]}>{s.change}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pending Summary */}
        <View style={styles.summaryRow}>
          <TouchableOpacity style={[styles.summaryCard, { borderLeftColor: colors.accent }]}
            onPress={() => Alert.alert('Pending Applications', `${pendingApps.length} application(s) awaiting review`)}>
            <Text style={styles.summaryNumber}>{pendingApps.length}</Text>
            <Text style={styles.summaryLabel}>Pending Applications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.summaryCard, { borderLeftColor: colors.info }]}
            onPress={() => Alert.alert('Pending Transfers', `${transfers.length} transfer(s) awaiting approval`)}>
            <Text style={styles.summaryNumber}>{transfers.length}</Text>
            <Text style={styles.summaryLabel}>Pending Transfers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.summaryCard, { borderLeftColor: colors.error }]}
            onPress={() => Alert.alert('Unread Messages', `${unreadMsgs.length} message(s) unread`)}>
            <Text style={styles.summaryNumber}>{unreadMsgs.length}</Text>
            <Text style={styles.summaryLabel}>Unread Messages</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Applications */}
        <Text style={styles.sectionTitle}>Pending Applications</Text>
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          {pendingApps.length === 0 ? (
            <Text style={styles.emptyText}>No pending applications</Text>
          ) : (
            pendingApps.map((a, i) => (
              <TouchableOpacity key={a.id} style={[styles.listItem, i < pendingApps.length - 1 && styles.listItemBorder]}
                onPress={() => { setSelectedApp(a); setShowAppModal(true); }}>
                <View style={styles.listItemLeft}>
                  <Text style={styles.listItemName}>{safe(a.name)}</Text>
                  <Text style={styles.listItemMeta}>{safe(a.product)} · {safe(a.date)}</Text>
                </View>
                <Text style={styles.listItemArrow}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </Card>

        {/* Pending Transfers */}
        <Text style={styles.sectionTitle}>Pending Transfers</Text>
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          {transfers.length === 0 ? (
            <Text style={styles.emptyText}>No pending transfers</Text>
          ) : (
            transfers.map((t, i) => (
              <TouchableOpacity key={t.id} style={[styles.transferItem, i < transfers.length - 1 && styles.listItemBorder]}
                onPress={() => { setSelectedTransfer(t); setShowTransferModal(true); }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.transferAmount}>${safe(t.amount ? parseFloat(t.amount).toFixed(2) : '0.00')}</Text>
                  <Text style={styles.transferMeta}>To: {safe(t.toName)} · Ref: {safe(t.id)}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => approveTransfer(t.id)}>
                    <Text style={styles.approveText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectTransfer(t.id)}>
                    <Text style={styles.rejectText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Card>

        {/* Customers */}
        <Text style={styles.sectionTitle}>Customer Management</Text>
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          {CUSTOMER_DB.map((c, i) => (
            <TouchableOpacity key={c.account} style={[styles.listItem, i < CUSTOMER_DB.length - 1 && styles.listItemBorder]}
              onPress={() => { setSelectedCustomer(c); setShowCustomerModal(true); }}>
              <View style={[styles.msgDot, { backgroundColor: colors.accent }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemName}>{c.name}</Text>
                <Text style={styles.listItemMeta}>{c.email} · {c.account}</Text>
              </View>
              <Text style={styles.listItemArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Recent Messages */}
        <Text style={styles.sectionTitle}>Recent Messages</Text>
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.xxl }}>
          {messages.length === 0 ? (
            <Text style={styles.emptyText}>No messages yet</Text>
          ) : (
            messages.slice(0, 5).map((m, i) => (
              <TouchableOpacity key={m.id} style={[styles.listItem, i < Math.min(messages.length, 5) - 1 && styles.listItemBorder]}
                onPress={() => { setSelectedMsg(m); setShowMsgModal(true); }}>
                <View style={[styles.msgDot, m.status === 'unread' && styles.msgDotUnread]} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.listItemName}>{safe(m.name)}</Text>
                    <Text style={{ ...fonts.regular, fontSize: 11, color: colors.textMuted }}>{safe(m.date)}</Text>
                  </View>
                  <Text style={styles.listItemMeta} numberOfLines={1}>{safe(m.subject)}: {safe(m.message)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Card>
      </ScrollView>

      {/* Application Detail Modal */}
      <Modal visible={showAppModal} transparent animationType="fade" onRequestClose={() => setShowAppModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedApp && (
              <>
                <Text style={styles.modalTitle}>Application Details</Text>
                <View style={styles.detailGrid}>
                  {[
                    ['Name', selectedApp.name],
                    ['Product', selectedApp.product],
                    ['Status', selectedApp.status],
                    ['Date', selectedApp.date],
                    ['Email', selectedApp.email],
                    ['Type', selectedApp.type],
                  ].map(([l, v]) => (
                    <View key={l} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{l}</Text>
                      <Text style={styles.detailValue}>{safe(v)}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectApp(selectedApp.id)}>
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveBtnModal} onPress={() => approveApp(selectedApp.id)}>
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowAppModal(false)}>
              <Text style={{ ...fonts.medium, fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Message Detail Modal */}
      <Modal visible={showMsgModal} transparent animationType="fade" onRequestClose={() => setShowMsgModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMsgModal(false)}>
          <View style={styles.modalContent}>
            {selectedMsg && (
              <>
                <Text style={styles.modalTitle}>Message Details</Text>
                <View style={styles.detailGrid}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>From</Text>
                    <Text style={styles.detailValue}>{safe(selectedMsg.name)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{safe(selectedMsg.email)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Subject</Text>
                    <Text style={styles.detailValue}>{safe(selectedMsg.subject)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{safe(selectedMsg.date)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={[styles.detailValue, { color: selectedMsg.status === 'unread' ? colors.accent : colors.textMuted }]}>{safe(selectedMsg.status)}</Text>
                  </View>
                </View>
                <Text style={{ ...fonts.semiBold, fontSize: 13, color: colors.textMuted, marginBottom: 6 }}>Message</Text>
                <Text style={{ ...fonts.regular, fontSize: 14, color: colors.text, lineHeight: 22 }}>{safe(selectedMsg.message)}</Text>
              </>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowMsgModal(false)}>
              <Text style={{ ...fonts.medium, fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Transfer Detail Modal */}
      <Modal visible={showTransferModal} transparent animationType="fade" onRequestClose={() => setShowTransferModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTransferModal(false)}>
          <View style={styles.modalContent}>
            {selectedTransfer && (
              <>
                <Text style={styles.modalTitle}>Transfer Details</Text>
                <View style={styles.detailGrid}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={[styles.detailValue, { color: colors.accent }]}>${safe(selectedTransfer.amount ? parseFloat(selectedTransfer.amount).toFixed(2) : '0.00')}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>From</Text>
                    <Text style={styles.detailValue}>{safe(selectedTransfer.fromName)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>To</Text>
                    <Text style={styles.detailValue}>{safe(selectedTransfer.toName)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Account</Text>
                    <Text style={styles.detailValue}>{safe(selectedTransfer.toAccount)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Reference</Text>
                    <Text style={styles.detailValue}>{safe(selectedTransfer.id)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Memo</Text>
                    <Text style={styles.detailValue}>{safe(selectedTransfer.memo)}</Text>
                  </View>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => { rejectTransfer(selectedTransfer.id); setShowTransferModal(false); }}>
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveBtnModal} onPress={() => { approveTransfer(selectedTransfer.id); setShowTransferModal(false); }}>
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowTransferModal(false)}>
              <Text style={{ ...fonts.medium, fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Customer Detail Modal */}
      <Modal visible={showCustomerModal} transparent animationType="fade" onRequestClose={() => setShowCustomerModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCustomerModal(false)}>
          <View style={styles.modalContent}>
            {selectedCustomer && (
              <>
                <Text style={styles.modalTitle}>{selectedCustomer.name}</Text>
                <View style={styles.detailGrid}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Account</Text>
                    <Text style={styles.detailValue}>{selectedCustomer.account}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{selectedCustomer.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>DOB</Text>
                    <Text style={styles.detailValue}>{selectedCustomer.dob}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Balance</Text>
                    <Text style={[styles.detailValue, { color: colors.accent }]}>${totalBalance(selectedCustomer).toLocaleString()}</Text>
                  </View>
                </View>
                <Text style={{ ...fonts.semiBold, fontSize: 13, color: colors.textMuted, marginBottom: 8 }}>Accounts</Text>
                {selectedCustomer.accounts.map((acct, i) => (
                  <View key={acct.id} style={[styles.listItem, i < selectedCustomer.accounts.length - 1 && styles.listItemBorder]}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...fonts.medium, fontSize: 14, color: colors.text }}>{acct.type}</Text>
                      <Text style={{ ...fonts.regular, fontSize: 12, color: colors.textMuted }}>{acct.number}</Text>
                    </View>
                    <Text style={{ ...fonts.bold, fontSize: 15, color: acct.balance < 0 ? colors.error : colors.success }}>
                      ${Math.abs(acct.balance).toLocaleString()}
                    </Text>
                  </View>
                ))}
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.approveBtnModal} onPress={() => {
                    const username = Object.keys(SEED_USERS).find(u => SEED_USERS[u].account === selectedCustomer.account);
                    if (username) { setPasswordTarget(username); setShowPasswordModal(true); }
                  }}>
                    <Text style={styles.approveBtnText}>Reset Password</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCustomerModal(false)}>
              <Text style={{ ...fonts.medium, fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Password Reset Modal */}
      <Modal visible={showPasswordModal} transparent animationType="fade" onRequestClose={() => setShowPasswordModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            {passwordTarget && (
              <>
                <Text style={{ ...fonts.regular, fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md }}>
                  Changing password for <Text style={{ color: colors.accent }}>{passwordTarget}</Text>
                </Text>
                <Text style={{ ...fonts.regular, fontSize: 12, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md }}>
                  Current: {getEffectivePassword(passwordTarget)}
                </Text>
                <TextInput
                  style={styles.adminInput}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textMuted}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoFocus
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowPasswordModal(false)}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalLoginBtn} onPress={handleResetPassword}>
                    <Text style={styles.modalLoginText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060e1a' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingTop: Platform.OS === 'ios' ? 60 : spacing.xl,
    paddingBottom: spacing.md, backgroundColor: '#0a1628', borderBottomWidth: 1, borderBottomColor: '#1a2744',
  },
  backBtn: { width: 60 },
  backText: { ...fonts.medium, fontSize: 16, color: colors.accent },
  headerTitle: { ...fonts.bold, fontSize: 20, color: colors.white, textAlign: 'center' },
  headerBadge: { ...fonts.regular, fontSize: 11, color: colors.accent, textAlign: 'center', opacity: 0.7 },
  statsRow: {
    flexDirection: 'row', flexWrap: 'wrap', padding: spacing.sm, gap: spacing.sm,
  },
  statCard: {
    width: '47%', backgroundColor: '#0f1d35', borderRadius: borderRadius.md,
    padding: spacing.md, borderWidth: 1, borderColor: '#1a2744',
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { ...fonts.bold, fontSize: 20, color: colors.white },
  statLabel: { ...fonts.regular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  statChange: { ...fonts.semiBold, fontSize: 11, marginTop: 4 },
  summaryRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  summaryCard: {
    flex: 1, backgroundColor: '#0f1d35', borderRadius: borderRadius.sm,
    padding: spacing.md, borderLeftWidth: 3, borderWidth: 1, borderColor: '#1a2744',
  },
  summaryNumber: { ...fonts.bold, fontSize: 22, color: colors.white },
  summaryLabel: { ...fonts.regular, fontSize: 10, color: colors.textMuted, marginTop: 2 },
  sectionTitle: {
    ...fonts.semiBold, fontSize: 15, color: colors.white,
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 10 },
  listItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  listItemLeft: { flex: 1 },
  listItemName: { ...fonts.medium, fontSize: 14, color: colors.text },
  listItemMeta: { ...fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  listItemArrow: { fontSize: 20, color: colors.textMuted },
  emptyText: { ...fonts.regular, fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
  transferItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 10 },
  transferAmount: { ...fonts.bold, fontSize: 16, color: colors.accent },
  transferMeta: { ...fonts.regular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  approveBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#d1fae5',
    alignItems: 'center', justifyContent: 'center',
  },
  approveText: { ...fonts.bold, fontSize: 14, color: colors.success },
  rejectBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#fee2e2',
    alignItems: 'center', justifyContent: 'center',
  },
  rejectText: { ...fonts.bold, fontSize: 14, color: colors.error },
  adminInput: {
    backgroundColor: colors.inputBg, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: borderRadius.sm, padding: 14, fontSize: 16, color: colors.text,
    ...fonts.regular, textAlign: 'center',
  },
  modalCancelBtn: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderRadius: borderRadius.sm, borderWidth: 1.5, borderColor: colors.border,
  },
  modalCancelText: { ...fonts.semiBold, fontSize: 15, color: colors.textMuted },
  modalLoginBtn: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderRadius: borderRadius.sm, backgroundColor: colors.accent,
  },
  modalLoginText: { ...fonts.semiBold, fontSize: 15, color: colors.primary },
  approveBtnModal: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderRadius: borderRadius.sm, backgroundColor: colors.success,
  },
  approveBtnText: { ...fonts.bold, fontSize: 15, color: colors.white },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#0f1d35', borderRadius: borderRadius.lg,
    padding: spacing.lg, borderWidth: 1, borderColor: '#1a2744', maxHeight: '80%',
  },
  modalTitle: { ...fonts.bold, fontSize: 18, color: colors.white, marginBottom: spacing.md, textAlign: 'center' },
  detailGrid: { marginBottom: spacing.md },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  detailLabel: { ...fonts.regular, fontSize: 13, color: colors.textMuted },
  detailValue: { ...fonts.semiBold, fontSize: 13, color: colors.text },
  modalActions: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  closeBtn: { paddingVertical: 8 },
  msgDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.textMuted },
  msgDotUnread: { backgroundColor: colors.accent },
});
