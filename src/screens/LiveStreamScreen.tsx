import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Eye, Play, Send } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import ReAnimated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import AnimatedPressable from '../components/AnimatedPressable';
import { LIVE_GAMES, RECENT_GAMES } from '../data/mockData';
import { formatViewers } from '../utils/formatting';
import BackButton from '../components/BackButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const REACTIONS = ['🔥', '⚽', '👏', '❤️', '😱', '💪'];

const MOCK_CHAT = [
  { user: 'Andi H.', msg: 'What a goal! 🔥🔥🔥', time: '2m ago' },
  { user: 'Elira M.', msg: 'FC Tirana looking strong today', time: '3m ago' },
  { user: 'Dritan L.', msg: 'That was offside tbh', time: '4m ago' },
  { user: 'Sara B.', msg: 'Come on Vllaznia! 💪', time: '5m ago' },
  { user: 'Arben K.', msg: 'Great save by the keeper!', time: '6m ago' },
  { user: 'Rina D.', msg: 'This match is insane', time: '7m ago' },
  { user: 'Blerim G.', msg: 'Penalty! Clear foul', time: '8m ago' },
  { user: 'Fjolla B.', msg: '2-1! Let\'s gooo!', time: '9m ago' },
];

type TabKey = 'chat' | 'stats' | 'events';

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
  anim: Animated.Value;
}

export default function LiveStreamScreen() {
  const route = useRoute<any>();
  const { id } = route.params as { id: string };

  const game =
    LIVE_GAMES.find((g) => g.id === id) ??
    RECENT_GAMES.find((g) => g.id === id);

  const [activeTab, setActiveTab] = useState<TabKey>('chat');
  const [chatMsg, setChatMsg] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const reactionId = useRef(0);

  const addReaction = useCallback((emoji: string) => {
    const rId = reactionId.current++;
    const x = Math.random() * (SCREEN_WIDTH * 0.7) + SCREEN_WIDTH * 0.05;
    const anim = new Animated.Value(0);
    const reaction: FloatingReaction = { id: rId, emoji, x, anim };

    setFloatingReactions((prev) => [...prev, reaction]);

    Animated.timing(anim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== rId));
    });
  }, []);

  if (!game) {
    return (
      <SafeAreaView style={styles.safe}>
        <BackButton />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Game not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statsEntries = Object.entries(game.stats);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <ReAnimated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <View style={styles.headerRight}>
          {game.isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}
          <View style={styles.viewersBadge}>
            <Eye size={12} color={colors.mutedForeground} />
            <Text style={styles.viewersText}>
              {formatViewers(game.viewers)}
            </Text>
          </View>
        </View>
      </ReAnimated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Video Player Placeholder ── */}
        <View style={styles.videoContainer}>
          <View style={styles.videoBg}>
            {/* Dark gradient layers */}
            <View style={styles.gradientTop} />
            <View style={styles.gradientBottom} />

            {/* Score overlay at top */}
            <View style={styles.videoScoreOverlay}>
              <View style={styles.videoTeam}>
                <Image
                  source={{ uri: game.teamA.logo }}
                  style={styles.videoTeamLogo}
                />
                <Text style={styles.videoTeamName} numberOfLines={1}>
                  {game.teamA.name}
                </Text>
              </View>
              <View style={styles.videoScoreBox}>
                <Text style={styles.videoScoreText}>
                  {game.teamA.score} - {game.teamB.score}
                </Text>
              </View>
              <View style={styles.videoTeam}>
                <Text style={styles.videoTeamName} numberOfLines={1}>
                  {game.teamB.name}
                </Text>
                <Image
                  source={{ uri: game.teamB.logo }}
                  style={styles.videoTeamLogo}
                />
              </View>
            </View>

            {/* Period / time */}
            <Text style={styles.videoPeriod}>
              {game.period} — {game.gameTime}
            </Text>

            {/* Play button center */}
            <View style={styles.playButtonOuter}>
              <View style={styles.playButton}>
                <Play size={28} color={colors.primary} />
              </View>
            </View>

            <Text style={styles.videoLabel}>Live Stream</Text>
            <Text style={styles.videoSublabel}>Premium Feature</Text>

            {/* LIVE badge inside video */}
            {game.isLive && (
              <View style={styles.videoLiveBadge}>
                <View style={styles.videoLiveDot} />
                <Text style={styles.videoLiveText}>LIVE</Text>
              </View>
            )}

            {/* Floating emoji reactions */}
            {floatingReactions.map((r) => {
              const translateY = r.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -120],
              });
              const opacity = r.anim.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [1, 0.8, 0],
              });
              const scale = r.anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1.3, 1.5],
              });
              return (
                <Animated.Text
                  key={r.id}
                  style={[
                    styles.floatingEmoji,
                    {
                      left: r.x,
                      transform: [{ translateY }, { scale }],
                      opacity,
                    },
                  ]}
                >
                  {r.emoji}
                </Animated.Text>
              );
            })}
          </View>
        </View>

        {/* Field info */}
        <ReAnimated.View entering={FadeInUp.delay(100).duration(500)} style={styles.fieldInfo}>
          <MapPin size={14} color={colors.mutedForeground} />
          <Text style={styles.fieldText}>
            {game.fieldName}, {game.fieldLocation}
          </Text>
        </ReAnimated.View>

        {/* ── Reactions Bar ── */}
        <ReAnimated.View entering={FadeInUp.delay(200).duration(500)} style={styles.reactionsBar}>
          {REACTIONS.map((emoji) => (
            <AnimatedPressable
              key={emoji}
              style={styles.reactionButton}
              onPress={() => addReaction(emoji)}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </AnimatedPressable>
          ))}
        </ReAnimated.View>

        {/* ── Tabs ── */}
        <View style={styles.tabBar}>
          {(['chat', 'stats', 'events'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tab Content ── */}
        {activeTab === 'chat' && (
          <View style={styles.tabContent}>
            {MOCK_CHAT.map((msg, i) => (
              <View key={i} style={styles.chatMessage}>
                <View style={styles.chatAvatar}>
                  <Text style={styles.chatAvatarText}>
                    {msg.user.charAt(0)}
                  </Text>
                </View>
                <View style={styles.chatBody}>
                  <View style={styles.chatMeta}>
                    <Text style={styles.chatUser}>{msg.user}</Text>
                    <Text style={styles.chatTime}>{msg.time}</Text>
                  </View>
                  <Text style={styles.chatText}>{msg.msg}</Text>
                </View>
              </View>
            ))}

            {/* Chat input */}
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                value={chatMsg}
                onChangeText={setChatMsg}
                placeholder="Say something..."
                placeholderTextColor={colors.mutedForeground}
              />
              <TouchableOpacity style={styles.sendButton} activeOpacity={0.7}>
                <Send size={16} color={colors.primaryForeground} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'stats' && (
          <View style={styles.tabContent}>
            {statsEntries.length > 0 ? (
              statsEntries.map(([label, [a, b]]) => {
                const total = a + b;
                const aPct = total > 0 ? (a / total) * 100 : 50;
                return (
                  <View key={label} style={styles.statRow}>
                    <View style={styles.statHeader}>
                      <Text style={styles.statValueLeft}>{a}</Text>
                      <Text style={styles.statLabel}>{label}</Text>
                      <Text style={styles.statValueRight}>{b}</Text>
                    </View>
                    <View style={styles.comparisonBar}>
                      <View
                        style={[
                          styles.comparisonSegment,
                          styles.barA,
                          { width: `${aPct}%` as any },
                        ]}
                      />
                      <View
                        style={[
                          styles.comparisonSegment,
                          styles.barB,
                          { width: `${100 - aPct}%` as any },
                        ]}
                      />
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyText}>No stats available yet</Text>
            )}
          </View>
        )}

        {activeTab === 'events' && (
          <View style={styles.tabContent}>
            {game.events.length > 0 ? (
              game.events.map((evt, i) => (
                <View
                  key={i}
                  style={[
                    styles.eventCard,
                    evt.team === 'A'
                      ? styles.eventCardA
                      : styles.eventCardB,
                  ]}
                >
                  <Text style={styles.eventTime}>{evt.time}</Text>
                  <Text style={styles.eventIcon}>
                    {evt.type === 'goal'
                      ? '⚽'
                      : evt.type === 'yellow-card'
                        ? '🟨'
                        : evt.type === 'red-card'
                          ? '🟥'
                          : '📝'}
                  </Text>
                  <View style={styles.eventBody}>
                    <Text style={styles.eventDesc}>{evt.description}</Text>
                    <Text style={styles.eventPlayer}>{evt.player}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No events recorded yet</Text>
            )}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.live + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.live,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.live,
  },
  viewersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewersText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* ── Video Player Placeholder ── */
  videoContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  videoBg: {
    backgroundColor: '#080b10',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(14, 17, 23, 0.6)',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(14, 17, 23, 0.7)',
  },
  videoScoreOverlay: {
    position: 'absolute',
    top: 14,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTeam: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  videoTeamLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.muted,
  },
  videoTeamName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.foreground,
    maxWidth: 80,
  },
  videoScoreBox: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(22, 27, 34, 0.85)',
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 6,
  },
  videoScoreText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.foreground,
    letterSpacing: 1,
  },
  videoPeriod: {
    position: 'absolute',
    top: 46,
    alignSelf: 'center',
    fontSize: 10,
    fontWeight: '600',
    color: colors.accent,
  },
  playButtonOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  videoLabel: {
    position: 'absolute',
    bottom: 32,
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
  },
  videoSublabel: {
    position: 'absolute',
    bottom: 16,
    fontSize: 11,
    color: colors.mutedForeground,
  },
  videoLiveBadge: {
    position: 'absolute',
    top: 14,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.live,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.white,
  },
  videoLiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  floatingEmoji: {
    position: 'absolute',
    bottom: 10,
    fontSize: 24,
  },

  /* ── Field Info ── */
  fieldInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  fieldText: {
    flex: 1,
    fontSize: 13,
    color: colors.mutedForeground,
  },

  /* ── Reactions Bar ── */
  reactionsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  reactionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionEmoji: {
    fontSize: 18,
  },

  /* ── Tabs ── */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.muted,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.card,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  tabTextActive: {
    color: colors.foreground,
  },

  /* ── Tab Content ── */
  tabContent: {
    gap: 8,
  },

  /* Chat */
  chatMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 6,
  },
  chatAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  chatBody: {
    flex: 1,
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  chatUser: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.foreground,
  },
  chatTime: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  chatText: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 18,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.foreground,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Stats */
  statRow: {
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValueLeft: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
    width: 40,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    textAlign: 'center',
    flex: 1,
  },
  statValueRight: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
    width: 40,
    textAlign: 'right',
  },
  comparisonBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: colors.muted,
    gap: 2,
  },
  comparisonSegment: {
    minWidth: 4,
    borderRadius: 3,
  },
  barA: {
    backgroundColor: colors.primary,
  },
  barB: {
    backgroundColor: colors.secondary,
  },

  /* Events */
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventCardA: {
    backgroundColor: colors.primary + '0D',
  },
  eventCardB: {
    backgroundColor: colors.secondary + '0D',
  },
  eventTime: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    fontVariant: ['tabular-nums'],
    width: 32,
  },
  eventIcon: {
    fontSize: 16,
  },
  eventBody: {
    flex: 1,
  },
  eventDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  eventPlayer: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 2,
  },

  /* Empty / Not-found */
  emptyText: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
    paddingVertical: 32,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
});
