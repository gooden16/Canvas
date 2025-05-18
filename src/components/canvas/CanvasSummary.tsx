import React from 'react';
import { Card } from '../ui/card';
import { Check, AlertCircle } from 'lucide-react';
import { CanvasState } from '../../types/canvas';
import { formatCurrency } from '../../lib/utils';

interface CanvasSummaryProps {
  canvasState: CanvasState;
}

export const CanvasSummary: React.FC<CanvasSummaryProps> = ({
  canvasState
}) => {
  const getMetricsSummary = () => {
    if (canvasState.metrics.length === 0) return 'No metrics defined';
    return `${canvasState.metrics.length} metric${canvasState.metrics.length === 1 ? '' : 's'} defined`;
  };

  const getAssetsSummary = () => {
    if (canvasState.assets.length === 0) return 'No assets configured';
    const total = canvasState.assets.reduce((sum, asset) => sum + asset.balanceParameters.expected, 0);
    return `${canvasState.assets.length} account${canvasState.assets.length === 1 ? '' : 's'}, ${formatCurrency(total)} total`;
  };

  const getLiabilitiesSummary = () => {
    if (!canvasState.liabilities?.length) return 'No liabilities configured';
    const total = canvasState.liabilities.reduce((sum, liability) => sum + liability.requestedAmount, 0);
    return `${canvasState.liabilities.length} facilit${canvasState.liabilities.length === 1 ? 'y' : 'ies'}, ${formatCurrency(total)} total`;
  };

  const getCollateralSummary = () => {
    if (!canvasState.collateral?.length) return 'No collateral configured';
    const total = canvasState.collateral.reduce((sum, col) => sum + col.value, 0);
    return `${canvasState.collateral.length} asset${canvasState.collateral.length === 1 ? '' : 's'}, ${formatCurrency(total)} total`;
  };

  const getMoneyMovementSummary = () => {
    if (!canvasState.moneyMovement) return 'Not configured';
    const services = [
      canvasState.moneyMovement.merchantPayments && 'Merchant Payments',
      canvasState.moneyMovement.cashDeposits && 'Cash Deposits',
      canvasState.moneyMovement.checkDeposits && 'Check Deposits',
      canvasState.moneyMovement.atmWithdrawals && 'ATM Access'
    ].filter(Boolean);
    return services.length ? services.join(', ') : 'Basic services only';
  };

  const needsCollateral = canvasState.liabilities?.some(l => l.requiresCollateral);
  const hasRequiredCollateral = needsCollateral ? canvasState.collateral?.length > 0 : true;

  return (
    <Card className="bg-canvas-navy border-canvas-mediumgray">
      <div className="p-4">
        <h3 className="text-lg font-playfair text-canvas-cream mb-4">Canvas Summary</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-canvas-cream">
            <div className="flex items-center gap-2">
              {canvasState.metrics.length > 0 ? (
                <Check className="w-4 h-4 text-canvas-gold" />
              ) : (
                <AlertCircle className="w-4 h-4 text-canvas-burgundy" />
              )}
              <span>Metrics</span>
            </div>
            <span className="text-sm opacity-80">{getMetricsSummary()}</span>
          </div>

          <div className="flex items-center justify-between text-canvas-cream">
            <div className="flex items-center gap-2">
              {canvasState.assets.length > 0 ? (
                <Check className="w-4 h-4 text-canvas-gold" />
              ) : (
                <AlertCircle className="w-4 h-4 text-canvas-burgundy" />
              )}
              <span>Assets</span>
            </div>
            <span className="text-sm opacity-80">{getAssetsSummary()}</span>
          </div>

          <div className="flex items-center justify-between text-canvas-cream">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-canvas-gold" />
              <span>Liabilities</span>
            </div>
            <span className="text-sm opacity-80">{getLiabilitiesSummary()}</span>
          </div>

          {needsCollateral && (
            <div className="flex items-center justify-between text-canvas-cream">
              <div className="flex items-center gap-2">
                {hasRequiredCollateral ? (
                  <Check className="w-4 h-4 text-canvas-gold" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-canvas-burgundy" />
                )}
                <span>Collateral</span>
              </div>
              <span className="text-sm opacity-80">{getCollateralSummary()}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-canvas-cream">
            <div className="flex items-center gap-2">
              {canvasState.moneyMovement ? (
                <Check className="w-4 h-4 text-canvas-gold" />
              ) : (
                <AlertCircle className="w-4 h-4 text-canvas-burgundy" />
              )}
              <span>Money Movement</span>
            </div>
            <span className="text-sm opacity-80">{getMoneyMovementSummary()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};