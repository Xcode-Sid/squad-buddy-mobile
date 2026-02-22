import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { MOCK_LEAGUES } from '../data/leaguesData';
import type { League, LeagueTeam, LeagueMatch } from '../data/leaguesData';

function StandingsTable({ teams }: { teams: LeagueTeam[] }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.thPos]}>#</Text>
        <Text style={[styles.th, styles.thTeam]}>Team</Text>
        <Text style={[styles.th, styles.thNum]}>P</Text>
        <Text style={[styles.th, styles.thNum]}>W</Text>
        <Text style={[styles.th, styles.thNum]}>D</Text>
        <Text style={[styles.th, styles.thNum]}>L</Text>
        <Text style={[styles.th, styles.thNum]}>GD</Text>
        <Text style={[styles.th, styles.thPts]}>Pts</Text>
      </View>
      {teams.map((t) => (
        <View key={t.team} style={styles.tableRow}>
          <Text style={[styles.td, styles.tdPos]}>{t.pos}</Text>
          <View style={styles.teamCell}>
            <Image source={{ uri: t.logo }} style={styles.teamLogo} />
            <Text style={[styles.td, styles.tdTeam]} numberOfLines={1}>
              {t.team}
            </Text>
          </View>
          <Text style={[styles.td, styles.tdNum]}>{t.p}</Text>
          <Text style={[styles.td, styles.tdNum]}>{t.w}</Text>
          <Text style={[styles.td, styles.tdNum]}>{t.d}</Text>
          <Text style={[styles.td, styles.tdNum]}>{t.l}</Text>
          <Text style={[styles.td, styles.tdNum, t.gd >= 0 ? styles.gdPos : styles.gdNeg]}>
            {t.gd > 0 ? '+' : ''}{t.gd}
          </Text>
          <Text style={[styles.td, styles.tdPts, styles.ptsBold]}>{t.pts}</Text>
        </View>
      ))}
    </View>
  );
}

function MatchRow({ m }: { m: LeagueMatch }) {
  return (
    <View style={styles.matchRow}>
      <Text style={styles.matchTeam} numberOfLines={1}>{m.homeTeam}</Text>
      <View style={styles.matchVs}>
        <Text style={styles.matchVsText}>vs</Text>
      </View>
      <Text style={styles.matchTeam} numberOfLines={1}>{m.awayTeam}</Text>
      <Text style={styles.matchDate}>{m.date}</Text>
      <Text style={styles.matchTime}>{m.time}</Text>
    </View>
  );
}

export default function LeaguesScreen() {
  const [selectedLeague, setSelectedLeague] = useState(0);
  const league = MOCK_LEAGUES[selectedLeague];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Leagues</Text>
        <Text style={styles.subtitle}>Standings & fixtures</Text>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.leagueTabs}
        contentContainerStyle={styles.leagueTabsContent}
      >
        {MOCK_LEAGUES.map((l, i) => (
          <Animated.View key={l.id} entering={FadeInRight.delay(i * 80).duration(400)}>
            <AnimatedPressable
              style={[styles.leagueTab, selectedLeague === i && styles.leagueTabActive]}
              onPress={() => setSelectedLeague(i)}
            >
              <Text
                style={[
                  styles.leagueTabText,
                  selectedLeague === i && styles.leagueTabTextActive,
                ]}
                numberOfLines={1}
              >
                {l.name}
              </Text>
            </AnimatedPressable>
          </Animated.View>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Standings</Text>
          <StandingsTable teams={league.teams} />
        </View>

        {league.upcomingMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Matches</Text>
            <View style={styles.matchesCard}>
              {league.upcomingMatches.map((m) => (
                <MatchRow key={m.id} m={m} />
              ))}
            </View>
          </View>
        )}

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
  leagueTabs: {
    marginBottom: 8,
    flexGrow: 0,
  },
  leagueTabsContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingRight: 20,
  },
  leagueTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  leagueTabActive: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
  },
  leagueTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  leagueTabTextActive: {
    color: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  table: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.muted,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  th: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
  },
  thPos: { width: 24 },
  thTeam: { flex: 1, marginLeft: 8 },
  thNum: { width: 28, textAlign: 'center' },
  thPts: { width: 32, textAlign: 'right', fontWeight: '800', color: colors.primary },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  td: {
    fontSize: 13,
    color: colors.foreground,
  },
  tdPos: { width: 24, fontWeight: '600' },
  tdTeam: { flex: 1, marginLeft: 8 },
  tdNum: { width: 28, textAlign: 'center' },
  tdPts: { width: 32, textAlign: 'right' },
  ptsBold: { fontWeight: '700', color: colors.primary },
  teamCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.muted,
  },
  gdPos: { color: colors.green500 },
  gdNeg: { color: colors.destructive },
  matchesCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  matchTeam: {
    flex: 1,
    fontSize: 13,
    color: colors.foreground,
    fontWeight: '500',
  },
  matchVs: {
    width: 36,
    alignItems: 'center',
  },
  matchVsText: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  matchDate: {
    width: 80,
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'right',
  },
  matchTime: {
    width: 50,
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'right',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 24,
  },
});
