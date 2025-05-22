import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { UserCircle, Plus, Trash2, Shield, CreditCard } from 'lucide-react';
import { UserBlock, ViewAccessType, TransactionAccessType, CanvasState } from '../../types/canvas';
import { cn, generateId, formatCurrency } from '../../lib/utils';
import { Toggle } from '../ui/toggle';

interface UserAccessBlockConfigProps {
  users: UserBlock[];
  canvasState: CanvasState;
  onAddUser: (user: UserBlock) => void;
  onRemoveUser: (userId: string) => void;
}

export const UserAccessBlockConfig: React.FC<UserAccessBlockConfigProps> = ({
  users,
  canvasState,
  onAddUser,
  onRemoveUser,
}) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    viewAccess: 'unrestricted' as ViewAccessType,
    selectedBlocks: [] as string[],
    transactionAccess: 'unrestricted' as TransactionAccessType,
    accountLimits: {} as Record<string, { maxValue?: number; maxCount?: number }>,
  });

  const handleAddUser = () => {
    if (!formState.name || !formState.email) {
      alert('Please provide both name and email');
      return;
    }

    // Filter account limits to only include blocks the user has view access to
    const filteredAccountLimits = Object.entries(formState.accountLimits).reduce((acc, [blockId, limits]) => {
      if (formState.viewAccess === 'unrestricted' || formState.selectedBlocks.includes(blockId)) {
        acc[blockId] = limits;
      }
      return acc;
    }, {} as Record<string, { maxValue?: number; maxCount?: number }>);

    const newUser: UserBlock = {
      id: generateId('user'),
      type: 'user',
      name: formState.name,
      email: formState.email,
      viewAccess: {
        type: formState.viewAccess,
        ...(formState.viewAccess === 'restricted' && {
          allowedBlocks: formState.selectedBlocks,
        }),
      },
      transactionAccess: {
        type: formState.transactionAccess,
        ...(formState.transactionAccess === 'value_restricted' && {
          accountLimits: filteredAccountLimits,
        }),
        ...(formState.transactionAccess === 'count_restricted' && {
          accountLimits: filteredAccountLimits,
        }),
      },
    };

    onAddUser(newUser);
    
    setFormState({
      name: '',
      email: '',
      viewAccess: 'unrestricted',
      selectedBlocks: [],
      transactionAccess: 'unrestricted',
      accountLimits: {},
    });
  };

  const handleBlockToggle = (blockId: string) => {
    setFormState(prev => {
      const newSelectedBlocks = prev.selectedBlocks.includes(blockId)
        ? prev.selectedBlocks.filter(id => id !== blockId)
        : [...prev.selectedBlocks, blockId];

      // Remove transaction limits for blocks that are no longer selected
      const newAccountLimits = { ...prev.accountLimits };
      if (!newSelectedBlocks.includes(blockId)) {
        delete newAccountLimits[blockId];
      }

      return {
        ...prev,
        selectedBlocks: newSelectedBlocks,
        accountLimits: newAccountLimits,
      };
    });
  };

  const handleAccountLimitChange = (accountId: string, type: 'maxValue' | 'maxCount', value: number) => {
    setFormState(prev => ({
      ...prev,
      accountLimits: {
        ...prev.accountLimits,
        [accountId]: {
          ...prev.accountLimits[accountId],
          [type]: value,
        },
      },
    }));
  };

  const getBlockOptions = () => {
    const options = [];
    
    if (canvasState.assets.length) {
      options.push(...canvasState.assets.map(asset => ({
        id: asset.id,
        label: asset.displayName,
        type: 'asset',
      })));
    }
    
    if (canvasState.liabilities.length) {
      options.push(...canvasState.liabilities.map(liability => ({
        id: liability.id,
        label: liability.displayName,
        type: 'liability',
      })));
    }
    
    return options;
  };

  const getAccessibleBlocks = () => {
    const blocks = getBlockOptions();
    return formState.viewAccess === 'unrestricted' 
      ? blocks 
      : blocks.filter(block => formState.selectedBlocks.includes(block.id));
  };

  const getTransactionAccessLabel = (access: TransactionAccessType, accountLimits: Record<string, { maxValue?: number; maxCount?: number }>) => {
    switch (access) {
      case 'unrestricted':
        return 'Unrestricted';
      case 'value_restricted':
        return 'Limited by value per account';
      case 'count_restricted':
        return 'Limited by transaction count per account';
      case 'no_transactions':
        return 'No transaction rights';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair text-canvas-cream mb-2">User Access Configuration</h2>
        <p className="text-canvas-cream opacity-80">
          Define user access and transaction rights for your Canvas.
        </p>
      </div>

      <Card className="mb-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                User Name *
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full input-field"
                placeholder="e.g., John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full input-field"
                placeholder="e.g., john@example.com"
              />
            </div>
          </div>

          <div className="border-t border-canvas-mediumgray pt-6">
            <h3 className="text-lg font-semibold text-canvas-navy mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              View Access
            </h3>
            
            <div className="space-y-4">
              <div>
                <select
                  value={formState.viewAccess}
                  onChange={(e) => setFormState({ ...formState, viewAccess: e.target.value as ViewAccessType })}
                  className="w-full input-field"
                >
                  <option value="unrestricted">Unrestricted Access</option>
                  <option value="restricted">Restricted to Specific Blocks</option>
                </select>
              </div>

              {formState.viewAccess === 'restricted' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-canvas-navy">
                    Select Allowed Blocks
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getBlockOptions().map(block => (
                      <div
                        key={block.id}
                        className={cn(
                          "p-3 rounded-md border-2 transition-all cursor-pointer",
                          formState.selectedBlocks.includes(block.id)
                            ? "border-canvas-pink bg-canvas-pink bg-opacity-10"
                            : "border-transparent hover:border-canvas-pink"
                        )}
                        onClick={() => handleBlockToggle(block.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-canvas-navy">{block.label}</div>
                            <div className="text-sm text-canvas-navy opacity-70 capitalize">{block.type}</div>
                          </div>
                          <Toggle
                            checked={formState.selectedBlocks.includes(block.id)}
                            onCheckedChange={() => handleBlockToggle(block.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-canvas-mediumgray pt-6">
            <h3 className="text-lg font-semibold text-canvas-navy mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Transaction Rights
            </h3>
            
            <div className="space-y-4">
              <div>
                <select
                  value={formState.transactionAccess}
                  onChange={(e) => setFormState({ ...formState, transactionAccess: e.target.value as TransactionAccessType })}
                  className="w-full input-field"
                >
                  <option value="unrestricted">Unrestricted</option>
                  <option value="value_restricted">Restricted by Value</option>
                  <option value="count_restricted">Restricted by Count</option>
                  <option value="no_transactions">No Transaction Rights</option>
                </select>
              </div>

              {(formState.transactionAccess === 'value_restricted' || formState.transactionAccess === 'count_restricted') && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-canvas-navy">
                    Configure Account Limits
                  </label>
                  <div className="space-y-3">
                    {getAccessibleBlocks().map(block => (
                      <Card key={block.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium text-canvas-navy">{block.label}</div>
                            <div className="text-sm text-canvas-navy opacity-70 capitalize">{block.type}</div>
                          </div>
                        </div>
                        {formState.transactionAccess === 'value_restricted' && (
                          <div>
                            <label className="block text-sm text-canvas-navy mb-1">Maximum Transaction Value</label>
                            <input
                              type="number"
                              value={formState.accountLimits[block.id]?.maxValue || 0}
                              onChange={(e) => handleAccountLimitChange(block.id, 'maxValue', Number(e.target.value))}
                              className="w-full input-field"
                              min="0"
                              step="1000"
                            />
                            <div className="mt-1 text-sm text-canvas-navy opacity-70">
                              {formatCurrency(formState.accountLimits[block.id]?.maxValue || 0)}
                            </div>
                          </div>
                        )}
                        {formState.transactionAccess === 'count_restricted' && (
                          <div>
                            <label className="block text-sm text-canvas-navy mb-1">Maximum Transactions per Month</label>
                            <input
                              type="number"
                              value={formState.accountLimits[block.id]?.maxCount || 0}
                              onChange={(e) => handleAccountLimitChange(block.id, 'maxCount', Number(e.target.value))}
                              className="w-full input-field"
                              min="0"
                              step="1"
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAddUser}
              icon={<Plus className="w-4 h-4" />}
            >
              Add User
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair text-canvas-cream">Canvas Users</h3>
          <div className="text-sm text-canvas-cream opacity-80">
            {users.length} {users.length === 1 ? 'user' : 'users'} configured
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.length === 0 ? (
            <div className="col-span-full bg-canvas-navy bg-opacity-50 border border-dashed border-canvas-mediumgray rounded-lg p-8 text-center">
              <p className="text-canvas-cream opacity-80">
                No users configured yet. Add users above to grant Canvas access.
              </p>
            </div>
          ) : (
            users.map((user) => (
              <Card
                key={user.id}
                className="hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-canvas-navy" />
                    <div>
                      <h4 className="text-lg font-semibold text-canvas-navy">
                        {user.name}
                      </h4>
                      <div className="text-sm text-canvas-navy opacity-70">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveUser(user.id)}
                    className="p-1 hover:bg-canvas-pink hover:bg-opacity-10 rounded"
                  >
                    <Trash2 className="w-5 h-5 text-canvas-burgundy" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="bg-canvas-pink bg-opacity-10 p-3 rounded-md">
                    <div className="text-sm font-medium text-canvas-navy mb-1">View Access</div>
                    <div className="text-sm text-canvas-navy">
                      {user.viewAccess.type === 'unrestricted' ? (
                        'Unrestricted access to all blocks'
                      ) : (
                        <>
                          Restricted to {user.viewAccess.allowedBlocks?.length || 0} blocks
                          {user.viewAccess.allowedBlocks && user.viewAccess.allowedBlocks.length > 0 && (
                            <div className="mt-1 text-xs opacity-70">
                              {user.viewAccess.allowedBlocks.map(blockId => {
                                const block = getBlockOptions().find(b => b.id === blockId);
                                return block ? block.label : '';
                              }).join(', ')}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-canvas-pink bg-opacity-10 p-3 rounded-md">
                    <div className="text-sm font-medium text-canvas-navy mb-1">Transaction Rights</div>
                    <div className="text-sm text-canvas-navy">
                      {getTransactionAccessLabel(
                        user.transactionAccess.type,
                        user.transactionAccess.accountLimits || {}
                      )}
                      {(user.transactionAccess.type === 'value_restricted' || user.transactionAccess.type === 'count_restricted') && 
                       user.transactionAccess.accountLimits && (
                        <div className="mt-2 space-y-2">
                          {Object.entries(user.transactionAccess.accountLimits).map(([blockId, limits]) => {
                            const block = getBlockOptions().find(b => b.id === blockId);
                            if (!block) return null;
                            return (
                              <div key={blockId} className="text-xs opacity-70">
                                <div className="font-medium">{block.label}:</div>
                                {limits.maxValue && (
                                  <div>Max value: {formatCurrency(limits.maxValue)}</div>
                                )}
                                {limits.maxCount && (
                                  <div>Max transactions: {limits.maxCount} per month</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
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