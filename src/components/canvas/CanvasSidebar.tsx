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
      <h2 className="text-xl font-playfair text-canvas-cream mb-8">Canvas Elements</h2>
      
      <div className="relative space-y-1">
        <div className="absolute left-[23px] top-2 bottom-2 w-px bg-canvas-mediumgray opacity-20" />
        
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'relative p-4 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-300 group',
              step.current ? 'bg-canvas-gold text-canvas-navy shadow-lg' : 
                step.completed ? 'text-canvas-cream hover:bg-canvas-cream hover:bg-opacity-5' : 
                'text-canvas-cream text-opacity-60 hover:bg-canvas-cream hover:bg-opacity-5'
            )}
            onClick={() => onSelectStep(step.id)}
          >
            <div className="relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
              {step.completed ? (
                <div className="w-6 h-6 rounded-full bg-canvas-gold flex items-center justify-center">
                  <Check className="w-4 h-4 text-canvas-navy" />
                </div>
              ) : (
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
                  step.current 
                    ? "bg-canvas-navy border-canvas-navy" 
                    : "border-canvas-mediumgray group-hover:border-canvas-gold"
                )}>
                  <span className="text-xs font-medium">{step.id}</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className={cn(
                "font-medium truncate transition-colors duration-300",
                step.current ? "text-canvas-navy" : "group-hover:text-canvas-gold"
              )}>
                {step.title}
              </div>
              <div className={cn(
                "text-sm truncate transition-colors duration-300",
                step.current ? "text-canvas-navy text-opacity-80" : "text-canvas-cream text-opacity-60"
              )}>
                {step.description}
              </div>
            </div>

            {step.current && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-canvas-navy rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};