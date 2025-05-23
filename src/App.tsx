import React, { useState } from 'react';
import { WelcomePage } from './pages/WelcomePage';
import { CanvasCreator } from './pages/CanvasCreator';

function App() {
  const [showCanvasCreator, setShowCanvasCreator] = useState(false);
  
  const handleStartCanvas = () => {
    setShowCanvasCreator(true);
  };

  return (
    <div>
      {showCanvasCreator ? (
        <CanvasCreator />
      ) : (
        <WelcomePage onStartCanvas={handleStartCanvas} />
      )}
    </div>
  );
}

export default App;