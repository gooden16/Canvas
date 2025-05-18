import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CreditCard, Building, Wallet, BanknoteIcon, Plus } from 'lucide-react';
import { MoneyMovementBlock, CardPaymentTiming, CardRewardType } from '../../types/canvas';
import { cn, generateId } from '../../lib/utils';

interface MoneyMovementBlockConfigProps {
  moneyMovement?: MoneyMovementBlock;
  onUpdateMoneyMovement: (moneyMovement: MoneyMovementBlock) => void;
}

export const MoneyMovementBlockConfig: React.FC<MoneyMovementBlockConfigProps> = ({
  moneyMovement,
  onUpdateMoneyMovement,
}) => {
  const [formState, setFormState] = useState({
    merchantPayments: false,
    cashDeposits: false,
    checkDeposits: false,
    atmWithdrawals: false,
    showCardConfig: false,
    cardPaymentTiming: 'monthly' as CardPaymentTiming,
    cardRewardType: 'cash' as CardRewardType,
  });

  const needsCard = formState.merchantPayments || formState.atmWithdrawals;

  const handleSaveConfiguration = () => {
    const newMoneyMovement: MoneyMovementBlock = {
      id: moneyMovement?.id || generateId('money-movement'),
      type: 'money-movement',
      merchantPayments: formState.merchantPayments,
      cashDeposits: formState.cashDeposits,
      checkDeposits: formState.checkDeposits,
      atmWithdrawals: formState.atmWithdrawals,
      ...(needsCard && {
        cardConfiguration: {
          paymentTiming: formState.cardPaymentTiming,
          rewardType: formState.cardRewardType,
        },
      }),
    };

    onUpdateMoneyMovement(newMoneyMovement);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair text-canvas-cream mb-2">Money Movement Configuration</h2>
        <p className="text-canvas-cream opacity-80">
          Configure how you plan to move money in and out of your accounts.
        </p>
      </div>

      <Card className="mb-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-canvas-pink bg-opacity-10 rounded-md">
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-canvas-navy" />
                <div>
                  <div className="font-medium text-canvas-navy">Regular Merchant/Vendor Payments</div>
                  <div className="text-sm text-canvas-navy opacity-70">Do you need to make regular payments to merchants or vendors?</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.merchantPayments}
                  onChange={(e) => setFormState({ ...formState, merchantPayments: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-canvas-mediumgray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-canvas-pink rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-canvas-pink"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-canvas-pink bg-opacity-10 rounded-md">
              <div className="flex items-center gap-3">
                <BanknoteIcon className="w-6 h-6 text-canvas-navy" />
                <div>
                  <div className="font-medium text-canvas-navy">Cash Deposits</div>
                  <div className="text-sm text-canvas-navy opacity-70">Will you need to deposit cash regularly?</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.cashDeposits}
                  onChange={(e) => setFormState({ ...formState, cashDeposits: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-canvas-mediumgray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-canvas-pink rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-canvas-pink"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-canvas-pink bg-opacity-10 rounded-md">
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-canvas-navy" />
                <div>
                  <div className="font-medium text-canvas-navy">Check Deposits</div>
                  <div className="text-sm text-canvas-navy opacity-70">Will you need to deposit checks regularly?</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.checkDeposits}
                  onChange={(e) => setFormState({ ...formState, checkDeposits: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-canvas-mediumgray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-canvas-pink rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-canvas-pink"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-canvas-pink bg-opacity-10 rounded-md">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-canvas-navy" />
                <div>
                  <div className="font-medium text-canvas-navy">ATM Withdrawals</div>
                  <div className="text-sm text-canvas-navy opacity-70">Will you need to withdraw cash from ATMs?</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.atmWithdrawals}
                  onChange={(e) => setFormState({ ...formState, atmWithdrawals: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-canvas-mediumgray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-canvas-pink rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-canvas-pink"></div>
              </label>
            </div>
          </div>

          {needsCard && (
            <div className="border-t border-canvas-mediumgray pt-6">
              <h3 className="text-lg font-semibold text-canvas-navy mb-4">Card Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-canvas-navy mb-2">
                    When should card balances be paid?
                  </label>
                  <select
                    value={formState.cardPaymentTiming}
                    onChange={(e) => setFormState({ ...formState, cardPaymentTiming: e.target.value as CardPaymentTiming })}
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
                    value={formState.cardRewardType}
                    onChange={(e) => setFormState({ ...formState, cardRewardType: e.target.value as CardRewardType })}
                    className="w-full input-field"
                  >
                    <option value="cash">Cash Back</option>
                    <option value="travel">Travel Rewards</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleSaveConfiguration}
              icon={<Plus className="w-4 h-4" />}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </Card>

      {moneyMovement && (
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-canvas-navy">Current Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-canvas-navy">Services Enabled</div>
                <ul className="mt-2 space-y-1 text-sm text-canvas-navy">
                  {moneyMovement.merchantPayments && <li>• Merchant Payments</li>}
                  {moneyMovement.cashDeposits && <li>• Cash Deposits</li>}
                  {moneyMovement.checkDeposits && <li>• Check Deposits</li>}
                  {moneyMovement.atmWithdrawals && <li>• ATM Withdrawals</li>}
                </ul>
              </div>

              {moneyMovement.cardConfiguration && (
                <div>
                  <div className="text-sm font-medium text-canvas-navy">Card Settings</div>
                  <ul className="mt-2 space-y-1 text-sm text-canvas-navy">
                    <li>• Payment: {moneyMovement.cardConfiguration.paymentTiming.replace('_', ' ')}</li>
                    <li>• Rewards: {moneyMovement.cardConfiguration.rewardType} rewards</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};