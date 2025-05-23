import React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import { useCanvasStore } from '../../stores/canvasStore';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { formatCurrency } from '../../lib/utils';
import { Toggle } from '../ui/toggle';
import { Slider } from '../ui/slider';

interface PropertiesPanelProps {
  componentId: string;
  onClose: () => void;
  className?: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  componentId,
  onClose,
  className
}) => {
  const { components, updateComponent } = useCanvasStore();
  const component = components.find(c => c.id === componentId);

  if (!component) return null;

  const handleUpdateField = (field: string, value: any) => {
    updateComponent(componentId, {
      data: {
        ...component.data,
        [field]: value
      }
    });
  };

  const renderFields = () => {
    switch (component.type) {
      case 'metric-kpi':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Metric Name *
              </label>
              <input
                type="text"
                value={component.data.name || ''}
                onChange={(e) => handleUpdateField('name', e.target.value)}
                className="w-full input-field"
                placeholder="e.g., Operating Cash Balance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Description
              </label>
              <textarea
                value={component.data.description || ''}
                onChange={(e) => handleUpdateField('description', e.target.value)}
                className="w-full input-field min-h-[100px]"
                placeholder="Describe what this metric measures and why it's important..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-canvas-navy mb-2">
                  Metric Type
                </label>
                <select
                  value={component.data.metricType || 'single_value'}
                  onChange={(e) => handleUpdateField('metricType', e.target.value)}
                  className="w-full input-field"
                >
                  <option value="single_value">Single Value</option>
                  <option value="time_series">Time Series</option>
                  <option value="ratio">Ratio</option>
                  <option value="comparison">Comparison</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-canvas-navy mb-2">
                  Update Frequency
                </label>
                <select
                  value={component.data.frequency || 'daily'}
                  onChange={(e) => handleUpdateField('frequency', e.target.value)}
                  className="w-full input-field"
                >
                  <option value="real_time">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-canvas-navy mb-2">
                  Visualization
                </label>
                <select
                  value={component.data.visualization || 'number'}
                  onChange={(e) => handleUpdateField('visualization', e.target.value)}
                  className="w-full input-field"
                >
                  <option value="number">Number</option>
                  <option value="gauge">Gauge</option>
                  <option value="line_chart">Line Chart</option>
                  <option value="bar_chart">Bar Chart</option>
                  <option value="progress">Progress Bar</option>
                  <option value="comparison">Comparison</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'asset-operating':
      case 'asset-reserve':
        const isReserve = component.type === 'asset-reserve';
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                {isReserve ? 'Reserve Account Name' : 'Operating Account Name'}
              </label>
              <input
                type="text"
                value={component.data.name || ''}
                onChange={(e) => handleUpdateField('name', e.target.value)}
                className="w-full input-field"
                placeholder={isReserve ? 'Reserve Account' : 'Operating Account'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Expected Balance
              </label>
              <Slider
                min={10000}
                max={2000000}
                step={10000}
                value={component.data.balance || 250000}
                onChange={(value) => handleUpdateField('balance', value)}
                leftLabel="$10k"
                rightLabel="$2M+"
              />
              <div className="mt-1 text-sm text-canvas-navy font-medium">
                {formatCurrency(component.data.balance || 250000)}
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
                  checked={component.data.yieldOptimization?.enabled || false}
                  onChange={(checked) => handleUpdateField('yieldOptimization', {
                    ...component.data.yieldOptimization,
                    enabled: checked
                  })}
                />
              </div>
            </div>

            {component.data.yieldOptimization?.enabled && (
              <div className="bg-canvas-pink bg-opacity-10 p-4 rounded-md">
                <div className="text-lg font-semibold text-canvas-navy mb-2">
                  Estimated Yield: {isReserve ? '4.35%' : '0.20%'}
                </div>
                <p className="text-sm text-canvas-navy opacity-70">
                  {component.data.yieldOptimization?.enabled ? 'Includes optimization boost' : 'Base rate without optimization'}
                </p>
              </div>
            )}
          </div>
        );

      case 'liability-line':
      case 'liability-loan':
        const isLoan = component.type === 'liability-loan';
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Facility Name *
              </label>
              <input
                type="text"
                value={component.data.name || ''}
                onChange={(e) => handleUpdateField('name', e.target.value)}
                className="w-full input-field"
                placeholder={`e.g., Business ${isLoan ? 'Term Loan' : 'Line of Credit'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                {isLoan ? 'Principal Amount' : 'Requested Amount'}
              </label>
              <input
                type="number"
                value={component.data.amount || 1000000}
                onChange={(e) => handleUpdateField('amount', Number(e.target.value))}
                className="w-full input-field"
                min="100000"
                step="100000"
              />
              <div className="mt-1 text-sm text-canvas-navy font-medium">
                {formatCurrency(component.data.amount || 1000000)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                When do you want to draw down the funds?
              </label>
              <select
                value={component.data.drawdownTiming || 'immediate'}
                onChange={(e) => handleUpdateField('drawdownTiming', e.target.value)}
                className="w-full input-field"
              >
                <option value="immediate">Immediately</option>
                <option value="within_90_days">Within 90 days</option>
                <option value="extended_period">Over an extended period</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Duration (Years)
              </label>
              <input
                type="number"
                value={component.data.durationYears || 3}
                onChange={(e) => handleUpdateField('durationYears', Math.min(10, Math.max(0, Number(e.target.value))))}
                className="w-full input-field"
                min="0"
                max="10"
                step="1"
              />
              <div className="mt-1 text-sm text-canvas-navy opacity-70">
                Enter a value between 0 and 10 years
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                How often do you want to make payments?
              </label>
              <select
                value={component.data.repaymentFrequency || 'monthly'}
                onChange={(e) => handleUpdateField('repaymentFrequency', e.target.value)}
                className="w-full input-field"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Repayment Structure
              </label>
              <select
                value={component.data.repaymentType || 'principal_and_interest'}
                onChange={(e) => handleUpdateField('repaymentType', e.target.value)}
                className="w-full input-field"
              >
                <option value="principal_and_interest">Principal + Interest</option>
                <option value="interest_only">Interest Only</option>
              </select>
            </div>

            <div className="bg-canvas-pink bg-opacity-10 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-canvas-navy mb-1">Estimated Rate</div>
                  <div className="text-2xl font-bold text-canvas-navy">6.72%</div>
                  <div className="text-xs text-canvas-navy opacity-70">
                    SOFR + 2.25% with structure adjustments
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-canvas-navy mb-1">
                    Estimated Monthly Payment
                  </div>
                  <div className="text-2xl font-bold text-canvas-navy">
                    {formatCurrency(30749)}
                  </div>
                  <div className="text-xs text-canvas-navy opacity-70">
                    Based on current rates and selected structure
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'collateral-asset':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Select Liability to Secure
              </label>
              <select
                value={component.data.liabilityId || ''}
                onChange={(e) => handleUpdateField('liabilityId', e.target.value)}
                className="w-full input-field"
              >
                <option value="">Choose a liability...</option>
                {/* Add liability options dynamically */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Asset Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'real_estate', label: 'Real Estate', rate: 70 },
                  { id: 'public_securities', label: 'Public Securities', rate: 80 },
                  { id: 'private_securities', label: 'Private Securities', rate: 50 },
                  { id: 'other_assets', label: 'Other Assets', rate: 40 },
                ].map((type) => (
                  <Card
                    key={type.id}
                    className={cn(
                      "border-2 transition-all cursor-pointer",
                      component.data.assetType === type.id ? "border-canvas-pink" : "border-transparent hover:border-canvas-pink"
                    )}
                    onClick={() => handleUpdateField('assetType', type.id)}
                  >
                    <div className="p-3">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs opacity-70">
                        Up to {type.rate}% advance rate
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Asset Value
              </label>
              <input
                type="number"
                value={component.data.value || 1000000}
                onChange={(e) => handleUpdateField('value', Number(e.target.value))}
                className="w-full input-field"
                min="100000"
                step="100000"
              />
              <div className="mt-1 text-sm text-canvas-navy font-medium">
                {formatCurrency(component.data.value || 1000000)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Location Type
              </label>
              <select
                value={component.data.locationType || 'broker_dealer'}
                onChange={(e) => handleUpdateField('locationType', e.target.value)}
                className="w-full input-field"
              >
                <option value="broker_dealer">Broker Dealer</option>
                <option value="physical_address">Physical Address</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Location Details
              </label>
              <input
                type="text"
                value={component.data.locationDetails || ''}
                onChange={(e) => handleUpdateField('locationDetails', e.target.value)}
                className="w-full input-field"
                placeholder={component.data.locationType === 'broker_dealer' ? 
                  'e.g., Charles Schwab Account #XXX-XXX' : 
                  'e.g., 123 Main St, City, State'}
              />
            </div>

            <div className="bg-canvas-pink bg-opacity-10 p-4 rounded-md">
              <div className="text-lg font-semibold text-canvas-navy mb-2">
                Available Lending Value: {formatCurrency(800000)}
              </div>
              <p className="text-sm text-canvas-navy opacity-70">
                Based on {component.data.assetType === 'public_securities' ? '80%' : '70%'} advance rate for {component.data.assetType?.replace('_', ' ') || 'selected asset type'}
              </p>
            </div>
          </div>
        );

      case 'money-movement-flow':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-canvas-pink bg-opacity-10 rounded-md">
                <div>
                  <div className="font-medium text-canvas-navy">Regular Merchant/Vendor Payments</div>
                  <div className="text-sm text-canvas-navy opacity-70">
                    Do you need to make regular payments to merchants or vendors?
                  </div>
                </div>
                <Toggle
                  checked={component.data.merchantPayments || false}
                  onChange={(checked) => handleUpdateField('merchantPayments', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-canvas-pink bg-opacity-10 rounded-md">
                <div>
                  <div className="font-medium text-canvas-navy">Cash Deposits</div>
                  <div className="text-sm text-canvas-navy opacity-70">
                    Will you need to deposit cash regularly?
                  </div>
                </div>
                <Toggle
                  checked={component.data.cashDeposits || false}
                  onChange={(checked) => handleUpdateField('cashDeposits', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-canvas-pink bg-opacity-10 rounded-md">
                <div>
                  <div className="font-medium text-canvas-navy">Check Deposits</div>
                  <div className="text-sm text-canvas-navy opacity-70">
                    Will you need to deposit checks regularly?
                  </div>
                </div>
                <Toggle
                  checked={component.data.checkDeposits || false}
                  onChange={(checked) => handleUpdateField('checkDeposits', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-canvas-pink bg-opacity-10 rounded-md">
                <div>
                  <div className="font-medium text-canvas-navy">ATM Withdrawals</div>
                  <div className="text-sm text-canvas-navy opacity-70">
                    Will you need to withdraw cash from ATMs?
                  </div>
                </div>
                <Toggle
                  checked={component.data.atmWithdrawals || false}
                  onChange={(checked) => handleUpdateField('atmWithdrawals', checked)}
                />
              </div>
            </div>

            {(component.data.merchantPayments || component.data.atmWithdrawals) && (
              <div className="border-t border-canvas-mediumgray pt-6">
                <h3 className="text-lg font-semibold text-canvas-navy mb-4">Card Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-canvas-navy mb-2">
                      When should card balances be paid?
                    </label>
                    <select
                      value={component.data.cardPaymentTiming || 'monthly'}
                      onChange={(e) => handleUpdateField('cardPaymentTiming', e.target.value)}
                      className="w-full input-field"
                    >
                      <option value="same_day">Same Day</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-canvas-navy mb-2">
                      Preferred Reward Type
                    </label>
                    <select
                      value={component.data.cardRewardType || 'cash'}
                      onChange={(e) => handleUpdateField('cardRewardType', e.target.value)}
                      className="w-full input-field"
                    >
                      <option value="cash">Cash Back</option>
                      <option value="travel">Travel Rewards</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'business-logic-rule':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                value={component.data.name || ''}
                onChange={(e) => handleUpdateField('name', e.target.value)}
                className="w-full input-field"
                placeholder="e.g., Low Balance Alert"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Source Block *
              </label>
              <select
                value={component.data.sourceBlockId || ''}
                onChange={(e) => handleUpdateField('sourceBlockId', e.target.value)}
                className="w-full input-field"
              >
                <option value="">Select a block...</option>
                {/* Add block options dynamically */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Trigger Condition
              </label>
              <select
                value={component.data.triggerType || 'balance_below'}
                onChange={(e) => handleUpdateField('triggerType', e.target.value)}
                className="w-full input-field"
              >
                <option value="balance_below">Balance Below</option>
                <option value="balance_above">Balance Above</option>
                <option value="payment_due">Payment Due</option>
                <option value="deposit_received">Deposit Received</option>
                <option value="withdrawal_made">Withdrawal Made</option>
              </select>
            </div>

            {(component.data.triggerType === 'balance_below' || component.data.triggerType === 'balance_above') && (
              <div>
                <label className="block text-sm font-medium text-canvas-navy mb-2">
                  Trigger Amount
                </label>
                <input
                  type="number"
                  value={component.data.triggerValue || 0}
                  onChange={(e) => handleUpdateField('triggerValue', Number(e.target.value))}
                  className="w-full input-field"
                  min="0"
                  step="1000"
                />
                <div className="mt-1 text-sm text-canvas-navy font-medium">
                  {formatCurrency(component.data.triggerValue || 0)}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Action
              </label>
              <select
                value={component.data.actionType || 'transfer_funds'}
                onChange={(e) => handleUpdateField('actionType', e.target.value)}
                className="w-full input-field"
              >
                <option value="transfer_funds">Transfer Funds</option>
                <option value="send_notification">Send Notification</option>
                <option value="adjust_limits">Adjust Limits</option>
              </select>
            </div>

            {component.data.actionType === 'transfer_funds' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-canvas-navy mb-2">
                    Destination Account
                  </label>
                  <select
                    value={component.data.destinationBlockId || ''}
                    onChange={(e) => handleUpdateField('destinationBlockId', e.target.value)}
                    className="w-full input-field"
                  >
                    <option value="">Select an account...</option>
                    {/* Add account options dynamically */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-canvas-navy mb-2">
                    Transfer Amount
                  </label>
                  <input
                    type="number"
                    value={component.data.actionAmount || 0}
                    onChange={(e) => handleUpdateField('actionAmount', Number(e.target.value))}
                    className="w-full input-field"
                    min="0"
                    step="1000"
                  />
                  <div className="mt-1 text-sm text-canvas-navy font-medium">
                    {formatCurrency(component.data.actionAmount || 0)}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      default:
        return (
          <div className="text-canvas-navy opacity-70">
            No editable properties available for this component type.
          </div>
        );
    }
  };

  return (
    <div className={cn("bg-canvas-lightgray border-l border-canvas-mediumgray", className)}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-canvas-navy">Properties</h2>
          <Button
            variant="tertiary"
            size="sm"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
          >
            Close
          </Button>
        </div>

        <Card>
          {renderFields()}
        </Card>
      </div>
    </div>
  );
};