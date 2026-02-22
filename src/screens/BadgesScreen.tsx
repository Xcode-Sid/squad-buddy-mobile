import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { MOCK_BADGES } from '../data/badgesData';
import type { Badge, BadgeRarity } from '../data/badgesData';

const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#71717a',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

const FILTERS = ['all', 'unlocked', 'locked'] as const;

export default function BadgesScreen() {
  const nav = useNavigation();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');

  const filtered = MOCK_BADGES.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return b.unlocked;
    return !b.unlocked;
  });

  const unlockedCount = MOCK_BADGES.filter((b) => b.unlocked).length;
  const totalCount = MOCK_BADGES.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const numColumns = 3;
  const { width } = Dimensions.get('window');
  const gap = 12;
  const cardWidth = (width - 40 - gap * (numColumns - 1)) / numColumns;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.subtitle}>Your achievement collection</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Collection Progress</Text>
          <Text style={styles.progressCount}>{unlockedCount} / {totalCount}</Text>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.tabs}>
        {FILTERS.map((f) => (
          <AnimatedPressable
            key={f}
            style={styles.tabWrap}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
            {filter === f && <View style={styles.tabIndicator} />}
          </AnimatedPressable>
        ))}
      </Animated.View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key="grid"
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item, index }) => (
          <Animated.View entering={ZoomIn.duration(400).delay(Math.min(index, 6) * 80)} style={[styles.badgeCard, { width: cardWidth }]}>
            <View
              style={[
                styles.rarityBar,
                { backgroundColor: RARITY_COLORS[item.rarity] },
              ]}
            />
            <Text style={styles.badgeEmoji}>{item.emoji}</Text>
            <Text
              style={[styles.badgeName, !item.unlocked && styles.badgeNameLocked]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            {!item.unlocked && item.progress !== undefined && item.target !== undefined && (
              <View style={styles.badgeProgress}>
                <View style={styles.badgeProgressBg}>
                  <View
                    style={[
                      styles.badgeProgressFill,
                      {
                        width: `${Math.min(100, (item.progress / item.target) * 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.badgeProgressText}>
                  {item.progress}/{item.target}
                </Text>
              </View>
            )}
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No badges found</Text>
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
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  progressBg: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 24,
  },
  tabWrap: {
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  badgeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  rarityBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  badgeEmoji: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: colors.mutedForeground,
    opacity: 0.8,
  },
  badgeProgress: {
    marginTop: 8,
  },
  badgeProgressBg: {
    height: 4,
    backgroundColor: colors.muted,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  badgeProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  badgeProgressText: {
    fontSize: 10,
    color: colors.mutedForeground,
    textAlign: 'center',
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
