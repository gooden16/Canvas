import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  onClick,
  type = 'button',
  icon,
}) => {
  const variantClasses = {
    primary: 'bg-canvas-gold text-canvas-navy hover:bg-opacity-90',
    secondary: 'bg-canvas-pink text-canvas-navy hover:bg-canvas-pink-dark',
    tertiary: 'bg-transparent text-canvas-cream border border-canvas-cream hover:bg-canvas-pink hover:bg-opacity-10 hover:border-canvas-pink',
  };

  const sizeClasses = {
    sm: 'text-sm h-9 px-3',
    md: 'text-base h-11 px-4',
    lg: 'text-lg h-12 px-6',
  };

  return (
    <button
      type={type}
      className={cn(
        'flex items-center justify-center gap-2 rounded-md transition-all font-semibold',
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};