import { Platform } from 'react-native';

export const colors = {
  primary: '#0a1628',
  primaryLight: '#0f1d35',
  primaryDark: '#060e1a',
  accent: '#d4a843',
  accentDark: '#b8922e',
  accentLight: '#e0c064',
  white: '#ffffff',
  offWhite: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  cardBg: '#ffffff',
  inputBg: '#f8fafc',
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors = {
  ...colors,
  primary: '#ffffff',
  primaryLight: '#e2e8f0',
  primaryDark: '#94a3b8',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: '#1e293b',
  borderLight: '#1a2744',
  cardBg: '#0f1d35',
  inputBg: '#1a2a4a',
  bg: '#0a1628',
};

const fontFamily = Platform.select({
  ios: 'System',
  default: 'Roboto',
});

export const fonts = {
  regular: { fontFamily, fontWeight: '400' },
  medium: { fontFamily, fontWeight: '500' },
  semiBold: { fontFamily, fontWeight: '600' },
  bold: { fontFamily, fontWeight: '700' },
  extraBold: { fontFamily, fontWeight: '800' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
