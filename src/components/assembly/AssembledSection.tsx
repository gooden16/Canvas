import React from 'react';
import { Card } from '../ui/card';
import { CanvasComponent } from '../../stores/canvasStore';
import { BuildingBlockCard } from './BuildingBlockCard';

interface AssembledSectionProps {
  components: CanvasComponent[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
}

export const AssembledSection: React.FC<AssembledSectionProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent
}) => {
  const assembledComponents = components.filter(c => c.type !== 'metric');

  if (assembledComponents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-playfair text-canvas-cream">Your Canvas Building Blocks</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assembledComponents.map(component => (
          <BuildingBlockCard
            key={component.id}
            component={component}
            selected={component.id === selectedComponent}
            onSelect={() => onSelectComponent(component.id)}
            onUpdate={(updates) => onUpdateComponent(component.id, updates)}
          />
        ))}
      </div>
    </div>
  );
};