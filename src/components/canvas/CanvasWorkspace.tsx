import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../lib/utils';
import { CanvasComponent, Connection } from '../../stores/canvasStore';
import { Card } from '../ui/card';
import { useDraggable } from '@dnd-kit/core';

interface CanvasWorkspaceProps {
  components: CanvasComponent[];
  connections: Connection[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  className?: string;
}

const GRID_SIZE = 40; // Increased grid size for better spacing
const COMPONENT_WIDTH = 280; // Slightly reduced for better fit
const COMPONENT_HEIGHT = 120; // Fixed height for consistent spacing
const COMPONENT_MARGIN = GRID_SIZE; // Margin between components

// Snap a coordinate to the nearest grid position
const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

// Find the next available grid position
const findAvailablePosition = (
  components: CanvasComponent[],
  baseX: number,
  baseY: number
): { x: number; y: number } => {
  const positions = new Set(
    components.map(c => `${snapToGrid(c.position.x)},${snapToGrid(c.position.y)}`)
  );

  let x = snapToGrid(baseX);
  let y = snapToGrid(baseY);
  
  // Try positions in a grid pattern until we find an empty spot
  while (positions.has(`${x},${y}`)) {
    x += GRID_SIZE + COMPONENT_WIDTH + COMPONENT_MARGIN;
    
    // If we've gone too far right, move down and start from the left
    if (x > window.innerWidth - COMPONENT_WIDTH) {
      x = GRID_SIZE;
      y += GRID_SIZE + COMPONENT_HEIGHT + COMPONENT_MARGIN;
    }
  }

  return { x, y };
};

const DraggableComponent: React.FC<{
  component: CanvasComponent;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ component, isSelected, onSelect }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: {
      type: 'canvas-component',
      component,
    },
  });

  // Calculate grid-aligned position
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
          "cursor-grab transition-all hover:shadow-lg",
          isSelected && "ring-2 ring-canvas-gold shadow-lg",
          isDragging && "opacity-50"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <div className="p-4">
          <h3 className="text-lg font-medium text-canvas-navy capitalize">
            {component.type.split('-').join(' ')}
          </h3>
          <div className="mt-2 text-sm text-canvas-navy opacity-70">
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
          />
        ))}

        {connections.map((connection) => {
          const fromComponent = components.find((c) => c.id === connection.from);
          const toComponent = components.find((c) => c.id === connection.to);

          if (!fromComponent || !toComponent) return null;

          // Calculate connection points from center of components
          const fromX = snapToGrid(fromComponent.position.x) + COMPONENT_WIDTH / 2;
          const fromY = snapToGrid(fromComponent.position.y) + COMPONENT_HEIGHT / 2;
          const toX = snapToGrid(toComponent.position.x) + COMPONENT_WIDTH / 2;
          const toY = snapToGrid(toComponent.position.y) + COMPONENT_HEIGHT / 2;

          // Calculate control points for smooth curve
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