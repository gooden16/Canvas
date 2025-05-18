import React from 'react';
import { BuildingBlockType, CanvasState, MetricBlock, AssetBlock, LiabilityBlock, CollateralBlock, MoneyMovementBlock, BusinessLogicBlock } from '../../types/canvas';
import { MetricBlockConfig } from './MetricBlock';
import { AssetBlockConfig } from './AssetBlock';
import { LiabilityBlockConfig } from './LiabilityBlock';
import { CollateralBlockConfig } from './CollateralBlock';
import { MoneyMovementBlockConfig } from './MoneyMovementBlock';
import { BusinessLogicBlockConfig } from './BusinessLogicBlock';
import { CanvasSummary } from './CanvasSummary';

interface CanvasContentProps {
  canvasState: CanvasState;
  onUpdateCanvas: (updatedCanvas: Partial<CanvasState>) => void;
}

export const CanvasContent: React.FC<CanvasContentProps> = ({
  canvasState,
  onUpdateCanvas,
}) => {
  const currentStep = canvasState.steps.find(step => step.current);
  
  if (!currentStep) {
    return <div>No active step found</div>;
  }
  
  const handleAddMetric = (metric: MetricBlock) => {
    const updatedMetrics = [...canvasState.metrics, metric];
    onUpdateCanvas({ metrics: updatedMetrics });
  };
  
  const handleAddAsset = (asset: AssetBlock) => {
    const updatedAssets = [...canvasState.assets, asset];
    onUpdateCanvas({ assets: updatedAssets });
  };
  
  const handleAddLiability = (liability: LiabilityBlock) => {
    const updatedLiabilities = [...(canvasState.liabilities || []), liability];
    onUpdateCanvas({ liabilities: updatedLiabilities });
  };
  
  const handleAddCollateral = (collateral: CollateralBlock) => {
    const updatedCollateral = [...(canvasState.collateral || []), collateral];
    onUpdateCanvas({ collateral: updatedCollateral });
  };
  
  const handleUpdateMoneyMovement = (moneyMovement: MoneyMovementBlock) => {
    onUpdateCanvas({ moneyMovement });
  };

  const handleUpdateBusinessLogic = (businessLogic: BusinessLogicBlock) => {
    onUpdateCanvas({ businessLogic });
  };
  
  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'metric':
        return (
          <MetricBlockConfig
            metrics={canvasState.metrics}
            onAddMetric={handleAddMetric}
          />
        );
      case 'asset':
        return (
          <AssetBlockConfig
            assets={canvasState.assets}
            onAddAsset={handleAddAsset}
          />
        );
      case 'liability':
        return (
          <LiabilityBlockConfig
            liabilities={canvasState.liabilities || []}
            onAddLiability={handleAddLiability}
          />
        );
      case 'collateral':
        return (
          <CollateralBlockConfig
            collateral={canvasState.collateral || []}
            liabilities={canvasState.liabilities || []}
            onAddCollateral={handleAddCollateral}
          />
        );
      case 'money-movement':
        return (
          <MoneyMovementBlockConfig
            moneyMovement={canvasState.moneyMovement}
            onUpdateMoneyMovement={handleUpdateMoneyMovement}
          />
        );
      case 'business-logic':
        return (
          <BusinessLogicBlockConfig
            canvasState={canvasState}
            onUpdateBusinessLogic={handleUpdateBusinessLogic}
          />
        );
      default:
        return (
          <div className="text-canvas-cream">
            Building block type "{currentStep.type}" not yet implemented
          </div>
        );
    }
  };

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1">
        {renderStepContent()}
      </div>
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-6">
          <CanvasSummary canvasState={canvasState} />
        </div>
      </div>
    </div>
  );
};