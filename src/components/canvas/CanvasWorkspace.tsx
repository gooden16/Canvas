import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../lib/utils';
import { CanvasComponent, Connection } from '../../stores/canvasStore';
import { Card } from '../ui/card';
import { useDraggable } from '@dnd-kit/core';
import { X } from 'lucide-react';

interface CanvasWorkspaceProps {
  components: CanvasComponent[];
  connections: Connection[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  onRemoveComponent?: (id: string) => void;
  className?: string;
}

const GRID_SIZE = 40;
const COMPONENT_WIDTH = 280;
const COMPONENT_HEIGHT = 120;
const COMPONENT_MARGIN = GRID_SIZE;

const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

const getBlockStyles = (type: string) => {
  switch (type) {
    case 'metric':
      return 'border-canvas-gold bg-canvas-gold bg-opacity-10 text-canvas-cream';
    case 'asset-operating':
    case 'asset-reserve':
      return 'border-canvas-olive bg-canvas-olive bg-opacity-10 text-canvas-cream';
    case 'liability-line':
    case 'liability-loan':
      return 'border-canvas-burgundy bg-canvas-burgundy bg-opacity-10 text-canvas-cream';
    case 'money-movement':
      return 'border-canvas-orange bg-canvas-orange bg-opacity-10 text-canvas-cream';
    case 'business-logic':
      return 'border-canvas-lightblue bg-canvas-lightblue bg-opacity-10 text-canvas-cream';
    case 'user':
      return 'border-canvas-pink bg-canvas-pink bg-opacity-10 text-canvas-cream';
    default:
      return 'border-canvas-mediumgray text-canvas-cream';
  }
};

const DraggableComponent: React.FC<{
  component: CanvasComponent;
  isSelected: boolean;
  onSelect: () => void;
  onRemove?: () => void;
}> = ({ component, isSelected, onSelect, onRemove }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: {
      type: 'canvas-component',
      component,
    },
  });

  const gridX = snapToGrid(component.position.x);
  const gridY = snapToGrid(component.position.y);

  return (
    <div 
      ref={setNodeRef} 
      style={{
        position: 'absolute',
        left: gridX,
        top: gridY,
        width: COMPONENT_WIDTH,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isSelected ? 10 : 1,
      }}
      {...listeners} 
      {...attributes}
    >
      <Card
        className={cn(
          "cursor-grab transition-all hover:shadow-lg border-2 relative",
          getBlockStyles(component.type),
          isSelected && "ring-2 ring-canvas-gold shadow-lg",
          isDragging && "opacity-50"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-canvas-cream hover:bg-opacity-10 text-canvas-cream"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="p-4">
          <h3 className="text-lg font-medium capitalize">
            {component.type.split('-').join(' ')}
          </h3>
          <div className="mt-2 opacity-70">
            {component.data.name || 'Untitled'}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  components,
  connections,
  selectedComponent,
  onSelectComponent,
  onRemoveComponent,
  className,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-workspace',
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative bg-canvas-navy overflow-auto min-h-screen",
        isOver && "bg-opacity-90",
        className
      )}
      onClick={() => onSelectComponent(null)}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundPosition: '0 0',
      }}
    >
      <div className="relative w-full h-full min-h-screen p-8">
        {components.map((component) => (
          <DraggableComponent
            key={component.id}
            component={component}
            isSelected={component.id === selectedComponent}
            onSelect={() => onSelectComponent(component.id)}
            onRemove={onRemoveComponent ? () => onRemoveComponent(component.id) : undefined}
          />
        ))}

        {connections.map((connection) => {
          const fromComponent = components.find((c) => c.id === connection.from);
          const toComponent = components.find((c) => c.id === connection.to);

          if (!fromComponent || !toComponent) return null;

          const fromX = snapToGrid(fromComponent.position.x) + COMPONENT_WIDTH / 2;
          const fromY = snapToGrid(fromComponent.position.y) + COMPONENT_HEIGHT / 2;
          const toX = snapToGrid(toComponent.position.x) + COMPONENT_WIDTH / 2;
          const toY = snapToGrid(toComponent.position.y) + COMPONENT_HEIGHT / 2;

          const midX = (fromX + toX) / 2;

          return (
            <svg
              key={connection.id}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            >
              <path
                d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                stroke="#D4AF37"
                strokeWidth={2}
                strokeDasharray="5,5"
                fill="none"
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
};