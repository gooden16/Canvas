import React, { useRef, useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { BuildingBlockType } from '../types/canvas';
import { useCanvasStore } from '../stores/canvasStore';
import { generateId } from '../lib/utils';
import { ComponentCatalog } from '../components/catalog/ComponentCatalog';
import { CanvasWorkspace } from '../components/canvas/CanvasWorkspace';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Save, Upload, Trash2, Download, FileUp, FileDown } from 'lucide-react';
import { ToastProvider } from '../components/ui/toast';
import { useNotificationStore, notification } from '../stores/notificationStore';

export const CanvasCreator: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    components,
    addComponent,
    updateComponent,
    removeComponent,
    connections,
    addConnection,
    resetCanvas,
    exportCanvas,
    importCanvas
  } = useCanvasStore();

  // Configure DnD sensors with better constraints for smoother dragging
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Minimum distance before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Delay before touch drag starts
        tolerance: 5, // Movement tolerance
      },
    })
  );

  // Improved component placement with better initial positioning
  const handleAddComponent = (type: BuildingBlockType, data: any) => {
    // Generate a unique ID for the component
    const id = generateId(type);
    
    // Find a suitable position for the new component
    // Try to place it in a visible area with some spacing from existing components
    const existingPositions = components.map(c => ({ x: c.position.x, y: c.position.y }));
    
    // Default position if no components exist
    let newX = 100;
    let newY = 100;
    
    if (existingPositions.length > 0) {
      // Find the rightmost component
      const maxX = Math.max(...existingPositions.map(p => p.x));
      // Find components at this X position
      const componentsAtMaxX = components.filter(c => c.position.x === maxX);
      
      if (componentsAtMaxX.length > 0) {
        // Find the lowest component at this X position
        const maxY = Math.max(...componentsAtMaxX.map(c => c.position.y));
        // Place new component below it
        newX = maxX;
        newY = maxY + 150; // Add some vertical spacing
      } else {
        // Place to the right of the rightmost component
        newX = maxX + 320; // Add some horizontal spacing
        newY = Math.min(...components.map(c => c.position.y));
      }
    }
    
    // Add the new component with the calculated position
    addComponent({
      id,
      type,
      position: { x: newX, y: newY },
      data: {
        ...data,
        name: data.displayName || data.name || `New ${type}`,
      }
    });
    
    // Show notification
    notification.success(`Added new ${type} block to canvas`);
  };

  // Handle the end of a drag operation
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (active.data.current?.type === 'canvas-component') {
      const { id } = active.data.current.component;
      const component = components.find(c => c.id === id);
      
      if (component) {
        // Update the component's position based on the drag delta
        updateComponent(id, {
          position: {
            x: component.position.x + delta.x,
            y: component.position.y + delta.y
          }
        });
      }
    }
  };

  // Handle creating connections between components
  const handleCreateConnection = (fromId: string, toId: string, type: string = 'default') => {
    if (fromId === toId) return; // Prevent self-connections
    
    // Check if connection already exists
    const connectionExists = connections.some(
      conn => conn.from === fromId && conn.to === toId
    );
    
    if (!connectionExists) {
      const connectionId = `conn_${fromId}_${toId}`;
      addConnection({
        id: connectionId,
        from: fromId,
        to: toId,
        type
      });
      
      // Show notification
      const fromComponent = components.find(c => c.id === fromId);
      const toComponent = components.find(c => c.id === toId);
      
      if (fromComponent && toComponent) {
        notification.info(
          `Connected ${fromComponent.data.name || fromComponent.type} to ${toComponent.data.name || toComponent.type}`
        );
      }
    }
  };

  // Handle canvas reset with confirmation
  const handleResetCanvas = () => {
    if (window.confirm('Are you sure you want to reset the canvas? This will remove all components and connections.')) {
      resetCanvas();
      setSelectedComponent(null);
      notification.info('Canvas has been reset');
    }
  };

  // Handle canvas export
  const handleExportCanvas = () => {
    try {
      const jsonData = exportCanvas();
      
      // Create a blob and download it
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      notification.success('Canvas exported successfully');
    } catch (error) {
      console.error('Error exporting canvas:', error);
      notification.error('Failed to export canvas');
    }
  };

  // Handle file selection for import
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setImportData(content);
        setImportError('');
        setShowImportDialog(true);
      } catch (error) {
        console.error('Error reading file:', error);
        setImportError('Failed to read the file');
        notification.error('Failed to read the import file');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle canvas import
  const handleImportCanvas = () => {
    if (!importData) {
      setImportError('No data to import');
      notification.error('No data to import');
      return;
    }
    
    const success = importCanvas(importData);
    if (success) {
      setShowImportDialog(false);
      setImportData('');
      setImportError('');
      notification.success('Canvas imported successfully');
    } else {
      setImportError('Invalid canvas data format. Please check the file and try again.');
      notification.error('Invalid canvas data format. Please check the file and try again.');
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas-navy flex flex-col">
        {/* Canvas Toolbar */}
        <div className="bg-canvas-darknavy p-4 border-b border-canvas-mediumgray flex justify-between items-center">
          <h1 className="text-canvas-cream text-xl font-semibold">Liquidity Canvas</h1>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetCanvas}
              className="text-canvas-cream border-canvas-mediumgray hover:bg-canvas-mediumgray"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Reset
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportCanvas}
              className="text-canvas-cream border-canvas-mediumgray hover:bg-canvas-mediumgray"
            >
              <FileDown className="w-4 h-4 mr-1" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-canvas-cream border-canvas-mediumgray hover:bg-canvas-mediumgray"
            >
              <FileUp className="w-4 h-4 mr-1" />
              Import
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json"
                className="hidden"
              />
            </Button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          <ComponentCatalog onAddComponent={handleAddComponent} />
          
          <DndContext
            sensors={sensors}
            modifiers={[restrictToWindowEdges]}
            onDragEnd={handleDragEnd}
          >
            <CanvasWorkspace
              components={components}
              connections={connections}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onRemoveComponent={(id) => {
                removeComponent(id);
                notification.info('Component removed from canvas');
              }}
              onCreateConnection={handleCreateConnection}
              className="flex-1"
            />
          </DndContext>
        </div>
        
        {/* Import Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="bg-canvas-darknavy border-canvas-mediumgray text-canvas-cream">
            <DialogHeader>
              <DialogTitle>Import Canvas</DialogTitle>
              <DialogDescription>
                Are you sure you want to import this canvas? This will replace your current canvas.
              </DialogDescription>
            </DialogHeader>
            
            {importError && (
              <div className="text-red-500 text-sm mt-2">{importError}</div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowImportDialog(false)}
                className="border-canvas-mediumgray text-canvas-cream"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImportCanvas}
                className="bg-canvas-gold text-canvas-navy hover:bg-canvas-gold/90"
              >
                Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ToastProvider>
  );
};
