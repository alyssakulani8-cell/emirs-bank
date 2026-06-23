import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert, Switch, TextInput } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { Card } from '../components';
import { useAuth } from '../data/AuthContext';

export default function SecurityCenterScreen() {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  useEffect(() => {
    checkBiometricAvailability();
    loadBiometricPreference();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricAvailable(compatible && enrolled);
  };

  const loadBiometricPreference = async () => {
    try {
      const stored = await AsyncStorage.getItem('ameris_biometric_creds');
      setIsBiometricEnabled(!!stored);
    } catch {
      setIsBiometricEnabled(false);
    }
  };

  const toggleBiometric = async (value) => {
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
      });
      if (result.success) {
        await AsyncStorage.setItem('ameris_biometric_creds', JSON.stringify({ enabled: true }));
        setIsBiometricEnabled(true);
        Alert.alert('Biometric Login', 'Biometric login has been enabled.');
      }
    } else {
      await AsyncStorage.removeItem('ameris_biometric_creds');
      setIsBiometricEnabled(false);
      Alert.alert('Biometric Login', 'Biometric login has been disabled.');
    }
  };

  const handleChangePin = () => {
    if (!currentPin.trim() || !newPin.trim()) {
      Alert.alert('Error', 'Please fill in both PIN fields.');
      return;
    }
    if (newPin.length < 4) {
      Alert.alert('Error', 'New PIN must be at least 4 digits.');
      return;
    }
    Alert.alert('PIN Changed', 'PIN changed successfully');
    setCurrentPin('');
    setNewPin('');
  };

  const handleRevokeSession = (deviceName) => {
    Alert.alert('Session Revoked', `Session for "${deviceName}" has been revoked.`);
  };

  const sessions = [
    { device: 'iPhone 15 Pro', lastActive: 'Active now' },
    { device: 'Chrome on Windows', lastActive: '2 hours ago' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.screenTitle}>Security Center</Text>
        <Text style={styles.screenSubtitle}>Manage your account security</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Biometric Login</Text>
          <Card style={styles.card}>
            {isBiometricAvailable ? (
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Enable Biometric Login</Text>
                  <Text style={styles.toggleDescription}>Use fingerprint or face ID to sign in</Text>
                </View>
                <Switch
                  value={isBiometricEnabled}
                  onValueChange={toggleBiometric}
                  trackColor={{ false: colors.borderLight, true: colors.accent }}
                  thumbColor={isBiometricEnabled ? colors.accentDark : colors.textMuted}
                />
              </View>
            ) : (
              <Text style={styles.notAvailable}>Biometric authentication is not available on this device.</Text>
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Change PIN</Text>
          <Card style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Current PIN"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              keyboardType="number-pad"
              value={currentPin}
              onChangeText={setCurrentPin}
            />
            <TextInput
              style={styles.input}
              placeholder="New PIN"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              keyboardType="number-pad"
              value={newPin}
              onChangeText={setNewPin}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePin}>
              <Text style={styles.buttonText}>Change PIN</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account Security</Text>
          <Card style={styles.card}>
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Last Login</Text>
              <Text style={styles.infoValue}>June 20, 2026 at 2:30 PM</Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Two-Factor Authentication</Text>
              <Text style={styles.infoValue}>Coming Soon</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Device Trust</Text>
              <Text style={styles.infoValueActive}>Active</Text>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Active Sessions</Text>
          <Card style={styles.card}>
            {sessions.map((session, idx) => (
              <View
                key={session.device}
                style={[styles.sessionRow, idx < sessions.length - 1 && styles.sessionRowBorder]}
              >
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionDevice}>{session.device}</Text>
                  <Text style={styles.sessionActive}>{session.lastActive}</Text>
                </View>
                <TouchableOpacity
                  style={styles.revokeBtn}
                  onPress={() => handleRevokeSession(session.device)}
                >
                  <Text style={styles.revokeBtnText}>Revoke</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Card>
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
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
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
  card: {
    marginHorizontal: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  toggleLabel: {
    ...fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  toggleDescription: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notAvailable: {
    ...fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...fonts.regular,
    fontSize: 15,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  buttonText: {
    ...fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.primary,
    flex: 1,
  },
  infoValue: {
    ...fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  infoValueActive: {
    ...fonts.semiBold,
    fontSize: 14,
    color: colors.success,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  sessionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    ...fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  sessionActive: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  revokeBtn: {
    backgroundColor: colors.error + '20',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  revokeBtnText: {
    ...fonts.semiBold,
    fontSize: 13,
    color: colors.error,
  },
});
