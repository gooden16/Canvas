import React from 'react';
import { cn } from '../../lib/utils';

interface BuildingBlockAssemblyProps {
  children: React.ReactNode;
  className?: string;
}

export const BuildingBlockAssembly: React.FC<BuildingBlockAssemblyProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      'max-w-7xl mx-auto p-6 space-y-8',
      className
    )}>
      {children}
    </div>
  );
};