import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronDown,
  ChevronUp,
  Trophy,
  Users,
  Calendar,
  Sparkles,
  Send,
  X,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { TOURNAMENTS, SPORTS, LEAGUE_STANDINGS } from '../data/mockData';
import { getTournamentStatusColor, getTournamentStatusLabel } from '../utils/styles';
import AnimatedPressable from '../components/AnimatedPressable';
import BackButton from '../components/BackButton';
import type { Tournament } from '../data/mockData';

interface AiTournamentResult {
  tournaments: Tournament[];
  message: string;
  tags: string[];
}

function generateAiTournamentResult(prompt: string): AiTournamentResult {
  const q = prompt.toLowerCase();
  let results = [...TOURNAMENTS];
  const tags: string[] = [];
  const parts: string[] = [];

  const sportMatch = SPORTS.find(
    (s) => q.includes(s.name.toLowerCase()) || q.includes(s.id),
  );
  if (sportMatch) {
    results = results.filter((t) => t.sport === sportMatch.id);
    tags.push(sportMatch.emoji + ' ' + sportMatch.name);
    parts.push(`${sportMatch.name} tournaments`);
  }

  if (q.includes('open') || q.includes('register') || q.includes('join')) {
    results = results.filter((t) => t.status === 'registration');
    tags.push('📝 Open Registration');
    parts.push('with open registration');
  } else if (q.includes('ongoing') || q.includes('in progress') || q.includes('active') || q.includes('live')) {
    results = results.filter((t) => t.status === 'in-progress');
    tags.push('🔥 In Progress');
    parts.push('currently running');
  } else if (q.includes('finished') || q.includes('completed') || q.includes('ended')) {
    results = results.filter((t) => t.status === 'completed');
    tags.push('✅ Completed');
    parts.push('that have completed');
  }

  if (q.includes('big') || q.includes('large') || q.includes('popular') || q.includes('most')) {
    results.sort((a, b) => b.teamsCount - a.teamsCount);
    tags.push('📊 Largest');
    parts.push('sorted by most teams');
  }

  if (q.includes('prize') || q.includes('money') || q.includes('reward')) {
    results.sort((a, b) => {
      const prizeA = parseInt(a.prizePool.replace(/\D/g, '')) || 0;
      const prizeB = parseInt(b.prizePool.replace(/\D/g, '')) || 0;
      return prizeB - prizeA;
    });
    tags.push('💰 Prize Pool');
    parts.push('sorted by biggest prize pool');
  }

  let message: string;
  if (results.length === 0) {
    message = `No tournaments found matching "${prompt}". Try searching for a sport or status.`;
  } else if (parts.length > 0) {
    message = `Found ${results.length} tournaments — ${parts.join(', ')}.`;
  } else {
    message = `Here are ${results.length} tournaments matching your query.`;
  }

  return { tournaments: results.slice(0, 6), message, tags };
}

const SUGGESTION_CHIPS = [
  'Football tournaments',
  'Open registration',
  'Most popular',
  'Basketball leagues',
  'Biggest prize pool',
];

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const [expanded, setExpanded] = useState(false);
  const sport = SPORTS.find((s) => s.id === tournament.sport);
  const statusColors = getTournamentStatusColor(tournament.status);
  const statusLabel = getTournamentStatusLabel(tournament.status);

  return (
    <View style={styles.tournamentCard}>
      <AnimatedPressable
        style={styles.tournamentHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.85}
      >
        <View style={styles.tournamentMain}>
          <Text style={styles.tournamentName}>{tournament.name}</Text>
          <View style={styles.tournamentMeta}>
            <Text style={styles.sportEmoji}>{sport?.emoji}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors.bg },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {statusLabel}
              </Text>
            </View>
          </View>
          <View style={styles.tournamentStats}>
            <View style={styles.statItem}>
              <Users size={14} color={colors.mutedForeground} />
              <Text style={styles.statText}>{tournament.teamsCount} teams</Text>
            </View>
            <View style={styles.statItem}>
              <Trophy size={14} color={colors.accent} />
              <Text style={styles.statText}>{tournament.prizePool}</Text>
            </View>
            <View style={styles.statItem}>
              <Calendar size={14} color={colors.mutedForeground} />
              <Text style={styles.statText}>
                {tournament.startDate} - {tournament.endDate}
              </Text>
            </View>
          </View>
        </View>
        {expanded ? (
          <ChevronUp size={20} color={colors.mutedForeground} />
        ) : (
          <ChevronDown size={20} color={colors.mutedForeground} />
        )}
      </AnimatedPressable>

      {expanded && (
        <View style={styles.bracketSection}>
          <Text style={styles.bracketTitle}>Teams / Bracket</Text>
          {tournament.teams.map((t, i) => (
            <View key={t.name + i} style={styles.teamRow}>
              <Text style={styles.teamSeed}>#{t.seed}</Text>
              <Text style={styles.teamNameText}>{t.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function TournamentsScreen() {
  const [tab, setTab] = useState<'tournaments' | 'leagues'>('tournaments');
  const [showAi, setShowAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<AiTournamentResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiSearch = useCallback(() => {
    const q = aiPrompt.trim();
    if (!q) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiResult(generateAiTournamentResult(q));
      setAiLoading(false);
    }, 500 + Math.random() * 500);
  }, [aiPrompt]);

  const clearAi = () => {
    setAiResult(null);
    setAiPrompt('');
    setShowAi(false);
  };

  const displayTournaments = aiResult ? aiResult.tournaments : TOURNAMENTS;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Tournaments & Leagues</Text>
        <Text style={styles.subtitle}>
          Join competitions and track brackets
        </Text>
      </Animated.View>

      {/* AI Tournament Scout Banner */}
      {!showAi && !aiResult && (
        <Animated.View entering={FadeInUp.duration(400).delay(100)}>
          <AnimatedPressable
            style={styles.aiBanner}
            onPress={() => setShowAi(true)}
            activeOpacity={0.85}
          >
            <View style={styles.aiBannerIcon}>
              <Trophy size={20} color={colors.white} />
            </View>
            <View style={styles.aiBannerContent}>
              <Text style={styles.aiBannerTitle}>AI Tournament Scout</Text>
              <Text style={styles.aiBannerHint}>
                Try: "Open football tournaments" or "Biggest prize pool"
              </Text>
            </View>
            <Sparkles size={18} color={colors.primary} />
          </AnimatedPressable>
        </Animated.View>
      )}

      {/* AI Search Panel */}
      {showAi && (
        <View style={styles.aiPanel}>
          <View style={styles.aiPanelAccent} />
          <View style={styles.aiPanelHeader}>
            <View style={styles.aiPanelHeaderLeft}>
              <View style={styles.aiPanelIconSmall}>
                <Sparkles size={14} color={colors.white} />
              </View>
              <View>
                <Text style={styles.aiPanelTitle}>AI Tournament Scout</Text>
                <Text style={styles.aiPanelSub}>
                  Ask about tournaments, leagues, teams...
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowAi(false)} hitSlop={8}>
              <X size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <View style={styles.aiInputRow}>
            <View style={styles.aiInputWrapper}>
              <Sparkles
                size={14}
                color={colors.primary + '66'}
                style={styles.aiInputIcon}
              />
              <TextInput
                style={styles.aiInput}
                value={aiPrompt}
                onChangeText={setAiPrompt}
                placeholder='"Open football tournaments"...'
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="search"
                onSubmitEditing={handleAiSearch}
              />
            </View>
            <AnimatedPressable
              style={[
                styles.aiSendBtn,
                (!aiPrompt.trim() || aiLoading) && styles.aiSendBtnDisabled,
              ]}
              onPress={handleAiSearch}
              disabled={!aiPrompt.trim() || aiLoading}
              activeOpacity={0.8}
            >
              {aiLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Send size={16} color={colors.white} />
              )}
            </AnimatedPressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsContent}
          >
            {SUGGESTION_CHIPS.map((chip) => (
              <AnimatedPressable
                key={chip}
                style={styles.chip}
                onPress={() => setAiPrompt(chip)}
                activeOpacity={0.7}
              >
                <Sparkles size={10} color={colors.mutedForeground} />
                <Text style={styles.chipText}>{chip}</Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* AI Result Banner */}
      {aiResult && (
        <View style={styles.aiResultBanner}>
          <View style={styles.aiResultHeader}>
            <View style={styles.aiResultLeft}>
              <View style={styles.aiResultIcon}>
                <Sparkles size={14} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.aiResultLabel}>AI Recommendation</Text>
                <Text style={styles.aiResultQuery}>"{aiPrompt}"</Text>
              </View>
            </View>
            <TouchableOpacity onPress={clearAi} hitSlop={8}>
              <X size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <Text style={styles.aiResultMsg}>{aiResult.message}</Text>
          {aiResult.tags.length > 0 && (
            <View style={styles.aiTagsRow}>
              {aiResult.tags.map((tag) => (
                <View key={tag} style={styles.aiTag}>
                  <Text style={styles.aiTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Tabs */}
      {!aiResult && (
        <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.tabsContainer}>
          <AnimatedPressable
            style={[styles.tabBtn, tab === 'tournaments' && styles.tabBtnActive]}
            onPress={() => setTab('tournaments')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabBtnText,
                tab === 'tournaments' && styles.tabBtnTextActive,
              ]}
            >
              Tournaments
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={[styles.tabBtn, tab === 'leagues' && styles.tabBtnActive]}
            onPress={() => setTab('leagues')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabBtnText,
                tab === 'leagues' && styles.tabBtnTextActive,
              ]}
            >
              Leagues
            </Text>
          </AnimatedPressable>
        </Animated.View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {aiResult ? (
          <>
            {displayTournaments.map((t, index) => (
              <Animated.View key={t.id} entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 80)}>
                <TournamentCard tournament={t} />
              </Animated.View>
            ))}
            {displayTournaments.length === 0 && (
              <View style={styles.emptyState}>
                <Trophy size={40} color={colors.mutedForeground} />
                <Text style={styles.emptyText}>
                  No tournaments match that query. Try a different prompt.
                </Text>
              </View>
            )}
            <AnimatedPressable style={styles.clearAiBtn} onPress={clearAi}>
              <Text style={styles.clearAiText}>Clear AI results</Text>
              <X size={12} color={colors.primary} />
            </AnimatedPressable>
          </>
        ) : tab === 'tournaments' ? (
          TOURNAMENTS.map((t, index) => (
            <Animated.View key={t.id} entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 80)}>
              <TournamentCard tournament={t} />
            </Animated.View>
          ))
        ) : (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Text style={styles.leagueTitle}>Albanian Football League</Text>
            <View style={styles.leagueTable}>
              {/* Table Header */}
              <View style={styles.leagueHeaderRow}>
                <Text style={[styles.leagueHeaderCell, styles.leaguePosCol]}>#</Text>
                <Text style={[styles.leagueHeaderCell, styles.leagueTeamCol]}>Team</Text>
                <Text style={[styles.leagueHeaderCell, styles.leagueStatCol]}>W</Text>
                <Text style={[styles.leagueHeaderCell, styles.leagueStatCol]}>D</Text>
                <Text style={[styles.leagueHeaderCell, styles.leagueStatCol]}>L</Text>
                <Text style={[styles.leagueHeaderCell, styles.leagueStatCol, styles.leaguePtsCol]}>Pts</Text>
              </View>
              {/* Table Rows */}
              {LEAGUE_STANDINGS.map((row, index) => (
                <Animated.View
                  key={row.pos}
                  entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 60)}
                  style={[
                    styles.leagueRow,
                    row.pos <= 3 && styles.leagueRowHighlight,
                  ]}
                >
                  <Text
                    style={[
                      styles.leagueCell,
                      styles.leaguePosCol,
                      row.pos <= 3 && { color: colors.primary },
                    ]}
                  >
                    {row.pos}
                  </Text>
                  <Text
                    style={[styles.leagueCell, styles.leagueTeamCol, styles.leagueTeamName]}
                    numberOfLines={1}
                  >
                    {row.team}
                  </Text>
                  <Text style={[styles.leagueCell, styles.leagueStatCol]}>{row.w}</Text>
                  <Text style={[styles.leagueCell, styles.leagueStatCol, { color: colors.mutedForeground }]}>{row.d}</Text>
                  <Text style={[styles.leagueCell, styles.leagueStatCol, { color: colors.mutedForeground }]}>{row.l}</Text>
                  <Text style={[styles.leagueCell, styles.leagueStatCol, styles.leaguePtsCol, styles.leaguePtsText]}>
                    {row.pts}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}
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
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },

  // AI Banner (collapsed)
  aiBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary + '33',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerContent: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  aiBannerHint: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 2,
  },

  // AI Panel (expanded)
  aiPanel: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary + '33',
    overflow: 'hidden',
  },
  aiPanelAccent: {
    height: 3,
    backgroundColor: colors.primary,
  },
  aiPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  aiPanelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiPanelIconSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPanelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  aiPanelSub: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  aiInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiInputIcon: {
    marginLeft: 12,
  },
  aiInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 13,
    color: colors.foreground,
  },
  aiSendBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSendBtnDisabled: {
    opacity: 0.4,
  },
  chipsScroll: {
    marginTop: 10,
    marginBottom: 14,
  },
  chipsContent: {
    paddingHorizontal: 14,
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.primary + '1A',
    marginRight: 6,
  },
  chipText: {
    fontSize: 11,
    color: colors.mutedForeground,
  },

  // AI Result Banner
  aiResultBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary + '1A',
  },
  aiResultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aiResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiResultIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiResultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  aiResultQuery: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  aiResultMsg: {
    fontSize: 13,
    color: colors.foreground,
    lineHeight: 18,
    marginBottom: 8,
  },
  aiTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  aiTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.primary + '1A',
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 4,
    borderRadius: 12,
    backgroundColor: colors.muted + '4D',
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.card,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  tabBtnTextActive: {
    color: colors.foreground,
  },

  // Clear AI
  clearAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  clearAiText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Tournament Card
  tournamentCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
  },
  tournamentMain: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 8,
  },
  tournamentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sportEmoji: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tournamentStats: {
    gap: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  bracketSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },
  bracketTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  teamSeed: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    width: 28,
  },
  teamNameText: {
    fontSize: 14,
    color: colors.foreground,
  },

  // League Standings
  leagueTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  leagueTable: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  leagueHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  leagueHeaderCell: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '80',
  },
  leagueRowHighlight: {
    backgroundColor: colors.primary + '0D',
  },
  leagueCell: {
    fontSize: 13,
    color: colors.foreground,
  },
  leaguePosCol: {
    width: 28,
  },
  leagueTeamCol: {
    flex: 1,
  },
  leagueTeamName: {
    fontWeight: '600',
  },
  leagueStatCol: {
    width: 36,
    textAlign: 'center',
  },
  leaguePtsCol: {
    fontWeight: '700',
  },
  leaguePtsText: {
    fontWeight: '800',
  },
});
