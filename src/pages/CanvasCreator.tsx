import React from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { BuildingBlockType } from '../types/canvas';
import { useCanvasStore } from '../stores/canvasStore';
import { generateId } from '../lib/utils';
import { ComponentCatalog } from '../components/catalog/ComponentCatalog';
import { CanvasWorkspace } from '../components/canvas/CanvasWorkspace';

export const CanvasCreator: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);
  
  const {
    components,
    addComponent,
    updateComponent,
    removeComponent,
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

  const handleAddComponent = (type: BuildingBlockType, data: any) => {
    const id = generateId(type);
    addComponent({
      id,
      type,
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        ...data,
        name: data.displayName || data.name || `New ${type}`,
      }
    });
  };

  return (
    <div className="min-h-screen bg-canvas-navy flex">
      <ComponentCatalog onAddComponent={handleAddComponent} />
      
      <DndContext
        sensors={sensors}
        modifiers={[restrictToWindowEdges]}
      >
        <CanvasWorkspace
          components={components}
          connections={connections}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          onRemoveComponent={removeComponent}
          className="flex-1"
        />
      </DndContext>
    </div>
  );
};