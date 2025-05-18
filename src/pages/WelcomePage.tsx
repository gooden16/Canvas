import React from 'react';
import { Button } from '../components/ui/button';
import { PlusCircle, TrendingUp, ShieldCheck, BarChart, Lock, BookOpen, RefreshCw } from 'lucide-react';

interface WelcomePageProps {
  onStartCanvas: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStartCanvas }) => {
  return (
    <div className="min-h-screen bg-canvas-navy">
      <div className="canvas-container py-12 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-canvas-cream mb-6 animate-fade-in">
            Brilliant Financial <span className="text-canvas-gold">Canvas</span>
          </h1>
          <p className="text-lg md:text-xl text-canvas-cream max-w-3xl mx-auto opacity-80 animate-slide-up">
            A sophisticated financial ecosystem designed specifically for Ultra-High Net Worth clients, 
            built on a first principles approach to banking and wealth management.
          </p>
          
          <Button
            variant="primary"
            size="lg"
            className="mt-8 animate-slide-up"
            onClick={onStartCanvas}
            icon={<PlusCircle className="w-5 h-5" />}
          >
            Create New Canvas
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 animate-fade-in">
          <div className="bg-canvas-navy bg-opacity-50 border border-canvas-mediumgray rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-canvas-gold flex items-center justify-center text-canvas-navy">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-playfair ml-3">Integrated Yield Optimization</h3>
            </div>
            <p className="text-canvas-cream opacity-80">
              Built-in intelligence that automatically maximizes returns on your assets while maintaining needed liquidity.
            </p>
          </div>
          
          <div className="bg-canvas-navy bg-opacity-50 border border-canvas-mediumgray rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-canvas-gold flex items-center justify-center text-canvas-navy">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-playfair ml-3">First Principles Collateral</h3>
            </div>
            <p className="text-canvas-cream opacity-80">
              A fundamental approach to assessing and valuing collateral based on core characteristics, not just categories.
            </p>
          </div>
          
          <div className="bg-canvas-navy bg-opacity-50 border border-canvas-mediumgray rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-canvas-gold flex items-center justify-center text-canvas-navy">
                <BarChart className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-playfair ml-3">Client-Centric Metrics</h3>
            </div>
            <p className="text-canvas-cream opacity-80">
              Start with the financial indicators that matter to you, not with traditional banking products.
            </p>
          </div>
        </div>
        
        <div className="bg-canvas-navy bg-opacity-40 border-t border-b border-canvas-mediumgray py-12 px-6 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-canvas-cream mb-8 text-center">How Canvas Works</h2>
            
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
              <div className="text-center">
                <div className="bg-canvas-gold text-canvas-navy rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl text-canvas-cream mb-2">Define Metrics</h3>
                <p className="text-canvas-cream opacity-80">
                  Start by identifying the financial indicators that matter most to you.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-canvas-gold text-canvas-navy rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl text-canvas-cream mb-2">Configure Blocks</h3>
                <p className="text-canvas-cream opacity-80">
                  Build your financial ecosystem with customized building blocks for assets, liabilities, and more.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-canvas-gold text-canvas-navy rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl text-canvas-cream mb-2">Activate & Optimize</h3>
                <p className="text-canvas-cream opacity-80">
                  Launch your Canvas and watch as it continuously optimizes your financial position.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-playfair text-canvas-cream mb-4">Ready to reimagine your banking experience?</h2>
            <p className="text-canvas-cream opacity-80 mb-6">
              The Canvas approach replaces traditional banking silos with an integrated financial ecosystem that adapts to your unique needs.
            </p>
            <Button
              variant="primary"
              onClick={onStartCanvas}
              className="w-full md:w-auto"
              icon={<PlusCircle className="w-5 h-5" />}
            >
              Start Creating Your Canvas
            </Button>
          </div>
          
          <div className="md:w-1/2 bg-canvas-navy bg-opacity-50 border border-canvas-mediumgray rounded-lg p-6">
            <div className="text-canvas-cream space-y-4">
              <div className="flex items-start">
                <Lock className="w-5 h-5 text-canvas-gold mt-1 mr-3 flex-shrink-0" />
                <p>
                  <span className="font-medium">Bank-grade security</span> protects all your financial data and transactions.
                </p>
              </div>
              <div className="flex items-start">
                <BookOpen className="w-5 h-5 text-canvas-gold mt-1 mr-3 flex-shrink-0" />
                <p>
                  <span className="font-medium">Comprehensive documentation</span> ensures you understand every aspect of your Canvas.
                </p>
              </div>
              <div className="flex items-start">
                <RefreshCw className="w-5 h-5 text-canvas-gold mt-1 mr-3 flex-shrink-0" />
                <p>
                  <span className="font-medium">Continuous optimization</span> works 24/7 to improve your financial position.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-canvas-navy border-t border-canvas-mediumgray py-8">
        <div className="canvas-container text-center">
          <p className="text-canvas-cream opacity-60 text-sm">
            &copy; 2025 Brilliant Financial. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};