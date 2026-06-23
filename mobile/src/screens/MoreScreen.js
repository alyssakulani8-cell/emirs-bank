import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert, Linking, TextInput, Modal } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { Card } from '../components';
import { useAuth } from '../data/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ADMIN_PASSWORD = 'admin123';

const menuItems = [
  {
    section: 'Banking Services',
    items: [
      { icon: '📋', label: 'Open New Account', action: 'openAccount' },
      { icon: '🧮', label: 'Mortgage Calculator', action: 'calculator' },
      { icon: '📄', label: 'Statements', action: 'statements' },
      { icon: '⭐', label: 'Beneficiaries', action: 'beneficiaries' },
    ],
  },
  {
    section: 'Support',
    items: [
      { icon: '💬', label: 'Live Chat', action: 'chat' },
      { icon: '📞', label: 'Call Us', action: 'call' },
      { icon: '✉️', label: 'Contact Us', action: 'contact' },
      { icon: '❓', label: 'FAQs', action: 'faqs' },
    ],
  },
  {
    section: 'Security',
    items: [
      { icon: '🔒', label: 'Security Center', action: 'security' },
      { icon: '🔐', label: 'Change PIN', action: 'pin' },
      { icon: '📱', label: 'Biometric Login', action: 'biometric' },
    ],
  },
  {
    section: 'System',
    items: [
      { icon: '⚙️', label: 'Admin Panel', action: 'admin' },
    ],
  },
  {
    section: 'Legal',
    items: [
      { icon: '📜', label: 'Privacy Policy', action: 'privacy' },
      { icon: '📋', label: 'Terms of Use', action: 'terms' },
      { icon: '🍪', label: 'Cookie Policy', action: 'cookies' },
    ],
  },
];

export default function MoreScreen() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleAdminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setShowAdminModal(false);
      setAdminPass('');
      setAdminError('');
      navigation.navigate('Admin');
    } else {
      setAdminError('Invalid admin password');
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'openAccount':
        navigation.navigate('Apply');
        break;
      case 'call':
        navigation.navigate('Contact');
        break;
      case 'contact':
      case 'chat':
      case 'faqs':
        navigation.navigate('Contact');
        break;
      case 'statements':
        navigation.navigate('Statements');
        break;
      case 'security':
      case 'pin':
      case 'biometric':
        navigation.navigate('SecurityCenter');
        break;
      case 'calculator':
        navigation.navigate('Home');
        break;
      case 'privacy':
      case 'terms':
      case 'cookies':
        Alert.alert('Legal', `View our ${action.replace(/([A-Z])/g, ' $1').trim()} on our website.`);
        break;
      case 'admin':
        setShowAdminModal(true);
        break;
      default:
        if (!isAuthenticated) {
          Alert.alert('Sign In Required', 'Please sign in to access this feature.');
        } else {
          Alert.alert('Coming Soon', `The "${action}" feature is coming soon!`);
        }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.screenTitle}>More</Text>
        <Text style={styles.screenSubtitle}>All banking services and support</Text>

        {menuItems.map((section, sIdx) => (
          <View key={sIdx} style={{ marginBottom: spacing.md }}>
            <Text style={styles.sectionHeader}>{section.section}</Text>
            <Card style={{ marginHorizontal: spacing.md }}>
              {section.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={item.action}
                  style={[styles.menuItem, iIdx < section.items.length - 1 && styles.menuItemBorder]}
                  onPress={() => handleAction(item.action)}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Routing Number</Text>
          <Text style={styles.footerNumber}>061201754</Text>
          <Text style={styles.footerCopy}>Ameris Global © 2026. Member FDIC.</Text>
        </View>
      </ScrollView>

      <Modal visible={showAdminModal} transparent animationType="fade" onRequestClose={() => setShowAdminModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAdminModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Admin Access</Text>
            <Text style={styles.modalSubtitle}>Enter the admin password to access the dashboard</Text>
            <TextInput
              style={styles.adminInput}
              placeholder="Enter admin password"
              placeholderTextColor={colors.textMuted}
              value={adminPass}
              onChangeText={v => { setAdminPass(v); setAdminError(''); }}
              secureTextEntry
              autoFocus
            />
            {adminError ? <Text style={styles.adminError}>{adminError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setShowAdminModal(false); setAdminPass(''); setAdminError(''); }}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalLoginBtn} onPress={handleAdminLogin}>
                <Text style={styles.modalLoginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  sectionHeader: {
    ...fonts.semiBold,
    fontSize: 13,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    ...fonts.medium,
    fontSize: 15,
    color: colors.primary,
  },
  menuArrow: {
    fontSize: 22,
    color: colors.textMuted,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  footerText: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  footerNumber: {
    ...fonts.bold,
    fontSize: 16,
    color: colors.accent,
    marginTop: 4,
    letterSpacing: 2,
  },
  footerCopy: {
    ...fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#0f1d35', borderRadius: borderRadius.lg,
    padding: spacing.lg, borderWidth: 1, borderColor: '#1a2744',
  },
  modalTitle: {
    ...fonts.bold, fontSize: 20, color: colors.white, textAlign: 'center', marginBottom: spacing.xs,
  },
  modalSubtitle: {
    ...fonts.regular, fontSize: 13, color: colors.textMuted,
    textAlign: 'center', marginBottom: spacing.lg,
  },
  adminInput: {
    backgroundColor: colors.inputBg, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: borderRadius.sm, padding: 14, fontSize: 16, color: colors.text,
    ...fonts.regular, textAlign: 'center',
  },
  adminError: {
    ...fonts.medium, fontSize: 13, color: colors.error,
    textAlign: 'center', marginTop: spacing.sm,
  },
  modalActions: {
    flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg,
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
});
