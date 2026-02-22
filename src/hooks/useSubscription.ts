import { useState, useCallback } from 'react';
import type { PlanId, BizPlanId } from '../types/subscription';
import { USER_PLANS, BIZ_PLANS } from '../data/subscriptionPlans';

export function useSubscription(role: 'individual' | 'business' | 'admin') {
  const [userPlanId, setUserPlanId] = useState<PlanId>('free');
  const [bizPlanId, setBizPlanId] = useState<BizPlanId>('starter');

  const currentUserPlan = USER_PLANS.find((p) => p.id === userPlanId)!;
  const currentBizPlan = BIZ_PLANS.find((p) => p.id === bizPlanId)!;

  const canAccess = useCallback(
    (featureKey: string): boolean => {
      if (role === 'admin') return true;
      if (role === 'business') return !currentBizPlan.locked.includes(featureKey);
      return !currentUserPlan.locked.includes(featureKey);
    },
    [role, currentUserPlan, currentBizPlan],
  );

  const upgradeUser = useCallback((plan: PlanId) => setUserPlanId(plan), []);
  const upgradeBiz = useCallback((plan: BizPlanId) => setBizPlanId(plan), []);

  return { userPlanId, bizPlanId, currentUserPlan, currentBizPlan, canAccess, upgradeUser, upgradeBiz };
}
