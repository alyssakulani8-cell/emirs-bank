import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert, Animated } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { Button, Card } from '../components';
import { useAuth } from '../data/AuthContext';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  scroll: { flex: 1 },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  badge: {
    ...fonts.semiBold, fontSize: 12, color: colors.accent,
    backgroundColor: 'rgba(212,168,67,0.15)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: borderRadius.full,
    alignSelf: 'flex-start', marginBottom: spacing.md,
  },
  heroTitle: {
    ...fonts.extraBold, fontSize: 36, color: colors.white, lineHeight: 44,
  },
  heroGradient: { color: colors.accent },
  heroSubtitle: {
    ...fonts.regular, fontSize: 15, color: colors.textMuted, lineHeight: 24, marginTop: spacing.md,
  },
  trustRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg,
  },
  trustItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  trustText: {
    ...fonts.regular, fontSize: 12, color: colors.textMuted,
  },
  heroCta: {
    flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.xl,
  },
  sectionBadge: {
    ...fonts.semiBold, fontSize: 12, color: colors.accent, marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...fonts.bold, fontSize: 24, color: colors.white, marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 22,
  },
  serviceBox: {
    backgroundColor: '#0f1d35', borderRadius: borderRadius.md, padding: spacing.md,
    width: '47%', marginBottom: spacing.md,
  },
  serviceIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(212,168,67,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  serviceIconText: { fontSize: 20 },
  serviceName: {
    ...fonts.semiBold, fontSize: 14, color: colors.white, marginBottom: 4,
  },
  serviceDesc: {
    ...fonts.regular, fontSize: 12, color: colors.textMuted, lineHeight: 18,
  },
  servicesRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: spacing.md,
  },
  rateCard: {
    backgroundColor: '#0f1d35', borderRadius: borderRadius.md, padding: spacing.md,
    width: '47%', marginBottom: spacing.md, borderWidth: 1, borderColor: '#1a2744',
  },
  rateFeatured: { borderColor: colors.accent },
  ratePopular: {
    ...fonts.semiBold, fontSize: 10, color: colors.primary,
    backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: borderRadius.full, alignSelf: 'flex-start', marginBottom: spacing.sm,
  },
  rateApy: { ...fonts.bold, fontSize: 28, color: colors.accent, marginVertical: spacing.sm },
  ratePercent: { ...fonts.regular, fontSize: 14, color: colors.accent },
  rateTitle: { ...fonts.semiBold, fontSize: 14, color: colors.white },
  rateDesc: { ...fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 4 },
  rateBtn: { marginTop: spacing.sm },
  ctaSection: { padding: spacing.xl, alignItems: 'center' },
  ctaText: {
    ...fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: 'center',
    marginTop: spacing.sm, marginBottom: spacing.lg,
  },
  mobileSection: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.xl,
    backgroundColor: '#0a1628',
  },
  mobileFeatureList: { marginTop: spacing.md },
  mobileFeature: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.sm,
  },
  mobileFeatureText: { ...fonts.regular, fontSize: 14, color: colors.textSecondary },
  phoneMockup: {
    backgroundColor: '#0f1d35', borderRadius: borderRadius.lg, padding: spacing.md,
    marginTop: spacing.lg, borderWidth: 1, borderColor: '#1a2744',
  },
  mockBalance: { ...fonts.bold, fontSize: 28, color: colors.accent, textAlign: 'center', marginVertical: spacing.sm },
  mockBalanceLabel: { ...fonts.medium, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  mockActions: {
    flexDirection: 'row', justifyContent: 'space-around', marginVertical: spacing.md,
  },
  mockAction: { alignItems: 'center', gap: 4 },
  mockActionText: { ...fonts.regular, fontSize: 11, color: colors.textMuted },
  calculatorBox: {
    backgroundColor: '#0f1d35', borderRadius: borderRadius.md, padding: spacing.lg,
    marginTop: spacing.md,
  },
  calcResult: { alignItems: 'center', marginBottom: spacing.lg },
  calcResultLabel: { ...fonts.medium, fontSize: 13, color: colors.textMuted },
  calcResultAmount: { ...fonts.bold, fontSize: 32, color: colors.accent, marginTop: 4 },
  ticker: {
    backgroundColor: '#060e1a', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1a2744',
  },
  tickerContent: { flexDirection: 'row', alignItems: 'center' },
  tickerItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24, paddingHorizontal: 8 },
  tickerPair: { ...fonts.semiBold, fontSize: 12, color: colors.white, marginRight: 6 },
  tickerVal: { ...fonts.medium, fontSize: 12, color: colors.textSecondary, marginRight: 4 },
  tickerUp: { color: colors.success, fontSize: 10 },
  tickerDown: { color: colors.error, fontSize: 10 },
  sliderRow: { marginBottom: spacing.md },
  sliderLabel: { ...fonts.medium, fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  sliderValue: { color: colors.accent },
  testimonialCard: {
    backgroundColor: '#0f1d35', borderRadius: borderRadius.md, padding: spacing.lg,
    marginRight: spacing.md, width: 280,
  },
  testimonialStars: { flexDirection: 'row', gap: 2, marginBottom: spacing.sm },
  testimonialQuote: { ...fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  testimonialAuthorName: { ...fonts.semiBold, fontSize: 13, color: colors.white },
  testimonialAuthorLoc: { ...fonts.regular, fontSize: 11, color: colors.textMuted },
  scrollRow: { paddingLeft: spacing.lg, marginTop: spacing.md },
});

const services = [
  { icon: '💳', name: 'Personal Banking', desc: 'Checking, savings & accounts with competitive rates.' },
  { icon: '💼', name: 'Business Banking', desc: 'Tools to help your business manage cash flow.' },
  { icon: '🏠', name: 'Mortage', desc: 'From first-time buyer to refinancing options.' },
  { icon: '📈', name: 'Asset Management', desc: 'Strategic investment & financial planning.' },
  { icon: '💰', name: 'Personal Loans', desc: 'Flexible loans for any purpose.' },
  { icon: '🛡️', name: 'Fraud Protection', desc: 'Advanced security & 24/7 monitoring.' },
];

const rates = [
  { name: 'High-Yield Savings', apy: '4.50', featured: true, desc: 'No minimum balance. No monthly fees.' },
  { name: '12-Month CD', apy: '5.10', featured: false, desc: 'Lock in a great rate. Min $1,000.' },
  { name: 'Money Market', apy: '3.85', featured: false, desc: 'Higher earnings with flexible access.' },
  { name: 'Premium Checking', apy: '0.25', featured: false, desc: 'Interest on every dollar.' },
];

const testimonials = [
  { name: 'Sarah Johnson', loc: 'Atlanta, GA', text: '"Ameris Global made refinancing our home incredibly easy. The team guided us through every step."', stars: 5 },
  { name: 'Michael Chen', loc: 'Jacksonville, FL', text: '"The business banking team helped us secure an SBA loan that allowed our company to expand."', stars: 5 },
  { name: 'Maria Garcia', loc: 'Miami, FL', text: '"I\'ve been with Ameris Global for over 15 years. Their mobile app is fantastic."', stars: 5 },
];

export default function HomeScreen({ navigation }) {
  const { isAuthenticated } = useAuth();
  const [calcAmount, setCalcAmount] = useState(300000);
  const [calcRate, setCalcRate] = useState(6.5);
  const [calcTerm, setCalcTerm] = useState(30);

  const monthlyPayment = () => {
    const r = (calcRate / 100) / 12;
    const n = calcTerm * 12;
    if (r === 0) return (calcAmount / n).toFixed(0);
    const p = calcAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return p.toFixed(0);
  };

  const handleServicePress = (name) => {
    navigation.navigate('Contact', { subject: name });
  };

  const handleRatePress = (rateName) => {
    Alert.alert(rateName, `Earn ${rateName} with competitive rates. Open an account to get started.`, [
      { text: 'Open Account', onPress: () => navigation.navigate('Apply') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const tickerData = [
    { pair: 'USD/JPY', val: '151.27', dir: 'up' },
    { pair: 'EUR/JPY', val: '164.53', dir: 'down' },
    { pair: 'GBP/JPY', val: '191.88', dir: 'up' },
    { pair: 'USD/CHF', val: '0.8924', dir: 'up' },
    { pair: 'AUD/USD', val: '0.6578', dir: 'down' },
    { pair: 'USD/CAD', val: '1.3685', dir: 'up' },
    { pair: 'EUR/USD', val: '1.0892', dir: 'up' },
    { pair: 'GBP/USD', val: '1.2745', dir: 'down' },
    { pair: 'WTI Crude', val: '$86.42', dir: 'up' },
    { pair: 'Gold', val: '$2,345.80', dir: 'down' },
    { pair: 'Bitcoin', val: '$68,321', dir: 'up' },
    { pair: 'Silver', val: '$29.76', dir: 'down' },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -tickerData.length * 140,
        duration: tickerData.length * 2000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <View style={styles.ticker}>
        <Animated.View style={[styles.tickerContent, { transform: [{ translateX: scrollX }] }]}>
          {[...tickerData, ...tickerData].map((t, i) => (
            <View key={i} style={styles.tickerItem}>
              <Text style={styles.tickerPair}>{t.pair}</Text>
              <Text style={styles.tickerVal}>{t.val}</Text>
              <Text style={t.dir === 'up' ? styles.tickerUp : styles.tickerDown}>
                {t.dir === 'up' ? '▲' : '▼'}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.badge}>Welcome to Ameris Global</Text>
          <Text style={styles.heroTitle}>
            We're <Text style={styles.heroGradient}>Fiercely</Text> Yours
          </Text>
          <Text style={styles.heroSubtitle}>
            Wherever you are on your financial journey, we're here to turn your money questions into financial peace of mind.
          </Text>
          <View style={styles.trustRow}>
            <View style={styles.trustItem}><Text style={styles.trustText}>🛡️ Member FDIC</Text></View>
            <View style={styles.trustItem}><Text style={styles.trustText}>⭐ 4.8/5 Rating</Text></View>
            <View style={styles.trustItem}><Text style={styles.trustText}>👥 500K+ Customers</Text></View>
            <View style={styles.trustItem}><Text style={styles.trustText}>🔒 256-bit Encryption</Text></View>
          </View>
          <View style={styles.heroCta}>
            <Button title="Open An Account" variant="primary" onPress={() => navigation.navigate('Apply')} />
            <Button title="Online Banking" variant="outline" onPress={() => navigation.navigate('Banking')} />
          </View>
          <TouchableOpacity style={{ marginTop: spacing.sm }} onPress={() => navigation.navigate('Contact')}>
            <Text style={{ ...fonts.medium, fontSize: 13, color: colors.textMuted, textAlign: 'center' }}>Need help? Contact Us</Text>
          </TouchableOpacity>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionBadge}>Our Solutions</Text>
          <Text style={styles.sectionTitle}>You've come to the <Text style={{ color: colors.accent }}>right place</Text></Text>
          <Text style={styles.sectionSubtitle}>Comprehensive financial solutions tailored to every stage of your journey.</Text>
          <View style={styles.servicesRow}>
            {services.map((s, i) => (
              <TouchableOpacity key={i} style={styles.serviceBox} onPress={() => handleServicePress(s.name)} activeOpacity={0.7}>
                <View style={styles.serviceIcon}><Text style={styles.serviceIconText}>{s.icon}</Text></View>
                <Text style={styles.serviceName}>{s.name}</Text>
                <Text style={styles.serviceDesc}>{s.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mobile Banking */}
        <View style={styles.mobileSection}>
          <Text style={styles.sectionBadge}>Digital Banking</Text>
          <Text style={styles.sectionTitle}>Banking in the <Text style={{ color: colors.accent }}>palm of your hands</Text></Text>
          <View style={styles.mobileFeatureList}>
            {['Mobile check deposit', 'Instant transfers & payments', 'Real-time transaction alerts', 'Fingerprint & face ID login', '24/7 customer support chat'].map((f, i) => (
              <View key={i} style={styles.mobileFeature}>
                <Text style={{ color: colors.success }}>✓</Text>
                <Text style={styles.mobileFeatureText}>{f}</Text>
              </View>
            ))}
          </View>
          <View style={styles.phoneMockup}>
            <Text style={styles.mockBalanceLabel}>Total Balance</Text>
            <Text style={styles.mockBalance}>$48,392.65</Text>
            <View style={styles.mockActions}>
              <View style={styles.mockAction}><Text style={{ fontSize: 20 }}>↑</Text><Text style={styles.mockActionText}>Send</Text></View>
              <View style={styles.mockAction}><Text style={{ fontSize: 20 }}>↓</Text><Text style={styles.mockActionText}>Request</Text></View>
              <View style={styles.mockAction}><Text style={{ fontSize: 20 }}>⇄</Text><Text style={styles.mockActionText}>Transfer</Text></View>
            </View>
          </View>
        </View>

        {/* Rates */}
        <View style={styles.section}>
          <Text style={styles.sectionBadge}>Competitive Rates</Text>
          <Text style={styles.sectionTitle}>Save more with <Text style={{ color: colors.accent }}>Ameris Global</Text></Text>
          <View style={styles.servicesRow}>
            {rates.map((r, i) => (
              <TouchableOpacity key={i} style={[styles.rateCard, r.featured && styles.rateFeatured]} onPress={() => handleRatePress(r.name)} activeOpacity={0.7}>
                {r.featured && <Text style={styles.ratePopular}>Most Popular</Text>}
                <Text style={styles.rateTitle}>{r.name}</Text>
                <Text style={styles.rateApy}>{r.apy}<Text style={styles.ratePercent}>% APY</Text></Text>
                <Text style={styles.rateDesc}>{r.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mortgage Calculator */}
        <View style={styles.section}>
          <Text style={styles.sectionBadge}>Plan Your Future</Text>
          <Text style={styles.sectionTitle}>Mortgage <Text style={{ color: colors.accent }}>Calculator</Text></Text>
          <View style={styles.calculatorBox}>
            <View style={styles.calcResult}>
              <Text style={styles.calcResultLabel}>Estimated Monthly Payment</Text>
              <Text style={styles.calcResultAmount}>${monthlyPayment()}</Text>
            </View>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Loan Amount: <Text style={styles.sliderValue}>${calcAmount.toLocaleString()}</Text></Text>
              <Slider value={calcAmount} onValueChange={setCalcAmount} min={50000} max={1000000} step={10000} />
            </View>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Interest Rate: <Text style={styles.sliderValue}>{calcRate}%</Text></Text>
              <Slider value={calcRate} onValueChange={setCalcRate} min={2} max={10} step={0.1} />
            </View>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Loan Term</Text>
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 4 }}>
                {[15, 20, 30].map(t => (
                  <TouchableOpacity key={t} onPress={() => setCalcTerm(t)}
                    style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: borderRadius.sm, backgroundColor: calcTerm === t ? colors.accent : '#1a2744' }}>
                    <Text style={{ ...fonts.medium, fontSize: 13, color: calcTerm === t ? colors.primary : colors.textMuted }}>{t}yr</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={{ marginTop: spacing.md }} onPress={() => navigation.navigate('Apply')}>
              <Text style={{ ...fonts.semiBold, fontSize: 14, color: colors.accent, textAlign: 'center' }}>Get Pre-Approved →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: spacing.sm }} onPress={() => navigation.navigate('Contact', { subject: 'Mortgage & Home Loans' })}>
              <Text style={{ ...fonts.regular, fontSize: 13, color: colors.textMuted, textAlign: 'center' }}>Talk to a Mortgage Specialist</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionBadge}>Testimonials</Text>
          <Text style={styles.sectionTitle}>What our <Text style={{ color: colors.accent }}>customers</Text> say</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {testimonials.map((t, i) => (
              <View key={i} style={styles.testimonialCard}>
                <View style={styles.testimonialStars}>
                  {[1,2,3,4,5].map(s => <Text key={s} style={{ color: '#f59e0b', fontSize: 14 }}>★</Text>)}
                </View>
                <Text style={styles.testimonialQuote}>{t.text}</Text>
                <View style={styles.testimonialAuthor}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ ...fonts.bold, fontSize: 14, color: colors.primary }}>{t.name.split(' ').map(n => n[0]).join('')}</Text>
                  </View>
                  <View>
                    <Text style={styles.testimonialAuthorName}>{t.name}</Text>
                    <Text style={styles.testimonialAuthorLoc}>{t.loc}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={[styles.sectionTitle, { textAlign: 'center', fontSize: 22 }]}>
            Ready to experience the <Text style={{ color: colors.accent }}>Ameris difference</Text>?
          </Text>
          <Text style={styles.ctaText}>Join thousands of satisfied customers who trust Ameris Global.</Text>
          <Button title="Open An Account Today" variant="primary" size="lg" onPress={() => navigation.navigate('Apply')} />
          <Button title="Contact Us" variant="outline" size="lg" onPress={() => navigation.navigate('Contact')} style={{ marginTop: spacing.sm }} />
        </View>
      </ScrollView>
    </View>
  );
}

function Slider({ value, onValueChange, min, max, step }) {
  const steps = Math.round((max - min) / step);
  const index = Math.round((value - min) / step);
  const percent = (index / steps) * 100;

  return (
    <View>
      <View style={{ height: 6, backgroundColor: '#1a2744', borderRadius: 3, position: 'relative' }}>
        <View style={{ width: `${percent}%`, height: 6, backgroundColor: colors.accent, borderRadius: 3 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -12, paddingHorizontal: -4 }}>
        {Array.from({ length: 5 }, (_, i) => {
          const val = min + (i / 4) * (max - min);
          const isActive = value >= val;
          return (
            <TouchableOpacity key={i} onPress={() => onValueChange(Math.round(val / step) * step)}
              style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: isActive ? colors.accent : '#1a2744', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isActive ? colors.primary : '#64748b' }} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
