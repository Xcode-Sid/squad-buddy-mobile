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
import { Star } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { formatPrice } from '../utils/formatting';
import { MOCK_TRAINING_PROGRAMS } from '../data/trainingData';
import { SPORTS } from '../data/mockData';
import type { TrainingProgram, ProgramLevel } from '../data/trainingData';

const LEVEL_COLORS: Record<ProgramLevel, string> = {
  beginner: colors.green500,
  intermediate: colors.blue500,
  advanced: colors.orange500,
  elite: colors.destructive,
};

type TabId = 'browse' | 'enrolled' | 'completed';

function ProgramCard({ item, index }: { item: TrainingProgram; index: number }) {
  const sport = SPORTS.find((s) => s.id === item.sport);
  const levelColor = LEVEL_COLORS[item.level];

  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index, 6) * 80).duration(500)} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.coachRow}>
          <Image source={{ uri: item.coachAvatar }} style={styles.coachAvatar} />
          <Text style={styles.coachName}>{item.coach}</Text>
        </View>
        <View style={styles.metaRow}>
          <View style={[styles.levelBadge, { backgroundColor: levelColor + '20' }]}>
            <Text style={[styles.levelText, { color: levelColor }]}>
              {item.level}
            </Text>
          </View>
          <Text style={styles.sportText}>{sport?.emoji} {sport?.name}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.ratingRow}>
            <Star size={14} color={colors.accent} fill={colors.accent} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.enrolledText}>{item.enrolledCount} enrolled</Text>
          <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
        </View>
        {item.progress !== undefined && item.progress < 100 && (
          <View style={styles.progressWrap}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${item.progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{item.progress}% complete</Text>
          </View>
        )}
        {item.status === 'available' && (
          <AnimatedPressable style={styles.enrollBtn}>
            <Text style={styles.enrollBtnText}>Enroll</Text>
          </AnimatedPressable>
        )}
      </View>
    </Animated.View>
  );
}

export default function TrainingScreen() {
  const [tab, setTab] = useState<TabId>('browse');

  const browsePrograms = MOCK_TRAINING_PROGRAMS.filter(
    (p) => p.status === 'available'
  );
  const enrolledPrograms = MOCK_TRAINING_PROGRAMS.filter(
    (p) => p.status === 'enrolled'
  );
  const completedPrograms = MOCK_TRAINING_PROGRAMS.filter(
    (p) => p.status === 'completed'
  );

  const data =
    tab === 'browse'
      ? browsePrograms
      : tab === 'enrolled'
        ? enrolledPrograms
        : completedPrograms;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Training</Text>
        <Text style={styles.subtitle}>Improve your game with programs</Text>
      </Animated.View>

      <View style={styles.tabs}>
        {(['browse', 'enrolled', 'completed'] as const).map((t) => (
          <AnimatedPressable
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </AnimatedPressable>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <ProgramCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {tab === 'browse'
                ? 'No programs available'
                : tab === 'enrolled'
                  ? 'No enrolled programs'
                  : 'No completed programs'}
            </Text>
          </View>
        }
      />
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  tabTextActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.muted,
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 10,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  coachAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.muted,
  },
  coachName: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sportText: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: colors.foreground,
    fontWeight: '600',
  },
  enrolledText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 'auto',
  },
  progressWrap: {
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  enrollBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  enrollBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.mutedForeground,
  },
});
