import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Toast types
export type ToastType = 'success' | 'error' | 'info';

// Toast interface
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Context interface
interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

// Default context
const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

// Generate unique ID for toasts
const generateId = () => Math.random().toString(36).substring(2, 9);

// Default toast duration in milliseconds
const DEFAULT_TOAST_DURATION = 5000;

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a new toast
  const addToast = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = generateId();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Helper functions to create different types of toasts
export const toast = {
  success: (message: string, duration?: number) => {
    const { addToast } = useToast();
    addToast(message, 'success', duration);
  },
  error: (message: string, duration?: number) => {
    const { addToast } = useToast();
    addToast(message, 'error', duration);
  },
  info: (message: string, duration?: number) => {
    const { addToast } = useToast();
    addToast(message, 'info', duration);
  },
};

// Toast item component
const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, toast.duration || DEFAULT_TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  // Get appropriate styles based on toast type
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-canvas-green bg-opacity-20 border-canvas-green';
      case 'error':
        return 'bg-canvas-red bg-opacity-20 border-canvas-red';
      case 'info':
        return 'bg-canvas-lightblue bg-opacity-20 border-canvas-lightblue';
      default:
        return 'bg-canvas-mediumgray bg-opacity-20 border-canvas-mediumgray';
    }
  };

  // Get icon based on toast type
  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-canvas-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-canvas-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-canvas-lightblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center p-4 mb-2 rounded-md shadow-lg border text-canvas-cream transition-all transform translate-y-0 opacity-100",
        getToastStyles(toast.type)
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0 mr-3">
        {getToastIcon(toast.type)}
      </div>
      <div className="flex-1 mr-2">{toast.message}</div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 rounded-full hover:bg-canvas-mediumgray hover:bg-opacity-20 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-canvas-cream" />
      </button>
    </div>
  );
};

// Toast container component
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-full flex flex-col items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};
