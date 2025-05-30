import React from 'react';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { BuildingBlockType } from '../../types/canvas';
import { Landmark, CreditCard, Package, ArrowLeftRight, Zap, Users, Target } from 'lucide-react';
import { MetricBlockConfig } from '../canvas/MetricBlock';
import { AssetBlockConfig } from '../canvas/AssetBlock';
import { CreditBlockConfig } from '../canvas/CreditBlock';
import { MoneyMovementBlockConfig } from '../canvas/MoneyMovementBlock';
import { BusinessLogicBlockConfig } from '../canvas/BusinessLogicBlock';
import { UserAccessBlockConfig } from '../canvas/UserAccessBlock';

interface ComponentCatalogProps {
  onAddComponent: (type: BuildingBlockType, data: any) => void;
}

const blockTypes = [
  {
    id: 'metric',
    icon: Target,
    label: 'Metrics',
    description: 'Define key financial indicators',
    color: 'border-canvas-gold',
    config: MetricBlockConfig,
  },
  {
    id: 'asset',
    icon: Landmark,
    label: 'Assets',
    description: 'Configure operating and reserve accounts',
    color: 'border-canvas-olive',
    config: AssetBlockConfig,
  },
  {
    id: 'credit',
    icon: CreditCard,
    label: 'Credit',
    description: 'Set up credit facilities',
    color: 'border-canvas-burgundy',
    config: CreditBlockConfig,
  },
  {
    id: 'money-movement',
    icon: ArrowLeftRight,
    label: 'Money Movement',
    description: 'Configure payment flows',
    color: 'border-canvas-orange',
    config: MoneyMovementBlockConfig,
  },
  {
    id: 'business-logic',
    icon: Zap,
    label: 'Business Logic',
    description: 'Create automated rules',
    color: 'border-canvas-lightblue',
    config: BusinessLogicBlockConfig,
  },
  {
    id: 'user',
    icon: Users,
    label: 'User Access',
    description: 'Manage permissions',
    color: 'border-canvas-pink',
    config: UserAccessBlockConfig,
  },
] as const;

export const ComponentCatalog: React.FC<ComponentCatalogProps> = ({ onAddComponent }) => {
  const [selectedType, setSelectedType] = React.useState<BuildingBlockType | null>(null);

  const handleClose = () => setSelectedType(null);

  const renderConfigComponent = () => {
    if (!selectedType) return null;

    const blockType = blockTypes.find(b => b.id === selectedType);
    if (!blockType) return null;

    const ConfigComponent = blockType.config;

    switch (selectedType) {
      case 'metric':
        return (
          <ConfigComponent
            metrics={[]}
            onAdd={(data: any) => {
              onAddComponent(selectedType, data);
              handleClose();
            }}
          />
        );
      case 'asset':
        return (
          <ConfigComponent
            assets={[]}
            onAddAsset={(data: any) => {
              onAddComponent(selectedType, data);
              handleClose();
            }}
          />
        );
      case 'credit':
        return (
          <ConfigComponent
            credits={[]}
            onAddCredit={(data: any) => {
              onAddComponent(selectedType, data);
              handleClose();
            }}
          />
        );
      case 'business-logic':
        return (
          <ConfigComponent
            canvasState={{ assets: [], credits: [], businessLogic: null }}
            onUpdateBusinessLogic={(data: any) => {
              onAddComponent(selectedType, data);
              handleClose();
            }}
          />
        );
      case 'user':
        return (
          <ConfigComponent
            users={[]}
            canvasState={{ assets: [], credits: [], users: [] }}
            onAddUser={(data: any) => {
              onAddComponent(selectedType, data);
              handleClose();
            }}
            onRemoveUser={() => {}}
          />
        );
      case 'money-movement':
        return (
          <ConfigComponent
            onUpdateMoneyMovement={(data: any) => {
              onAddComponent(selectedType, data);
              handleClose();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-canvas-navy border-r border-canvas-mediumgray p-6">
      <h2 className="text-xl font-playfair text-canvas-cream mb-6">Building Blocks</h2>
      
      <div className="space-y-4">
        {blockTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={`cursor-pointer hover:shadow-lg transition-all border-2 ${type.color}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-full bg-canvas-pink bg-opacity-20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-canvas-navy" />
                </div>
                <div>
                  <h3 className="font-medium text-canvas-navy">{type.label}</h3>
                  <p className="text-sm text-canvas-navy opacity-70">{type.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedType && (
        <Dialog open={true} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure {blockTypes.find(b => b.id === selectedType)?.label}</DialogTitle>
            </DialogHeader>
            {renderConfigComponent()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
