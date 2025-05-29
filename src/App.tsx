import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { WelcomePage } from './pages/WelcomePage';
import { CanvasCreator } from './pages/CanvasCreator';
import { ToastProvider } from './components/ui/toast';
import { notification } from './stores/notificationStore';

// Error boundary component to catch and handle errors
class ErrorBoundary extends Component<{children: ReactNode}> {
  state = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Canvas application error:', error, errorInfo);
    
    // Show notification
    notification.error('An error occurred in the application. Please try refreshing the page.');
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen bg-canvas-navy flex flex-col items-center justify-center text-canvas-cream p-4">
          <div className="bg-canvas-darknavy border border-canvas-mediumgray rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold text-canvas-gold mb-4">Something went wrong</h2>
            <p className="mb-4">The application encountered an unexpected error. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-canvas-gold text-canvas-navy px-4 py-2 rounded hover:bg-canvas-gold/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // State is maintained between page transitions with this useState hook
  const [showCanvasCreator, setShowCanvasCreator] = useState(false);
  
  const handleStartCanvas = () => {
    setShowCanvasCreator(true);
    notification.info('Canvas editor opened');
  };

  // Handle returning to welcome page
  const handleBackToWelcome = () => {
    setShowCanvasCreator(false);
    notification.info('Returned to welcome page');
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-canvas-navy">
          {showCanvasCreator ? (
            <CanvasCreator />
          ) : (
            <WelcomePage onStartCanvas={handleStartCanvas} />
          )}
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
