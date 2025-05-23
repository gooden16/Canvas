import React from 'react';
import { cn } from '../../lib/utils';
import { Card } from '../ui/card';
import { useDraggable } from '@dnd-kit/core';
import { 
  BarChart3, 
  Landmark, 
  CreditCard, 
  Package, 
  ArrowLeftRight, 
  Zap, 
  Users, 
  Wallet, 
  Building2, 
  CircleDollarSign, 
  Briefcase 
} from 'lucide-react';
import { BuildingBlockType } from '../../types/canvas';

interface ComponentPaletteProps {
  activeTool: BuildingBlockType;
  className?: string;
}

interface PaletteItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  defaultData?: Record<string, any>;
}

const DraggablePaletteItem: React.FC<PaletteItemProps> = ({ 
  id, 
  icon, 
  label, 
  description,
  defaultData 
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${id}`,
    data: {
      type: 'palette-item',
      componentType: id,
      defaultData
    },
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <Card 
        className={cn(
          "cursor-grab hover:shadow-lg transition-all",
          isDragging && "opacity-50"
        )}
      >
        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-full bg-canvas-pink bg-opacity-20 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-canvas-navy">{label}</h3>
            <p className="text-sm text-canvas-navy opacity-70">{description}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  activeTool,
  className,
}) => {
  const getPaletteItems = (): PaletteItemProps[] => {
    switch (activeTool) {
      case 'metric':
        return [
          {
            id: 'metric-kpi',
            icon: <BarChart3 className="w-5 h-5 text-canvas-navy" />,
            label: 'KPI Metric',
            description: 'Track key performance indicators',
            defaultData: {
              name: '',
              description: '',
              metricType: 'single_value',
              frequency: 'daily',
              visualization: 'number',
              category: 'business'
            }
          },
        ];
      case 'asset':
        return [
          {
            id: 'asset-operating',
            icon: <Wallet className="w-5 h-5 text-canvas-navy" />,
            label: 'Operating Account',
            description: 'For day-to-day transactions and cash flow',
            defaultData: {
              name: 'Operating Account',
              balance: 250000,
              yieldOptimization: {
                enabled: true,
                excessThreshold: 300000,
                timing: 'daily',
                level: 'balanced'
              }
            }
          },
          {
            id: 'asset-reserve',
            icon: <Building2 className="w-5 h-5 text-canvas-navy" />,
            label: 'Reserve Account',
            description: 'High-yield savings for excess capital',
            defaultData: {
              name: 'Reserve Account',
              balance: 500000,
              yieldOptimization: {
                enabled: true,
                excessThreshold: 600000,
                timing: 'daily',
                level: 'aggressive'
              }
            }
          },
        ];
      case 'liability':
        return [
          {
            id: 'liability-line',
            icon: <CircleDollarSign className="w-5 h-5 text-canvas-navy" />,
            label: 'Line of Credit',
            description: 'Revolving credit facility',
            defaultData: {
              name: '',
              amount: 1000000,
              drawdownTiming: 'immediate',
              durationYears: 3,
              repaymentFrequency: 'monthly',
              repaymentType: 'principal_and_interest'
            }
          },
          {
            id: 'liability-loan',
            icon: <Briefcase className="w-5 h-5 text-canvas-navy" />,
            label: 'Term Loan',
            description: 'Fixed-term financing solution',
            defaultData: {
              name: '',
              amount: 1000000,
              drawdownTiming: 'immediate',
              durationYears: 5,
              repaymentFrequency: 'monthly',
              repaymentType: 'principal_and_interest'
            }
          },
        ];
      case 'collateral':
        return [
          {
            id: 'collateral-asset',
            icon: <Package className="w-5 h-5 text-canvas-navy" />,
            label: 'Asset Collateral',
            description: 'Secure your credit facilities',
            defaultData: {
              assetType: 'public_securities',
              value: 1000000,
              locationType: 'broker_dealer',
              locationDetails: '',
              liabilityId: ''
            }
          },
        ];
      case 'money-movement':
        return [
          {
            id: 'money-movement-flow',
            icon: <ArrowLeftRight className="w-5 h-5 text-canvas-navy" />,
            label: 'Payment Flow',
            description: 'Configure payment routes',
            defaultData: {
              merchantPayments: false,
              cashDeposits: false,
              checkDeposits: false,
              atmWithdrawals: false,
              cardConfiguration: {
                paymentTiming: 'monthly',
                rewardType: 'cash'
              }
            }
          },
        ];
      case 'business-logic':
        return [
          {
            id: 'business-logic-rule',
            icon: <Zap className="w-5 h-5 text-canvas-navy" />,
            label: 'Business Rule',
            description: 'Automate financial decisions',
            defaultData: {
              name: '',
              sourceBlockId: '',
              triggerType: 'balance_below',
              triggerValue: 0,
              actionType: 'transfer_funds',
              destinationBlockId: '',
              actionAmount: 0,
              enabled: true
            }
          },
        ];
      case 'user':
        return [
          {
            id: 'user-access',
            icon: <Users className="w-5 h-5 text-canvas-navy" />,
            label: 'User Access',
            description: 'Manage user permissions',
            defaultData: {
              name: '',
              email: '',
              viewAccess: {
                type: 'unrestricted',
                allowedBlocks: []
              },
              transactionAccess: {
                type: 'unrestricted',
                accountLimits: {}
              }
            }
          },
        ];
      default:
        return [];
    }
  };

  return (
    <div className={cn("bg-canvas-lightgray border-r border-canvas-mediumgray p-4", className)}>
      <h2 className="text-lg font-semibold text-canvas-navy mb-4">Components</h2>
      <div className="space-y-3">
        {getPaletteItems().map((item) => (
          <DraggablePaletteItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};