import React, { useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { 
  BarChart3, 
  Landmark, 
  CreditCard, 
  Package, 
  ArrowLeftRight, 
  Zap,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ComponentPalette } from '../components/canvas/ComponentPalette';
import { CanvasWorkspace } from '../components/canvas/CanvasWorkspace';
import { PropertiesPanel } from '../components/canvas/PropertiesPanel';
import { FloatingToolbar } from '../components/canvas/FloatingToolbar';
import { useCanvasStore } from '../stores/canvasStore';
import { BuildingBlockType } from '../types/canvas';
import { generateId } from '../lib/utils';

const tools = [
  { id: 'metric', icon: BarChart3, label: 'Metrics' },
  { id: 'asset', icon: Landmark, label: 'Assets' },
  { id: 'liability', icon: CreditCard, label: 'Liabilities' },
  { id: 'collateral', icon: Package, label: 'Collateral' },
  { id: 'money-movement', icon: ArrowLeftRight, label: 'Money Movement' },
  { id: 'business-logic', icon: Zap, label: 'Business Logic' },
  { id: 'user', icon: Users, label: 'Users' }
];

const GRID_SIZE = 40;
const COMPONENT_WIDTH = 280;
const COMPONENT_HEIGHT = 120;
const COMPONENT_MARGIN = GRID_SIZE;

// Snap a coordinate to the nearest grid position
const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

// Find the next available grid position
const findAvailablePosition = (
  components: any[],
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
    if (x > window.innerWidth - COMPONENT_WIDTH - 300) {
      x = GRID_SIZE;
      y += GRID_SIZE + COMPONENT_HEIGHT + COMPONENT_MARGIN;
    }
  }

  return { x, y };
};

export const CanvasCreator: React.FC = () => {
  const [activeTool, setActiveTool] = useState<BuildingBlockType>('metric');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  const {
    components,
    addComponent,
    updateComponent,
    connections,
    addConnection
  } = useCanvasStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    // Get cursor position from the pointer coordinates
    const pointerCoords = event.activatorEvent as MouseEvent;
    const baseX = pointerCoords.clientX - 150; // Offset from left edge
    const baseY = pointerCoords.clientY - 50;  // Offset from top edge

    if (active.data.current?.type === 'palette-item') {
      const componentType = active.data.current.componentType;
      const defaultData = active.data.current.defaultData || {};
      
      // Find the next available position on the grid
      const position = findAvailablePosition(components, baseX, baseY);
      
      addComponent({
        id: generateId(componentType),
        type: componentType,
        position,
        data: defaultData,
      });
    } else {
      // For existing components, find the next available position
      const position = findAvailablePosition(
        components.filter(c => c.id !== active.id),
        baseX,
        baseY
      );
      
      updateComponent(active.id as string, { position });
    }
  };

  return (
    <div className="h-screen bg-canvas-navy overflow-hidden">
      <FloatingToolbar 
        tools={tools}
        activeTool={activeTool}
        onToolSelect={(id) => setActiveTool(id as BuildingBlockType)}
      />
      
      <DndContext
        sensors={sensors}
        modifiers={[restrictToWindowEdges]}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full">
          <ComponentPalette 
            activeTool={activeTool}
            className="w-64 border-r border-canvas-mediumgray"
          />
          
          <CanvasWorkspace
            components={components}
            connections={connections}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            className="flex-1"
          />
          
          {selectedComponent && (
            <PropertiesPanel
              componentId={selectedComponent}
              onClose={() => setSelectedComponent(null)}
              className="w-80 border-l border-canvas-mediumgray"
            />
          )}
        </div>
      </DndContext>
    </div>
  );
};