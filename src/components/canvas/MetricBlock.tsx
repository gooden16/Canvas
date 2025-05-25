import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { BarChart3, PieChart, TrendingUp, Percent, Plus } from 'lucide-react';
import { MetricBlock, MetricCategory, MetricType, VisualizationType, FrequencyType } from '../../types/canvas';
import { cn, generateId } from '../../lib/utils';

interface MetricBlockConfigProps {
  metrics?: MetricBlock[];
  onAdd: (metric: MetricBlock) => void;
}

export const MetricBlockConfig: React.FC<MetricBlockConfigProps> = ({
  metrics = [], // Provide default empty array
  onAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory>('business');
  const [formState, setFormState] = useState({
    displayName: '',
    description: '',
    metricType: 'single_value' as MetricType,
    desiredFrequency: 'daily' as FrequencyType,
    visualizationPreference: 'number' as VisualizationType,
  });
  
  const categories: { id: MetricCategory; label: string }[] = [
    { id: 'business', label: 'Business' },
    { id: 'investment', label: 'Investment' },
    { id: 'liquidity', label: 'Liquidity' },
    { id: 'risk', label: 'Risk' },
    { id: 'custom', label: 'Custom' },
  ];
  
  const metricTypes: { id: MetricType; label: string; icon: React.ReactNode }[] = [
    { id: 'single_value', label: 'Single Value', icon: <Percent className="w-5 h-5" /> },
    { id: 'time_series', label: 'Time Series', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'ratio', label: 'Ratio', icon: <PieChart className="w-5 h-5" /> },
    { id: 'comparison', label: 'Comparison', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const frequencies: { value: FrequencyType; label: string }[] = [
    { value: 'real_time', label: 'Real-time' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
  ];

  const visualizations: { value: VisualizationType; label: string }[] = [
    { value: 'number', label: 'Number' },
    { value: 'gauge', label: 'Gauge' },
    { value: 'line_chart', label: 'Line Chart' },
    { value: 'bar_chart', label: 'Bar Chart' },
    { value: 'progress', label: 'Progress Bar' },
    { value: 'comparison', label: 'Comparison' },
  ];
  
  const handleAddMetric = () => {
    if (!formState.displayName) {
      alert('Please provide a name for the metric');
      return;
    }

    const newMetric: MetricBlock = {
      id: generateId('metric'),
      type: 'metric',
      phase: 'initial',
      displayName: formState.displayName,
      description: formState.description,
      category: selectedCategory,
      metricType: formState.metricType,
      visualizationPreference: formState.visualizationPreference,
      desiredFrequency: formState.desiredFrequency,
      priority: 'medium',
    };
    
    onAdd(newMetric);
    
    // Reset form
    setFormState({
      displayName: '',
      description: '',
      metricType: 'single_value',
      desiredFrequency: 'daily',
      visualizationPreference: 'number',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair text-canvas-cream mb-2">Initial Metrics Definition</h2>
        <p className="text-canvas-cream opacity-80">
          Define the key financial indicators you want to track. These metrics will guide the configuration of your Canvas.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              'px-4 py-2 rounded-full text-sm transition-colors',
              category.id === selectedCategory
                ? 'bg-canvas-pink text-canvas-navy'
                : 'bg-canvas-navy border border-canvas-mediumgray text-canvas-cream hover:bg-canvas-pink hover:bg-opacity-10'
            )}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      <Card className="mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Metric Name *
            </label>
            <input
              type="text"
              value={formState.displayName}
              onChange={(e) => setFormState({ ...formState, displayName: e.target.value })}
              className="w-full input-field"
              placeholder="e.g., Operating Cash Balance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Description
            </label>
            <textarea
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              className="w-full input-field min-h-[100px]"
              placeholder="Describe what this metric measures and why it's important..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Metric Type
              </label>
              <select
                value={formState.metricType}
                onChange={(e) => setFormState({ ...formState, metricType: e.target.value as MetricType })}
                className="w-full input-field"
              >
                {metricTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Update Frequency
              </label>
              <select
                value={formState.desiredFrequency}
                onChange={(e) => setFormState({ ...formState, desiredFrequency: e.target.value as FrequencyType })}
                className="w-full input-field"
              >
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Visualization
              </label>
              <select
                value={formState.visualizationPreference}
                onChange={(e) => setFormState({ ...formState, visualizationPreference: e.target.value as VisualizationType })}
                className="w-full input-field"
              >
                {visualizations.map((vis) => (
                  <option key={vis.value} value={vis.value}>{vis.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAddMetric}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Metric
            </Button>
          </div>
        </div>
      </Card>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair text-canvas-cream">Your Metrics</h3>
          <div className="text-sm text-canvas-cream opacity-80">
            {metrics.length} {metrics.length === 1 ? 'metric' : 'metrics'} defined
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.length === 0 ? (
            <div className="col-span-full bg-canvas-navy bg-opacity-50 border border-dashed border-canvas-mediumgray rounded-lg p-8 text-center">
              <p className="text-canvas-cream opacity-80">
                No metrics defined yet. Use the form above to create your first metric.
              </p>
            </div>
          ) : (
            metrics.map((metric) => (
              <Card
                key={metric.id}
                className="hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-canvas-navy">{metric.displayName}</h4>
                  <span className="px-2 py-1 text-xs rounded-full bg-canvas-pink text-canvas-navy capitalize">
                    {metric.category}
                  </span>
                </div>
                <p className="text-sm text-canvas-navy opacity-70 mb-4">
                  {metric.description || 'No description provided'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-canvas-navy">
                  <div>
                    <span className="font-semibold">Type:</span> {metric.metricType.replace('_', ' ')}
                  </div>
                  <div>
                    <span className="font-semibold">Priority:</span> {metric.priority}
                  </div>
                  <div>
                    <span className="font-semibold">Frequency:</span> {metric.desiredFrequency}
                  </div>
                  <div>
                    <span className="font-semibold">Visualization:</span> {metric.visualizationPreference.replace('_', ' ')}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};