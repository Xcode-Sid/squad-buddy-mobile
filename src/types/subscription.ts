export type PlanId = "free" | "pro" | "elite";
export type BizPlanId = "starter" | "growth" | "premium";

export interface UserPlan {
  id: PlanId;
  name: string;
  price: number;
  yearlyPrice: number;
  color: string;
  accentClass: string;
  bgClass: string;
  borderClass: string;
  features: string[];
  locked: string[];
}

export interface BizPlan {
  id: BizPlanId;
  name: string;
  price: number;
  yearlyPrice: number;
  color: string;
  accentClass: string;
  bgClass: string;
  borderClass: string;
  maxFields: number;
  features: string[];
  locked: string[];
}
