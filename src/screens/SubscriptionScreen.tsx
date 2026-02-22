import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Check } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { USER_PLANS, BIZ_PLANS } from '../data/subscriptionPlans';
import { useSubscriptionContext } from '../context/SubscriptionContext';
import { formatPrice } from '../utils/formatting';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';

export default function SubscriptionScreen() {
  const nav = useNavigation<any>();
  const { user } = useAuth();
  const {
    userPlanId,
    bizPlanId,
    currentUserPlan,
    currentBizPlan,
    upgradeUser,
    upgradeBiz,
  } = useSubscriptionContext();

  const isBusiness = user?.role === 'business';
  const plans = isBusiness ? BIZ_PLANS : USER_PLANS;
  const currentPlanId = isBusiness ? bizPlanId : userPlanId;
  const upgradeFn = (id: string) => {
    if (isBusiness) upgradeBiz(id as any);
    else upgradeUser(id as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>
          {isBusiness ? 'Business Plan' : 'Subscription'}
        </Text>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(500)} style={styles.currentWrap}>
          <Text style={styles.currentLabel}>Current Plan</Text>
          <Text style={styles.currentName}>
            {isBusiness ? currentBizPlan.name : currentUserPlan.name}
          </Text>
        </Animated.View>

        <View style={styles.plansList}>
          {plans.map((plan, index) => {
            const isCurrent = plan.id === currentPlanId;

            return (
              <Animated.View
                key={plan.id}
                entering={ZoomIn.delay(Math.min(index, 6) * 80).duration(500)}
                style={[
                  styles.planCard,
                  isCurrent && styles.planCardCurrent,
                ]}
              >
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, isCurrent && styles.planNameCurrent]}>
                    {plan.name}
                  </Text>
                  <Text style={styles.planPrice}>
                    {plan.price === 0
                      ? 'Free'
                      : `${formatPrice(plan.price)}/mo`}
                  </Text>
                </View>
                <View style={styles.featuresList}>
                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Check size={16} color={colors.primary} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>
                <Animated.View entering={FadeInUp.delay(Math.min(index, 6) * 100 + 200).springify()}>
                  <AnimatedPressable
                    style={[
                      styles.upgradeBtn,
                      isCurrent && styles.upgradeBtnCurrent,
                    ]}
                    onPress={() => !isCurrent && upgradeFn(plan.id)}
                    disabled={isCurrent}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.upgradeBtnText,
                        isCurrent && styles.upgradeBtnTextCurrent,
                      ]}
                    >
                      {isCurrent ? 'Current Plan' : 'Upgrade'}
                    </Text>
                  </AnimatedPressable>
                </Animated.View>
              </Animated.View>
            );
          })}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginLeft: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  currentWrap: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    marginBottom: 24,
  },
  currentLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  currentName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  plansList: {
    gap: 16,
  },
  planCard: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planCardCurrent: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '0D',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  planNameCurrent: {
    color: colors.primary,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  featuresList: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: colors.foreground,
    flex: 1,
  },
  upgradeBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  upgradeBtnCurrent: {
    backgroundColor: colors.muted,
  },
  upgradeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  upgradeBtnTextCurrent: {
    color: colors.mutedForeground,
  },
});
