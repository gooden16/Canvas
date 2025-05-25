import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Target, Plus } from 'lucide-react';
import { MetricBlock } from '../../types/canvas';
import { formatCurrency } from '../../lib/utils';

interface MetricsSectionProps {
  metrics: MetricBlock[];
  onAddMetric: (metric: Partial<MetricBlock>) => void;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({
  metrics,
  onAddMetric
}) => {
  return (
    <div className="relative">
      <Card className="bg-gradient-to-br from-canvas-gold to-canvas-cream border-2 border-canvas-gold shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-canvas-navy flex items-center justify-center">
            <Target className="w-6 h-6 text-canvas-gold" />
          </div>
          <div>
            <h2 className="text-xl font-playfair text-canvas-navy">Metrics Building Block</h2>
            <p className="text-sm text-canvas-navy opacity-70">Define your key financial indicators</p>
          </div>
        </div>

        <div className="space-y-4">
          {metrics.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-canvas-navy opacity-70">No metrics defined yet</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => onAddMetric({})}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Your First Metric
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {metrics.map(metric => (
                <div
                  key={metric.id}
                  className="bg-white bg-opacity-50 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-canvas-navy">{metric.displayName}</div>
                    <div className="text-sm text-canvas-navy opacity-70">{metric.description}</div>
                  </div>
                  <div className="text-sm font-medium text-canvas-navy">
                    {metric.metricType === 'single_value' && formatCurrency(metric.data?.value || 0)}
                  </div>
                </div>
              ))}
              
              <Button
                variant="secondary"
                onClick={() => onAddMetric({})}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Another Metric
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};