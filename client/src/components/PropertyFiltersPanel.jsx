import React from 'react';
import { X } from 'lucide-react';
import {
  FLAT_OPTIONS,
  SHOP_OPTIONS,
  FARMHOUSE_OPTIONS,
} from '../utils/propertyOptions';

const EMPTY_FILTERS = {
  propertyType: 'all',
  bhk: '',
  furnishing: '',
  bathroomType: '',
  tenantPreference: '',
  nearbyLocation: '',
  shopFeature: '',
  farmhouseFeature: '',
  stayOption: '',
  minGuests: '',
  amenities: '',
  minRent: '',
  maxRent: '',
  minDeposit: '',
  maxDeposit: '',
  city: '',
};

const PropertyFiltersPanel = ({ open, filters, onChange, onApply, onClear, onClose }) => {
  if (!open) return null;

  const type = filters.propertyType;
  const showFlat = type === 'all' || type === 'flat';
  const showShop = type === 'all' || type === 'shop';
  const showFarmhouse = type === 'all' || type === 'farmhouse';

  const set = (name, value) => onChange({ ...filters, [name]: value });

  return (
  <div className="fixed inset-0 z-50 flex justify-end">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="filter-panel relative bg-white w-full max-w-md h-full overflow-y-auto shadow-xl text-gray-900">
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-lg font-bold text-gray-800">More Filters</h2>
        <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Rent (₹)</label>
            <input
              type="number"
              value={filters.minRent}
              onChange={(e) => set('minRent', e.target.value)}
              className="filter-panel-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Rent (₹)</label>
            <input
              type="number"
              value={filters.maxRent}
              onChange={(e) => set('maxRent', e.target.value)}
              className="filter-panel-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Deposit (₹)</label>
            <input
              type="number"
              value={filters.minDeposit}
              onChange={(e) => set('minDeposit', e.target.value)}
              className="filter-panel-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Deposit (₹)</label>
            <input
              type="number"
              value={filters.maxDeposit}
              onChange={(e) => set('maxDeposit', e.target.value)}
              className="filter-panel-input"
            />
          </div>
        </div>

        {showFlat && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-800">Flat filters</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
              <select
                value={filters.furnishing}
                onChange={(e) => set('furnishing', e.target.value)}
                className="filter-panel-select"
              >
                <option value="">Any</option>
                {FLAT_OPTIONS.furnishing.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathroom</label>
              <select
                value={filters.bathroomType}
                onChange={(e) => set('bathroomType', e.target.value)}
                className="filter-panel-select"
              >
                <option value="">Any</option>
                {FLAT_OPTIONS.bathroomType.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant preference</label>
              <select
                value={filters.tenantPreference}
                onChange={(e) => set('tenantPreference', e.target.value)}
                className="filter-panel-select"
              >
                <option value="">Any</option>
                {FLAT_OPTIONS.tenantPreference.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nearby location</label>
              <select
                value={filters.nearbyLocation}
                onChange={(e) => set('nearbyLocation', e.target.value)}
                className="filter-panel-select"
              >
                <option value="">Any</option>
                {FLAT_OPTIONS.nearbyLocations.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenity</label>
              <select
                value={filters.amenities}
                onChange={(e) => set('amenities', e.target.value)}
                className="filter-panel-select"
              >
                <option value="">Any</option>
                {FLAT_OPTIONS.amenities.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {showShop && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-800">Shop filters</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop feature</label>
              <select
                value={filters.shopFeature}
                onChange={(e) => set('shopFeature', e.target.value)}
                className="filter-panel-select"
              >
                <option value="">Any</option>
                {SHOP_OPTIONS.shopFeatures.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {showFarmhouse && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-800">Farmhouse filters</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feature</label>
              <select
                value={filters.farmhouseFeature}
                onChange={(e) => set('farmhouseFeature', e.target.value)}
                className="filter-panel-select"
              >
                <option value="">Any</option>
                {FARMHOUSE_OPTIONS.farmhouseFeatures.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stay type</label>
              <select
                value={filters.stayOption}
                onChange={(e) => set('stayOption', e.target.value)}
                className="filter-panel-select"
              >
                <option value="">Any</option>
                {FARMHOUSE_OPTIONS.stayOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min guests capacity</label>
              <input
                type="number"
                min="1"
                value={filters.minGuests}
                onChange={(e) => set('minGuests', e.target.value)}
                className="filter-panel-input"
              />
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
        <button
          type="button"
          onClick={onClear}
          className="flex-1 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={onApply}
          className="flex-1 py-2 bg-mb-red text-white rounded font-medium hover:bg-red-700"
        >
          Apply filters
        </button>
      </div>
    </div>
  </div>
  );
};

export { EMPTY_FILTERS };
export default PropertyFiltersPanel;
