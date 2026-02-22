import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { MOCK_CHALLENGES } from '../data/challengesData';
import type { Challenge, ChallengeCategory } from '../data/challengesData';

const CATEGORIES: { id: ChallengeCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'special', label: 'Special' },
];

export default function ChallengesScreen() {
  const nav = useNavigation();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [category, setCategory] = useState<ChallengeCategory | 'all'>('all');

  const filtered = MOCK_CHALLENGES.filter((c) => {
    const statusMatch = activeTab === 'active'
      ? c.status === 'active'
      : c.status === 'completed';
    const catMatch = category === 'all' || c.category === category;
    return statusMatch && catMatch;
  });

  const formatReward = (c: Challenge) => {
    if (c.rewardType === 'wallet') return `${c.reward.toLocaleString()} ALL`;
    if (c.rewardType === 'points') return `${c.reward} pts`;
    return c.rewardType;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Challenges</Text>
        <Text style={styles.subtitle}>Earn rewards by completing challenges</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.tabs}>
        <AnimatedPressable
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active
          </Text>
        </AnimatedPressable>
        <AnimatedPressable
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            Completed
          </Text>
        </AnimatedPressable>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {CATEGORIES.map((item) => (
          <AnimatedPressable
            key={item.id}
            style={[styles.chip, category === item.id && styles.chipActive]}
            onPress={() => setCategory(item.id)}
          >
            <Text style={[styles.chipText, category === item.id && styles.chipTextActive]}>
              {item.label}
            </Text>
          </AnimatedPressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 80)}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <View style={styles.cardTitleWrap}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardReward}>{formatReward(item)}</Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <Animated.View entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 80 + 200)} style={styles.progressWrap}>
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, (item.progress / item.target) * 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {item.progress} / {item.target}
                </Text>
              </Animated.View>
              {item.status === 'completed' && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓ Completed</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No challenges found</Text>
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
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
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
  chipRow: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.foreground,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  cardTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  cardReward: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  cardDesc: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 12,
    lineHeight: 20,
  },
  progressWrap: {
    marginBottom: 4,
  },
  progressBg: {
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  completedBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary + '2A',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
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
