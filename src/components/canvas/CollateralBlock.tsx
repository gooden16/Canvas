import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Building2, Globe2, Briefcase, Package, Plus, DollarSign, Calendar, User, Info } from 'lucide-react';
import { 
  CollateralBlock, 
  CollateralAssetType, 
  CreditBlock, 
  ValuationSourceType,
  OwnershipType
} from '../../types/canvas';
import { cn, generateId, formatCurrency } from '../../lib/utils';

interface CollateralBlockConfigProps {
  collateral: CollateralBlock[];
  credits: CreditBlock[];
  onAddCollateral: (collateral: CollateralBlock) => void;
}

export const CollateralBlockConfig: React.FC<CollateralBlockConfigProps> = ({
  collateral,
  credits,
  onAddCollateral,
}) => {
  const [formState, setFormState] = useState({
    assetType: 'public_securities' as CollateralAssetType,
    value: 1000000,
    locationType: 'broker_dealer' as 'broker_dealer' | 'physical_address',
    locationDetails: '',
    creditId: '',
    // Valuation details
    valuationDate: new Date().toISOString().split('T')[0],
    valuationSource: 'market_data' as ValuationSourceType,
    lastUpdated: new Date().toISOString().split('T')[0],
    // Ownership information
    ownerName: '',
    ownershipType: 'individual' as OwnershipType,
    ownershipPercentage: 100,
    // Source information
    sourceInformation: '',
  });

  const [activeSection, setActiveSection] = useState<'basic' | 'valuation' | 'ownership'>('basic');

  const assetTypes: { id: CollateralAssetType; label: string; icon: React.ReactNode }[] = [
    { id: 'real_estate', label: 'Real Estate', icon: <Building2 className="w-5 h-5" /> },
    { id: 'public_securities', label: 'Public Securities', icon: <Globe2 className="w-5 h-5" /> },
    { id: 'private_securities', label: 'Private Securities', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'receivable_cash_flow', label: 'Receivable/Cash Flow', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'other_assets', label: 'Other Assets', icon: <Package className="w-5 h-5" /> },
  ];

  const valuationSources: { id: ValuationSourceType; label: string }[] = [
    { id: 'market_data', label: 'Market Data' },
    { id: 'appraisal', label: 'Professional Appraisal' },
    { id: 'estimate', label: 'Estimated Value' },
    { id: 'contract_value', label: 'Contract Value' },
    { id: 'other', label: 'Other Source' },
  ];

  const ownershipTypes: { id: OwnershipType; label: string }[] = [
    { id: 'individual', label: 'Individual Ownership' },
    { id: 'joint', label: 'Joint Ownership' },
    { id: 'entity', label: 'Entity Ownership (LLC, Corp)' },
    { id: 'trust', label: 'Trust' },
  ];

  const handleAddCollateral = () => {
    // Validate required fields
    if (!formState.creditId) {
      alert('Please select a credit facility to secure');
      return;
    }

    if (!formState.locationDetails) {
      alert('Please provide location details');
      return;
    }

    if (!formState.ownerName && formState.assetType !== 'public_securities') {
      alert('Please provide owner information');
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
      creditId: formState.creditId,
      // Add enhanced fields
      valuationDetails: {
        valuationDate: formState.valuationDate,
        valuationSource: formState.valuationSource,
        lastUpdated: formState.lastUpdated,
      },
      ownershipDetails: {
        ownerName: formState.ownerName,
        ownershipType: formState.ownershipType,
        ownershipPercentage: formState.ownershipPercentage,
      },
      sourceInformation: formState.sourceInformation || undefined,
    };

    onAddCollateral(newCollateral);
    
    // Reset form state
    setFormState({
      assetType: 'public_securities',
      value: 1000000,
      locationType: 'broker_dealer',
      locationDetails: '',
      creditId: '',
      valuationDate: new Date().toISOString().split('T')[0],
      valuationSource: 'market_data',
      lastUpdated: new Date().toISOString().split('T')[0],
      ownerName: '',
      ownershipType: 'individual',
      ownershipPercentage: 100,
      sourceInformation: '',
    });
    
    // Reset to basic section
    setActiveSection('basic');
  };

  const getAdvanceRate = (assetType: CollateralAssetType) => {
    switch (assetType) {
      case 'public_securities':
        return 0.8; // 80%
      case 'real_estate':
        return 0.7; // 70%
      case 'private_securities':
        return 0.5; // 50%
      case 'receivable_cash_flow':
        return 0.6; // 60%
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
          Select and configure assets to secure your credit facilities.
        </p>
      </div>

      <Card className="mb-8">
        {/* Section Tabs */}
        <div className="border-b border-canvas-mediumgray mb-6">
          <div className="flex">
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium",
                activeSection === 'basic' 
                  ? "border-b-2 border-canvas-pink text-canvas-navy" 
                  : "text-canvas-navy opacity-70 hover:opacity-100"
              )}
              onClick={() => setActiveSection('basic')}
            >
              Basic Information
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium",
                activeSection === 'valuation' 
                  ? "border-b-2 border-canvas-pink text-canvas-navy" 
                  : "text-canvas-navy opacity-70 hover:opacity-100"
              )}
              onClick={() => setActiveSection('valuation')}
            >
              Valuation Details
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium",
                activeSection === 'ownership' 
                  ? "border-b-2 border-canvas-pink text-canvas-navy" 
                  : "text-canvas-navy opacity-70 hover:opacity-100"
              )}
              onClick={() => setActiveSection('ownership')}
            >
              Ownership Information
            </button>
          </div>
        </div>

        {/* Basic Information Section */}
        {activeSection === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Select Credit to Secure
              </label>
              <select
                value={formState.creditId}
                onChange={(e) => setFormState({ ...formState, creditId: e.target.value })}
                className="w-full input-field"
              >
                <option value="">Choose a credit facility...</option>
                {credits.map((credit) => (
                  <option key={credit.id} value={credit.id}>
                    {credit.displayName} ({formatCurrency(credit.requestedAmount)})
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

            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setActiveSection('valuation')}
              >
                Next: Valuation Details
              </Button>
            </div>
          </div>
        )}

        {/* Valuation Details Section */}
        {activeSection === 'valuation' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                <Calendar className="w-4 h-4 inline-block mr-1" /> Valuation Date
              </label>
              <input
                type="date"
                value={formState.valuationDate}
                onChange={(e) => setFormState({ ...formState, valuationDate: e.target.value })}
                className="w-full input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Valuation Source
              </label>
              <select
                value={formState.valuationSource}
                onChange={(e) => setFormState({ ...formState, valuationSource: e.target.value as ValuationSourceType })}
                className="w-full input-field"
              >
                {valuationSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.label}
                  </option>
                ))}
              </select>
              {formState.valuationSource === 'other' && (
                <input
                  type="text"
                  value={formState.sourceInformation}
                  onChange={(e) => setFormState({ ...formState, sourceInformation: e.target.value })}
                  className="w-full input-field mt-2"
                  placeholder="Specify valuation source..."
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                <Calendar className="w-4 h-4 inline-block mr-1" /> Last Updated
              </label>
              <input
                type="date"
                value={formState.lastUpdated}
                onChange={(e) => setFormState({ ...formState, lastUpdated: e.target.value })}
                className="w-full input-field"
              />
            </div>

            <div className="bg-canvas-pink bg-opacity-10 p-4 rounded-md">
              <div className="text-sm font-medium text-canvas-navy mb-2">
                <Info className="w-4 h-4 inline-block mr-1" /> Valuation Information
              </div>
              <p className="text-sm text-canvas-navy">
                Regular valuation updates are essential for accurate LTV calculations and risk management.
                {formState.assetType === 'public_securities' && ' Market data is refreshed daily for public securities.'}
                {formState.assetType === 'real_estate' && ' Real estate should be professionally appraised every 1-3 years.'}
                {formState.assetType === 'private_securities' && ' Private securities should be valued at least annually.'}
                {formState.assetType === 'receivable_cash_flow' && ' Receivables should be reviewed quarterly for collectability.'}
              </p>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveSection('basic')}
              >
                Back
              </Button>
              <Button
                variant="secondary"
                onClick={() => setActiveSection('ownership')}
              >
                Next: Ownership Details
              </Button>
            </div>
          </div>
        )}

        {/* Ownership Information Section */}
        {activeSection === 'ownership' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                <User className="w-4 h-4 inline-block mr-1" /> Owner Name
              </label>
              <input
                type="text"
                value={formState.ownerName}
                onChange={(e) => setFormState({ ...formState, ownerName: e.target.value })}
                className="w-full input-field"
                placeholder="e.g., John Smith or Smith Family Trust"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Ownership Type
              </label>
              <select
                value={formState.ownershipType}
                onChange={(e) => setFormState({ ...formState, ownershipType: e.target.value as OwnershipType })}
                className="w-full input-field"
              >
                {ownershipTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                Ownership Percentage
              </label>
              <input
                type="number"
                value={formState.ownershipPercentage}
                onChange={(e) => setFormState({ ...formState, ownershipPercentage: Math.min(100, Math.max(0, Number(e.target.value))) })}
                className="w-full input-field"
                min="0"
                max="100"
                step="1"
              />
              <div className="mt-1 text-sm text-canvas-navy opacity-70">
                {formState.ownershipPercentage}% ownership
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-canvas-navy mb-2">
                <Info className="w-4 h-4 inline-block mr-1" /> Additional Source Information
              </label>
              <textarea
                value={formState.sourceInformation}
                onChange={(e) => setFormState({ ...formState, sourceInformation: e.target.value })}
                className="w-full input-field min-h-[100px]"
                placeholder="Enter any additional details about the source, acquisition, or other relevant information..."
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveSection('valuation')}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleAddCollateral}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Collateral
              </Button>
            </div>
          </div>
        )}
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
                No collateral configured yet. Add collateral above to secure your credit facilities.
              </p>
            </div>
          ) : (
            collateral.map((col) => {
              const credit = credits.find(c => c.id === col.creditId);
              const assetType = assetTypes.find(t => t.id === col.assetType);
              
              return (
                <Card
                  key={col.id}
                  className="hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {assetType?.icon}
                      <div>
                        <h4 className="text-lg font-semibold text-canvas-navy">
                          {assetType?.label}
                        </h4>
                        {col.ownershipDetails?.ownerName && (
                          <div className="text-xs text-canvas-navy opacity-70">
                            Owned by: {col.ownershipDetails.ownerName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-canvas-navy opacity-70 mb-1">Asset Value</div>
                      <div className="font-semibold text-canvas-navy">
                        {formatCurrency(col.value)}
                      </div>
                      {col.valuationDetails && (
                        <div className="text-xs text-canvas-navy opacity-70">
                          Valued: {new Date(col.valuationDetails.valuationDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-canvas-navy opacity-70 mb-1">Lending Value</div>
                      <div className="font-semibold text-canvas-navy">
                        {formatCurrency(col.value * getAdvanceRate(col.assetType))}
                      </div>
                      <div className="text-xs text-canvas-navy opacity-70">
                        {(getAdvanceRate(col.assetType) * 100)}% advance rate
                      </div>
                    </div>
                  </div>

                  <div className="bg-canvas-pink bg-opacity-10 p-3 rounded-md">
                    <div className="text-sm font-medium text-canvas-navy mb-2">Secures</div>
                    <div className="text-xs text-canvas-navy">
                      {credit?.displayName || 'Unknown Credit Facility'}
                    </div>
                    <div className="text-xs text-canvas-navy opacity-70 mt-1">
                      Location: {col.location.details}
                    </div>
                    {col.valuationDetails?.valuationSource && (
                      <div className="text-xs text-canvas-navy opacity-70 mt-1">
                        Source: {valuationSources.find(s => s.id === col.valuationDetails?.valuationSource)?.label}
                      </div>
                    )}
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
