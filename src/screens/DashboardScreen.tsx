import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  ChevronRight,
  Radio,
  Bell,
  DollarSign,
  Star,
  Building2,
  GitCompare,
  Wallet,
  Target,
  Award,
  GraduationCap,
  ShoppingBag,
  Map,
  Ticket,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { formatPrice, getBookingStatusStyle } from '../utils/formatting';
import {
  CURRENT_PLAYER,
  UPCOMING_BOOKINGS,
  SPORTS,
  LIVE_GAMES,
} from '../data/mockData';
import PlayerAvatar from '../components/PlayerAvatar';
import AnimatedPressable from '../components/AnimatedPressable';
import type { BusinessProfile } from '../types/auth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_MARGIN = 12;
const HORIZONTAL_PADDING = 20;

const QUICK_ACTIONS_INDIVIDUAL = [
  { icon: Users, label: 'Community', screen: 'Community', color: colors.primary },
  { icon: GitCompare, label: 'Compare', screen: 'Compare', color: colors.violet400 },
  { icon: Trophy, label: 'Tournaments', screen: 'Tournaments', color: colors.accent },
  { icon: Radio, label: 'Live', screen: 'LiveScores', color: colors.live },
] as const;

const QUICK_ACTIONS_BUSINESS = [
  { icon: Building2, label: 'My Fields', screen: 'FieldManagement', color: colors.primary },
  { icon: Radio, label: 'Live Control', screen: 'LiveManagement', color: colors.live },
  { icon: Calendar, label: 'Subscription', screen: 'Subscription', color: colors.secondary },
] as const;

const MORE_ACTIONS_INDIVIDUAL = [
  { icon: Wallet, label: 'Wallet', screen: 'Wallet', color: colors.green500 },
  { icon: Target, label: 'Challenges', screen: 'Challenges', color: colors.orange500 },
  { icon: Award, label: 'Badges', screen: 'Badges', color: colors.yellow500 },
  { icon: GraduationCap, label: 'Training', screen: 'Training', color: colors.blue500 },
  { icon: Star, label: 'Rewards', screen: 'Loyalty', color: colors.purple500 },
  { icon: ShoppingBag, label: 'Equipment', screen: 'Equipment', color: colors.teal500 },
  { icon: Map, label: 'Venues', screen: 'Venues', color: colors.pink500 },
  { icon: Ticket, label: 'Leagues', screen: 'Leagues', color: colors.cyan500 },
] as const;

const MORE_ACTIONS_BUSINESS = [
  { icon: Wallet, label: 'Wallet', screen: 'Wallet', color: colors.green500 },
  { icon: ShoppingBag, label: 'Equipment', screen: 'Equipment', color: colors.teal500 },
] as const;

const WEEKLY_GAMES = [3, 5, 2, 4, 6, 1, 3];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_WEEKLY = Math.max(...WEEKLY_GAMES);

function StatCell({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <View style={styles.statCell}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const nav = useNavigation<any>();
  const isBusiness = user?.role === 'business';
  const bizProfile = user as BusinessProfile | null;

  const quickActions = isBusiness ? QUICK_ACTIONS_BUSINESS : QUICK_ACTIONS_INDIVIDUAL;
  const moreActions = isBusiness ? MORE_ACTIONS_BUSINESS : MORE_ACTIONS_INDIVIDUAL;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={styles.headerLeft}>
            {isBusiness ? (
              <View style={styles.bizAvatar}>
                <Building2 size={24} color={colors.primary} />
              </View>
            ) : (
              <PlayerAvatar
                uri={CURRENT_PLAYER.avatar}
                name={CURRENT_PLAYER.name}
                size="lg"
              />
            )}
            <View style={styles.headerText}>
              <Text style={styles.welcome}>Welcome back</Text>
              <Text style={styles.userName}>
                {isBusiness ? bizProfile?.businessName : CURRENT_PLAYER.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => nav.navigate('Notifications')}
          >
            <Bell size={22} color={colors.foreground} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, quickActions.length === 3 && styles.quickActions3]}>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Animated.View key={action.label} entering={FadeInUp.delay(100 + index * 80).springify()} style={{ flex: 1 }}>
                <AnimatedPressable
                  style={styles.quickActionCard}
                  onPress={() => nav.navigate(action.screen)}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color + '1A' }]}>
                    <Icon size={20} color={action.color} />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </AnimatedPressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Business: Revenue Stat Card */}
        {isBusiness && bizProfile && (
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.revenueCard}>
            <View style={styles.revenueIconWrap}>
              <DollarSign size={20} color={colors.primary} />
            </View>
            <View style={styles.revenueContent}>
              <Text style={styles.revenueValue}>
                {formatPrice(bizProfile.totalRevenue ?? 0)}
              </Text>
              <Text style={styles.revenueLabel}>Total Revenue</Text>
            </View>
          </Animated.View>
        )}

        {/* Upcoming Bookings */}
        <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
            <Text style={styles.sectionCount}>{UPCOMING_BOOKINGS.length} upcoming</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookingsScroll}
          >
            {UPCOMING_BOOKINGS.map((booking, index) => {
              const sport = SPORTS.find((s) => s.id === booking.sport);
              const statusStyle = getBookingStatusStyle(booking.status);
              return (
                <Animated.View key={booking.id} entering={FadeInRight.delay(350 + index * 100).springify()}>
                  <AnimatedPressable
                    style={styles.bookingCard}
                    onPress={() => nav.navigate('Booking', { id: booking.id })}
                  >
                    <Image
                      source={{ uri: booking.field.image }}
                      style={styles.bookingImage}
                    />
                    <View style={styles.bookingContent}>
                      <Text style={styles.bookingFieldName} numberOfLines={1}>
                        {booking.field.name}
                      </Text>
                      <View style={styles.bookingMeta}>
                        <Calendar size={12} color={colors.mutedForeground} />
                        <Text style={styles.bookingMetaText}>{booking.date}</Text>
                      </View>
                      <View style={styles.bookingMeta}>
                        <Clock size={12} color={colors.mutedForeground} />
                        <Text style={styles.bookingMetaText}>{booking.time}</Text>
                      </View>
                      <View style={styles.bookingMeta}>
                        <Text style={styles.sportEmoji}>{sport?.emoji}</Text>
                        <Text style={styles.bookingMetaText}>{sport?.name}</Text>
                      </View>
                      <View style={[styles.statusBadge, statusStyle]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>
                          {booking.status}
                        </Text>
                      </View>
                    </View>
                  </AnimatedPressable>
                </Animated.View>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Live Games */}
        {LIVE_GAMES.length > 0 && (
          <Animated.View entering={FadeInUp.delay(400).springify()}>
            <AnimatedPressable
              style={styles.liveCard}
              onPress={() => nav.navigate('LiveStream', { id: LIVE_GAMES[0].id })}
            >
              <View style={styles.liveCardLeft}>
                <View style={styles.liveDot} />
                <View>
                  <Text style={styles.liveTitle}>
                    {LIVE_GAMES.length} Live Games Now
                  </Text>
                  <Text style={styles.liveSubtitle}>
                    {LIVE_GAMES[0].teamA.name} vs {LIVE_GAMES[0].teamB.name}
                  </Text>
                </View>
              </View>
              <View style={styles.watchBtn}>
                <Text style={styles.watchBtnText}>Watch</Text>
                <ChevronRight size={16} color={colors.foreground} />
              </View>
            </AnimatedPressable>
          </Animated.View>
        )}

        {/* Weekly Activity (individual only) */}
        {!isBusiness && (
          <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.section}>
            <Text style={[styles.sectionTitle, { paddingHorizontal: HORIZONTAL_PADDING, marginBottom: 12 }]}>This Week</Text>
            <View style={styles.weeklyCard}>
              <View style={styles.barChart}>
                {WEEKLY_GAMES.map((g, i) => (
                  <View key={i} style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        { height: Math.max(4, (g / MAX_WEEKLY) * 64) },
                      ]}
                    />
                  </View>
                ))}
              </View>
              <View style={styles.daysRow}>
                {DAYS.map((d) => (
                  <Text key={d} style={styles.dayLabel}>
                    {d}
                  </Text>
                ))}
              </View>
              <View style={styles.weeklyStats}>
                <StatCell
                  label="Total Games"
                  value={CURRENT_PLAYER.gamesPlayed}
                  color={colors.primary}
                />
                <StatCell
                  label="Win Rate"
                  value={`${CURRENT_PLAYER.winRate}%`}
                  color={colors.accent}
                />
                <StatCell
                  label="Total Hours"
                  value={`${CURRENT_PLAYER.totalHours}h`}
                  color={colors.secondary}
                />
              </View>
            </View>
          </Animated.View>
        )}

        {/* Explore More */}
        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.section}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: HORIZONTAL_PADDING, marginBottom: 12 }]}>Explore More</Text>
          <View style={styles.exploreGrid}>
            {moreActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Animated.View key={action.label} entering={ZoomIn.delay(650 + index * 60).springify()}>
                  <AnimatedPressable
                    style={styles.exploreCard}
                    onPress={() => nav.navigate(action.screen)}
                  >
                    <View
                      style={[
                        styles.exploreIcon,
                        { backgroundColor: action.color + '1A' },
                      ]}
                    >
                      <Icon size={18} color={action.color} />
                    </View>
                    <Text style={styles.exploreLabel}>{action.label}</Text>
                  </AnimatedPressable>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_PADDING, paddingTop: 8, paddingBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bizAvatar: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primary + '1A',
    borderWidth: 2, borderColor: colors.primary + '4D', alignItems: 'center', justifyContent: 'center',
  },
  headerText: { gap: 2 },
  welcome: { fontSize: 13, color: colors.mutedForeground },
  userName: { fontSize: 18, fontWeight: '700', color: colors.foreground },
  notifBtn: { padding: 10, position: 'relative' },
  notifDot: {
    position: 'absolute', top: 8, right: 8, width: 8, height: 8,
    borderRadius: 4, backgroundColor: colors.live,
  },
  quickActions: { flexDirection: 'row', gap: 12, paddingHorizontal: HORIZONTAL_PADDING, marginBottom: 20 },
  quickActions3: { gap: 12 },
  quickActionCard: {
    flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8,
    backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
  },
  quickActionIcon: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  quickActionLabel: { fontSize: 11, fontWeight: '600', color: colors.foreground, textAlign: 'center' },
  revenueCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: HORIZONTAL_PADDING,
    marginBottom: 20, padding: 16, backgroundColor: colors.card,
    borderRadius: 16, borderWidth: 1, borderColor: colors.border,
  },
  revenueIconWrap: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary + '1A',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  revenueContent: { flex: 1 },
  revenueValue: { fontSize: 20, fontWeight: '700', color: colors.primary },
  revenueLabel: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_PADDING, marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground },
  sectionCount: { fontSize: 12, color: colors.mutedForeground },
  bookingsScroll: {
    paddingHorizontal: HORIZONTAL_PADDING, gap: CARD_MARGIN,
    paddingRight: HORIZONTAL_PADDING + CARD_MARGIN,
  },
  bookingCard: {
    width: CARD_WIDTH, backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  bookingImage: { width: '100%', height: 100, backgroundColor: colors.muted },
  bookingContent: { padding: 12 },
  bookingFieldName: { fontSize: 15, fontWeight: '600', color: colors.foreground, marginBottom: 8 },
  bookingMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  bookingMetaText: { fontSize: 12, color: colors.mutedForeground },
  sportEmoji: { fontSize: 12 },
  statusBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20, marginTop: 8,
  },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  liveCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: HORIZONTAL_PADDING, marginBottom: 20, padding: 16,
    backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.live + '4D',
  },
  liveCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.live },
  liveTitle: { fontSize: 15, fontWeight: '600', color: colors.foreground },
  liveSubtitle: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  watchBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  watchBtnText: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  weeklyCard: {
    marginHorizontal: HORIZONTAL_PADDING, padding: 16, backgroundColor: colors.card,
    borderRadius: 16, borderWidth: 1, borderColor: colors.border,
  },
  barChart: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    height: 80, marginBottom: 8,
  },
  barWrapper: {
    flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 2,
  },
  bar: {
    width: '100%', minHeight: 4, backgroundColor: colors.primary,
    borderTopLeftRadius: 6, borderTopRightRadius: 6,
  },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  dayLabel: { flex: 1, fontSize: 10, color: colors.mutedForeground, textAlign: 'center' },
  weeklyStats: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 16,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border,
  },
  statCell: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 10, color: colors.mutedForeground, marginTop: 2 },
  exploreGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: HORIZONTAL_PADDING, gap: 12,
  },
  exploreCard: {
    width: (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - 36) / 4,
    alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8,
    backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
  },
  exploreIcon: {
    width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  exploreLabel: { fontSize: 10, fontWeight: '600', color: colors.foreground, textAlign: 'center' },
  bottomSpacer: { height: 24 },
});
