// src/server/db/schema.ts

// Using a generic syntax, will be adapted to a specific ORM like Prisma later.

// --- User Management ---

// Describes a platform user. Could be an Advisor or a Client.
interface User {
  id: string; // UUID
  email: string; // unique
  name?: string;
  hashedPassword?: string;
  authProvider?: string; // e.g., 'google', 'credentials'
  authProviderId?: string;
  createdAt: Date;
  updatedAt: Date;

  // Role on the platform - simplified for now
  // More complex roles/permissions system could be separate tables
  isAdvisor: boolean; // default false

  // Relationships
  advisorProfileId?: string;
  clientProfileId?: string;
  canvases: UserCanvasPermission[]; // Canvases this user has access to
  ownedCanvases: Canvas[]; // Canvases this user owns (primarily for advisors)
}

// Specific details if the User is an Advisor
interface Advisor {
  id: string; // UUID
  userId: string; // unique, foreign key to User.id
  firmName?: string;
  // ... other advisor details
}

// Specific details if the User is a Client
// (May not be strictly necessary if all clients are just Users with canvas permissions)
// For now, let's assume a Client might have some distinct properties or relationships
interface Client {
  id: string; // UUID
  userId: string; // unique, foreign key to User.id
  // ... other client details
}

// --- Canvas Core ---

interface Canvas {
  id: string; // UUID
  name: string;
  ownerId: string; // foreign key to User.id (Advisor)
  createdAt: Date;
  updatedAt: Date;

  // Relationships to building blocks
  // These will be one-to-many from Canvas to each block type
  assetBlocks: AssetBlock[];
  liabilityBlocks: LiabilityBlock[];
  collateralBlocks: CollateralBlock[];
  metricBlocks: MetricBlock[];
  userPermissions: UserCanvasPermission[]; // Users who have access to this canvas
  
  // Single instance blocks linked to canvas
  moneyMovementConfig?: MoneyMovementBlock;
  businessLogicConfig?: BusinessLogicBlock;
}

// --- Canvas Permissions ---

// Junction table for User-Canvas many-to-many relationship with permission details
// This aligns with UserBlock type from canvas.ts for per-canvas permissions
interface UserCanvasPermission {
  id: string; // UUID
  userId: string; // foreign key to User.id
  canvasId: string; // foreign key to Canvas.id

  viewAccessType: 'unrestricted' | 'restricted';
  allowedViewBlockIds?: string[]; // List of block IDs

  transactionAccessType: 'unrestricted' | 'value_restricted' | 'count_restricted' | 'no_transactions';
  transactionAccountLimitsJson?: string; // JSON string for Record<string, { maxValue?: number; maxCount?: number }>

  createdAt: Date;
  updatedAt: Date;

  // @@unique([userId, canvasId]) - This would be an ORM-level constraint
}

// --- Building Blocks ---

// --- Asset Block ---
interface AssetBlock {
  id: string; // UUID
  canvasId: string; // foreign key to Canvas.id
  // Fields from types/canvas.ts AssetBlock
  accountType: 'operating' | 'reserve' | 'timed_deposit'; // Added timed_deposit
  displayName: string;
  transactionVolume: 'low' | 'medium' | 'high';
  // Balance Parameters (could be JSON or separate columns)
  balanceParameters_expected: number;
  balanceParameters_minimum: number;
  balanceParameters_peak: number;
  // Yield Optimization (could be JSON or separate columns)
  yieldOptimization_enabled: boolean;
  yieldOptimization_excessThreshold: number;
  yieldOptimization_timing: 'daily' | 'weekly';
  // yieldOptimization_returnTriggers: // This is an array of objects, likely JSON
  yieldOptimization_returnTriggersJson?: string; 
  yieldOptimization_level: 'conservative' | 'balanced' | 'aggressive';
  yieldOptimization_approvalWorkflow: 'automatic' | 'notification' | 'approval';
  // Timed Deposit specific fields (if accountType is 'timed_deposit')
  timedDeposit_term?: number; // e.g., in months
  timedDeposit_maturityDate?: Date;
  timedDeposit_interestRate?: number; 

  createdAt: Date;
  updatedAt: Date;
}

// --- Liability Block ---
interface LiabilityBlock {
  id: string; // UUID
  canvasId: string; // foreign key to Canvas.id
  // Fields from types/canvas.ts LiabilityBlock
  liabilityType: 'loan' | 'line';
  displayName: string;
  requestedAmount: number;
  currentBalance?: number; // To track outstanding balance
  durationYears: number;
  interestRate?: number; // Actual rate, not just estimated
  repaymentFrequency: 'monthly' | 'quarterly' | 'annually';
  repaymentType: 'principal_and_interest' | 'interest_only' | 'bullet';
  requiresCollateral: boolean;
  // drawdownSchedule (JSON for simplicity, or a separate related table for complex schedules)
  drawdownScheduleJson?: string; // JSON for { initialAmount: number; remainingSchedule: { amount: number; date: string }[] }
  // Link to operating cash for payments (could be an assetBlockId or a more abstract link)
  paymentSourceAssetId?: string; // Foreign key to an AssetBlock (Operating Cash)

  createdAt: Date;
  updatedAt: Date;
}

// --- Collateral Block ---
interface CollateralBlock {
  id: string; // UUID
  canvasId: string; // foreign key to Canvas.id
  // Fields from types/canvas.ts CollateralBlock, plus PRD requirements
  assetType: 'real_estate' | 'public_securities' | 'private_securities' | 'cash_flows' | 'other_assets'; // Added cash_flows from PRD
  description?: string; // For further details like specific car model, art piece
  value: number;
  valuationDate?: Date;
  ltvRatio?: number; // Loan-to-Value Ratio
  // location (JSON or separate columns)
  location_type: 'broker_dealer' | 'physical_address' | 'escrow'; // Added escrow
  location_details: string;
  perfectionStatus?: 'pending' | 'perfected' | 'unperfected';
  tradabilityInfo?: string; // Notes on tradability in downside scenario
  
  // Relationship: A single collateral item might secure multiple liabilities in some models,
  // or a liability might be secured by multiple collateral items.
  // For now, let's assume a junction table would be better for many-to-many.
  // If one collateral item links to ONE liability (as in current types/canvas.ts):
  // securedLiabilityId?: string; // Foreign key to LiabilityBlock.id
  // For many-to-many, we'd have a LiabilityCollateralLink table.

  createdAt: Date;
  updatedAt: Date;
}

// Junction table for Liability to Collateral (Many-to-Many)
interface LiabilityCollateralLink {
    id: string; // UUID
    liabilityId: string; // FK to LiabilityBlock
    collateralId: string; // FK to CollateralBlock
    // any specific attributes of the linkage itself
}


// --- Metric Block ---
interface MetricBlock {
  id: string; // UUID
  canvasId: string; // foreign key to Canvas.id
  // Fields from types/canvas.ts MetricBlock
  phase: 'initial' | 'active';
  displayName: string;
  description?: string;
  category: 'business' | 'investment' | 'liquidity' | 'risk' | 'custom';
  metricType: 'single_value' | 'time_series' | 'ratio' | 'comparison';
  visualizationPreference: 'number' | 'gauge' | 'line_chart' | 'bar_chart' | 'progress' | 'comparison';
  desiredFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  priority: 'high' | 'medium' | 'low';
  // For calculation logic of custom metrics:
  calculationLogic_sourceBlockIds?: string[]; // Array of AssetBlock/LiabilityBlock IDs
  calculationLogic_formula?: string; // User-defined formula or reference to a predefined one
  currentValue?: number; // or string, depending on metric type
  lastCalculatedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// --- Money Movement Block ---
// This is a single config object per canvas based on current frontend types
interface MoneyMovementBlock {
  id: string; // UUID
  canvasId: string; // foreign key to Canvas.id, unique if only one per canvas
  // Fields from types/canvas.ts MoneyMovementBlock
  merchantPayments: boolean;
  cashDeposits: boolean;
  checkDeposits: boolean;
  atmWithdrawals: boolean;
  // cardConfiguration (JSON or separate columns)
  cardConfiguration_paymentTiming?: 'same_day' | 'weekly' | 'monthly';
  cardConfiguration_rewardType?: 'cash' | 'travel';

  createdAt: Date;
  updatedAt: Date;
}

// --- Business Logic Block & Rules ---
// BusinessLogicBlock is a container for rules, one per canvas
interface BusinessLogicBlock {
  id: string; // UUID
  canvasId: string; // foreign key to Canvas.id, unique
  // rules are stored in a separate table for one-to-many relationship
  createdAt: Date;
  updatedAt: Date;
}

interface BusinessRule {
  id: string; // UUID
  businessLogicBlockId: string; // foreign key to BusinessLogicBlock.id
  // Fields from types/canvas.ts BusinessRule
  name: string;
  sourceBlockId: string; // ID of an AssetBlock or LiabilityBlock
  triggerType: 'balance_below' | 'balance_above' | 'payment_due' | 'deposit_received' | 'withdrawal_made' | 'ltv_threshold_breached'; // Added LTV
  triggerValue?: number;
  actionType: 'transfer_funds' | 'send_notification' | 'adjust_limits';
  destinationBlockId?: string; // ID of an AssetBlock or LiabilityBlock for transfers
  actionAmount?: number;
  notificationMessage?: string; // If actionType is send_notification
  enabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// Placeholder export to satisfy module requirements if any
export {}; 