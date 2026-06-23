import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, StatusBar,
  TouchableOpacity, Alert, Modal, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { Button, Card } from '../components';
import { sb } from '../api';

const ACCOUNT_TYPES = [
  { label: 'Premium Checking', value: 'Premium Checking' },
  { label: 'Basic Checking', value: 'Basic Checking' },
  { label: 'High-Yield Savings', value: 'High-Yield Savings' },
  { label: 'Premium Savings', value: 'Premium Savings' },
  { label: 'Student Banking', value: 'Student Banking' },
  { label: 'Platinum Credit Card', value: 'Platinum Credit Card' },
];

const EMPLOYMENT_STATUS = [
  'Employed Full-Time', 'Employed Part-Time', 'Self-Employed',
  'Unemployed', 'Retired', 'Student',
];

const ID_TYPES = [
  "Driver's License", 'Passport', 'State ID', 'Military ID',
];

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export default function ApplyScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', dob: '',
    accountType: '', initialDeposit: '',
    address: '', apt: '', city: '', state: '', zip: '',
    employmentStatus: '', annualIncome: '', idType: '', idNumber: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appRef, setAppRef] = useState('');

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const validateStep = (s) => {
    switch (s) {
      case 1:
        if (!form.firstName.trim()) { Alert.alert('Error', 'First name is required'); return false; }
        if (!form.lastName.trim()) { Alert.alert('Error', 'Last name is required'); return false; }
        if (!form.email.trim() || !isValidEmail(form.email)) { Alert.alert('Error', 'Valid email is required'); return false; }
        if (!form.phone.trim()) { Alert.alert('Error', 'Phone number is required'); return false; }
        if (!form.dob.trim()) { Alert.alert('Error', 'Date of birth is required'); return false; }
        return true;
      case 2:
        if (!form.accountType) { Alert.alert('Error', 'Select an account type'); return false; }
        if (!form.address.trim()) { Alert.alert('Error', 'Address is required'); return false; }
        if (!form.city.trim()) { Alert.alert('Error', 'City is required'); return false; }
        if (!form.state) { Alert.alert('Error', 'Select a state'); return false; }
        if (!form.zip.trim() || form.zip.length < 5) { Alert.alert('Error', 'Valid ZIP code is required'); return false; }
        return true;
      case 3:
        if (!form.employmentStatus) { Alert.alert('Error', 'Select employment status'); return false; }
        if (!form.annualIncome.trim()) { Alert.alert('Error', 'Annual income is required'); return false; }
        if (!form.idType) { Alert.alert('Error', 'Select ID type'); return false; }
        if (!form.idNumber.trim()) { Alert.alert('Error', 'ID number is required'); return false; }
        return true;
      case 4:
        if (!form.agreeTerms) { Alert.alert('Error', 'You must agree to the Terms & Conditions'); return false; }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setLoading(true);
    const refId = 'APP-' + String(Date.now()).slice(-6);
    const appData = {
      id: refId,
      name: `${form.firstName} ${form.lastName}`,
      type: 'Account Opening',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      email: form.email,
      phone: form.phone,
      product: form.accountType,
      initialDeposit: form.initialDeposit || '0',
      ssn: '',
      dob: form.dob,
      idType: form.idType,
      idNumber: form.idNumber,
      address: `${form.address}${form.apt ? ', ' + form.apt : ''}`,
      city: form.city,
      state: form.state,
      zip: form.zip,
      employmentStatus: form.employmentStatus,
      annualIncome: form.annualIncome,
      source: 'mobile',
    };

    try {
      const existing = JSON.parse(await AsyncStorage.getItem('ameris_applications') || '[]');
      existing.push(appData);
      await AsyncStorage.setItem('ameris_applications', JSON.stringify(existing));

      const sbData = {};
      Object.keys(appData).forEach(k => { sbData[k.toLowerCase()] = appData[k]; });
      sb.insert('applications', sbData).catch(() => {});

      setAppRef(refId);
      setSubmitted(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  

  const PickerField = ({ label, value, options, onSelect, placeholder }) => {
    const [visible, setVisible] = useState(false);
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setVisible(true)}>
          <Text style={[styles.pickerText, !value && styles.pickerPlaceholder]}>
            {value ? (options.find(o => (o.value || o) === value)?.label || value) : (placeholder || `Select ${label}`)}
          </Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>
        <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{label}</Text>
              <ScrollView style={styles.modalList}>
                {options.map((opt, i) => {
                  const optVal = typeof opt === 'string' ? opt : opt.value;
                  const optLabel = typeof opt === 'string' ? opt : opt.label;
                  const active = value === optVal;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.modalOption, active && styles.modalOptionActive]}
                      onPress={() => { onSelect(optVal); setVisible(false); }}
                    >
                      <Text style={[styles.modalOptionText, active && styles.modalOptionTextActive]}>
                        {optLabel}
                      </Text>
                      {active && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const formatPhone = (val) => {
    const nums = val.replace(/[^0-9]/g, '');
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `(${nums.slice(0,3)}) ${nums.slice(3)}`;
    return `(${nums.slice(0,3)}) ${nums.slice(3,6)}-${nums.slice(6,10)}`;
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successRef}>Reference: {appRef}</Text>
          <Text style={styles.successMsg}>
            Thank you for applying with Ameris Global. Our team will review your application and get back to you within 1-2 business days.
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
        <Text style={styles.headerTitle}>Open an Account</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map(s => (
          <View key={s} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              step === s && styles.progressDotActive,
              step > s && styles.progressDotCompleted,
            ]}>
              <Text style={[
                styles.progressDotText,
                (step === s || step > s) && styles.progressDotTextActive,
              ]}>{step > s ? '✓' : s}</Text>
            </View>
            {s < 4 && <View style={[styles.progressLine, step > s && styles.progressLineCompleted]} />}
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {step === 1 && (
          <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
            <Text style={styles.stepTitle}>Personal Information</Text>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} placeholder="John" placeholderTextColor={colors.textMuted}
                  value={form.firstName} onChangeText={v => update('firstName', v)} />
              </View>
              <View style={{ width: spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} placeholder="Smith" placeholderTextColor={colors.textMuted}
                  value={form.lastName} onChangeText={v => update('lastName', v)} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="john@email.com" placeholderTextColor={colors.textMuted}
                value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput style={styles.input} placeholder="(555) 123-4567" placeholderTextColor={colors.textMuted}
                value={form.phone} onChangeText={v => update('phone', formatPhone(v))} keyboardType="phone-pad" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textMuted}
                value={form.dob} onChangeText={v => update('dob', v)} />
            </View>
            <Button title="Next →" variant="primary" size="lg"
              onPress={() => { if (validateStep(1)) setStep(2); }} />
          </Card>
        )}

        {step === 2 && (
          <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
            <Text style={styles.stepTitle}>Account Details</Text>
            <PickerField label="Account Type" value={form.accountType} options={ACCOUNT_TYPES}
              onSelect={v => update('accountType', v)} placeholder="Select account type" />
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Deposit (Optional)</Text>
              <TextInput style={styles.input} placeholder="$0.00" placeholderTextColor={colors.textMuted}
                value={form.initialDeposit} onChangeText={v => update('initialDeposit', v.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" />
            </View>
            <Text style={[styles.stepTitle, { marginTop: spacing.md }]}>Address</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput style={styles.input} placeholder="123 Main St" placeholderTextColor={colors.textMuted}
                value={form.address} onChangeText={v => update('address', v)} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apt / Suite (Optional)</Text>
              <TextInput style={styles.input} placeholder="Apt 4B" placeholderTextColor={colors.textMuted}
                value={form.apt} onChangeText={v => update('apt', v)} />
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>City</Text>
                <TextInput style={styles.input} placeholder="New York" placeholderTextColor={colors.textMuted}
                  value={form.city} onChangeText={v => update('city', v)} />
              </View>
              <View style={{ width: spacing.sm }} />
              <View style={{ flex: 1 }}>
                <PickerField label="State" value={form.state} options={STATES.map(s => ({ label: s, value: s }))}
                  onSelect={v => update('state', v)} placeholder="State" />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput style={styles.input} placeholder="10001" placeholderTextColor={colors.textMuted}
                value={form.zip} onChangeText={v => update('zip', v.replace(/[^0-9]/g, '').slice(0, 5))} keyboardType="number-pad" />
            </View>
            <View style={styles.row}>
              <Button title="← Back" variant="outline" size="lg" style={{ flex: 1 }}
                onPress={() => setStep(1)} />
              <View style={{ width: spacing.sm }} />
              <Button title="Next →" variant="primary" size="lg" style={{ flex: 1 }}
                onPress={() => { if (validateStep(2)) setStep(3); }} />
            </View>
          </Card>
        )}

        {step === 3 && (
          <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
            <Text style={styles.stepTitle}>Employment & Identity</Text>
            <PickerField label="Employment Status" value={form.employmentStatus}
              options={EMPLOYMENT_STATUS} onSelect={v => update('employmentStatus', v)}
              placeholder="Select employment status" />
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Annual Income</Text>
              <TextInput style={styles.input} placeholder="$50,000" placeholderTextColor={colors.textMuted}
                value={form.annualIncome} onChangeText={v => update('annualIncome', v.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" />
            </View>
            <PickerField label="ID Type" value={form.idType} options={ID_TYPES}
              onSelect={v => update('idType', v)} placeholder="Select ID type" />
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID Number</Text>
              <TextInput style={styles.input} placeholder="Enter ID number" placeholderTextColor={colors.textMuted}
                value={form.idNumber} onChangeText={v => update('idNumber', v)} />
            </View>
            <View style={styles.row}>
              <Button title="← Back" variant="outline" size="lg" style={{ flex: 1 }}
                onPress={() => setStep(2)} />
              <View style={{ width: spacing.sm }} />
              <Button title="Review →" variant="primary" size="lg" style={{ flex: 1 }}
                onPress={() => { if (validateStep(3)) setStep(4); }} />
            </View>
          </Card>
        )}

        {step === 4 && (
          <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
            <Text style={styles.stepTitle}>Review Your Application</Text>
            <View style={styles.reviewGrid}>
              {[
                ['First Name', form.firstName],
                ['Last Name', form.lastName],
                ['Email', form.email],
                ['Phone', form.phone],
                ['Date of Birth', form.dob],
                ['Account Type', form.accountType],
                ['Initial Deposit', form.initialDeposit ? `$${parseFloat(form.initialDeposit).toLocaleString()}` : '$0'],
                ['Address', `${form.address}${form.apt ? ', ' + form.apt : ''}`],
                ['City', form.city],
                ['State', form.state],
                ['ZIP Code', form.zip],
                ['Employment', form.employmentStatus],
                ['Annual Income', form.annualIncome ? `$${parseFloat(form.annualIncome).toLocaleString()}` : ''],
                ['ID Type', form.idType],
                ['ID Number', form.idNumber],
              ].map(([label, value]) => (
                <View key={label} style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>{label}</Text>
                  <Text style={styles.reviewValue}>{value || '-'}</Text>
                </View>
              ))}
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.agreeTerms && styles.checkboxActive]}
                onPress={() => update('agreeTerms', !form.agreeTerms)}
              >
                {form.agreeTerms && <Text style={styles.checkmarkIcon}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I agree to the Terms & Conditions and Privacy Policy
              </Text>
            </View>
            <View style={styles.row}>
              <Button title="← Back" variant="outline" size="lg" style={{ flex: 1 }}
                onPress={() => setStep(3)} />
              <View style={{ width: spacing.sm }} />
              <Button title={loading ? 'Submitting...' : 'Submit Application'} variant="primary" size="lg" style={{ flex: 1 }}
                onPress={handleSubmit} loading={loading} />
            </View>
          </Card>
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
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
  progressBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  progressStep: { flexDirection: 'row', alignItems: 'center' },
  progressDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  progressDotActive: { backgroundColor: colors.accent },
  progressDotCompleted: { backgroundColor: colors.success },
  progressDotText: { ...fonts.semiBold, fontSize: 12, color: colors.textMuted },
  progressDotTextActive: { color: '#0a1628' },
  progressLine: { width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 4 },
  progressLineCompleted: { backgroundColor: colors.success },
  stepTitle: { ...fonts.bold, fontSize: 18, color: colors.white, marginBottom: spacing.md },
  inputGroup: { marginBottom: spacing.md },
  label: { ...fonts.medium, fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: colors.inputBg, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: borderRadius.sm, padding: 14, fontSize: 15, color: colors.text, ...fonts.regular,
  },
  row: { flexDirection: 'row' },
  picker: {
    backgroundColor: colors.inputBg, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: borderRadius.sm, padding: 14, flexDirection: 'row', alignItems: 'center',
  },
  pickerText: { flex: 1, fontSize: 15, color: colors.text, ...fonts.regular },
  pickerPlaceholder: { color: colors.textMuted },
  pickerArrow: { fontSize: 10, color: colors.textMuted },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
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
  reviewGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    marginBottom: spacing.md,
  },
  reviewItem: { width: '47%' },
  reviewLabel: { ...fonts.regular, fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  reviewValue: { ...fonts.semiBold, fontSize: 14, color: colors.text },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: 10 },
  checkbox: {
    width: 22, height: 22, borderWidth: 2, borderColor: colors.accent,
    borderRadius: 4, alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.accent },
  checkmarkIcon: { ...fonts.bold, fontSize: 14, color: '#0a1628' },
  checkboxLabel: { flex: 1, ...fonts.regular, fontSize: 13, color: colors.textSecondary },
  successContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIcon: {
    fontSize: 60, color: colors.success, marginBottom: spacing.md,
    ...fonts.bold,
  },
  successTitle: { ...fonts.bold, fontSize: 24, color: colors.white, marginBottom: spacing.sm },
  successRef: { ...fonts.medium, fontSize: 14, color: colors.accent, marginBottom: spacing.md },
  successMsg: {
    ...fonts.regular, fontSize: 14, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl,
  },
});
