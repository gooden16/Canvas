import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Toggle } from '../ui/toggle';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Landmark, Plus, Banknote } from 'lucide-react';
import { AssetBlock, AccountType } from '../../types/canvas';
import { cn, generateId, formatCurrency } from '../../lib/utils';

interface AssetBlockConfigProps {
  assets: AssetBlock[];
  onAddAsset: (asset: AssetBlock) => void;
}

export const AssetBlockConfig: React.FC<AssetBlockConfigProps> = ({
  assets,
  onAddAsset,
}) => {
  const [accountType, setAccountType] = useState<AccountType>('operating');
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);
  
  const accountTypes: { id: AccountType; label: string; icon: React.ReactNode; description: string; rate: number }[] = [
    { 
      id: 'operating', 
      label: 'Operating Account', 
      icon: <Landmark className="w-6 h-6" />,
      description: 'For day-to-day transactions and cash flow management',
      rate: 0.002 // 0.2%
    },
    { 
      id: 'reserve', 
      label: 'Reserve Account', 
      icon: <Banknote className="w-6 h-6" />,
      description: 'High-yield savings for excess capital',
      rate: 0.0435 // 4.35%
    },
  ];
  
  const [expectedBalance, setExpectedBalance] = useState(250000);
  
  const handleAddAsset = () => {
    const newAsset: AssetBlock = {
      id: generateId('asset'),
      type: 'asset',
      accountType: accountType,
      displayName: accountType === 'operating' ? 'Operating Account' : 'Reserve Account',
      transactionVolume: 'medium',
      balanceParameters: {
        expected: expectedBalance,
        minimum: expectedBalance * 0.2, // Simplified - set to 20% of expected
        peak: expectedBalance * 1.5, // Simplified - set to 150% of expected
      },
      yieldOptimization: {
        enabled: optimizationEnabled,
        excessThreshold: expectedBalance * 1.2, // Simplified - set to 120% of expected
        timing: 'daily',
        returnTriggers: [
          {
            condition: 'balance_below',
            value: expectedBalance * 0.3, // Simplified - set to 30% of expected
          },
        ],
        level: 'balanced',
        approvalWorkflow: 'notification',
      },
    };
    
    onAddAsset(newAsset);
  };

  const getEstimatedYield = () => {
    const baseRate = accountTypes.find(type => type.id === accountType)?.rate || 0;
    return optimizationEnabled ? baseRate * 1.15 : baseRate; // 15% boost with optimization
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair text-canvas-cream mb-2">Asset Building Blocks</h2>
        <p className="text-canvas-cream opacity-80">
          Configure your core liquidity accounts with built-in intelligence for maximizing returns.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {accountTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              "border-2 transition-all",
              accountType === type.id ? "border-canvas-pink" : "border-transparent hover:border-canvas-pink"
            )}
            selected={accountType === type.id}
            onClick={() => setAccountType(type.id)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-canvas-pink flex items-center justify-center text-canvas-navy flex-shrink-0">
                {type.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-canvas-navy mb-1">{type.label}</h3>
                <p className="text-sm text-canvas-navy opacity-70 mb-2">{type.description}</p>
                <p className="text-sm font-medium text-canvas-pink-dark">
                  Base Rate: {(type.rate * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Expected Balance
            </label>
            <Slider
              min={10000}
              max={2000000}
              step={10000}
              value={expectedBalance}
              onChange={setExpectedBalance}
              leftLabel="$10k"
              rightLabel="$2M+"
            />
            <div className="mt-1 text-sm text-canvas-navy font-medium">
              {formatCurrency(expectedBalance)}
            </div>
          </div>
          
          <div className="pt-4 border-t border-canvas-mediumgray">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-canvas-navy font-medium mb-1">Yield Optimization</h4>
                <p className="text-sm text-canvas-navy opacity-70">
                  Enable smart yield optimization to maximize returns
                </p>
              </div>
              <Toggle 
                checked={optimizationEnabled}
                onChange={setOptimizationEnabled}
              />
            </div>
          </div>
          
          <div className="bg-canvas-pink bg-opacity-10 p-4 rounded-md">
            <div className="text-lg font-semibold text-canvas-navy mb-2">
              Estimated Yield: {(getEstimatedYield() * 100).toFixed(2)}%
            </div>
            <p className="text-sm text-canvas-navy opacity-70">
              {optimizationEnabled ? 'Includes optimization boost' : 'Base rate without optimization'}
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAddAsset}
              icon={<Plus className="w-4 h-4" />}
            >
              Add to Canvas
            </Button>
          </div>
        </div>
      </Card>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair text-canvas-cream">Your Assets</h3>
          <div className="text-sm text-canvas-cream opacity-80">
            {assets.length} {assets.length === 1 ? 'asset' : 'assets'} defined
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.length === 0 ? (
            <div className="col-span-full bg-canvas-navy bg-opacity-50 border border-dashed border-canvas-mediumgray rounded-lg p-8 text-center">
              <p className="text-canvas-cream opacity-80">
                No assets defined yet. Configure and add an asset above to get started.
              </p>
            </div>
          ) : (
            assets.map((asset) => (
              <Card
                key={asset.id}
                className="hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {asset.accountType === 'operating' ? (
                      <Landmark className="w-5 h-5 text-canvas-navy" />
                    ) : (
                      <Banknote className="w-5 h-5 text-canvas-navy" />
                    )}
                    <h4 className="text-lg font-semibold text-canvas-navy">{asset.displayName}</h4>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-canvas-pink text-canvas-navy capitalize">
                    {asset.accountType}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-canvas-navy opacity-70 mb-1">Expected Balance</div>
                  <div className="font-semibold text-canvas-navy">{formatCurrency(asset.balanceParameters.expected)}</div>
                </div>
                
                {asset.yieldOptimization.enabled && (
                  <div className="bg-canvas-pink bg-opacity-10 p-3 rounded-md">
                    <div className="text-sm font-medium text-canvas-navy">
                      Yield Optimization Enabled
                    </div>
                    <div className="text-xs text-canvas-navy opacity-70 mt-1">
                      Enhanced returns with smart optimization
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};