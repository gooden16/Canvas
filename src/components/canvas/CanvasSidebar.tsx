import React from 'react';
import { cn } from '../../lib/utils';
import { CanvasStep } from '../../types/canvas';
import { Check, Circle } from 'lucide-react';

interface CanvasSidebarProps {
  steps: CanvasStep[];
  onSelectStep: (stepId: number) => void;
}

export const CanvasSidebar: React.FC<CanvasSidebarProps> = ({ 
  steps, 
  onSelectStep 
}) => {
  return (
    <div className="bg-canvas-navy border-r border-canvas-mediumgray p-6 h-full">
      <h2 className="text-xl font-playfair text-canvas-cream mb-6">Canvas Elements</h2>
      
      <div className="space-y-1">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'p-3 rounded-md flex items-center gap-3 cursor-pointer transition-colors',
              step.current ? 'bg-canvas-gold text-canvas-navy' : 
                step.completed ? 'text-canvas-cream hover:bg-canvas-cream hover:bg-opacity-10' : 
                'text-canvas-cream text-opacity-60 hover:bg-canvas-cream hover:bg-opacity-10'
            )}
            onClick={() => onSelectStep(step.id)}
          >
            <div className="flex-shrink-0">
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <Circle className={cn("w-5 h-5", step.current && "fill-canvas-navy stroke-canvas-navy")} />
              )}
            </div>
            <span>{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};