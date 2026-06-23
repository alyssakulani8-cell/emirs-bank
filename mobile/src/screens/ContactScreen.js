import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, StatusBar,
  TouchableOpacity, Alert, Modal, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { Button, Card } from '../components';
import { sb } from '../api';

const SUBJECTS = [
  'Personal Banking', 'Business Banking', 'Mortgage & Home Loans',
  'Wealth Management', 'Personal Loans', 'Fraud Protection',
  'Account Inquiry', 'Lost or Stolen Card', 'Loan Application',
  'Technical Support', 'General Question', 'Complaint',
];

const formatPhone = (val) => {
  const nums = val.replace(/[^0-9]/g, '');
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `(${nums.slice(0, 3)}) ${nums.slice(3)}`;
  return `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6, 10)}`;
};

export default function ContactScreen({ route, navigation }) {
  const initialSubject = route?.params?.subject || '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Please enter your name'); return; }
    if (!email.trim() || !isValidEmail(email)) { Alert.alert('Error', 'Please enter a valid email address'); return; }
    if (!subject) { Alert.alert('Error', 'Please select a subject'); return; }
    if (!message.trim()) { Alert.alert('Error', 'Please enter your message'); return; }

    setLoading(true);
    const refId = 'MSG-' + String(Date.now()).slice(-6);
    const data = {
      id: refId, name: name.trim(), email: email.trim(),
      subject, message: message.trim(), status: 'unread',
      date: new Date().toISOString().split('T')[0],
      source: 'mobile',
    };

    try {
      const existing = JSON.parse(await AsyncStorage.getItem('ameris_contact_messages') || '[]');
      existing.push(data);
      await AsyncStorage.setItem('ameris_contact_messages', JSON.stringify(existing));
      sb.insert('applications', {
        id: refId, name: data.name, type: 'contact_submission',
        product: subject, status: 'unread', date: data.date,
        email: data.email, phone: JSON.stringify({ message: data.message }),
      }).catch(() => {});
      setSubmitted(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✉️</Text>
          <Text style={styles.successTitle}>Message Sent!</Text>
          <Text style={styles.successMsg}>
            Thank you for contacting Ameris Global. Our team will review your inquiry and respond within 1-2 business days.
          </Text>
          <Button title="Back to Home" variant="primary" size="lg" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.heroSection}>
          <Text style={styles.heroBadge}>We're Here to Help</Text>
          <Text style={styles.heroTitle}>Get in <Text style={{ color: colors.accent }}>Touch</Text></Text>
          <Text style={styles.heroDesc}>
            Have a question, concern, or feedback? Send us a message and we'll get back to you within 1-2 business days.
          </Text>
        </View>

        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name <Text style={{ color: colors.error }}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={colors.textMuted}
              value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email <Text style={{ color: colors.error }}>*</Text></Text>
            <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor={colors.textMuted}
              value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject <Text style={{ color: colors.error }}>*</Text></Text>
            <TouchableOpacity style={styles.picker} onPress={() => setShowSubjectPicker(true)}>
              <Text style={[styles.pickerText, !subject && styles.pickerPlaceholder]}>
                {subject || 'Select a topic...'}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message <Text style={{ color: colors.error }}>*</Text></Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="How can we help you?"
              placeholderTextColor={colors.textMuted} value={message} onChangeText={setMessage}
              multiline numberOfLines={4} textAlignVertical="top" />
          </View>

          <Button title={loading ? 'Sending...' : 'Send Message'} variant="primary" size="lg"
            onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.sm }} />
        </Card>

        <View style={styles.altContactSection}>
          <Text style={styles.altTitle}>Other ways to reach us</Text>
          <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
            <TouchableOpacity style={styles.altRow} onPress={() => Linking.openURL('tel:18002637474')}>
              <Text style={styles.altIcon}>📞</Text>
              <View>
                <Text style={styles.altLabel}>Call Us</Text>
                <Text style={styles.altValue}>1-800-AMERIS-GLOBAL</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.altDivider} />
            <TouchableOpacity style={styles.altRow} onPress={() => Linking.openURL('mailto:support.amerisglobal@gmail.com')}>
              <Text style={styles.altIcon}>✉️</Text>
              <View>
                <Text style={styles.altLabel}>Email Us</Text>
                <Text style={styles.altValue}>support.amerisglobal@gmail.com</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.altDivider} />
            <View style={styles.altRow}>
              <Text style={styles.altIcon}>🏢</Text>
              <View>
                <Text style={styles.altLabel}>Visit Us</Text>
                <Text style={styles.altValue}>245 Main Street, Atlanta, GA 30303</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      <Modal visible={showSubjectPicker} transparent animationType="fade" onRequestClose={() => setShowSubjectPicker(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSubjectPicker(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Subject</Text>
            <ScrollView style={styles.modalList}>
              {SUBJECTS.map((s, i) => (
                <TouchableOpacity key={i} style={[styles.modalOption, subject === s && styles.modalOptionActive]}
                  onPress={() => { setSubject(s); setShowSubjectPicker(false); }}>
                  <Text style={[styles.modalOptionText, subject === s && styles.modalOptionTextActive]}>{s}</Text>
                  {subject === s && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingTop: Platform.OS === 'ios' ? 60 : spacing.xl,
    paddingBottom: spacing.md,
  },
  backBtn: { width: 60 },
  backText: { ...fonts.medium, fontSize: 16, color: colors.accent },
  headerTitle: { ...fonts.bold, fontSize: 20, color: colors.white, textAlign: 'center', flex: 1 },
  heroSection: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  heroBadge: {
    ...fonts.semiBold, fontSize: 12, color: colors.accent,
    backgroundColor: 'rgba(212,168,67,0.15)', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: borderRadius.full, alignSelf: 'flex-start', marginBottom: spacing.sm,
  },
  heroTitle: { ...fonts.extraBold, fontSize: 28, color: colors.white, lineHeight: 34 },
  heroDesc: { ...fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22, marginTop: spacing.sm },
  inputGroup: { marginBottom: spacing.md },
  label: { ...fonts.medium, fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: colors.inputBg, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: borderRadius.sm, padding: 14, fontSize: 15, color: colors.text, ...fonts.regular,
  },
  textArea: { minHeight: 100 },
  picker: {
    backgroundColor: colors.inputBg, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: borderRadius.sm, padding: 14, flexDirection: 'row', alignItems: 'center',
  },
  pickerText: { flex: 1, fontSize: 15, color: colors.text, ...fonts.regular },
  pickerPlaceholder: { color: colors.textMuted },
  pickerArrow: { fontSize: 10, color: colors.textMuted },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#0f1d35', borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg, maxHeight: '60%', paddingBottom: spacing.xl,
  },
  modalTitle: {
    ...fonts.bold, fontSize: 18, color: colors.white,
    padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  modalList: { paddingHorizontal: spacing.md },
  modalOption: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  modalOptionActive: { backgroundColor: 'rgba(212,168,67,0.08)' },
  modalOptionText: { ...fonts.medium, fontSize: 15, color: colors.text, flex: 1 },
  modalOptionTextActive: { color: colors.accent },
  checkmark: { ...fonts.semiBold, fontSize: 16, color: colors.accent },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  successIcon: { fontSize: 60, marginBottom: spacing.md },
  successTitle: { ...fonts.bold, fontSize: 24, color: colors.white, marginBottom: spacing.sm },
  successMsg: {
    ...fonts.regular, fontSize: 14, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl,
  },
  altContactSection: { paddingHorizontal: spacing.md, marginBottom: spacing.xxl },
  altTitle: { ...fonts.semiBold, fontSize: 16, color: colors.white, marginBottom: spacing.sm },
  altRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  altIcon: { fontSize: 20 },
  altLabel: { ...fonts.medium, fontSize: 14, color: colors.text },
  altValue: { ...fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  altDivider: { height: 1, backgroundColor: colors.borderLight },
});
