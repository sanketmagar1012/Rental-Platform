import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import PropertyFiltersPanel, { EMPTY_FILTERS } from '../components/PropertyFiltersPanel';
import { getProperties } from '../services/propertyService';
import { buildFilterParams, hasActiveFilters } from '../utils/buildFilterParams';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    propertyType: 'all',
    bhk: '',
  });
  const [draftFilters, setDraftFilters] = useState(filters);

  const fetchProps = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildFilterParams(filters);
      let res = await getProperties(params);
      setProperties(res.data || []);
    } catch (err) {
      console.error(err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProps();
  }, [fetchProps]);

  const handleBarFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'propertyType') {
        next.bhk = '';
        next.shopFeature = '';
        next.farmhouseFeature = '';
        next.furnishing = '';
      }
      return next;
    });
  };

  const openMoreFilters = () => {
    setDraftFilters(filters);
    setFiltersOpen(true);
  };

  const applyMoreFilters = () => {
    setFilters(draftFilters);
    setFiltersOpen(false);
  };

  const clearAllFilters = () => {
    const cleared = { ...EMPTY_FILTERS, propertyType: 'all', bhk: '' };
    setDraftFilters(cleared);
    setFilters(cleared);
    setFiltersOpen(false);
  };

  const filtered = hasActiveFilters(filters);
  const typeLabel =
    filters.propertyType === 'all'
      ? 'All Properties'
      : filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1);

  const renderList = (title, items) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No properties in this category.</p>
      ) : (
        items.map((prop) => <PropertyCard key={prop._id} property={prop} />)
      )}
    </div>
  );

  return (
    <div className="bg-mb-gray min-h-screen pb-10">
      <div className="bg-mb-red text-white sticky top-16 z-40 shadow-md">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="bg-white text-mb-text flex items-center rounded-full px-4 py-1.5 text-sm shrink-0">
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleBarFilterChange}
              className="outline-none bg-transparent cursor-pointer"
            >
              <option value="all">All Properties</option>
              <option value="flat">Flats</option>
              <option value="shop">Shops</option>
              <option value="farmhouse">Farmhouses</option>
            </select>
          </div>

          {(filters.propertyType === 'flat' || filters.propertyType === 'all') && (
            <div className="bg-white text-mb-text flex items-center rounded-full px-4 py-1.5 text-sm shrink-0">
              <select
                name="bhk"
                value={filters.bhk}
                onChange={handleBarFilterChange}
                className="outline-none bg-transparent cursor-pointer"
              >
                <option value="">Any BHK</option>
                <option value="1RK">1 RK</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
              </select>
            </div>
          )}

          {(filters.propertyType === 'flat' || filters.propertyType === 'all') && (
            <div className="bg-white text-mb-text flex items-center rounded-full px-4 py-1.5 text-sm shrink-0">
              <select
                name="furnishing"
                value={filters.furnishing || ''}
                onChange={handleBarFilterChange}
                className="outline-none bg-transparent cursor-pointer"
              >
                <option value="">Furnishing</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi Furnished">Semi</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={openMoreFilters}
            className="bg-white text-mb-text flex items-center gap-1 rounded-full px-4 py-1.5 text-sm shrink-0 hover:bg-gray-50"
          >
            <SlidersHorizontal size={14} /> More Filters
          </button>

          {filtered && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-white/90 text-sm underline shrink-0 hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <PropertyFiltersPanel
        open={filtersOpen}
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={applyMoreFilters}
        onClear={clearAllFilters}
        onClose={() => setFiltersOpen(false)}
      />

      <div className="container mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-light text-gray-800 mb-6">
            {properties.length} results | {typeLabel} for Rent
          </h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mb-red" />
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg">No properties match your filters.</p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 text-mb-red underline text-sm"
              >
                Reset filters
              </button>
            </div>
          ) : filtered || filters.propertyType !== 'all' ? (
            <div>
              {properties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          ) : (
            <div>
              {renderList('Flats & Apartments', properties.filter((p) => p.propertyType === 'flat'))}
              {renderList('Commercial Shops', properties.filter((p) => p.propertyType === 'shop'))}
              {renderList('Farmhouses', properties.filter((p) => p.propertyType === 'farmhouse'))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Properties;
