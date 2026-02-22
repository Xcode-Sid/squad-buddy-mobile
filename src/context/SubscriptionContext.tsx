import React, { createContext, useContext, type ReactNode } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from './AuthContext';
import type { PlanId, BizPlanId } from '../types/subscription';

interface SubContextValue {
  canAccess: (key: string) => boolean;
  userPlanId: PlanId;
  bizPlanId: BizPlanId;
  upgradeUser: (plan: PlanId) => void;
  upgradeBiz: (plan: BizPlanId) => void;
  currentUserPlan: ReturnType<typeof useSubscription>['currentUserPlan'];
  currentBizPlan: ReturnType<typeof useSubscription>['currentBizPlan'];
}

const SubContext = createContext<SubContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const sub = useSubscription(user?.role ?? 'individual');

  return <SubContext.Provider value={sub}>{children}</SubContext.Provider>;
}

export function useSubscriptionContext() {
  const ctx = useContext(SubContext);
  if (!ctx) throw new Error('useSubscriptionContext must be inside SubscriptionProvider');
  return ctx;
}
