import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Building2, Globe2, Briefcase, Package, Plus } from 'lucide-react';
import { CollateralBlock, CollateralAssetType, LiabilityBlock } from '../../types/canvas';
import { cn, generateId, formatCurrency } from '../../lib/utils';

interface CollateralBlockConfigProps {
  collateral: CollateralBlock[];
  liabilities: LiabilityBlock[];
  onAddCollateral: (collateral: CollateralBlock) => void;
}

export const CollateralBlockConfig: React.FC<CollateralBlockConfigProps> = ({
  collateral,
  liabilities,
  onAddCollateral,
}) => {
  const [formState, setFormState] = useState({
    assetType: 'public_securities' as CollateralAssetType,
    value: 1000000,
    locationType: 'broker_dealer' as 'broker_dealer' | 'physical_address',
    locationDetails: '',
    liabilityId: '',
  });

  const assetTypes: { id: CollateralAssetType; label: string; icon: React.ReactNode }[] = [
    { id: 'real_estate', label: 'Real Estate', icon: <Building2 className="w-5 h-5" /> },
    { id: 'public_securities', label: 'Public Securities', icon: <Globe2 className="w-5 h-5" /> },
    { id: 'private_securities', label: 'Private Securities', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'other_assets', label: 'Other Assets', icon: <Package className="w-5 h-5" /> },
  ];

  const handleAddCollateral = () => {
    if (!formState.liabilityId) {
      alert('Please select a liability to secure');
      return;
    }

    if (!formState.locationDetails) {
      alert('Please provide location details');
      return;
    }

    const newCollateral: CollateralBlock = {
      id: generateId('collateral'),
      type: 'collateral',
      assetType: formState.assetType,
      value: formState.value,
      location: {
        type: formState.locationType,
        details: formState.locationDetails,
      },
      liabilityId: formState.liabilityId,
    };

    onAddCollateral(newCollateral);
    
    setFormState({
      assetType: 'public_securities',
      value: 1000000,
      locationType: 'broker_dealer',
      locationDetails: '',
      liabilityId: '',
    });
  };

  const getAdvanceRate = (assetType: CollateralAssetType) => {
    switch (assetType) {
      case 'public_securities':
        return 0.8; // 80%
      case 'real_estate':
        return 0.7; // 70%
      case 'private_securities':
        return 0.5; // 50%
      case 'other_assets':
        return 0.4; // 40%
      default:
        return 0.5;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair text-canvas-cream mb-2">Collateral Configuration</h2>
        <p className="text-canvas-cream opacity-80">
          Select and configure assets to secure your liabilities.
        </p>
      </div>

      <Card className="mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Select Liability to Secure
            </label>
            <select
              value={formState.liabilityId}
              onChange={(e) => setFormState({ ...formState, liabilityId: e.target.value })}
              className="w-full input-field"
            >
              <option value="">Choose a liability...</option>
              {liabilities.map((liability) => (
                <option key={liability.id} value={liability.id}>
                  {liability.displayName} ({formatCurrency(liability.requestedAmount)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Asset Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assetTypes.map((type) => (
                <Card
                  key={type.id}
                  className={cn(
                    "border-2 transition-all cursor-pointer",
                    formState.assetType === type.id ? "border-canvas-pink" : "border-transparent hover:border-canvas-pink"
                  )}
                  onClick={() => setFormState({ ...formState, assetType: type.id })}
                >
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-10 h-10 rounded-full bg-canvas-pink bg-opacity-20 flex items-center justify-center">
                      {type.icon}
                    </div>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs opacity-70">
                        Up to {(getAdvanceRate(type.id) * 100)}% advance rate
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Asset Value
            </label>
            <input
              type="number"
              value={formState.value}
              onChange={(e) => setFormState({ ...formState, value: Number(e.target.value) })}
              className="w-full input-field"
              min="100000"
              step="100000"
            />
            <div className="mt-1 text-sm text-canvas-navy font-medium">
              {formatCurrency(formState.value)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Location Type
            </label>
            <select
              value={formState.locationType}
              onChange={(e) => setFormState({ ...formState, locationType: e.target.value as 'broker_dealer' | 'physical_address' })}
              className="w-full input-field"
            >
              <option value="broker_dealer">Broker Dealer</option>
              <option value="physical_address">Physical Address</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-canvas-navy mb-2">
              Location Details
            </label>
            <input
              type="text"
              value={formState.locationDetails}
              onChange={(e) => setFormState({ ...formState, locationDetails: e.target.value })}
              className="w-full input-field"
              placeholder={formState.locationType === 'broker_dealer' ? 'e.g., Charles Schwab Account #XXX-XXX' : 'e.g., 123 Main St, City, State'}
            />
          </div>

          <div className="bg-canvas-pink bg-opacity-10 p-4 rounded-md">
            <div className="text-lg font-semibold text-canvas-navy mb-2">
              Available Lending Value: {formatCurrency(formState.value * getAdvanceRate(formState.assetType))}
            </div>
            <p className="text-sm text-canvas-navy opacity-70">
              Based on {(getAdvanceRate(formState.assetType) * 100)}% advance rate for {assetTypes.find(t => t.id === formState.assetType)?.label.toLowerCase()}
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAddCollateral}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Collateral
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair text-canvas-cream">Your Collateral</h3>
          <div className="text-sm text-canvas-cream opacity-80">
            {collateral.length} {collateral.length === 1 ? 'asset' : 'assets'} pledged
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collateral.length === 0 ? (
            <div className="col-span-full bg-canvas-navy bg-opacity-50 border border-dashed border-canvas-mediumgray rounded-lg p-8 text-center">
              <p className="text-canvas-cream opacity-80">
                No collateral configured yet. Add collateral above to secure your liabilities.
              </p>
            </div>
          ) : (
            collateral.map((col) => {
              const liability = liabilities.find(l => l.id === col.liabilityId);
              const assetType = assetTypes.find(t => t.id === col.assetType);
              
              return (
                <Card
                  key={col.id}
                  className="hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {assetType?.icon}
                      <h4 className="text-lg font-semibold text-canvas-navy">
                        {assetType?.label}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-canvas-navy opacity-70 mb-1">Asset Value</div>
                      <div className="font-semibold text-canvas-navy">
                        {formatCurrency(col.value)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-canvas-navy opacity-70 mb-1">Lending Value</div>
                      <div className="font-semibold text-canvas-navy">
                        {formatCurrency(col.value * getAdvanceRate(col.assetType))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-canvas-pink bg-opacity-10 p-3 rounded-md">
                    <div className="text-sm font-medium text-canvas-navy mb-2">Secures</div>
                    <div className="text-xs text-canvas-navy">
                      {liability?.displayName || 'Unknown Liability'}
                    </div>
                    <div className="text-xs text-canvas-navy opacity-70 mt-1">
                      Location: {col.location.details}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};