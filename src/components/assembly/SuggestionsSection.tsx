import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Landmark, CreditCard, Package, ArrowLeftRight, Zap, Users } from 'lucide-react';
import { CanvasComponent } from '../../stores/canvasStore';
import { useDraggable } from '@dnd-kit/core';

interface SuggestionCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  componentType: string;
  defaultData?: Record<string, any>;
  onAdd: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  id,
  title,
  description,
  icon,
  benefits,
  componentType,
  defaultData,
  onAdd
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `suggestion-${id}`,
    data: {
      type: 'suggestion',
      componentType,
      defaultData
    }
  });

  return (
    <Card
      ref={setNodeRef}
      className={`cursor-grab transition-all hover:border-canvas-gold ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-canvas-pink bg-opacity-20 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="text-lg font-medium text-canvas-navy">{title}</h4>
          <p className="text-sm text-canvas-navy opacity-70">{description}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-canvas-navy">
            <span className="text-canvas-gold">✓</span>
            {benefit}
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={onAdd}
        className="w-full"
      >
        Add to Canvas
      </Button>
    </Card>
  );
};

interface SuggestionsSectionProps {
  existingComponents: CanvasComponent[];
  onAddComponent: (component: CanvasComponent) => void;
}

export const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({
  existingComponents,
  onAddComponent
}) => {
  const suggestions = [
    {
      id: 'operating-account',
      title: 'Operating Account',
      description: 'For day-to-day transactions and cash flow',
      icon: <Landmark className="w-5 h-5 text-canvas-navy" />,
      benefits: [
        'Optimize daily cash flow',
        'Earn 0.20% base rate',
        'Smart yield optimization'
      ],
      componentType: 'asset-operating',
      defaultData: {
        name: 'Operating Account',
        balance: 250000,
        yieldOptimization: {
          enabled: true,
          excessThreshold: 300000,
          timing: 'daily',
          level: 'balanced'
        }
      }
    },
    {
      id: 'line-of-credit',
      title: 'Business Line of Credit',
      description: 'Flexible funding when you need it',
      icon: <CreditCard className="w-5 h-5 text-canvas-navy" />,
      benefits: [
        'Up to $1M available',
        '6.72% variable rate',
        'Interest-only option'
      ],
      componentType: 'liability-line',
      defaultData: {
        name: 'Business Line of Credit',
        amount: 1000000,
        drawdownTiming: 'immediate',
        durationYears: 3,
        repaymentFrequency: 'monthly',
        repaymentType: 'principal_and_interest'
      }
    },
    // Add more suggestions as needed
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-playfair text-canvas-cream">Recommended Building Blocks</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map(suggestion => (
          <SuggestionCard
            key={suggestion.id}
            {...suggestion}
            onAdd={() => onAddComponent({
              id: `${suggestion.componentType}-${Date.now()}`,
              type: suggestion.componentType,
              position: { x: 0, y: 0 },
              data: suggestion.defaultData
            })}
          />
        ))}
      </div>
    </div>
  );
};