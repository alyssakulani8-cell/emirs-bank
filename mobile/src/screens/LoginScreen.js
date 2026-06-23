import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, StatusBar,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, TouchableOpacity,
} from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { Button, Card } from '../components';
import { useAuth } from '../data/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, biometricSupported, hasBiometricCredentials, biometricLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberBiometric, setRememberBiometric] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password, rememberBiometric);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    const result = await biometricLogin();
    if (!result.success) {
      Alert.alert('Biometric Login Failed', result.error || 'Could not authenticate with biometrics');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.topSection}>
          <Text style={styles.logo}>🦅</Text>
          <Text style={styles.tagline}>Fiercely Yours</Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSubtitle}>Access your online banking</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.biometricToggle}
            onPress={() => setRememberBiometric(!rememberBiometric)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, rememberBiometric && styles.checkboxActive]}>
              {rememberBiometric ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.biometricToggleLabel}>Remember biometric login</Text>
          </TouchableOpacity>

          <Button
            title={loading ? 'Signing in...' : 'Sign In'}
            variant="primary"
            size="lg"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: spacing.md }}
          />

          {biometricSupported && hasBiometricCredentials ? (
            <Button
              title="🔐  Sign in with Biometrics"
              variant="outline"
              size="lg"
              onPress={handleBiometricLogin}
              style={{ marginTop: spacing.md }}
            />
          ) : null}

        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  topSection: { alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    fontSize: 80,
  },
  tagline: {
    ...fonts.regular,
    fontSize: 14,
    color: colors.accent,
    opacity: 0.7,
    marginTop: 4,
  },
  formCard: {
    padding: spacing.lg,
  },
  formTitle: {
    ...fonts.bold,
    fontSize: 22,
    color: colors.primary,
    textAlign: 'center',
  },
  formSubtitle: {
    ...fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  error: {
    ...fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: '#fef2f2',
    borderRadius: borderRadius.sm,
  },
  inputGroup: { marginBottom: spacing.md },
  label: {
    ...fonts.medium,
    fontSize: 13,
    color: colors.text,
    marginBottom: 6,
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
  biometricToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkmark: {
    ...fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  biometricToggleLabel: {
    ...fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  demoSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoTitle: {
    ...fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
