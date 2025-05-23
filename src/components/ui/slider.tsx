import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  leftLabel,
  rightLabel,
  disabled = false,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;
  
  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const track = trackRef.current;
    if (!track) return;
    
    const rect = track.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;
    const newValue = min + clickPosition * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    onChange(clampedValue);
  };
  
  const handleDragStart = () => {
    if (disabled) return;
    setIsDragging(true);
  };
  
  const handleDrag = (event: MouseEvent) => {
    if (!isDragging || disabled) return;
    
    const track = trackRef.current;
    if (!track) return;
    
    const rect = track.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const newValue = min + clickPosition * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    onChange(clampedValue);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-xs text-canvas-cream">
        {leftLabel && <span>{leftLabel}</span>}
        {rightLabel && <span>{rightLabel}</span>}
      </div>
      <div
        ref={trackRef}
        className={cn('slider-track relative h-1 rounded-full cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}
        onClick={handleTrackClick}
      >
        <div
          className="slider-track-active absolute top-0 left-0 h-full rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <div
          className={cn(
            'slider-handle absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 focus:outline-none focus:ring-2 focus:ring-canvas-gold focus:ring-opacity-50',
            disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
          )}
          style={{ left: `${percentage}%` }}
          onMouseDown={handleDragStart}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
    </div>
  );
};