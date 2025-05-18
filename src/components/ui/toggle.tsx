import React from 'react';
import { cn } from '../../lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex w-9 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-canvas-pink focus:ring-opacity-50',
          checked ? 'bg-canvas-pink-dark' : 'bg-canvas-mediumgray',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'absolute w-4 h-4 rounded-full bg-white transition-transform transform top-0.5 left-0.5',
            checked ? 'translate-x-4' : ''
          )}
        />
      </button>
      {label && (
        <span className="ml-2 text-sm text-canvas-cream">{label}</span>
      )}
    </div>
  );
};