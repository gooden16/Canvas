import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CreditCard, Plus, Building2 } from 'lucide-react';
import { CreditBlock, CreditType, RepaymentFrequency, RepaymentType } from '../../types/canvas';
import { cn, generateId, formatCurrency } from '../../lib/utils';

interface CreditBlockConfigProps {
  credits: CreditBlock[];
  onAddCredit: (credit: CreditBlock) => void;
}

export const CreditBlockConfig: React.FC<CreditBlockConfigProps> = ({
  credits,
  onAddCredit,
}) => {
  const [creditType, setCreditType] = useState<CreditType>('loan');
  const [formState, setFormState] = useState({
    displayName: '',
    requestedAmount: 1000000,
    durationYears: 3,
    repaymentFrequency: 'monthly' as RepaymentFrequency,
    repaymentType: 'principal_and_interest' as RepaymentType,
  });

  const facilityTypes: { id: CreditType; label: string; icon: React.ReactNode; description: string }[] = [
    {
      id: 'loan',
      label: 'Term Loan',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Fixed-term financing with upfront funding',
    },
    {
      id: 'line',
      label: 'Line of Credit',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Flexible revolving credit facility',
    },
  ];

  const handleAddCredit = () => {
    if (!formState.displayName) {
      alert('Please provide a name for the facility');
      return;
    }

    const newCredit: CreditBlock = {
      id: generateId('credit'),
      type: 'credit',
      creditType: creditType,
      displayName: formState.displayName,
      requestedAmount: formState.requestedAmount,
      durationYears: formState.durationYears,
      repaymentFrequency: formState.repaymentFrequency,
      repaymentType: formState.repaymentType,
      requiresCollateral: true,
      ...(creditType === 'line' && {
        drawdownSchedule: {
          initialAmount: formState.requestedAmount * 0.25, // Initial 25% draw
          remainingSchedule: [
            {
              amount: formState.requestedAmount * 0.25,
              date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
            },
            {
              amount: formState.requestedAmount * 0.5,
              date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days
            },
          ],
        },
      }),
    };

    onAddCredit(newCredit);
    
    setFormState({
      displayName: '',
      requestedAmount: 1000000,
      durationYears: 3,
      repaymentFrequency: 'monthly',
      repaymentType: 'principal_and_interest',
    });
  };

  const getEstimatedRate = () => {
    const baseRate = 0.0672; // SOFR + 2.25% (6.72%)
    const durationImpact = formState.durationYears > 5 ? 0.005 : 0;
    const typeImpact = creditType === 'line' ? 0.005 : 0;
    const structureImpact = formState.repaymentType === 'bullet' ? 0.0075 : 
                           formState.repaymentType === 'interest_only' ? 0.005 : 0;
    return baseRate + durationImpact + typeImpact + structureImpact;
  };

  const getEstimatedPayment = () => {
    const rate = getEstimatedRate() / 12; // Monthly rate
    const amount = creditType === 'line' 
      ? formState.requestedAmount * 0.25 // Initial draw for line of credit
      : formState.requestedAmount;
    const term = formState.durationYears * 12; // Convert years to months

    if (formState.repaymentType === 'bullet') {
      return amount * rate; // Interest-only payments with principal due at maturity
    } else if (formState.repaymentType === 'interest_only') {
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
        <h2 className="text-2xl font-playfair text-canvas-cream mb-2">Credit Building Blocks</h2>
        <p className="text-canvas-cream opacity-80">
          Configure your credit solutions with flexible structures and repayment options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {facilityTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              "border-2 transition-all",
              creditType === type.id ? "border-canvas-pink" : "border-transparent hover:border-canvas-pink"
            )}
            onClick={() => setCreditType(type.id)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-canvas-pink flex items-center justify-center text-canvas-navy flex-shrink-0">
                {type.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-canvas-navy mb-1">{type.label}</h3>
                <p className="text-sm text-canvas-navy opacity-70">{type.description}</p>
              </div>
            </div>
          </Card>
        ))}
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
              placeholder={`e.g., Business ${creditType === 'loan' ? 'Term Loan' : 'Line of Credit'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              {creditType === 'loan' ? 'Loan Amount' : 'Credit Limit'}
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
              <option value="bullet">Bullet (Interest + Principal at Maturity)</option>
            </select>
            {formState.repaymentType === 'bullet' && (
              <div className="mt-2 text-sm text-canvas-navy bg-canvas-pink bg-opacity-10 p-3 rounded">
                <strong>Note:</strong> Bullet structure requires full principal repayment at maturity.
                Regular payments will be interest-only until then.
              </div>
            )}
          </div>

          {creditType === 'line' && (
            <div className="bg-canvas-pink bg-opacity-10 p-4 rounded-md">
              <h4 className="text-lg font-semibold text-canvas-navy mb-2">Drawdown Schedule</h4>
              <div className="space-y-2 text-sm text-canvas-navy">
                <div>• Initial draw: {formatCurrency(formState.requestedAmount * 0.25)}</div>
                <div>• 90 days: +{formatCurrency(formState.requestedAmount * 0.25)}</div>
                <div>• 180 days: +{formatCurrency(formState.requestedAmount * 0.5)}</div>
              </div>
            </div>
          )}

          <div className="bg-canvas-pink bg-opacity-10 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
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
                  Based on {creditType === 'line' ? 'initial draw' : 'full amount'}
                  {formState.repaymentType === 'bullet' && ' (excluding final principal payment)'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAddCredit}
              icon={<Plus className="w-4 h-4" />}
            >
              Add to Canvas
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair text-canvas-cream">Your Credit Facilities</h3>
          <div className="text-sm text-canvas-cream opacity-80">
            {credits.length} {credits.length === 1 ? 'credit facility' : 'credit facilities'} defined
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credits.length === 0 ? (
            <div className="col-span-full bg-canvas-navy bg-opacity-50 border border-dashed border-canvas-mediumgray rounded-lg p-8 text-center">
              <p className="text-canvas-cream opacity-80">
                No credit facilities defined yet. Configure a credit facility above to get started.
              </p>
            </div>
          ) : (
            credits.map((credit) => (
              <Card
                key={credit.id}
                className="hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {credit.creditType === 'loan' ? (
                      <Building2 className="w-5 h-5 text-canvas-navy" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-canvas-navy" />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-canvas-navy">
                        {credit.displayName}
                      </h4>
                      <div className="text-sm text-canvas-navy opacity-70 capitalize">
                        {credit.creditType}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-canvas-navy opacity-70 mb-1">
                      {credit.creditType === 'loan' ? 'Amount' : 'Credit Limit'}
                    </div>
                    <div className="font-semibold text-canvas-navy">
                      {formatCurrency(credit.requestedAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-canvas-navy opacity-70 mb-1">Duration</div>
                    <div className="font-semibold text-canvas-navy">{credit.durationYears} years</div>
                  </div>
                </div>

                <div className="bg-canvas-pink bg-opacity-10 p-3 rounded-md">
                  <div className="text-sm font-medium text-canvas-navy mb-2">Structure</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-canvas-navy">
                    <div>
                      <span className="opacity-70">Repayment: </span>
                      {credit.repaymentType === 'principal_and_interest' ? 'P+I' : 
                       credit.repaymentType === 'interest_only' ? 'Interest Only' : 'Bullet'}
                    </div>
                    <div>
                      <span className="opacity-70">Frequency: </span>
                      {credit.repaymentFrequency}
                    </div>
                  </div>
                  {credit.creditType === 'line' && credit.drawdownSchedule && (
                    <div className="mt-2 text-xs text-canvas-navy">
                      <span className="opacity-70">Initial Draw: </span>
                      {formatCurrency(credit.drawdownSchedule.initialAmount)}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
