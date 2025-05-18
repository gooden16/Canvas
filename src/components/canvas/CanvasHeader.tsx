import React from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { Button } from '../ui/button';

interface CanvasHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
  onSave: () => void;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  title,
  currentStep,
  totalSteps,
  canGoBack,
  canContinue,
  onBack,
  onContinue,
  onSave,
}) => {
  return (
    <header className="bg-canvas-navy py-6 border-b border-canvas-mediumgray">
      <div className="canvas-container">
        <div className="flex justify-between items-center">
          <h1 className="text-canvas-cream font-playfair">{title}</h1>
          <div className="text-canvas-cream">{`Step ${currentStep} of ${totalSteps}`}</div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="tertiary"
            onClick={onBack}
            disabled={!canGoBack}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="tertiary"
              onClick={onSave}
              icon={<Save className="w-4 h-4" />}
            >
              Save Progress
            </Button>
            
            <Button
              variant="primary"
              onClick={onContinue}
              disabled={!canContinue}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};