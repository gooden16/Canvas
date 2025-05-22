import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, ArrowRight, Plus, ToggleLeft, Trash2 } from 'lucide-react';
import { BusinessLogicBlock, BusinessRule, BusinessRuleAction, BusinessRuleTrigger, CanvasState } from '../../types/canvas';
import { cn, generateId, formatCurrency } from '../../lib/utils';

interface BusinessLogicBlockConfigProps {
  canvasState: CanvasState;
  onUpdateBusinessLogic: (businessLogic: BusinessLogicBlock) => void;
}

export const BusinessLogicBlockConfig: React.FC<BusinessLogicBlockConfigProps> = ({
  canvasState,
  onUpdateBusinessLogic,
}) => {
  const [formState, setFormState] = useState({
    name: '',
    sourceBlockId: '',
    triggerType: 'balance_below' as BusinessRuleTrigger,
    triggerValue: 0,
    actionType: 'transfer_funds' as BusinessRuleAction,
    destinationBlockId: '',
    actionAmount: 0,
  });

  const businessLogic = canvasState.businessLogic || {
    id: generateId('business-logic'),
    type: 'business-logic' as const,
    rules: [],
  };

  const handleAddRule = () => {
    if (!formState.name || !formState.sourceBlockId) {
      alert('Please provide a name and select a source block');
      return;
    }

    const newRule: BusinessRule = {
      id: generateId('rule'),
      name: formState.name,
      sourceBlockId: formState.sourceBlockId,
      triggerType: formState.triggerType,
      triggerValue: formState.triggerValue,
      actionType: formState.actionType,
      destinationBlockId: formState.destinationBlockId,
      actionAmount: formState.actionAmount,
      enabled: true,
    };

    const updatedBusinessLogic = {
      ...businessLogic,
      rules: [...businessLogic.rules, newRule],
    };

    onUpdateBusinessLogic(updatedBusinessLogic);
    
    setFormState({
      name: '',
      sourceBlockId: '',
      triggerType: 'balance_below',
      triggerValue: 0,
      actionType: 'transfer_funds',
      destinationBlockId: '',
      actionAmount: 0,
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedBusinessLogic = {
      ...businessLogic,
      rules: businessLogic.rules.filter(rule => rule.id !== ruleId),
    };
    onUpdateBusinessLogic(updatedBusinessLogic);
  };

  const handleToggleRule = (ruleId: string) => {
    const updatedBusinessLogic = {
      ...businessLogic,
      rules: businessLogic.rules.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      ),
    };
    onUpdateBusinessLogic(updatedBusinessLogic);
  };

  const getBlockName = (blockId: string) => {
    const asset = canvasState.assets.find(a => a.id === blockId);
    if (asset) return asset.displayName;
    
    const liability = canvasState.liabilities.find(l => l.id === blockId);
    if (liability) return liability.displayName;
    
    return 'Unknown Block';
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair text-canvas-cream mb-2">Business Logic Configuration</h2>
        <p className="text-canvas-cream opacity-80">
          Create automated rules for managing your assets and liabilities.
        </p>
      </div>

      <Card className="mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Rule Name *
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full input-field"
              placeholder="e.g., Low Balance Alert"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Source Block *
            </label>
            <select
              value={formState.sourceBlockId}
              onChange={(e) => setFormState({ ...formState, sourceBlockId: e.target.value })}
              className="w-full input-field"
            >
              <option value="">Select a block...</option>
              <optgroup label="Assets">
                {canvasState.assets.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.displayName}</option>
                ))}
              </optgroup>
              <optgroup label="Liabilities">
                {canvasState.liabilities.map(liability => (
                  <option key={liability.id} value={liability.id}>{liability.displayName}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Trigger Condition
            </label>
            <select
              value={formState.triggerType}
              onChange={(e) => setFormState({ ...formState, triggerType: e.target.value as BusinessRuleTrigger })}
              className="w-full input-field"
            >
              <option value="balance_below">Balance Below</option>
              <option value="balance_above">Balance Above</option>
              <option value="payment_due">Payment Due</option>
              <option value="deposit_received">Deposit Received</option>
              <option value="withdrawal_made">Withdrawal Made</option>
            </select>
          </div>

          {(formState.triggerType === 'balance_below' || formState.triggerType === 'balance_above') && (
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Trigger Amount
              </label>
              <input
                type="number"
                value={formState.triggerValue}
                onChange={(e) => setFormState({ ...formState, triggerValue: Number(e.target.value) })}
                className="w-full input-field"
                min="0"
                step="1000"
              />
              <div className="mt-1 text-sm text-canvas-navy font-medium">
                {formatCurrency(formState.triggerValue)}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Action
            </label>
            <select
              value={formState.actionType}
              onChange={(e) => setFormState({ ...formState, actionType: e.target.value as BusinessRuleAction })}
              className="w-full input-field"
            >
              <option value="transfer_funds">Transfer Funds</option>
              <option value="send_notification">Send Notification</option>
              <option value="adjust_limits">Adjust Limits</option>
            </select>
          </div>

          {formState.actionType === 'transfer_funds' && (
            <>
              <div>
                <label className="block text-sm font-medium text-canvas-navy mb-2">
                  Destination Account
                </label>
                <select
                  value={formState.destinationBlockId}
                  onChange={(e) => setFormState({ ...formState, destinationBlockId: e.target.value })}
                  className="w-full input-field"
                >
                  <option value="">Select an account...</option>
                  {canvasState.assets.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.displayName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-canvas-navy mb-2">
                  Transfer Amount
                </label>
                <input
                  type="number"
                  value={formState.actionAmount}
                  onChange={(e) => setFormState({ ...formState, actionAmount: Number(e.target.value) })}
                  className="w-full input-field"
                  min="0"
                  step="1000"
                />
                <div className="mt-1 text-sm text-canvas-navy font-medium">
                  {formatCurrency(formState.actionAmount)}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAddRule}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Rule
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair text-canvas-cream">Your Business Rules</h3>
          <div className="text-sm text-canvas-cream opacity-80">
            {businessLogic.rules.length} {businessLogic.rules.length === 1 ? 'rule' : 'rules'} defined
          </div>
        </div>

        <div className="space-y-4">
          {businessLogic.rules.length === 0 ? (
            <div className="bg-canvas-navy bg-opacity-50 border border-dashed border-canvas-mediumgray rounded-lg p-8 text-center">
              <p className="text-canvas-cream opacity-80">
                No business rules defined yet. Add a rule above to automate your financial operations.
              </p>
            </div>
          ) : (
            businessLogic.rules.map((rule) => (
              <Card
                key={rule.id}
                className={cn(
                  "hover:shadow-md transition-all",
                  !rule.enabled && "opacity-60"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-canvas-navy" />
                    <h4 className="text-lg font-semibold text-canvas-navy">
                      {rule.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className="p-1 hover:bg-canvas-pink hover:bg-opacity-10 rounded"
                    >
                      <ToggleLeft className="w-5 h-5 text-canvas-navy" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 hover:bg-canvas-pink hover:bg-opacity-10 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-canvas-burgundy" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-canvas-navy">
                  <span className="font-medium">{getBlockName(rule.sourceBlockId)}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>
                    {rule.triggerType.replace('_', ' ')}
                    {rule.triggerValue ? ` ${formatCurrency(rule.triggerValue)}` : ''}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                  <span>{rule.actionType.replace('_', ' ')}</span>
                  {rule.destinationBlockId && (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span className="font-medium">{getBlockName(rule.destinationBlockId)}</span>
                    </>
                  )}
                </div>

                {rule.actionAmount > 0 && (
                  <div className="mt-2 text-sm text-canvas-navy opacity-70">
                    Amount: {formatCurrency(rule.actionAmount)}
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