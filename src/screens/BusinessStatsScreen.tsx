import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DollarSign, Calendar, MapPin, Star } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import { formatPrice } from '../utils/formatting';
import { useAuth } from '../context/AuthContext';
import type { BusinessProfile } from '../types/auth';

const REVENUE_MONTHLY = [120000, 145000, 132000, 158000, 142000, 165000, 155000, 170000, 148000, 162000, 175000, 180000];
const MAX_REVENUE = Math.max(...REVENUE_MONTHLY);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MOCK_RECENT_BOOKINGS = [
  { id: '1', field: 'Arena Sport Tirana', date: '2026-02-18', time: '18:00', amount: 3000 },
  { id: '2', field: 'Padel Club Durrës', date: '2026-02-17', time: '19:00', amount: 3500 },
  { id: '3', field: 'Basketball Center Vlorë', date: '2026-02-16', time: '20:00', amount: 4000 },
  { id: '4', field: 'Arena Sport Tirana', date: '2026-02-15', time: '18:00', amount: 3000 },
  { id: '5', field: 'Kompleksi Dinamo', date: '2026-02-14', time: '17:00', amount: 2500 },
];

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  index = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  index?: number;
}) {
  return (
    <Animated.View entering={ZoomIn.delay(index * 100).duration(500)} style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '20' }]}>
        <Icon size={22} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function BusinessStatsScreen() {
  const { user } = useAuth();
  const biz = user?.role === 'business' ? (user as BusinessProfile) : null;

  if (!biz) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Business Stats</Text>
          <Text style={styles.emptyText}>Business account required</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Revenue Dashboard</Text>
        <Text style={styles.subtitle}>{biz.businessName}</Text>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={formatPrice(biz.totalRevenue)}
            color={colors.primary}
            index={0}
          />
          <StatCard
            icon={Calendar}
            label="Total Bookings"
            value={biz.totalBookings}
            color={colors.secondary}
            index={1}
          />
          <StatCard
            icon={MapPin}
            label="Fields"
            value={biz.fieldsCount}
            color={colors.accent}
            index={2}
          />
          <StatCard
            icon={Star}
            label="Rating"
            value={biz.rating}
            color={colors.green500}
            index={3}
          />
        </View>

        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue (Monthly)</Text>
          <View style={styles.chartCard}>
            <View style={styles.barChart}>
              {REVENUE_MONTHLY.map((v, i) => (
                <View key={i} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height: Math.max(4, (v / MAX_REVENUE) * 80) },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.monthsRow}>
              {MONTHS.map((m) => (
                <Text key={m} style={styles.monthLabel}>
                  {m}
                </Text>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <View style={styles.bookingsCard}>
            {MOCK_RECENT_BOOKINGS.map((b) => (
              <View key={b.id} style={styles.bookingRow}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingField}>{b.field}</Text>
                  <Text style={styles.bookingDate}>
                    {b.date} at {b.time}
                  </Text>
                </View>
                <Text style={styles.bookingAmount}>{formatPrice(b.amount)}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 90,
    marginBottom: 8,
  },
  barWrapper: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  bar: {
    width: '80%',
    minHeight: 4,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  monthsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  monthLabel: {
    flex: 1,
    fontSize: 9,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  bookingsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingField: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
  },
  bookingDate: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  bookingAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomSpacer: {
    height: 24,
  },
});
