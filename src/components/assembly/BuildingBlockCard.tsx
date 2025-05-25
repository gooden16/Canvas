import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Settings, Trash2 } from 'lucide-react';
import { CanvasComponent } from '../../stores/canvasStore';
import { formatCurrency } from '../../lib/utils';

interface BuildingBlockCardProps {
  component: CanvasComponent;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CanvasComponent>) => void;
}

export const BuildingBlockCard: React.FC<BuildingBlockCardProps> = ({
  component,
  selected,
  onSelect,
  onUpdate
}) => {
  const renderContent = () => {
    switch (component.type) {
      case 'asset-operating':
      case 'asset-reserve':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-canvas-navy opacity-70 mb-1">Expected Balance</div>
                <div className="font-semibold text-canvas-navy">
                  {formatCurrency(component.data.balance || 0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-canvas-navy opacity-70 mb-1">Yield Optimization</div>
                <div className="font-semibold text-canvas-navy">
                  {component.data.yieldOptimization?.enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            
            {component.data.yieldOptimization?.enabled && (
              <div className="bg-canvas-pink bg-opacity-10 p-3 rounded-md">
                <div className="text-sm font-medium text-canvas-navy">
                  Estimated Yield: {component.type === 'asset-reserve' ? '4.35%' : '0.20%'}
                </div>
                <div className="text-xs text-canvas-navy opacity-70">
                  Includes optimization boost
                </div>
              </div>
            )}
          </>
        );

      case 'liability-line':
      case 'liability-loan':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-canvas-navy opacity-70 mb-1">Amount</div>
                <div className="font-semibold text-canvas-navy">
                  {formatCurrency(component.data.amount || 0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-canvas-navy opacity-70 mb-1">Term</div>
                <div className="font-semibold text-canvas-navy">
                  {component.data.durationYears} years
                </div>
              </div>
            </div>

            <div className="bg-canvas-pink bg-opacity-10 p-3 rounded-md">
              <div className="text-sm font-medium text-canvas-navy">
                Est. Monthly Payment: {formatCurrency(30749)}
              </div>
              <div className="text-xs text-canvas-navy opacity-70">
                Based on current rates
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="text-sm text-canvas-navy opacity-70">
            Click to configure this building block
          </div>
        );
    }
  };

  return (
    <Card
      className={`transition-all ${
        selected ? 'ring-2 ring-canvas-gold shadow-lg' : 'hover:border-canvas-gold'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-canvas-navy">
            {component.data.name || 'Untitled Block'}
          </h4>
          <p className="text-sm text-canvas-navy opacity-70">
            {component.type.split('-').join(' ')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="tertiary"
            size="sm"
            icon={<Settings className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          />
          <Button
            variant="tertiary"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete
            }}
          />
        </div>
      </div>

      {renderContent()}
    </Card>
  );
};