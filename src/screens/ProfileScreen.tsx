import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn, SlideInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Settings,
  Edit3,
  Star,
  Trophy,
  Clock,
  Target,
  Bell,
  Users,
  ChevronRight,
  Calendar,
  Flame,
  MapPin,
  CreditCard,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { SPORTS, ACHIEVEMENTS, PLAYERS, NOTIFICATIONS } from '../data/mockData';
import AnimatedPressable from '../components/AnimatedPressable';
import BackButton from '../components/BackButton';

const RECENT_ACTIVITY = [
  { id: 'a1', emoji: '⚽', title: 'Played at Arena Sport Tirana', time: '2 hours ago', type: 'game' },
  { id: 'a2', emoji: '🏆', title: 'Won Tournament Round 2', time: 'Yesterday', type: 'achievement' },
  { id: 'a3', emoji: '📅', title: 'Booked Padel Club Durrës', time: '2 days ago', type: 'booking' },
  { id: 'a4', emoji: '👥', title: 'Joined Squad "Tirana FC"', time: '3 days ago', type: 'social' },
  { id: 'a5', emoji: '🎯', title: 'New personal best: 5 wins streak', time: '5 days ago', type: 'streak' },
];

export default function ProfileScreen() {
  const nav = useNavigation<any>();
  const { user } = useAuth();

  const isIndividual = user?.role === 'individual';
  const profile = isIndividual ? user : null;

  if (!user) {
    return (
      <SafeAreaView style={st.safe}>
        <View style={st.notFound}>
          <Text style={st.notFoundText}>Please log in</Text>
        </View>
      </SafeAreaView>
    );
  }

  const gamesPlayed = isIndividual && profile && 'gamesPlayed' in profile ? profile.gamesPlayed : 0;
  const winRate = isIndividual && profile && 'winRate' in profile ? profile.winRate : 0;
  const totalHours = isIndividual && profile && 'totalHours' in profile ? profile.totalHours : 0;
  const rating = isIndividual && profile && 'rating' in profile ? profile.rating : 0;
  const bio = isIndividual && profile && 'bio' in profile ? profile.bio : '';
  const username = isIndividual && profile && 'username' in profile ? profile.username : '';
  const location = isIndividual && profile && 'location' in profile ? profile.location : '';
  const sports = isIndividual && profile && 'sports' in profile ? profile.sports : [];
  const achievements = isIndividual && profile && 'achievements' in profile ? profile.achievements : [];
  const friends = isIndividual && profile && 'friends' in profile ? profile.friends : [];
  const memberSince = isIndividual ? 'Jan 2023' : '';

  const unlockedAchievements = ACHIEVEMENTS.filter(a => achievements.includes(a.id));
  const sportChips = sports.map(s => SPORTS.find(sp => sp.id === s)).filter(Boolean);
  const friendProfiles = PLAYERS.filter(p => friends.includes(`player-${p.id}`));
  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length;

  const currentStreak = 7;
  const weeklyGames = 4;

  return (
    <SafeAreaView style={st.safe} edges={['top']}>
      {/* Header */}
      <View style={st.header}>
        <BackButton />
        <Text style={st.title}>Profile</Text>
        <View style={st.headerRight}>
          <TouchableOpacity
            style={st.headerBtn}
            onPress={() => nav.navigate('Notifications')}
          >
            <Bell size={20} color={colors.foreground} />
            {unreadNotifs > 0 && (
              <View style={st.notifBadge}>
                <Text style={st.notifBadgeText}>{unreadNotifs}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={st.headerBtn}
            onPress={() => nav.navigate('Settings')}
          >
            <Settings size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={st.scroll}
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Top */}
        <View style={st.profileTop}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Image source={{ uri: user.avatar }} style={st.avatar} />
          </Animated.View>
          <Animated.Text entering={FadeInDown.duration(500).delay(100)} style={st.name}>{user.name}</Animated.Text>
          {username ? <Animated.Text entering={FadeInDown.duration(400).delay(150)} style={st.username}>{username}</Animated.Text> : null}
          {location ? (
            <Animated.View entering={FadeInDown.duration(400).delay(200)} style={st.locationRow}>
              <MapPin size={12} color={colors.mutedForeground} />
              <Text style={st.locationText}>{location}</Text>
            </Animated.View>
          ) : null}
          {bio ? <Animated.Text entering={FadeInDown.duration(400).delay(250)} style={st.bio}>{bio}</Animated.Text> : null}

          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <AnimatedPressable
              style={st.editBtn}
              onPress={() => nav.navigate('EditProfile')}
            >
              <Edit3 size={16} color={colors.primaryForeground} />
              <Text style={st.editBtnText}>Edit Profile</Text>
            </AnimatedPressable>
          </Animated.View>
        </View>

        {isIndividual && (
          <>
            {/* Quick Stats Bar */}
            <Animated.View entering={FadeInUp.delay(350).duration(500)} style={st.quickStatsBar}>
              <View style={st.quickStat}>
                <Flame size={16} color={colors.accent} />
                <Text style={st.quickStatVal}>{currentStreak}</Text>
                <Text style={st.quickStatLabel}>Day Streak</Text>
              </View>
              <View style={st.quickStatDivider} />
              <View style={st.quickStat}>
                <Calendar size={16} color={colors.secondary} />
                <Text style={st.quickStatVal}>{weeklyGames}</Text>
                <Text style={st.quickStatLabel}>This Week</Text>
              </View>
              <View style={st.quickStatDivider} />
              <View style={st.quickStat}>
                <Users size={16} color={colors.primary} />
                <Text style={st.quickStatVal}>{friendProfiles.length}</Text>
                <Text style={st.quickStatLabel}>Friends</Text>
              </View>
              <View style={st.quickStatDivider} />
              <View style={st.quickStat}>
                <Text style={st.memberLabel}>Since</Text>
                <Text style={st.quickStatVal2}>{memberSince}</Text>
              </View>
            </Animated.View>

            {/* Stats Grid */}
            <View style={st.statsRow}>
              <Animated.View entering={FadeInUp.delay(400).springify()} style={st.statCard}>
                <Target size={20} color={colors.primary} />
                <Text style={st.statValue}>{gamesPlayed}</Text>
                <Text style={st.statLabel}>Games Played</Text>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(480).springify()} style={st.statCard}>
                <Trophy size={20} color={colors.accent} />
                <Text style={st.statValue}>{winRate}%</Text>
                <Text style={st.statLabel}>Win Rate</Text>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(560).springify()} style={st.statCard}>
                <Clock size={20} color={colors.secondary} />
                <Text style={st.statValue}>{totalHours}</Text>
                <Text style={st.statLabel}>Total Hours</Text>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(640).springify()} style={st.statCard}>
                <Star size={20} color={colors.accent} />
                <Text style={st.statValue}>{rating}</Text>
                <Text style={st.statLabel}>Rating</Text>
              </Animated.View>
            </View>

            {/* Sports */}
            {sportChips.length > 0 && (
              <View style={st.section}>
                <Text style={st.sectionTitle}>Sports</Text>
                <View style={st.chipsRow}>
                  {sportChips.map(s =>
                    s ? (
                      <View key={s.id} style={st.chip}>
                        <Text style={st.chipText}>{s.emoji} {s.name}</Text>
                      </View>
                    ) : null,
                  )}
                </View>
              </View>
            )}

            {/* Friends */}
            {friendProfiles.length > 0 && (
              <View style={st.section}>
                <View style={st.sectionHeader}>
                  <Text style={st.sectionTitle}>Friends</Text>
                  <TouchableOpacity onPress={() => nav.navigate('Social')} activeOpacity={0.7}>
                    <Text style={st.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>
                <View style={st.friendsRow}>
                  {friendProfiles.map((f, index) => (
                    <Animated.View key={f.id} entering={FadeInRight.delay(index * 100).springify()} style={st.friendCard}>
                      <Image source={{ uri: f.avatar }} style={st.friendAvatar} />
                      <Text style={st.friendName} numberOfLines={1}>{f.name.split(' ')[0]}</Text>
                      <Text style={st.friendSport}>{SPORTS.find(s => s.id === f.favoriteSport)?.emoji}</Text>
                    </Animated.View>
                  ))}
                  <TouchableOpacity style={st.friendCardAdd} onPress={() => nav.navigate('Social')} activeOpacity={0.8}>
                    <Users size={20} color={colors.primary} />
                    <Text style={st.friendAddText}>Find</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Recent Activity */}
            <View style={st.section}>
              <Text style={st.sectionTitle}>Recent Activity</Text>
              <View style={st.activityList}>
                {RECENT_ACTIVITY.map((a, index) => (
                  <Animated.View key={a.id} entering={FadeInUp.delay(index * 60).springify()} style={st.activityCard}>
                    <Text style={st.activityEmoji}>{a.emoji}</Text>
                    <View style={st.activityBody}>
                      <Text style={st.activityTitle}>{a.title}</Text>
                      <Text style={st.activityTime}>{a.time}</Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* Achievements */}
            <View style={st.section}>
              <View style={st.sectionHeader}>
                <Text style={st.sectionTitle}>Achievements</Text>
                <TouchableOpacity onPress={() => nav.navigate('Badges')} activeOpacity={0.7}>
                  <Text style={st.seeAll}>View All</Text>
                </TouchableOpacity>
              </View>
              {unlockedAchievements.length === 0 ? (
                <Text style={st.emptyText}>No achievements yet</Text>
              ) : (
                <View style={st.achievementsList}>
                  {unlockedAchievements.map(a => (
                    <View key={a.id} style={st.achievementCard}>
                      <Text style={st.achievementEmoji}>{a.emoji}</Text>
                      <View style={st.achievementBody}>
                        <Text style={st.achievementName}>{a.name}</Text>
                        <Text style={st.achievementDesc}>{a.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Quick Links */}
            <View style={st.section}>
              <Text style={st.sectionTitle}>Quick Links</Text>
              {[
                { label: 'My Stats', icon: Target, screen: 'IndividualStats' },
                { label: 'Challenges', icon: Flame, screen: 'Challenges' },
                { label: 'Loyalty Rewards', icon: Star, screen: 'Loyalty' },
                { label: 'Training Plans', icon: Calendar, screen: 'Training' },
                { label: 'Subscription', icon: CreditCard, screen: 'Subscription' },
              ].map((link, index) => (
                <Animated.View key={link.screen} entering={SlideInRight.delay(index * 80).springify()}>
                  <AnimatedPressable
                    style={st.linkRow}
                    onPress={() => nav.navigate(link.screen)}
                  >
                    <link.icon size={18} color={colors.primary} />
                    <Text style={st.linkText}>{link.label}</Text>
                    <ChevronRight size={16} color={colors.mutedForeground} />
                  </AnimatedPressable>
                </Animated.View>
              ))}
            </View>
          </>
        )}

        {user.role === 'business' && (
          <View style={st.section}>
            <Text style={st.sectionTitle}>Business Profile</Text>
            <Text style={st.emptyText}>Switch to business view for full profile.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.foreground },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.destructive,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notifBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16, color: colors.mutedForeground },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  profileTop: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.muted,
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: '800', color: colors.foreground, marginBottom: 4 },
  username: { fontSize: 14, color: colors.mutedForeground, marginBottom: 4 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: { fontSize: 12, color: colors.mutedForeground },
  bio: {
    fontSize: 14,
    color: colors.foreground,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  editBtnText: { fontSize: 14, fontWeight: '600', color: colors.primaryForeground },
  quickStatsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickStat: { alignItems: 'center', gap: 4 },
  quickStatVal: { fontSize: 16, fontWeight: '800', color: colors.foreground },
  quickStatVal2: { fontSize: 12, fontWeight: '700', color: colors.foreground },
  quickStatLabel: { fontSize: 10, color: colors.mutedForeground },
  quickStatDivider: { width: 1, height: 32, backgroundColor: colors.border },
  memberLabel: { fontSize: 10, color: colors.mutedForeground },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.foreground, marginTop: 8 },
  statLabel: { fontSize: 12, color: colors.mutedForeground, marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 12 },
  seeAll: { fontSize: 13, fontWeight: '600', color: colors.primary, marginBottom: 12 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.muted,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { fontSize: 13, color: colors.foreground },
  friendsRow: { flexDirection: 'row', gap: 12 },
  friendCard: {
    alignItems: 'center',
    width: 68,
    gap: 4,
  },
  friendAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.muted,
  },
  friendName: { fontSize: 11, color: colors.foreground, fontWeight: '500' },
  friendSport: { fontSize: 14 },
  friendCardAdd: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    gap: 4,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  friendAddText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  activityList: { gap: 8 },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  activityEmoji: { fontSize: 22 },
  activityBody: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  activityTime: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  achievementsList: { gap: 10 },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementEmoji: { fontSize: 28, marginRight: 14 },
  achievementBody: { flex: 1 },
  achievementName: { fontSize: 15, fontWeight: '600', color: colors.foreground },
  achievementDesc: { fontSize: 13, color: colors.mutedForeground, marginTop: 2 },
  emptyText: { fontSize: 14, color: colors.mutedForeground },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  linkText: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.foreground },
});
