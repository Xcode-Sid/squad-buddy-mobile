import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, Calendar, TrendingUp, Clock } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { formatPrice } from '../../utils/formatting';

const { width: SW } = Dimensions.get('window');
const MAX_H = 110;

const MONTHLY = [
  { month: 'Sep', revenue: 2450000, bookings: 342 },
  { month: 'Oct', revenue: 2890000, bookings: 398 },
  { month: 'Nov', revenue: 3120000, bookings: 421 },
  { month: 'Dec', revenue: 3560000, bookings: 467 },
  { month: 'Jan', revenue: 3890000, bookings: 512 },
  { month: 'Feb', revenue: 4120000, bookings: 534 },
];
const BUSINESSES = [
  { id: 'b1', name: 'Arena Sport Tirana', revenue: 1280000 },
  { id: 'b2', name: 'Kompleksi Sportiv Dinamo', revenue: 980000 },
  { id: 'b5', name: 'Tennis Academy Shkodër', revenue: 780000 },
  { id: 'b3', name: 'Padel Club Durrës', revenue: 650000 },
  { id: 'b4', name: 'Basketball Center Vlorë', revenue: 420000 },
];
const TRANSACTIONS = [
  { id: 't1', business: 'Arena Sport Tirana', amount: 45000, date: '2 min ago' },
  { id: 't2', business: 'Padel Club Durrës', amount: 35000, date: '15 min ago' },
  { id: 't3', business: 'Basketball Center Vlorë', amount: 20000, date: '1 hour ago' },
  { id: 't4', business: 'Tennis Academy Shkodër', amount: 28000, date: '2 hours ago' },
  { id: 't5', business: 'Kompleksi Sportiv Dinamo', amount: 40000, date: '3 hours ago' },
];

const totalBookings = MONTHLY.reduce((s, m) => s + m.bookings, 0);
const totalRev = MONTHLY[MONTHLY.length - 1].revenue;
const avgBooking = Math.round(totalRev / MONTHLY[MONTHLY.length - 1].bookings);
const maxRev = Math.max(...MONTHLY.map(m => m.revenue));

export default function AdminRevenueScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}><Text style={s.title}>Revenue</Text></View>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.kpiGrid}>
          {[
            { icon: DollarSign, color: colors.primary, val: formatPrice(totalRev), label: 'Total Revenue' },
            { icon: Calendar, color: colors.secondary, val: String(totalBookings), label: 'Total Bookings' },
            { icon: TrendingUp, color: colors.green500, val: formatPrice(avgBooking), label: 'Avg Booking' },
            { icon: Clock, color: colors.accent, val: formatPrice(125000), label: 'Pending Payouts' },
          ].map((k, i) => {
            const Icon = k.icon;
            return (
              <View key={i} style={s.kpiCard}>
                <Icon size={20} color={k.color} />
                <Text style={s.kpiVal}>{k.val}</Text>
                <Text style={s.kpiLabel}>{k.label}</Text>
              </View>
            );
          })}
        </View>

        <Text style={s.section}>Revenue (6 months)</Text>
        <View style={s.chart}>
          {MONTHLY.map(m => (
            <View key={m.month} style={s.chartCol}>
              <View style={[s.bar, { height: (m.revenue / maxRev) * MAX_H }]} />
              <Text style={s.chartLabel}>{m.month}</Text>
            </View>
          ))}
        </View>

        <Text style={s.section}>Top Businesses</Text>
        {BUSINESSES.map((b, i) => (
          <View key={b.id} style={s.row}>
            <Text style={s.rank}>{i + 1}</Text>
            <Text style={s.bizName} numberOfLines={1}>{b.name}</Text>
            <Text style={s.bizRev}>{formatPrice(b.revenue)}</Text>
          </View>
        ))}

        <Text style={s.section}>Recent Transactions</Text>
        {TRANSACTIONS.map(t => (
          <View key={t.id} style={s.txRow}>
            <View>
              <Text style={s.txBiz}>{t.business}</Text>
              <Text style={s.txDate}>{t.date}</Text>
            </View>
            <Text style={s.txAmt}>{formatPrice(t.amount)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 20, fontWeight: '700', color: colors.foreground },
  content: { padding: 16, paddingBottom: 24 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  kpiCard: { width: (SW - 42) / 2, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  kpiVal: { fontSize: 17, fontWeight: '700', color: colors.foreground, marginTop: 6 },
  kpiLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  section: { fontSize: 15, fontWeight: '700', color: colors.foreground, marginTop: 16, marginBottom: 8 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: MAX_H + 24, paddingHorizontal: 4 },
  chartCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '65%', backgroundColor: colors.primary, borderRadius: 4, minHeight: 6 },
  chartLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: colors.card, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: colors.border },
  rank: { width: 22, fontSize: 13, fontWeight: '700', color: colors.mutedForeground },
  bizName: { flex: 1, fontSize: 13, color: colors.foreground, fontWeight: '500' },
  bizRev: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  txRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: colors.card, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: colors.border },
  txBiz: { fontSize: 13, fontWeight: '600', color: colors.foreground },
  txDate: { fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  txAmt: { fontSize: 13, color: colors.primary, fontWeight: '600' },
});
