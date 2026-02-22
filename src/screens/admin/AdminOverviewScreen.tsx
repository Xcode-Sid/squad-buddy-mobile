import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Users, Building2, Ban, MapPin, Radio, DollarSign, Crown, Calendar, AlertTriangle, LogOut } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice } from '../../utils/formatting';
import { PLAYERS, FIELDS, LIVE_GAMES, TOURNAMENTS } from '../../data/mockData';
import { Alert } from 'react-native';

const { width: SW } = Dimensions.get('window');

const MOCK_BUSINESSES_COUNT = 5;

const PLATFORM_REVENUE_MONTHLY = [
  { month: 'Sep', revenue: 2450000 }, { month: 'Oct', revenue: 2890000 },
  { month: 'Nov', revenue: 3120000 }, { month: 'Dec', revenue: 3560000 },
  { month: 'Jan', revenue: 3890000 }, { month: 'Feb', revenue: 4120000 },
];
const totalBookings = 2674;
const totalMonthlyRev = PLATFORM_REVENUE_MONTHLY[PLATFORM_REVENUE_MONTHLY.length - 1].revenue;

export default function AdminOverviewScreen() {
  const { logout } = useAuth();
  const { bannedUsers, bannedFields } = useAdmin();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Shield size={22} color={colors.primary} />
          <Text style={s.headerTitle}>Admin Panel</Text>
        </View>
        <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut}>
          <LogOut size={18} color={colors.destructive} />
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.kpiGrid}>
          {[
            { icon: Users, color: colors.primary, value: PLAYERS.length, label: 'Total Users' },
            { icon: Building2, color: colors.secondary, value: MOCK_BUSINESSES_COUNT, label: 'Businesses' },
            { icon: MapPin, color: colors.accent, value: FIELDS.length, label: 'Active Fields' },
            { icon: DollarSign, color: colors.green500, value: formatPrice(totalMonthlyRev), label: 'Monthly Revenue' },
            { icon: Radio, color: colors.live, value: LIVE_GAMES.filter(g => g.isLive).length, label: 'Live Now' },
            { icon: Calendar, color: colors.purple500, value: totalBookings, label: 'Bookings/mo' },
            { icon: Ban, color: colors.destructive, value: bannedUsers.size + bannedFields.size, label: 'Banned' },
            { icon: Crown, color: colors.yellow400, value: TOURNAMENTS.length, label: 'Tournaments' },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <View key={i} style={s.kpiCard}>
                <Icon size={18} color={kpi.color} />
                <Text style={s.kpiValue}>{kpi.value}</Text>
                <Text style={s.kpiLabel}>{kpi.label}</Text>
              </View>
            );
          })}
        </View>

        <Text style={s.sectionTitle}>Platform Health</Text>
        <View style={s.healthCard}>
          {[
            { label: 'User Satisfaction', pct: 92 },
            { label: 'System Uptime', pct: 99.9 },
            { label: 'Payment Success', pct: 98 },
          ].map(h => (
            <View key={h.label}>
              <Text style={s.healthLabel}>{h.label}</Text>
              <View style={s.progressBg}>
                <View style={[s.progressFill, { width: `${h.pct}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.foreground },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 10 },
  signOutText: { fontSize: 13, color: colors.destructive, fontWeight: '600' },
  content: { padding: 16, paddingBottom: 24 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: { width: (SW - 42) / 2, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  kpiValue: { fontSize: 22, fontWeight: '700', color: colors.foreground, marginTop: 6 },
  kpiLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground, marginTop: 16, marginBottom: 8 },
  healthCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  healthLabel: { fontSize: 12, color: colors.mutedForeground, marginBottom: 4 },
  progressBg: { height: 8, backgroundColor: colors.muted, borderRadius: 4, overflow: 'hidden', marginBottom: 14 },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: colors.primary },
});
