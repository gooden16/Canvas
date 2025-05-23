import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CreditCard, Plus } from 'lucide-react';
import { LiabilityBlock, DrawdownTiming, RepaymentFrequency, RepaymentType } from '../../types/canvas';
import { cn, generateId, formatCurrency } from '../../lib/utils';

interface LiabilityBlockConfigProps {
  liabilities: LiabilityBlock[];
  onAddLiability: (liability: LiabilityBlock) => void;
}

export const LiabilityBlockConfig: React.FC<LiabilityBlockConfigProps> = ({
  liabilities,
  onAddLiability,
}) => {
  const [formState, setFormState] = useState({
    displayName: '',
    requestedAmount: 1000000,
    drawdownTiming: 'immediate' as DrawdownTiming,
    durationYears: 3,
    repaymentFrequency: 'monthly' as RepaymentFrequency,
    repaymentType: 'principal_and_interest' as RepaymentType,
  });

  const handleAddLiability = () => {
    if (!formState.displayName) {
      alert('Please provide a name for the facility');
      return;
    }

    const newLiability: LiabilityBlock = {
      id: generateId('liability'),
      type: 'liability',
      displayName: formState.displayName,
      requestedAmount: formState.requestedAmount,
      drawdownTiming: formState.drawdownTiming,
      durationYears: formState.durationYears,
      repaymentFrequency: formState.repaymentFrequency,
      repaymentType: formState.repaymentType,
      requiresCollateral: true,
    };

    onAddLiability(newLiability);
    
    setFormState({
      displayName: '',
      requestedAmount: 1000000,
      drawdownTiming: 'immediate',
      durationYears: 3,
      repaymentFrequency: 'monthly',
      repaymentType: 'principal_and_interest',
    });
  };

  const getEstimatedRate = () => {
    const baseRate = 0.0672; // SOFR + 2.25% (6.72%)
    const durationImpact = formState.durationYears > 5 ? 0.005 : 0;
    const structureImpact = formState.repaymentType === 'interest_only' ? 0.005 : 0;
    return baseRate + durationImpact + structureImpact;
  };

  const getEstimatedPayment = () => {
    const rate = getEstimatedRate() / 12; // Monthly rate
    const amount = formState.requestedAmount;
    const term = formState.durationYears * 12; // Convert years to months

    if (formState.repaymentType === 'interest_only') {
      return amount * rate;
    } else {
      // Principal + Interest payment
      const pmt = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
      return pmt;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair text-canvas-cream mb-2">Liability Building Blocks</h2>
        <p className="text-canvas-cream opacity-80">
          Configure your lending solutions with flexible drawdown and repayment structures.
        </p>
      </div>

      <Card className="mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Facility Name *
            </label>
            <input
              type="text"
              value={formState.displayName}
              onChange={(e) => setFormState({ ...formState, displayName: e.target.value })}
              className="w-full input-field"
              placeholder="e.g., Business Line of Credit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Requested Amount
            </label>
            <input
              type="number"
              value={formState.requestedAmount}
              onChange={(e) => setFormState({ ...formState, requestedAmount: Number(e.target.value) })}
              className="w-full input-field"
              min="100000"
              step="100000"
            />
            <div className="mt-1 text-sm text-canvas-navy font-medium">
              {formatCurrency(formState.requestedAmount)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              When do you want to draw down the funds?
            </label>
            <select
              value={formState.drawdownTiming}
              onChange={(e) => setFormState({ ...formState, drawdownTiming: e.target.value as DrawdownTiming })}
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
              value={formState.durationYears}
              onChange={(e) => setFormState({ ...formState, durationYears: Math.min(10, Math.max(0, Number(e.target.value))) })}
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
              value={formState.repaymentFrequency}
              onChange={(e) => setFormState({ ...formState, repaymentFrequency: e.target.value as RepaymentFrequency })}
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
              value={formState.repaymentType}
              onChange={(e) => setFormState({ ...formState, repaymentType: e.target.value as RepaymentType })}
              className="w-full input-field"
            >
              <option value="principal_and_interest">Principal + Interest</option>
              <option value="interest_only">Interest Only</option>
            </select>
          </div>

          <div className="bg-canvas-pink bg-opacity-10 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-canvas-navy mb-1">Estimated Rate</div>
                <div className="text-2xl font-bold text-canvas-navy">
                  {(getEstimatedRate() * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-canvas-navy opacity-70">
                  SOFR + 2.25% with structure adjustments
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-canvas-navy mb-1">
                  Estimated {formState.repaymentFrequency} Payment
                </div>
                <div className="text-2xl font-bold text-canvas-navy">
                  {formatCurrency(getEstimatedPayment())}
                </div>
                <div className="text-xs text-canvas-navy opacity-70">
                  Based on current rates and selected structure
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAddLiability}
              icon={<Plus className="w-4 h-4" />}
            >
              Add to Canvas
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair text-canvas-cream">Your Liabilities</h3>
          <div className="text-sm text-canvas-cream opacity-80">
            {liabilities.length} {liabilities.length === 1 ? 'liability' : 'liabilities'} defined
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liabilities.length === 0 ? (
            <div className="col-span-full bg-canvas-navy bg-opacity-50 border border-dashed border-canvas-mediumgray rounded-lg p-8 text-center">
              <p className="text-canvas-cream opacity-80">
                No liabilities defined yet. Configure a liability above to get started.
              </p>
            </div>
          ) : (
            liabilities.map((liability) => (
              <Card
                key={liability.id}
                className="hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-canvas-navy" />
                    <h4 className="text-lg font-semibold text-canvas-navy">
                      {liability.displayName}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-canvas-navy opacity-70 mb-1">Amount</div>
                    <div className="font-semibold text-canvas-navy">
                      {formatCurrency(liability.requestedAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-canvas-navy opacity-70 mb-1">Duration</div>
                    <div className="font-semibold text-canvas-navy">{liability.durationYears} years</div>
                  </div>
                </div>

                <div className="bg-canvas-pink bg-opacity-10 p-3 rounded-md">
                  <div className="text-sm font-medium text-canvas-navy mb-2">Structure</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-canvas-navy">
                    <div>
                      <span className="opacity-70">Drawdown: </span>
                      {liability.drawdownTiming.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="opacity-70">Repayment: </span>
                      {liability.repaymentType === 'principal_and_interest' ? 'P+I' : 'Interest Only'}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};