import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../lib/utils';
import { CanvasComponent, Connection } from '../../stores/canvasStore';
import { useDraggable } from '@dnd-kit/core';
import { CanvasControls } from './CanvasControls';

interface CanvasWorkspaceProps {
  components: CanvasComponent[];
  connections: Connection[];
  selectedComponent: string | null;
  onSelectComponent: (id: string) => void;
  onRemoveComponent?: (id: string) => void;
  onCreateConnection?: (fromId: string, toId: string, type?: string) => void;
  className?: string;
}

const GRID_SIZE = 20; // Smaller grid size for finer control
const COMPONENT_WIDTH = 280;
const COMPONENT_HEIGHT = 120;
const COMPONENT_MARGIN = GRID_SIZE;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

// Enhanced snap to grid function with offset consideration
const snapToGrid = (value: number, offset: number = 0): number => {
  return Math.round((value - offset) / GRID_SIZE) * GRID_SIZE + offset;
};

// Helper function to calculate component center
const getComponentCenter = (component: CanvasComponent) => {
  const x = snapToGrid(component.position.x) + COMPONENT_WIDTH / 2;
  const y = snapToGrid(component.position.y) + COMPONENT_HEIGHT / 2;
  return { x, y };
};

// Helper function to calculate connection path
const calculateConnectionPath = (fromComponent: CanvasComponent, toComponent: CanvasComponent) => {
  const from = getComponentCenter(fromComponent);
  const to = getComponentCenter(toComponent);
  
  // Calculate control points for a smoother curve
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Adjust curve intensity based on distance
  const curveIntensity = Math.min(distance * 0.5, 150);
  
  // Calculate control points
  const midX = (from.x + to.x) / 2;
  const cp1x = from.x + (to.x - from.x) / 4;
  const cp1y = from.y;
  const cp2x = to.x - (to.x - from.x) / 4;
  const cp2y = to.y;
  
  return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
};

const getBlockStyles = (type: string) => {
  switch (type) {
    case 'metric':
      return 'border-canvas-gold bg-canvas-gold bg-opacity-10 text-canvas-cream';
    case 'asset':
      return 'border-canvas-green bg-canvas-green bg-opacity-10 text-canvas-cream';
    case 'liability':
      return 'border-canvas-red bg-canvas-red bg-opacity-10 text-canvas-cream';
    case 'business-logic':
      return 'border-canvas-purple bg-canvas-purple bg-opacity-10 text-canvas-cream';
    case 'money-movement':
      return 'border-canvas-lightblue bg-canvas-lightblue bg-opacity-10 text-canvas-cream';
    case 'user':
      return 'border-canvas-pink bg-canvas-pink bg-opacity-10 text-canvas-cream';
    case 'collateral':
      return 'border-canvas-green bg-canvas-green bg-opacity-10 text-canvas-cream';
    default:
      return 'border-canvas-mediumgray text-canvas-cream';
  }
};

const DraggableComponent: React.FC<{
  component: CanvasComponent;
  isSelected: boolean;
  onSelect: () => void;
  onRemove?: () => void;
  scale: number;
  onStartConnection?: () => void;
}> = ({ component, isSelected, onSelect, onRemove, scale, onStartConnection }) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: component.id,
    data: {
      type: 'canvas-component',
      component,
    },
  });

  // Snap position to grid
  const gridX = snapToGrid(component.position.x);
  const gridY = snapToGrid(component.position.y);

  // Apply transform during dragging for smoother movement
  const style: React.CSSProperties = {
    position: 'absolute',
    left: gridX,
    top: gridY,
    width: COMPONENT_WIDTH,
    height: 'auto',
    opacity: isDragging ? 0.7 : 1,
    zIndex: isSelected ? 10 : (isDragging ? 9 : 1),
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: isDragging ? 'none' : 'all 0.2s ease',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...listeners} 
      {...attributes}
    >
      <div 
        className={cn(
          "cursor-grab transition-all hover:shadow-lg border-2 relative",
          getBlockStyles(component.type),
          isSelected && "ring-2 ring-canvas-gold shadow-lg",
          isDragging && "shadow-xl"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          if (onStartConnection) {
            onStartConnection();
          }
        }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm truncate">
              {component.data.name || component.type}
            </h3>
            {onRemove && (
              <button 
                className="text-canvas-cream opacity-60 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          <div className="text-xs opacity-70">
            {component.type}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  components,
  connections,
  selectedComponent,
  onSelectComponent,
  onRemoveComponent,
  onCreateConnection,
  className,
}) => {
  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
  const workspaceRef = useRef<HTMLDivElement>(null);
  
  // Connection creation state
  const [connectionMode, setConnectionMode] = useState(false);
  const [connectionSource, setConnectionSource] = useState<string | null>(null);

  const { setNodeRef } = useDroppable({
    id: 'canvas-workspace',
  });

  // State to track viewport dimensions for proper rendering
  const [viewportDimensions, setViewportDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update viewport dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Find the maximum component positions to ensure the canvas is large enough
  const maxX = Math.max(...components.map(c => c.position.x + COMPONENT_WIDTH), viewportDimensions.width);
  const maxY = Math.max(...components.map(c => c.position.y + COMPONENT_HEIGHT), viewportDimensions.height);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleResetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // Toggle fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      workspaceRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start panning with middle mouse button (button 1) or when holding space
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setStartPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - startPanPoint.x;
      const dy = e.clientY - startPanPoint.y;
      
      setTranslate(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      setStartPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, startPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Add mouse wheel zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setScale(prev => Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM));
    }
  }, []);

  // Connection creation handlers
  const startConnectionMode = useCallback((componentId: string) => {
    if (onCreateConnection) {
      setConnectionMode(true);
      setConnectionSource(componentId);
    }
  }, [onCreateConnection]);

  const handleComponentSelect = useCallback((componentId: string) => {
    // If in connection mode, complete the connection
    if (connectionMode && connectionSource && componentId !== connectionSource) {
      if (onCreateConnection) {
        onCreateConnection(connectionSource, componentId);
      }
      // Reset connection mode
      setConnectionMode(false);
      setConnectionSource(null);
    } else {
      // Normal component selection
      onSelectComponent(componentId);
    }
  }, [connectionMode, connectionSource, onCreateConnection, onSelectComponent]);

  // Cancel connection mode when clicking on empty space
  const handleCanvasClick = useCallback(() => {
    if (connectionMode) {
      setConnectionMode(false);
      setConnectionSource(null);
    } else {
      onSelectComponent('');
    }
  }, [connectionMode, onSelectComponent]);

  // Add keyboard handlers for zoom, pan, and connections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom with + and -
      if (e.key === '=' || e.key === '+') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      }
      // Reset view with 0
      else if (e.key === '0') {
        handleResetView();
      }
      // Connection creation with 'c' key when a component is selected
      else if (e.key === 'c' && selectedComponent && onCreateConnection) {
        startConnectionMode(selectedComponent);
      }
      // Cancel connection mode with Escape
      else if (e.key === 'Escape' && connectionMode) {
        setConnectionMode(false);
        setConnectionSource(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleResetView, selectedComponent, onCreateConnection, startConnectionMode, connectionMode]);

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (workspaceRef) workspaceRef.current = node;
      }}
      className={cn(
        "relative overflow-auto bg-canvas-navy",
        className,
        isPanning && "cursor-grabbing",
        connectionMode && "cursor-crosshair"
      )}
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        cursor: isPanning ? 'grabbing' : connectionMode ? 'crosshair' : 'default',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: `${GRID_SIZE * scale}px ${GRID_SIZE * scale}px`,
        backgroundPosition: '0 0',
      }}
    >
      {/* Connection mode indicator */}
      {connectionMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-canvas-gold text-canvas-navy px-4 py-2 rounded-md shadow-lg z-50">
          Select a component to connect to
        </div>
      )}
      
      <div 
        className="relative w-full h-full min-h-screen p-8"
        style={{ 
          width: Math.max(maxX + 200, viewportDimensions.width), 
          height: Math.max(maxY + 200, viewportDimensions.height),
          transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
          transformOrigin: '0 0',
          transition: isPanning ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Render connections first so they appear behind components */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {connections.map((connection) => {
            const fromComponent = components.find((c) => c.id === connection.from);
            const toComponent = components.find((c) => c.id === connection.to);

            if (!fromComponent || !toComponent) return null;

            // Calculate path for the connection
            const path = calculateConnectionPath(fromComponent, toComponent);
            
            return (
              <g key={connection.id}>
                <path
                  d={path}
                  stroke="#D4AF37"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  fill="none"
                />
                {/* Add arrow at the end of the path */}
                <circle 
                  cx={getComponentCenter(toComponent).x} 
                  cy={getComponentCenter(toComponent).y} 
                  r={4} 
                  fill="#D4AF37" 
                />
              </g>
            );
          })}
        </svg>

        {/* Render components on top of connections */}
        {components.map((component) => (
          <DraggableComponent
            key={component.id}
            component={component}
            isSelected={component.id === selectedComponent || component.id === connectionSource}
            onSelect={() => handleComponentSelect(component.id)}
            onRemove={onRemoveComponent ? () => onRemoveComponent(component.id) : undefined}
            scale={scale}
            onStartConnection={() => startConnectionMode(component.id)}
          />
        ))}
      </div>

      {/* Canvas Controls */}
      <CanvasControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onToggleFullscreen={handleToggleFullscreen}
        currentZoom={scale}
      />
    </div>
  );
};
