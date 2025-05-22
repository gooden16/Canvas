import React, { useState } from 'react';
import { CanvasHeader } from '../components/canvas/CanvasHeader';
import { CanvasSidebar } from '../components/canvas/CanvasSidebar';
import { CanvasContent } from '../components/canvas/CanvasContent';
import { CanvasState, CanvasStep } from '../types/canvas';
import { generateId } from '../lib/utils';

const initialSteps: CanvasStep[] = [
  {
    id: 1,
    type: 'metric',
    title: 'Initial Metrics',
    description: 'Define key financial indicators',
    completed: false,
    current: true,
  },
  {
    id: 2,
    type: 'asset',
    title: 'Asset Blocks',
    description: 'Configure operating and reserve accounts',
    completed: false,
    current: false,
  },
  {
    id: 3,
    type: 'liability',
    title: 'Liability Blocks',
    description: 'Configure lending solutions',
    completed: false,
    current: false,
  },
  {
    id: 4,
    type: 'collateral',
    title: 'Collateral Config',
    description: 'Define securing assets',
    completed: false,
    current: false,
  },
  {
    id: 5,
    type: 'money-movement',
    title: 'Money Movement',
    description: 'Define payment forms and rails',
    completed: false,
    current: false,
  },
  {
    id: 6,
    type: 'business-logic',
    title: 'Business Logic',
    description: 'Create automated rules',
    completed: false,
    current: false,
  },
  {
    id: 7,
    type: 'user',
    title: 'User Access',
    description: 'Configure roles and permissions',
    completed: false,
    current: false,
  },
];

const initialCanvasState: CanvasState = {
  id: generateId('canvas'),
  name: 'New Financial Canvas',
  currentStep: 1,
  steps: initialSteps,
  metrics: [],
  assets: [],
  liabilities: [],
  users: [],
};

export const CanvasCreator: React.FC = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>(initialCanvasState);
  
  const handleSelectStep = (stepId: number) => {
    const updatedSteps = canvasState.steps.map(step => ({
      ...step,
      current: step.id === stepId,
    }));
    
    setCanvasState({
      ...canvasState,
      currentStep: stepId,
      steps: updatedSteps,
    });
  };
  
  const handleBack = () => {
    if (canvasState.currentStep > 1) {
      handleSelectStep(canvasState.currentStep - 1);
    }
  };
  
  const handleContinue = () => {
    // Mark current step as completed
    const currentStepIndex = canvasState.steps.findIndex(step => step.current);
    
    if (currentStepIndex < canvasState.steps.length - 1) {
      const updatedSteps = canvasState.steps.map((step, index) => {
        if (index === currentStepIndex) {
          return { ...step, completed: true, current: false };
        } else if (index === currentStepIndex + 1) {
          return { ...step, current: true };
        } else {
          return step;
        }
      });
      
      setCanvasState({
        ...canvasState,
        currentStep: canvasState.currentStep + 1,
        steps: updatedSteps,
      });
    }
  };
  
  const handleSave = () => {
    console.log('Saving canvas:', canvasState);
    // Here you would send the canvas state to your backend
    alert('Canvas progress saved successfully!');
  };
  
  const handleUpdateCanvas = (updatedCanvas: Partial<CanvasState>) => {
    setCanvasState({
      ...canvasState,
      ...updatedCanvas,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-canvas-navy">
      <CanvasHeader
        title={canvasState.name}
        currentStep={canvasState.currentStep}
        totalSteps={canvasState.steps.length}
        canGoBack={canvasState.currentStep > 1}
        canContinue={
          // Simple validation - requires at least one item in the current step's collection
          (canvasState.currentStep === 1 && canvasState.metrics.length > 0) ||
          (canvasState.currentStep === 2 && canvasState.assets.length > 0) ||
          (canvasState.currentStep === 3 && (!canvasState.liabilities || canvasState.liabilities.length > 0)) ||
          // For other steps, we would add similar validation
          canvasState.currentStep > 3
        }
        onBack={handleBack}
        onContinue={handleContinue}
        onSave={handleSave}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0 hidden md:block">
          <CanvasSidebar
            steps={canvasState.steps}
            onSelectStep={handleSelectStep}
          />
        </div>
        
        <div className="flex-1 overflow-auto">
          <CanvasContent
            canvasState={canvasState}
            onUpdateCanvas={handleUpdateCanvas}
          />
        </div>
      </div>
    </div>
  );
};