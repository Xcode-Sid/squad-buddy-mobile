import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Trophy, Target, Clock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import { CURRENT_PLAYER } from '../data/mockData';
import { ACHIEVEMENTS } from '../data/mockData';
import { SPORTS } from '../data/mockData';

const MONTHLY_ACTIVITY = [12, 18, 15, 22, 19, 25, 20, 18, 24, 21, 19, 23];
const MAX_ACTIVITY = Math.max(...MONTHLY_ACTIVITY);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.unlocked);

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '20' }]}>
        <Icon size={22} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function IndividualStatsScreen() {
  const sportCounts = CURRENT_PLAYER.sports.reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sortedSports = Object.entries(sportCounts).sort((a, b) => b[1] - a[1]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>My Stats</Text>
        <Text style={styles.subtitle}>Your performance overview</Text>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(500)} style={styles.profileRow}>
          <Image source={{ uri: CURRENT_PLAYER.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.playerName}>{CURRENT_PLAYER.name}</Text>
            <Text style={styles.playerUsername}>{CURRENT_PLAYER.username}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.statsGrid}>
          <StatCard
            icon={Trophy}
            label="Games Played"
            value={CURRENT_PLAYER.gamesPlayed}
            color={colors.primary}
          />
          <StatCard
            icon={Target}
            label="Win Rate"
            value={`${CURRENT_PLAYER.winRate}%`}
            color={colors.accent}
          />
          <StatCard
            icon={Clock}
            label="Total Hours"
            value={`${CURRENT_PLAYER.totalHours}h`}
            color={colors.secondary}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Sport Breakdown</Text>
          <View style={styles.sportBreakdown}>
            {sortedSports.slice(0, 5).map(([sportId, count]) => {
              const sport = SPORTS.find((s) => s.id === sportId);
              const pct = (count / CURRENT_PLAYER.sports.length) * 100;
              return (
                <View key={sportId} style={styles.sportRow}>
                  <Text style={styles.sportEmoji}>{sport?.emoji}</Text>
                  <Text style={styles.sportName}>{sport?.name}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${Math.min(100, pct * 2)}%` }]} />
                  </View>
                  <Text style={styles.sportCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Activity</Text>
          <View style={styles.chartCard}>
            <View style={styles.barChart}>
              {MONTHLY_ACTIVITY.map((v, i) => (
                <View key={i} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height: Math.max(4, (v / MAX_ACTIVITY) * 80) },
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

        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsCard}>
            {unlockedAchievements.slice(0, 5).map((a) => (
              <View key={a.id} style={styles.achievementRow}>
                <Text style={styles.achievementEmoji}>{a.emoji}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{a.name}</Text>
                  <Text style={styles.achievementDesc}>{a.description}</Text>
                </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.muted,
  },
  profileInfo: {
    marginLeft: 14,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  playerUsername: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 4,
    textAlign: 'center',
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
  sportBreakdown: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sportEmoji: {
    fontSize: 18,
    width: 28,
  },
  sportName: {
    fontSize: 14,
    color: colors.foreground,
    width: 100,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sportCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    width: 24,
    textAlign: 'right',
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
  achievementsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  achievementEmoji: {
    fontSize: 24,
    width: 36,
    textAlign: 'center',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
  },
  achievementDesc: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  bottomSpacer: {
    height: 24,
  },
});
