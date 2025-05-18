// Canvas Types

export type BuildingBlockType = 
  | 'metric'
  | 'asset'
  | 'liability'
  | 'collateral'
  | 'money-movement'
  | 'business-logic'
  | 'user';

// ... (previous type definitions)

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
};