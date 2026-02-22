import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Radio, Video, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { formatViewers } from '../utils/formatting';
import { LIVE_GAMES } from '../data/mockData';
import { SPORTS } from '../data/mockData';

function StreamCard({
  game,
  onKill,
  index = 0,
}: {
  game: (typeof LIVE_GAMES)[0];
  onKill: () => void;
  index?: number;
}) {
  const sport = SPORTS.find((s) => s.id === game.sport);

  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index, 6) * 80).duration(500)} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={styles.viewerRow}>
          <Radio size={14} color={colors.mutedForeground} />
          <Text style={styles.viewerText}>{formatViewers(game.viewers)} viewers</Text>
        </View>
      </View>
      <Text style={styles.matchText}>
        {game.teamA.name} vs {game.teamB.name}
      </Text>
      <Text style={styles.sportText}>{sport?.emoji} {sport?.name}</Text>
      <Text style={styles.venueText}>{game.fieldName}</Text>
      <AnimatedPressable style={styles.killBtn} onPress={onKill}>
        <Trash2 size={16} color={colors.primaryForeground} />
        <Text style={styles.killBtnText}>Kill Stream</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function LiveManagementScreen() {
  const handleKillStream = (gameId: string) => {
    Alert.alert('End Stream', 'Are you sure you want to end this stream?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Stream', style: 'destructive', onPress: () => {} },
    ]);
  };

  const handleStartStream = () => {
    Alert.alert('Coming Soon', 'Start new stream will be available soon.');
  };

  const activeStreams = LIVE_GAMES.filter((g) => g.isLive);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Live Management</Text>
        <Text style={styles.subtitle}>Control your streams</Text>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Streams</Text>
          {activeStreams.length === 0 ? (
            <View style={styles.emptyCard}>
              <Video size={48} color={colors.mutedForeground} />
              <Text style={styles.emptyText}>No active streams</Text>
            </View>
          ) : (
            activeStreams.map((game, idx) => (
              <StreamCard
                key={game.id}
                game={game}
                index={idx}
                onKill={() => handleKillStream(game.id)}
              />
            ))
          )}
        </View>

        <Animated.View entering={FadeInUp.springify().delay(320).duration(500)}>
          <AnimatedPressable style={styles.startBtn} onPress={handleStartStream}>
            <Video size={24} color={colors.primaryForeground} />
            <Text style={styles.startBtnText}>Start New Stream</Text>
          </AnimatedPressable>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.live + '20',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.live,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.live,
  },
  viewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewerText: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  matchText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  sportText: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  venueText: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginBottom: 12,
  },
  killBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.destructive,
  },
  killBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.mutedForeground,
    marginTop: 12,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  bottomSpacer: {
    height: 24,
  },
});
