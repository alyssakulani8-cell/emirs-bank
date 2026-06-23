import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import { useAuth } from '../data/AuthContext';
import { colors, fonts } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TransferScreen from '../screens/TransferScreen';
import CardsScreen from '../screens/CardsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MoreScreen from '../screens/MoreScreen';
import ApplyScreen from '../screens/ApplyScreen';
import StatementsScreen from '../screens/StatementsScreen';
import SecurityCenterScreen from '../screens/SecurityCenterScreen';
import ContactScreen from '../screens/ContactScreen';
import AdminScreen from '../screens/AdminScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    Home: '🏠',
    Banking: '🏦',
    Transfer: '💸',
    Cards: '💳',
    More: '⚙️',
  };
  return (
    <View style={tabStyles.iconContainer}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconFocused]}>
        {icons[label] || '•'}
      </Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, opacity: 0.5 },
  iconFocused: { opacity: 1 },
});

function HomeTabs() {
  const { isAuthenticated } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a1628',
          borderTopColor: '#1a2744',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          ...fonts.medium,
          fontSize: 11,
        },
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Banking"
        component={isAuthenticated ? DashboardScreen : LoginScreen}
        options={{ tabBarLabel: isAuthenticated ? 'Dashboard' : 'Login' }}
      />
      <Tab.Screen name="Transfer" component={TransferScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen
        name="More"
        component={isAuthenticated ? ProfileScreen : MoreScreen}
        options={{ tabBarLabel: isAuthenticated ? 'Profile' : 'More' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={HomeTabs} />
      <Stack.Screen name="Apply" component={ApplyScreen} />
      <Stack.Screen name="Statements" component={StatementsScreen} />
      <Stack.Screen name="SecurityCenter" component={SecurityCenterScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
    </Stack.Navigator>
  );
}
