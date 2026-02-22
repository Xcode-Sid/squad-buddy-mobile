import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import {
  MOCK_LOYALTY,
  MOCK_REWARDS,
  MOCK_COUPONS,
  TIER_INFO,
} from '../data/loyaltyData';
import type { LoyaltyTier } from '../data/loyaltyData';

const TIER_COLORS: Record<LoyaltyTier, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#f59e0b',
  platinum: '#06b6d4',
  diamond: '#a855f7',
};

export default function LoyaltyScreen() {
  const nav = useNavigation();
  const { points, tier, nextTier, pointsToNextTier } = MOCK_LOYALTY;
  const tierInfo = TIER_INFO[tier];
  const nextTierInfo = nextTier ? TIER_INFO[nextTier] : null;

  const activeCoupons = MOCK_COUPONS.filter((c) => !c.isUsed);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Loyalty</Text>
        <Text style={styles.subtitle}>Points & rewards</Text>
      </Animated.View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={ZoomIn.duration(500).delay(100)} style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <Text style={styles.tierEmoji}>{tierInfo.emoji}</Text>
            <View style={styles.tierInfo}>
              <Text style={styles.tierName}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</Text>
              <Text style={styles.tierPoints}>{points.toLocaleString()} points</Text>
            </View>
          </View>
          {nextTier && nextTierInfo && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress to {nextTier}</Text>
                <Text style={styles.progressVal}>{pointsToNextTier.toLocaleString()} pts to go</Text>
              </View>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(100, (points / (nextTierInfo?.min ?? 10000)) * 100)}%`,
                      backgroundColor: nextTier ? TIER_COLORS[nextTier] : colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(200)}>
          <Text style={styles.sectionTitle}>Rewards Marketplace</Text>
        </Animated.View>
        <View style={styles.rewardsGrid}>
          {MOCK_REWARDS.map((r, index) => (
            <Animated.View key={r.id} entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 80)} style={styles.rewardCard}>
              <Text style={styles.rewardEmoji}>{r.emoji}</Text>
              <Text style={styles.rewardName} numberOfLines={2}>{r.name}</Text>
              <Text style={styles.rewardCost}>{r.pointsCost.toLocaleString()} pts</Text>
              <AnimatedPressable
                style={[styles.redeemBtn, !r.available && styles.redeemBtnDisabled]}
                disabled={!r.available}
              >
                <Text
                  style={[
                    styles.redeemBtnText,
                    !r.available && styles.redeemBtnTextDisabled,
                  ]}
                >
                  {r.available ? 'Redeem' : 'Unavailable'}
                </Text>
              </AnimatedPressable>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.duration(400)}>
          <Text style={styles.sectionTitle}>Active Coupons</Text>
        </Animated.View>
        <View style={styles.couponList}>
          {activeCoupons.map((c, index) => (
            <Animated.View key={c.id} entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 80)} style={styles.couponCard}>
              <View style={styles.couponMain}>
                <Text style={styles.couponCode}>{c.code}</Text>
                <Text style={styles.couponDesc}>{c.description}</Text>
                <Text style={styles.couponExp}>Expires {c.expiresAt}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
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
    marginTop: 12,
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
  tierCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.foreground,
  },
  tierPoints: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  progressSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
  progressVal: {
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
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  rewardCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rewardEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 6,
  },
  rewardCost: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 10,
  },
  redeemBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemBtnDisabled: {
    backgroundColor: colors.muted,
  },
  redeemBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  redeemBtnTextDisabled: {
    color: colors.mutedForeground,
  },
  couponList: {
    gap: 10,
  },
  couponCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  couponMain: {
    flex: 1,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  couponDesc: {
    fontSize: 14,
    color: colors.foreground,
    marginBottom: 4,
  },
  couponExp: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
});
