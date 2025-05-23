import React from 'react';
import { ChevronLeft, ChevronRight, Save, Bell, Settings, User } from 'lucide-react';
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
  currentStep,
  totalSteps,
  canGoBack,
  canContinue,
  onBack,
  onContinue,
  onSave,
}) => {
  return (
    <header className="bg-canvas-navy py-4 border-b border-canvas-mediumgray">
      <div className="canvas-container">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="font-raleway text-xl font-semibold text-canvas-cream">
                Brilliant<span className="text-canvas-pink-dusty">*</span>
              </span>
              <span className="font-playfair text-xl text-canvas-cream">
                Financial Canvas
              </span>
            </div>
            <Button
              variant="tertiary"
              onClick={onBack}
              disabled={!canGoBack}
              icon={<ChevronLeft className="w-4 h-4" />}
              size="sm"
            >
              Back
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-canvas-cream text-sm">Step {currentStep} of {totalSteps}</div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-canvas-cream hover:bg-canvas-cream hover:bg-opacity-10 rounded-full">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-canvas-cream hover:bg-canvas-cream hover:bg-opacity-10 rounded-full">
                <Settings className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-canvas-mediumgray mx-2"></div>
              <button className="flex items-center gap-2 text-canvas-cream hover:bg-canvas-cream hover:bg-opacity-10 rounded-full p-1">
                <div className="w-8 h-8 bg-canvas-cream bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex-1"></div>
          
          <div className="flex space-x-3">
            <Button
              variant="tertiary"
              onClick={onSave}
              icon={<Save className="w-4 h-4" />}
              size="sm"
            >
              Save Progress
            </Button>
            
            <Button
              variant="primary"
              onClick={onContinue}
              disabled={!canContinue}
              icon={<ChevronRight className="w-4 h-4" />}
              size="sm"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};