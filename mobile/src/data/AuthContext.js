import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { authenticateUser } from './customers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [hasBiometricCredentials, setHasBiometricCredentials] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    loadSession();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricSupported(hasHardware && isEnrolled);
    } catch (e) {
      setBiometricSupported(false);
    }
  };

  const checkBiometricCredentials = async () => {
    try {
      const creds = await AsyncStorage.getItem('ameris_biometric_creds');
      setHasBiometricCredentials(!!creds);
      return creds ? JSON.parse(creds) : null;
    } catch (e) {
      setHasBiometricCredentials(false);
      return null;
    }
  };

  const loadSession = async () => {
    try {
      const saved = await AsyncStorage.getItem('ameris_session');
      if (saved) {
        const { username, password } = JSON.parse(saved);
        const result = authenticateUser(username, password);
        if (result) {
          setUser(result.user);
          setCustomer(result.customer);
        }
      }
      await checkBiometricCredentials();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password, rememberBiometric) => {
    const result = authenticateUser(username, password);
    if (!result) throw new Error('Invalid username or password');
    setUser(result.user);
    setCustomer(result.customer);
    await AsyncStorage.setItem('ameris_session', JSON.stringify({ username, password }));
    if (rememberBiometric) {
      await saveBiometricCredentials(username, password);
    }
    return result;
  };

  const logout = async () => {
    setUser(null);
    setCustomer(null);
    await AsyncStorage.removeItem('ameris_session');
  };

  const saveBiometricCredentials = async (username, password) => {
    await AsyncStorage.setItem('ameris_biometric_creds', JSON.stringify({ username, password }));
    setHasBiometricCredentials(true);
  };

  const biometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Sign in to Ameris Global',
      fallbackLabel: 'Enter Password',
    });
    if (!result.success) return { success: false, error: 'Authentication failed' };
    const creds = await AsyncStorage.getItem('ameris_biometric_creds');
    if (!creds) return { success: false, error: 'No saved credentials found' };
    const { username, password } = JSON.parse(creds);
    try {
      await login(username, password, false);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, customer, loading, login, logout, isAuthenticated: !!user,
      biometricSupported, biometricLogin, saveBiometricCredentials, hasBiometricCredentials,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
