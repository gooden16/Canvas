// Canvas Types

export type BuildingBlockType = 
  | 'metric'
  | 'asset'
  | 'liability'
  | 'collateral'
  | 'money-movement'
  | 'business-logic'
  | 'user';

export type ViewAccessType = 'unrestricted' | 'restricted';
export type TransactionAccessType = 
  | 'unrestricted' 
  | 'value_restricted' 
  | 'count_restricted'
  | 'no_transactions';

export interface UserBlock {
  id: string;
  type: 'user';
  name: string;
  email: string;
  viewAccess: {
    type: ViewAccessType;
    allowedBlocks?: string[]; // Block IDs when restricted
  };
  transactionAccess: {
    type: TransactionAccessType;
    accountLimits?: Record<string, {
      maxValue?: number;
      maxCount?: number;
    }>;
  };
}

export type MetricCategory = 'business' | 'investment' | 'liquidity' | 'risk' | 'custom';
export type MetricType = 'single_value' | 'time_series' | 'ratio' | 'comparison';
export type VisualizationType = 'number' | 'gauge' | 'line_chart' | 'bar_chart' | 'progress' | 'comparison';
export type FrequencyType = 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

export interface MetricBlock {
  id: string;
  type: 'metric';
  phase: 'initial' | 'active';
  displayName: string;
  description?: string;
  category: MetricCategory;
  metricType: MetricType;
  visualizationPreference: VisualizationType;
  desiredFrequency: FrequencyType;
  priority: 'high' | 'medium' | 'low';
}

export type AccountType = 'operating' | 'reserve';
export type TransactionVolume = 'low' | 'medium' | 'high';

export interface AssetBlock {
  id: string;
  type: 'asset';
  accountType: AccountType;
  displayName: string;
  transactionVolume: TransactionVolume;
  balanceParameters: {
    expected: number;
    minimum: number;
    peak: number;
  };
  yieldOptimization: {
    enabled: boolean;
    excessThreshold: number;
    timing: 'daily' | 'weekly';
    returnTriggers: {
      condition: 'balance_below' | 'scheduled';
      value?: number;
    }[];
    level: 'conservative' | 'balanced' | 'aggressive';
    approvalWorkflow: 'automatic' | 'notification' | 'approval';
  };
}

export type DrawdownTiming = 'immediate' | 'within_90_days' | 'extended_period';
export type RepaymentFrequency = 'monthly' | 'quarterly' | 'annually';
export type RepaymentType = 'principal_and_interest' | 'interest_only';

export interface LiabilityBlock {
  id: string;
  type: 'liability';
  displayName: string;
  requestedAmount: number;
  drawdownTiming: DrawdownTiming;
  durationYears: number;
  repaymentFrequency: RepaymentFrequency;
  repaymentType: RepaymentType;
  requiresCollateral: boolean;
}

export type CollateralAssetType = 'real_estate' | 'public_securities' | 'private_securities' | 'other_assets';

export interface CollateralBlock {
  id: string;
  type: 'collateral';
  assetType: CollateralAssetType;
  value: number;
  location: {
    type: 'broker_dealer' | 'physical_address';
    details: string;
  };
  liabilityId: string;
}

export type CardPaymentTiming = 'same_day' | 'weekly' | 'monthly';
export type CardRewardType = 'cash' | 'travel';

export interface MoneyMovementBlock {
  id: string;
  type: 'money-movement';
  merchantPayments: boolean;
  cashDeposits: boolean;
  checkDeposits: boolean;
  atmWithdrawals: boolean;
  cardConfiguration?: {
    paymentTiming: CardPaymentTiming;
    rewardType: CardRewardType;
  };
}

export type BusinessRuleTrigger = 
  | 'balance_below'
  | 'balance_above'
  | 'payment_due'
  | 'deposit_received'
  | 'withdrawal_made';

export type BusinessRuleAction = 
  | 'transfer_funds'
  | 'send_notification'
  | 'adjust_limits';

export interface BusinessRule {
  id: string;
  name: string;
  sourceBlockId: string;
  triggerType: BusinessRuleTrigger;
  triggerValue?: number;
  actionType: BusinessRuleAction;
  destinationBlockId?: string;
  actionAmount?: number;
  enabled: boolean;
}

export interface BusinessLogicBlock {
  id: string;
  type: 'business-logic';
  rules: BusinessRule[];
}

export interface CanvasStep {
  id: number;
  type: BuildingBlockType;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export type CanvasState = {
  id: string;
  name: string;
  currentStep: number;
  steps: CanvasStep[];
  metrics: MetricBlock[];
  assets: AssetBlock[];
  liabilities: LiabilityBlock[];
  collateral: CollateralBlock[];
  moneyMovement?: MoneyMovementBlock;
  businessLogic?: BusinessLogicBlock;
  users: UserBlock[];
};