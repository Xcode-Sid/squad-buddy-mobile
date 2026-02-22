import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AnimatedPressable from '../components/AnimatedPressable';
import {
  Shield,
  Users,
  Building2,
  Ban,
  CheckCircle,
  AlertTriangle,
  Search,
  BarChart3,
  Eye,
  MapPin,
  Radio,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Crown,
  Star,
  LogOut,
  Sparkles,
  Send,
  X,
  Calendar,
  Clock,
  UserX,
  UserCheck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatting';
import {
  PLAYERS,
  FIELDS,
  LIVE_GAMES,
  TOURNAMENTS,
  SPORTS,
} from '../data/mockData';
import { USER_PLANS, BIZ_PLANS } from '../data/subscriptionPlans';
import PlayerAvatar from '../components/PlayerAvatar';

type AdminTab = 'overview' | 'users' | 'fields' | 'subs' | 'revenue' | 'reports' | 'ai';

const MOCK_BUSINESSES = [
  {
    id: 'b1',
    name: 'Arena Sport Tirana',
    owner: 'Artan Koci',
    city: 'Tirana',
    fields: 3,
    revenue: 1280000,
    rating: 4.8,
    verified: true,
    plan: 'growth',
  },
  {
    id: 'b2',
    name: 'Kompleksi Sportiv Dinamo',
    owner: 'Elira Murati',
    city: 'Tirana',
    fields: 5,
    revenue: 980000,
    rating: 4.6,
    verified: true,
    plan: 'premium',
  },
  {
    id: 'b3',
    name: 'Padel Club Durrës',
    owner: 'Dritan Leka',
    city: 'Durrës',
    fields: 2,
    revenue: 650000,
    rating: 4.9,
    verified: false,
    plan: 'starter',
  },
  {
    id: 'b4',
    name: 'Basketball Center Vlorë',
    owner: 'Sara Basha',
    city: 'Vlorë',
    fields: 1,
    revenue: 420000,
    rating: 4.5,
    verified: true,
    plan: 'starter',
  },
  {
    id: 'b5',
    name: 'Tennis Academy Shkodër',
    owner: 'Arben Krasniqi',
    city: 'Shkodër',
    fields: 4,
    revenue: 780000,
    rating: 4.7,
    verified: true,
    plan: 'growth',
  },
];

const PLATFORM_REVENUE_MONTHLY = [
  { month: 'Sep', revenue: 2450000, bookings: 342 },
  { month: 'Oct', revenue: 2890000, bookings: 398 },
  { month: 'Nov', revenue: 3120000, bookings: 421 },
  { month: 'Dec', revenue: 3560000, bookings: 467 },
  { month: 'Jan', revenue: 3890000, bookings: 512 },
  { month: 'Feb', revenue: 4120000, bookings: 534 },
];

const TRANSACTIONS = [
  { id: 't1', business: 'Arena Sport Tirana', amount: 45000, date: '2 min ago', type: 'booking' },
  { id: 't2', business: 'Padel Club Durrës', amount: 35000, date: '15 min ago', type: 'booking' },
  { id: 't3', business: 'Basketball Center Vlorë', amount: 20000, date: '1 hour ago', type: 'booking' },
  { id: 't4', business: 'Tennis Academy Shkodër', amount: 28000, date: '2 hours ago', type: 'booking' },
  { id: 't5', business: 'Kompleksi Sportiv Dinamo', amount: 40000, date: '3 hours ago', type: 'booking' },
  { id: 't6', business: 'Arena Sport Tirana', amount: 45000, date: '5 hours ago', type: 'booking' },
  { id: 't7', business: 'Padel Club Durrës', amount: 35000, date: 'Yesterday', type: 'booking' },
];

const REPORTS = [
  { id: 'r1', userId: '1', userName: 'Andi Hoxha', reason: 'Inappropriate behavior during match', severity: 'high' as const, time: '10 min ago' },
  { id: 'r2', userId: '2', userName: 'Elira Murati', reason: 'Spam in comments', severity: 'low' as const, time: '1 hour ago' },
  { id: 'r3', userId: '3', userName: 'Dritan Leka', reason: 'Fake field listing', severity: 'high' as const, time: '2 hours ago' },
  { id: 'r4', userId: '4', userName: 'Sara Basha', reason: 'Payment dispute', severity: 'medium' as const, time: '3 hours ago' },
  { id: 'r5', userId: '5', userName: 'Arben Krasniqi', reason: 'Harassment report', severity: 'medium' as const, time: '5 hours ago' },
];

const getAIResponse = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.includes('user')) return 'You have 30 active users. 5 new signups this week. Top users: Andi Hoxha, Elira Murati, Dritan Leka.';
  if (lower.includes('revenue')) return 'Total platform revenue: 4.12M ALL this month. Up 12% from last month. Top earners: Arena Sport Tirana, Kompleksi Dinamo.';
  if (lower.includes('live')) return '5 live games currently running. FC Tirana vs KF Vllaznia has 1,234 viewers. Basketball and volleyball also live.';
  if (lower.includes('field')) return '20 active fields listed. 3 new fields this month. Top rated: Padel Club Durrës (4.9), Stadiumi Loro Boriçi (4.9).';
  if (lower.includes('tournament')) return '5 tournaments: 2 in progress, 1 in registration, 2 completed. Tirana Football Cup and Albanian Basketball League are active.';
  if (lower.includes('report')) return '5 pending reports: 2 high, 2 medium, 1 low severity. Recommend reviewing high-severity reports first.';
  if (lower.includes('sport')) return 'Most popular sports: Football, Basketball, Padel, Tennis. 18 sports supported on the platform.';
  return 'I can help with users, revenue, live games, fields, tournaments, reports, or sports. What would you like to know?';
};

const TAB_LABELS: Record<AdminTab, string> = {
  overview: 'Overview',
  users: 'Users',
  fields: 'Fields',
  subs: 'Subs',
  revenue: 'Revenue',
  reports: 'Reports',
  ai: 'AI',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_CHART_HEIGHT = 120;

export default function AdminScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [fieldSearch, setFieldSearch] = useState('');
  const [subsType, setSubsType] = useState<'individual' | 'business'>('individual');
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [bannedFields, setBannedFields] = useState<Set<string>>(new Set());
  const [dismissedReports, setDismissedReports] = useState<Set<string>>(new Set());
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Hello! I\'m your admin assistant. Ask about users, revenue, live games, fields, tournaments, reports, or sports.' },
  ]);
  const [aiInput, setAiInput] = useState('');

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  }, [logout]);

  const toggleUserBan = (id: string) => {
    setBannedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFieldBan = (id: string) => {
    setBannedFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReportAction = (reportId: string, action: 'dismiss' | 'warn' | 'ban') => {
    if (action === 'dismiss') {
      setDismissedReports((prev) => new Set([...prev, reportId]));
    } else {
      Alert.alert(action === 'warn' ? 'Warn User' : 'Ban User', `Action: ${action}`);
    }
  };

  const sendAIMessage = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput('');
    setAiMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    const reply = getAIResponse(userMsg);
    setAiMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
  };

  const filteredUsers = PLAYERS.filter(
    (p) =>
      p.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredFields = FIELDS.filter(
    (f) =>
      f.name.toLowerCase().includes(fieldSearch.toLowerCase()) ||
      f.city.toLowerCase().includes(fieldSearch.toLowerCase())
  );

  const activeReports = REPORTS.filter((r) => !dismissedReports.has(r.id));
  const highCount = activeReports.filter((r) => r.severity === 'high').length;
  const mediumCount = activeReports.filter((r) => r.severity === 'medium').length;
  const lowCount = activeReports.filter((r) => r.severity === 'low').length;

  const totalRevenue = PLATFORM_REVENUE_MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = PLATFORM_REVENUE_MONTHLY.reduce((s, m) => s + m.bookings, 0);
  const totalMonthlyRev = PLATFORM_REVENUE_MONTHLY[PLATFORM_REVENUE_MONTHLY.length - 1]?.revenue ?? 0;
  const avgBooking = totalBookings > 0 ? Math.round(totalMonthlyRev / totalBookings) : 0;

  const maxRevenue = Math.max(...PLATFORM_REVENUE_MONTHLY.map((m) => m.revenue));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Shield size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>Admin Panel</Text>
        </View>
        <AnimatedPressable style={styles.signOutBtn} onPress={handleSignOut}>
          <LogOut size={20} color={colors.destructive} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </AnimatedPressable>
      </Animated.View>

      {/* Tab Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
        style={styles.tabBarScroll}
      >
        {(Object.keys(TAB_LABELS) as AdminTab[]).map((tab) => (
          <AnimatedPressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {TAB_LABELS[tab]}
            </Text>
          </AnimatedPressable>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            <View style={styles.kpiGrid}>
              {[
                { icon: <Users size={20} color={colors.primary} />, value: PLAYERS.length, label: 'Total Users' },
                { icon: <Building2 size={20} color={colors.secondary} />, value: MOCK_BUSINESSES.length, label: 'Businesses' },
                { icon: <MapPin size={20} color={colors.accent} />, value: FIELDS.length, label: 'Active Fields' },
                { icon: <DollarSign size={20} color={colors.green500} />, value: formatPrice(totalMonthlyRev), label: 'Monthly Revenue' },
                { icon: <Radio size={20} color={colors.live} />, value: LIVE_GAMES.filter((g) => g.isLive).length, label: 'Live Now' },
                { icon: <Calendar size={20} color={colors.purple500} />, value: totalBookings, label: 'Bookings/mo' },
                { icon: <Ban size={20} color={colors.destructive} />, value: bannedUsers.size + bannedFields.size, label: 'Banned' },
                { icon: <Crown size={20} color={colors.yellow400} />, value: TOURNAMENTS.length, label: 'Tournaments' },
              ].map((kpi, idx) => (
                <Animated.View key={kpi.label} entering={ZoomIn.delay(idx * 60).duration(400)} style={styles.kpiCard}>
                  {kpi.icon}
                  <Text style={styles.kpiValue}>{kpi.value}</Text>
                  <Text style={styles.kpiLabel}>{kpi.label}</Text>
                </Animated.View>
              ))}
            </View>

            <Animated.View entering={FadeInUp.delay(500).duration(500)}>
              <Text style={styles.sectionTitle}>Platform Health</Text>
              <View style={styles.healthBar}>
                <Text style={styles.healthLabel}>User Satisfaction</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '92%', backgroundColor: colors.primary }]} />
                </View>
                <Text style={styles.healthLabel}>System Uptime</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '99.9%', backgroundColor: colors.primary }]} />
                </View>
                <Text style={styles.healthLabel}>Payment Success</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '98%', backgroundColor: colors.primary }]} />
                </View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.quickActions}>
              <AnimatedPressable
                style={styles.quickBtn}
                onPress={() => setActiveTab('reports')}
              >
                <AlertTriangle size={20} color={colors.accent} />
                <Text style={styles.quickBtnText}>Reports</Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={styles.quickBtn}
                onPress={() => setActiveTab('revenue')}
              >
                <Radio size={20} color={colors.live} />
                <Text style={styles.quickBtnText}>Live</Text>
              </AnimatedPressable>
            </Animated.View>
          </View>
        )}

        {activeTab === 'users' && (
          <View style={styles.tabContent}>
            <View style={styles.searchBar}>
              <Search size={20} color={colors.mutedForeground} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search users..."
                placeholderTextColor={colors.mutedForeground}
                value={userSearch}
                onChangeText={setUserSearch}
              />
            </View>

            <Text style={styles.sectionTitle}>Individual Users</Text>
            {filteredUsers.map((user, idx) => {
              const isBanned = bannedUsers.has(user.id);
              return (
                <Animated.View key={user.id} entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(400)} style={styles.userCard}>
                  <PlayerAvatar uri={user.avatar} size="md" name={user.name} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userNameSub}>{user.username}</Text>
                  </View>
                  <AnimatedPressable
                    style={[styles.banBtn, isBanned && styles.banBtnActive]}
                    onPress={() => toggleUserBan(user.id)}
                  >
                    {isBanned ? (
                      <UserCheck size={18} color={colors.primary} />
                    ) : (
                      <Ban size={18} color={colors.destructive} />
                    )}
                    <Text style={[styles.banBtnText, isBanned && { color: colors.primary }]}>
                      {isBanned ? 'Unban' : 'Ban'}
                    </Text>
                  </AnimatedPressable>
                </Animated.View>
              );
            })}

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Business Accounts</Text>
            {MOCK_BUSINESSES.map((biz, idx) => (
              <Animated.View key={biz.id} entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(400)} style={styles.bizCard}>
                <View style={styles.bizRow}>
                  <Text style={styles.bizName}>{biz.name}</Text>
                  {biz.verified && <CheckCircle size={16} color={colors.primary} />}
                </View>
                <Text style={styles.bizOwner}>Owner: {biz.owner}</Text>
                <View style={styles.bizMeta}>
                  <MapPin size={14} color={colors.mutedForeground} />
                  <Text style={styles.bizMetaText}>{biz.city}</Text>
                  <Text style={styles.bizMetaText}>• {biz.fields} fields</Text>
                  <Text style={styles.bizRevenue}>{formatPrice(biz.revenue)}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {activeTab === 'fields' && (
          <View style={styles.tabContent}>
            <View style={styles.searchBar}>
              <Search size={20} color={colors.mutedForeground} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search fields..."
                placeholderTextColor={colors.mutedForeground}
                value={fieldSearch}
                onChangeText={setFieldSearch}
              />
            </View>

            {filteredFields.map((field, idx) => {
              const isBanned = bannedFields.has(field.id);
              const sportNames = field.sports
                .map((s) => SPORTS.find((sp) => sp.id === s)?.name ?? s)
                .join(', ');
              return (
                <Animated.View key={field.id} entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(400)} style={styles.fieldCard}>
                  <Image source={{ uri: field.image }} style={styles.fieldImage} />
                  <View style={styles.fieldInfo}>
                    <Text style={styles.fieldName}>{field.name}</Text>
                    <View style={styles.fieldMeta}>
                      <MapPin size={12} color={colors.mutedForeground} />
                      <Text style={styles.fieldMetaText}>{field.city}</Text>
                    </View>
                    <View style={styles.fieldMeta}>
                      <Star size={12} color={colors.yellow400} />
                      <Text style={styles.fieldMetaText}>{field.rating}</Text>
                      <Text style={styles.fieldMetaText}>• {formatPrice(field.pricePerHour)}/hr</Text>
                    </View>
                    <Text style={styles.fieldSports}>{sportNames}</Text>
                    <AnimatedPressable
                      style={[styles.banBtn, isBanned && styles.banBtnActive]}
                      onPress={() => toggleFieldBan(field.id)}
                    >
                      {isBanned ? (
                        <UserCheck size={16} color={colors.primary} />
                      ) : (
                        <Ban size={16} color={colors.destructive} />
                      )}
                      <Text style={[styles.banBtnText, isBanned && { color: colors.primary }]}>
                        {isBanned ? 'Unban' : 'Ban'}
                      </Text>
                    </AnimatedPressable>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        )}

        {activeTab === 'subs' && (
          <View style={styles.tabContent}>
            <Animated.View entering={FadeInUp.duration(400)} style={styles.subsToggle}>
              <AnimatedPressable
                style={[styles.subsToggleBtn, subsType === 'individual' && styles.subsToggleActive]}
                onPress={() => setSubsType('individual')}
              >
                <Text style={[styles.subsToggleText, subsType === 'individual' && styles.subsToggleTextActive]}>
                  Individual
                </Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={[styles.subsToggleBtn, subsType === 'business' && styles.subsToggleActive]}
                onPress={() => setSubsType('business')}
              >
                <Text style={[styles.subsToggleText, subsType === 'business' && styles.subsToggleTextActive]}>
                  Business
                </Text>
              </AnimatedPressable>
            </Animated.View>

            {subsType === 'individual' &&
              USER_PLANS.map((plan, idx) => (
                <Animated.View key={plan.id} entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(400)} style={styles.planCard}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>
                      {plan.price === 0 ? 'Free' : `${formatPrice(plan.price)}/mo`}
                    </Text>
                  </View>
                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.planFeature}>
                      <CheckCircle size={16} color={colors.primary} />
                      <Text style={styles.planFeatureText}>{f}</Text>
                    </View>
                  ))}
                </Animated.View>
              ))}

            {subsType === 'business' &&
              BIZ_PLANS.map((plan, idx) => (
                <Animated.View key={plan.id} entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(400)} style={styles.planCard}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>
                      {formatPrice(plan.price)}/mo • {plan.maxFields === Infinity ? '∞' : plan.maxFields} fields
                    </Text>
                  </View>
                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.planFeature}>
                      <CheckCircle size={16} color={colors.primary} />
                      <Text style={styles.planFeatureText}>{f}</Text>
                    </View>
                  ))}
                </Animated.View>
              ))}

            <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.subsStats}>
              <Text style={styles.sectionTitle}>Subscription Stats</Text>
              <View style={styles.subsStatsGrid}>
                {[
                  { value: '24', label: 'Pro Users' },
                  { value: '8', label: 'Elite Users' },
                  { value: '3', label: 'Growth Biz' },
                  { value: '2', label: 'Premium Biz' },
                ].map((stat, idx) => (
                  <Animated.View key={stat.label} entering={ZoomIn.delay(400 + idx * 60).duration(400)} style={styles.subsStatCard}>
                    <Text style={styles.subsStatValue}>{stat.value}</Text>
                    <Text style={styles.subsStatLabel}>{stat.label}</Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          </View>
        )}

        {activeTab === 'revenue' && (
          <View style={styles.tabContent}>
            <View style={styles.revenueStats}>
              {[
                { icon: <DollarSign size={24} color={colors.primary} />, value: formatPrice(totalMonthlyRev), label: 'Total Revenue' },
                { icon: <Calendar size={24} color={colors.secondary} />, value: totalBookings, label: 'Total Bookings' },
                { icon: <TrendingUp size={24} color={colors.green500} />, value: formatPrice(avgBooking), label: 'Avg Booking Value' },
                { icon: <Clock size={24} color={colors.accent} />, value: formatPrice(125000), label: 'Pending Payouts' },
              ].map((card, idx) => (
                <Animated.View key={card.label} entering={ZoomIn.delay(idx * 80).duration(400)} style={styles.revenueCard}>
                  {card.icon}
                  <Text style={styles.revenueValue}>{card.value}</Text>
                  <Text style={styles.revenueLabel}>{card.label}</Text>
                </Animated.View>
              ))}
            </View>

            <Animated.View entering={FadeInUp.delay(350).duration(500)}>
              <Text style={styles.sectionTitle}>Revenue (6 months)</Text>
              <View style={styles.chartContainer}>
                {PLATFORM_REVENUE_MONTHLY.map((m, i) => (
                  <View key={m.month} style={styles.chartBar}>
                    <View
                      style={[
                        styles.chartBarFill,
                        {
                          height: (m.revenue / maxRevenue) * MAX_CHART_HEIGHT,
                        },
                      ]}
                    />
                    <Text style={styles.chartLabel}>{m.month}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500).duration(500)}>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Top Businesses</Text>
              {MOCK_BUSINESSES.slice(0, 5)
                .sort((a, b) => b.revenue - a.revenue)
                .map((b, i) => (
                  <Animated.View key={b.id} entering={FadeInRight.delay(600 + Math.min(i, 6) * 60).duration(400)} style={styles.topBizRow}>
                    <Text style={styles.topBizRank}>{i + 1}</Text>
                    <Text style={styles.topBizName}>{b.name}</Text>
                    <Text style={styles.topBizRev}>{formatPrice(b.revenue)}</Text>
                  </Animated.View>
                ))}
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(700).duration(500)}>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Transactions</Text>
              {TRANSACTIONS.map((t, idx) => (
                <Animated.View key={t.id} entering={FadeInUp.delay(800 + Math.min(idx, 6) * 60).duration(400)} style={styles.txRow}>
                  <View>
                    <Text style={styles.txBusiness}>{t.business}</Text>
                    <Text style={styles.txDate}>{t.date}</Text>
                  </View>
                  <Text style={styles.txAmount}>{formatPrice(t.amount)}</Text>
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        )}

        {activeTab === 'reports' && (
          <View style={styles.tabContent}>
            <Animated.View entering={FadeInDown.duration(400)} style={styles.severitySummary}>
              {[
                { count: highCount, label: 'High', color: colors.destructive },
                { count: mediumCount, label: 'Medium', color: colors.accent },
                { count: lowCount, label: 'Low', color: colors.secondary },
              ].map((sev, idx) => (
                <Animated.View key={sev.label} entering={ZoomIn.delay(idx * 80).duration(400)} style={[styles.severityBadge, { backgroundColor: sev.color + '30' }]}>
                  <Text style={[styles.severityCount, { color: sev.color }]}>{sev.count}</Text>
                  <Text style={styles.severityLabel}>{sev.label}</Text>
                </Animated.View>
              ))}
            </Animated.View>

            {activeReports.map((r, idx) => (
              <Animated.View key={r.id} entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(400)} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportUser}>{r.userName}</Text>
                  <View
                    style={[
                      styles.reportSeverityBadge,
                      r.severity === 'high' && { backgroundColor: colors.destructive + '30' },
                      r.severity === 'medium' && { backgroundColor: colors.accent + '30' },
                      r.severity === 'low' && { backgroundColor: colors.secondary + '30' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reportSeverityText,
                        r.severity === 'high' && { color: colors.destructive },
                        r.severity === 'medium' && { color: colors.accent },
                        r.severity === 'low' && { color: colors.secondary },
                      ]}
                    >
                      {r.severity}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reportReason}>{r.reason}</Text>
                <Text style={styles.reportTime}>{r.time}</Text>
                <View style={styles.reportActions}>
                  <AnimatedPressable
                    style={styles.reportActionBtn}
                    onPress={() => handleReportAction(r.id, 'dismiss')}
                  >
                    <X size={16} color={colors.mutedForeground} />
                    <Text style={styles.reportActionText}>Dismiss</Text>
                  </AnimatedPressable>
                  <AnimatedPressable
                    style={styles.reportActionBtn}
                    onPress={() => handleReportAction(r.id, 'warn')}
                  >
                    <AlertTriangle size={16} color={colors.accent} />
                    <Text style={[styles.reportActionText, { color: colors.accent }]}>Warn</Text>
                  </AnimatedPressable>
                  <AnimatedPressable
                    style={styles.reportActionBtn}
                    onPress={() => handleReportAction(r.id, 'ban')}
                  >
                    <Ban size={16} color={colors.destructive} />
                    <Text style={[styles.reportActionText, { color: colors.destructive }]}>Ban</Text>
                  </AnimatedPressable>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {activeTab === 'ai' && (
          <View style={styles.tabContent}>
            <Animated.View entering={FadeInDown.duration(400)} style={styles.aiHeader}>
              <Sparkles size={24} color={colors.accent} />
              <Text style={styles.aiHeaderText}>Admin AI Assistant</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(100).duration(500)}>
              <ScrollView
                style={styles.aiMessages}
                contentContainerStyle={styles.aiMessagesInner}
                showsVerticalScrollIndicator={false}
              >
                {aiMessages.map((msg, i) => (
                  <View
                    key={i}
                    style={[
                      styles.aiMessage,
                      msg.role === 'user' ? styles.aiMessageUser : styles.aiMessageAssistant,
                    ]}
                  >
                    <Text style={msg.role === 'user' ? styles.aiMessageTextUser : styles.aiMessageTextAssistant}>
                      {msg.text}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).duration(400).springify()} style={styles.aiInputRow}>
              <TextInput
                style={styles.aiInput}
                placeholder="Ask about users, revenue, live, fields..."
                placeholderTextColor={colors.mutedForeground}
                value={aiInput}
                onChangeText={setAiInput}
                onSubmitEditing={sendAIMessage}
                returnKeyType="send"
              />
              <AnimatedPressable style={styles.aiSendBtn} onPress={sendAIMessage}>
                <Send size={20} color={colors.background} />
              </AnimatedPressable>
            </Animated.View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  signOutText: {
    fontSize: 14,
    color: colors.destructive,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tabBarScroll: {
    maxHeight: 48,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.muted,
  },
  tabActive: {
    backgroundColor: colors.primary + '30',
  },
  tabText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
    paddingBottom: 100,
  },
  tabContent: {
    gap: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
    marginTop: 8,
  },
  kpiLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginTop: 8,
  },
  healthBar: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  healthLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickBtnText: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.foreground,
    padding: 0,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  userNameSub: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  banBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.destructive + '20',
  },
  banBtnActive: {
    backgroundColor: colors.primary + '20',
  },
  banBtnText: {
    fontSize: 12,
    color: colors.destructive,
    fontWeight: '600',
  },
  bizCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bizName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  bizOwner: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  bizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  bizMetaText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  bizRevenue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 'auto',
  },
  fieldCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.muted,
  },
  fieldInfo: {
    flex: 1,
    padding: 12,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  fieldMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  fieldMetaText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  fieldSports: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  subsToggle: {
    flexDirection: 'row',
    backgroundColor: colors.muted,
    borderRadius: 10,
    padding: 4,
  },
  subsToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  subsToggleActive: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subsToggleText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  subsToggleTextActive: {
    color: colors.foreground,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  planPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  planFeatureText: {
    fontSize: 14,
    color: colors.foreground,
  },
  subsStats: {
    marginTop: 16,
  },
  subsStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subsStatCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subsStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  subsStatLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  revenueStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  revenueCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  revenueValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginTop: 8,
  },
  revenueLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_CHART_HEIGHT + 24,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '70%',
    backgroundColor: colors.primary,
    borderRadius: 4,
    minHeight: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  topBizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topBizRank: {
    width: 24,
    fontSize: 14,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  topBizName: {
    flex: 1,
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
  },
  topBizRev: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txBusiness: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  txDate: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  severitySummary: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  severityBadge: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  severityCount: {
    fontSize: 24,
    fontWeight: '700',
  },
  severityLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  reportCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reportUser: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  reportSeverityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reportSeverityText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  reportReason: {
    fontSize: 14,
    color: colors.foreground,
    marginBottom: 4,
  },
  reportTime: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 12,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  reportActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  reportActionText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  aiHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  aiMessages: {
    maxHeight: 400,
    marginBottom: 16,
  },
  aiMessagesInner: {
    paddingBottom: 16,
  },
  aiMessage: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '85%',
  },
  aiMessageUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary + '30',
  },
  aiMessageAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiMessageTextUser: {
    fontSize: 14,
    color: colors.foreground,
  },
  aiMessageTextAssistant: {
    fontSize: 14,
    color: colors.foreground,
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiInput: {
    flex: 1,
    fontSize: 16,
    color: colors.foreground,
    paddingVertical: 12,
    padding: 0,
  },
  aiSendBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
  },
});
