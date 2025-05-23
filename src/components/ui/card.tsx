import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  header,
  footer,
  onClick,
  selected = false,
}) => {
  return (
    <div
      className={cn(
        'card animate-scale-in',
        onClick && 'cursor-pointer',
        selected && 'ring-2 ring-canvas-gold shadow-md',
        className
      )}
      onClick={onClick}
    >
      {header && (
        <div className="pb-2 mb-2 border-b border-canvas-mediumgray">
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="pt-2 mt-2 border-t border-canvas-mediumgray">
          {footer}
        </div>
      )}
    </div>
  );
};