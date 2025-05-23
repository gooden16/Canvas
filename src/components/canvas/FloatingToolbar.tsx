import React from 'react';
import { cn } from '../../lib/utils';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ToolbarProps {
  tools: {
    id: string;
    icon: LucideIcon;
    label: string;
  }[];
  activeTool: string;
  onToolSelect: (id: string) => void;
}

export const FloatingToolbar: React.FC<ToolbarProps> = ({
  tools,
  activeTool,
  onToolSelect
}) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-canvas-navy border border-canvas-mediumgray rounded-xl p-2 flex space-x-2 shadow-xl">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={cn(
              "p-2 rounded-lg flex items-center gap-2 transition-all duration-300",
              activeTool === tool.id
                ? "bg-canvas-gold text-canvas-navy"
                : "text-canvas-cream hover:bg-canvas-cream hover:bg-opacity-10"
            )}
          >
            <tool.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};