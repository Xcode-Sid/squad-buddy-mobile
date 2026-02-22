import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Eye,
  Sparkles,
  Send,
  X,
  Clock,
  Bell,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ReAnimated, { FadeInDown, FadeInUp, FadeInRight } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import AnimatedPressable from '../components/AnimatedPressable';
import BackButton from '../components/BackButton';
import { LIVE_GAMES, RECENT_GAMES, SPORTS } from '../data/mockData';
import { formatViewers } from '../utils/formatting';
import type { LiveGame } from '../data/mockData';

const SPORT_FILTERS = ['all', 'football', 'basketball', 'tennis', 'volleyball', 'futsal'] as const;

interface AiGameResult {
  live: LiveGame[];
  recent: LiveGame[];
  message: string;
  tags: string[];
}

function generateAiGameResult(prompt: string): AiGameResult {
  const q = prompt.toLowerCase();
  let live = [...LIVE_GAMES];
  let recent = [...RECENT_GAMES];
  const tags: string[] = [];
  const parts: string[] = [];

  const sportMatch = SPORTS.find(
    (s) => q.includes(s.name.toLowerCase()) || q.includes(s.id),
  );
  if (sportMatch) {
    live = live.filter((g) => g.sport === sportMatch.id);
    recent = recent.filter((g) => g.sport === sportMatch.id);
    tags.push(sportMatch.emoji + ' ' + sportMatch.name);
    parts.push(`${sportMatch.name} games`);
  }

  if (q.includes('most watched') || q.includes('popular') || q.includes('viewers') || q.includes('trending')) {
    live.sort((a, b) => b.viewers - a.viewers);
    tags.push('🔥 Trending');
    parts.push('sorted by most viewers');
  }

  if (q.includes('high score') || q.includes('goals') || q.includes('exciting')) {
    live.sort((a, b) => (b.teamA.score + b.teamB.score) - (a.teamA.score + a.teamB.score));
    recent.sort((a, b) => (b.teamA.score + b.teamB.score) - (a.teamA.score + a.teamB.score));
    tags.push('⚡ High Scoring');
    parts.push('sorted by highest scores');
  }

  if (q.includes('close') || q.includes('tight') || q.includes('intense') || q.includes('competitive')) {
    live.sort((a, b) => Math.abs(a.teamA.score - a.teamB.score) - Math.abs(b.teamA.score - b.teamB.score));
    tags.push('🔥 Close Games');
    parts.push('showing closest matchups');
  }

  if (q.includes('live') || q.includes('happening now') || q.includes('right now')) {
    tags.push('📡 Live Now');
    parts.push('currently live');
  }

  if (q.includes('recent') || q.includes('finished') || q.includes('results')) {
    live = [];
    tags.push('📋 Results');
    parts.push('recent results');
  }

  const totalResults = live.length + recent.length;
  let message: string;

  if (totalResults === 0) {
    message = `No games found matching "${prompt}". Try a sport or "most watched".`;
  } else if (parts.length > 0) {
    message = `Found ${totalResults} games — ${parts.join(', ')}.`;
  } else {
    message = `Here are ${totalResults} games matching your search.${live.length > 0 ? ` ${live.length} are live now!` : ''}`;
  }

  return { live: live.slice(0, 5), recent: recent.slice(0, 5), message, tags };
}

const SUGGESTION_CHIPS = [
  'Most watched live games',
  'Football in Tirana',
  'Close competitive matches',
  'High scoring games',
  'Recent basketball results',
];

const UPCOMING_GAMES = [
  { teams: 'KF Partizani vs KF Bylis', time: 'Today 20:00', sport: '⚽' },
  { teams: 'BC Elbasan vs BC Fier', time: 'Tomorrow 18:00', sport: '🏀' },
  { teams: 'VC Shkodër vs VC Korçë', time: 'Wed 19:30', sport: '🏐' },
];

function PulsingDot() {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);
  return <Animated.View style={[styles.liveDot, { opacity }]} />;
}

function GameCard({
  game,
  onPress,
}: {
  game: LiveGame;
  onPress: () => void;
}) {
  const sport = SPORTS.find((s) => s.id === game.sport);

  return (
    <AnimatedPressable
      style={styles.gameCard}
      onPress={onPress}
    >
      <View style={styles.gameHeader}>
        <View style={styles.teamsRow}>
          <Text style={styles.teamName} numberOfLines={1}>
            {game.teamA.name}
          </Text>
          <View style={styles.scoreBox}>
            {game.isLive && <PulsingDot />}
            <Text style={styles.score}>
              {game.teamA.score} - {game.teamB.score}
            </Text>
          </View>
          <Text style={styles.teamName} numberOfLines={1}>
            {game.teamB.name}
          </Text>
        </View>
        <View style={styles.gameMeta}>
          <Text style={styles.sportBadge}>
            {sport?.emoji} {sport?.name || game.sport}
          </Text>
          <Text style={styles.gameTime}>{game.gameTime}</Text>
        </View>
      </View>
      <View style={styles.gameFooter}>
        <View style={styles.fieldRow}>
          <MapPin size={12} color={colors.mutedForeground} />
          <Text style={styles.fieldText} numberOfLines={1}>
            {game.fieldName}, {game.fieldLocation}
          </Text>
        </View>
        <View style={styles.viewersRow}>
          <Eye size={12} color={colors.mutedForeground} />
          <Text style={styles.viewersText}>{formatViewers(game.viewers)}</Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default function LiveScoresScreen() {
  const nav = useNavigation<any>();
  const [filter, setFilter] = useState<string>('all');
  const [showAi, setShowAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<AiGameResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const filteredLive =
    filter === 'all' ? LIVE_GAMES : LIVE_GAMES.filter((g) => g.sport === filter);
  const filteredRecent =
    filter === 'all' ? RECENT_GAMES : RECENT_GAMES.filter((g) => g.sport === filter);

  const handleAiSearch = useCallback(() => {
    const q = aiPrompt.trim();
    if (!q) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiResult(generateAiGameResult(q));
      setAiLoading(false);
    }, 500 + Math.random() * 500);
  }, [aiPrompt]);

  const clearAi = () => {
    setAiResult(null);
    setAiPrompt('');
    setShowAi(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ReAnimated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <View style={styles.titleRow}>
          <BackButton />
          <Text style={styles.title}>Live Scores</Text>
          <Text style={styles.liveCountBadge}>
            {LIVE_GAMES.length} live now
          </Text>
        </View>
        <Text style={styles.subtitle}>Watch live games and recent results</Text>
      </ReAnimated.View>

      {/* AI Game Finder Banner */}
      {!showAi && !aiResult && (
        <TouchableOpacity
          style={styles.aiBanner}
          onPress={() => setShowAi(true)}
          activeOpacity={0.85}
        >
          <View style={styles.aiBannerIcon}>
            <Sparkles size={20} color={colors.white} />
          </View>
          <View style={styles.aiBannerContent}>
            <Text style={styles.aiBannerTitle}>AI Game Finder</Text>
            <Text style={styles.aiBannerHint}>
              Try: "Most watched football" or "Close matches"
            </Text>
          </View>
          <Sparkles size={18} color={colors.secondary} />
        </TouchableOpacity>
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
                <Text style={styles.aiPanelTitle}>AI Game Finder</Text>
                <Text style={styles.aiPanelSub}>
                  Ask about live games, scores, teams...
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
                color={colors.secondary + '66'}
                style={styles.aiInputIcon}
              />
              <TextInput
                style={styles.aiInput}
                value={aiPrompt}
                onChangeText={setAiPrompt}
                placeholder='"Most watched football game"...'
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="search"
                onSubmitEditing={handleAiSearch}
              />
            </View>
            <TouchableOpacity
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
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsContent}
          >
            {SUGGESTION_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip}
                style={styles.chip}
                onPress={() => setAiPrompt(chip)}
                activeOpacity={0.7}
              >
                <Sparkles size={10} color={colors.mutedForeground} />
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
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
                <Sparkles size={14} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.aiResultLabel}>AI Analysis</Text>
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

      {/* Sport filter tabs */}
      {!aiResult && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sportFilterScroll}
          contentContainerStyle={styles.sportFilterContent}
        >
          {SPORT_FILTERS.map((s) => {
            const sport = s === 'all' ? null : SPORTS.find((sp) => sp.id === s);
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.sportFilterBtn,
                  filter === s && styles.sportFilterBtnActive,
                ]}
                onPress={() => setFilter(s)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sportFilterText,
                    filter === s && styles.sportFilterTextActive,
                  ]}
                >
                  {s === 'all' ? 'All Sports' : `${sport?.emoji} ${sport?.name}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {aiResult ? (
          <>
            {/* AI Live */}
            {aiResult.live.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.liveBadge}>
                    <PulsingDot />
                    <Text style={styles.liveBadgeText}>Live Now</Text>
                  </View>
                </View>
                {aiResult.live.map((game, idx) => (
                  <ReAnimated.View entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(500)} key={game.id}>
                    <GameCard
                      game={game}
                      onPress={() => nav.navigate('LiveStream', { id: game.id })}
                    />
                  </ReAnimated.View>
                ))}
              </View>
            )}

            {/* AI Recent */}
            {aiResult.recent.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Results</Text>
                {aiResult.recent.map((game, idx) => (
                  <ReAnimated.View entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(500)} key={game.id}>
                    <GameCard
                      game={game}
                      onPress={() => nav.navigate('LiveStream', { id: game.id })}
                    />
                  </ReAnimated.View>
                ))}
              </View>
            )}

            {aiResult.live.length === 0 && aiResult.recent.length === 0 && (
              <View style={styles.emptyState}>
                <Sparkles size={40} color={colors.mutedForeground} />
                <Text style={styles.emptyText}>
                  No games match that query. Try a different prompt.
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.clearAiBtn} onPress={clearAi}>
              <Text style={styles.clearAiText}>Clear AI results</Text>
              <X size={12} color={colors.secondary} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Live Games */}
            {filteredLive.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.liveBadge}>
                    <PulsingDot />
                    <Text style={styles.liveBadgeText}>Live Now</Text>
                  </View>
                </View>
                {filteredLive.map((game, idx) => (
                  <ReAnimated.View entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(500)} key={game.id}>
                    <GameCard
                      game={game}
                      onPress={() =>
                        nav.navigate('LiveStream', { id: game.id })
                      }
                    />
                  </ReAnimated.View>
                ))}
              </View>
            )}

            {/* Recent Results */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Games</Text>
              {filteredRecent.map((game, idx) => (
                <ReAnimated.View entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(500)} key={game.id}>
                  <GameCard
                    game={game}
                    onPress={() =>
                      nav.navigate('LiveStream', { id: game.id })
                    }
                  />
                </ReAnimated.View>
              ))}
            </View>

            {/* Upcoming Games */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming</Text>
              {UPCOMING_GAMES.map((g, i) => (
                <ReAnimated.View entering={FadeInUp.delay(Math.min(i, 6) * 80).duration(500)} key={i} style={styles.upcomingCard}>
                  <View style={styles.upcomingLeft}>
                    <Text style={styles.upcomingSport}>{g.sport}</Text>
                    <View>
                      <Text style={styles.upcomingTeams}>{g.teams}</Text>
                      <View style={styles.upcomingTimeRow}>
                        <Clock size={12} color={colors.mutedForeground} />
                        <Text style={styles.upcomingTime}>{g.time}</Text>
                      </View>
                    </View>
                  </View>
                  <AnimatedPressable style={styles.remindBtn}>
                    <Bell size={12} color={colors.foreground} />
                    <Text style={styles.remindText}>Remind</Text>
                  </AnimatedPressable>
                </ReAnimated.View>
              ))}
            </View>
          </>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
  },
  liveCountBadge: {
    fontSize: 12,
    color: colors.mutedForeground,
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
    borderColor: colors.secondary + '33',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerContent: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
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
    borderColor: colors.secondary + '33',
    overflow: 'hidden',
  },
  aiPanelAccent: {
    height: 3,
    backgroundColor: colors.secondary,
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
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPanelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
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
    backgroundColor: colors.secondary,
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
    borderColor: colors.secondary + '1A',
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
    borderColor: colors.secondary + '1A',
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
    backgroundColor: colors.secondary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiResultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
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
    backgroundColor: colors.secondary + '1A',
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.secondary,
  },

  // Sport Filter Tabs
  sportFilterScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  sportFilterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  sportFilterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.muted,
    marginRight: 8,
  },
  sportFilterBtnActive: {
    backgroundColor: colors.primary,
  },
  sportFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  sportFilterTextActive: {
    color: colors.primaryForeground,
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
    color: colors.secondary,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.live,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.live,
  },

  // Game Card
  gameCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gameHeader: {
    marginBottom: 12,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teamName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  score: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.foreground,
  },
  gameMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sportBadge: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  gameTime: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  gameFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  fieldText: {
    fontSize: 12,
    color: colors.mutedForeground,
    flex: 1,
  },
  viewersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewersText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },

  // Upcoming
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  upcomingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  upcomingSport: {
    fontSize: 18,
  },
  upcomingTeams: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  upcomingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  upcomingTime: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  remindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.muted,
  },
  remindText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.foreground,
  },
});
