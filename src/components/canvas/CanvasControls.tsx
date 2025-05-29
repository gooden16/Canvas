import React, { useState, useCallback, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  RotateCcw,
  Move
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface CanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleFullscreen: () => void;
  currentZoom: number;
  className?: string;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleFullscreen,
  currentZoom,
  className
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if fullscreen mode is active
  const checkFullscreen = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  // Add event listener for fullscreen changes
  useEffect(() => {
    document.addEventListener('fullscreenchange', checkFullscreen);
    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
    };
  }, [checkFullscreen]);

  // Format zoom level as percentage
  const zoomPercentage = `${Math.round(currentZoom * 100)}%`;

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 bg-canvas-darknavy bg-opacity-80 rounded-lg p-2 flex flex-col gap-2 shadow-lg z-10",
        className
      )}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onZoomIn}
        className="w-8 h-8 text-canvas-cream hover:bg-canvas-mediumgray hover:bg-opacity-30"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      
      <div className="text-xs text-canvas-cream text-center font-mono py-1">
        {zoomPercentage}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onZoomOut}
        className="w-8 h-8 text-canvas-cream hover:bg-canvas-mediumgray hover:bg-opacity-30"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <div className="w-full h-px bg-canvas-mediumgray my-1"></div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onResetView}
        className="w-8 h-8 text-canvas-cream hover:bg-canvas-mediumgray hover:bg-opacity-30"
        title="Reset View"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onToggleFullscreen}
        className="w-8 h-8 text-canvas-cream hover:bg-canvas-mediumgray hover:bg-opacity-30"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </Button>
      
      <div className="w-full h-px bg-canvas-mediumgray my-1"></div>
      
      <div className="text-canvas-cream text-xs text-center opacity-70">
        <Move className="w-3 h-3 inline-block mr-1" />
        Drag to pan
      </div>
    </div>
  );
};
