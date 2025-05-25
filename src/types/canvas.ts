// Canvas Types - Core type definitions for the financial canvas application

// Defines the different types of building blocks available in the canvas
export type BuildingBlockType = 
  | 'metric'     // Financial metrics and KPIs
  | 'asset'      // Asset accounts (operating, reserve)
  | 'liability'  // Lending and credit facilities
  | 'collateral' // Assets securing liabilities
  | 'money-movement' // Payment and transaction configuration
  | 'business-logic' // Automated rules and workflows
  | 'user';      // User access and permissions

// User access control types
export type ViewAccessType = 'unrestricted' | 'restricted';
export type TransactionAccessType = 
  | 'unrestricted'      // No limits on transactions
  | 'value_restricted'  // Limited by transaction amount
  | 'count_restricted'  // Limited by number of transactions
  | 'no_transactions';  // View-only access

// User access configuration
export interface UserBlock {
  id: string;
  type: 'user';
  name: string;
  email: string;
  viewAccess: {
    type: ViewAccessType;
    allowedBlocks?: string[]; // Specific blocks user can access when restricted
  };
  transactionAccess: {
    type: TransactionAccessType;
    accountLimits?: Record<string, {
      maxValue?: number;   // Maximum transaction amount
      maxCount?: number;   // Maximum transactions per period
    }>;
  };
}

// Metric configuration types
export type MetricCategory = 'business' | 'investment' | 'liquidity' | 'risk' | 'custom';
export type MetricType = 'single_value' | 'time_series' | 'ratio' | 'comparison';
export type VisualizationType = 'number' | 'gauge' | 'line_chart' | 'bar_chart' | 'progress' | 'comparison';
export type FrequencyType = 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

// Metric block definition
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

// Asset configuration types
export type AccountType = 'operating' | 'reserve';
export type TransactionVolume = 'low' | 'medium' | 'high';

// Asset block definition
export interface AssetBlock {
  id: string;
  type: 'asset';
  accountType: AccountType;
  displayName: string;
  transactionVolume: TransactionVolume;
  balanceParameters: {
    expected: number;  // Expected average balance
    minimum: number;   // Minimum required balance
    peak: number;      // Expected peak balance
  };
  yieldOptimization: {
    enabled: boolean;
    excessThreshold: number;  // Balance threshold for optimization
    timing: 'daily' | 'weekly';
    returnTriggers: {
      condition: 'balance_below' | 'scheduled';
      value?: number;
    }[];
    level: 'conservative' | 'balanced' | 'aggressive';
    approvalWorkflow: 'automatic' | 'notification' | 'approval';
  };
}

// Liability configuration types
export type LiabilityType = 'loan' | 'line';
export type RepaymentFrequency = 'monthly' | 'quarterly' | 'annually';
export type RepaymentType = 'principal_and_interest' | 'interest_only' | 'bullet';

// Liability block definition
export interface LiabilityBlock {
  id: string;
  type: 'liability';
  liabilityType: LiabilityType;
  displayName: string;
  requestedAmount: number;
  durationYears: number;
  repaymentFrequency: RepaymentFrequency;
  repaymentType: RepaymentType;
  requiresCollateral: boolean;
  drawdownSchedule?: {
    initialAmount: number;
    remainingSchedule: {
      amount: number;
      date: string;
    }[];
  };
}

// Collateral configuration types
export type CollateralAssetType = 'real_estate' | 'public_securities' | 'private_securities' | 'other_assets';

// Collateral block definition
export interface CollateralBlock {
  id: string;
  type: 'collateral';
  assetType: CollateralAssetType;
  value: number;
  location: {
    type: 'broker_dealer' | 'physical_address';
    details: string;
  };
  liabilityId: string;  // Links collateral to specific liability
}

// Money movement configuration types
export type CardPaymentTiming = 'same_day' | 'weekly' | 'monthly';
export type CardRewardType = 'cash' | 'travel';

// Money movement block definition
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

// Business logic configuration types
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

// Business rule definition
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

// Business logic block definition
export interface BusinessLogicBlock {
  id: string;
  type: 'business-logic';
  rules: BusinessRule[];
}

// Canvas step definition
export interface CanvasStep {
  id: number;
  type: BuildingBlockType;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

// Main canvas state definition
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