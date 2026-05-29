import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import PropertyFiltersPanel, { EMPTY_FILTERS } from '../components/PropertyFiltersPanel';
import { getProperties } from '../services/propertyService';
import { buildFilterParams, hasActiveFilters } from '../utils/buildFilterParams';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return parseFloat(distance.toFixed(2));
};

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
  const [tenantLocation, setTenantLocation] = useState({
    latitude: 18.5204, // Default Pune center
    longitude: 73.8567,
  });
  const [sortByProximity, setSortByProximity] = useState(false);

  const mapInstanceRef = useRef(null);
  const tenantMarkerRef = useRef(null);
  const propertyMarkersRef = useRef([]);

  // Auto-detect location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTenantLocation({
            latitude: parseFloat(position.coords.latitude.toFixed(6)),
            longitude: parseFloat(position.coords.longitude.toFixed(6)),
          });
        },
        (error) => {
          console.log('Geolocation permission denied or not available. Using default center.');
        }
      );
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!window.L) return;
    const L = window.L;

    if (mapInstanceRef.current) return;

    const map = L.map('properties-map').setView([tenantLocation.latitude, tenantLocation.longitude], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const tenantIcon = L.divIcon({
      html: `
        <div style="
          background-color: #10B981; 
          width: 36px; 
          height: 36px; 
          border-radius: 50% 50% 50% 0; 
          position: absolute; 
          transform: rotate(-45deg); 
          left: 50%; 
          top: 50%; 
          margin: -18px 0 0 -18px;
          border: 2px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
      `,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    const marker = L.marker([tenantLocation.latitude, tenantLocation.longitude], {
      draggable: true,
      icon: tenantIcon,
    }).addTo(map);
    tenantMarkerRef.current = marker;

    marker.bindPopup("<div class='font-semibold text-center font-sans'>Your Location<br/><span class='text-xs text-gray-500 font-normal'>Drag me to recalculate distances!</span></div>").openPopup();

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      setTenantLocation({
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
      });
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setTenantLocation({
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tenantMarkerRef.current = null;
      }
    };
  }, []);

  // Update Tenant marker position when tenantLocation changes externally
  useEffect(() => {
    if (tenantMarkerRef.current) {
      tenantMarkerRef.current.setLatLng([tenantLocation.latitude, tenantLocation.longitude]);
    }
  }, [tenantLocation]);

  // Update Property markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;

    propertyMarkersRef.current.forEach((m) => m.remove());
    propertyMarkersRef.current = [];

    const flatIcon = L.divIcon({
      html: `
        <div style="
          background-color: #E21B3C; 
          width: 24px; 
          height: 24px; 
          border-radius: 50% 50% 50% 0; 
          position: absolute; 
          transform: rotate(-45deg); 
          left: 50%; 
          top: 50%; 
          margin: -12px 0 0 -12px;
          border: 1.5px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div>
        </div>
      `,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });

    properties.forEach((prop) => {
      if (!prop.latitude || !prop.longitude) return;

      const pMarker = L.marker([prop.latitude, prop.longitude], { icon: flatIcon }).addTo(mapInstanceRef.current);

      const dist = calculateDistance(tenantLocation.latitude, tenantLocation.longitude, prop.latitude, prop.longitude);
      const distStr = dist ? `<div class='text-[11px] text-emerald-600 font-semibold mt-1 font-sans'>📍 ${dist} km from you</div>` : '';

      pMarker.bindPopup(`
        <div class="p-1 font-sans" style="min-width: 140px;">
          <div class="font-bold text-gray-800 line-clamp-1 text-xs">${prop.title}</div>
          <div class="text-[10px] text-gray-500 line-clamp-1">${prop.address}</div>
          <div class="text-xs font-bold text-gray-900 mt-1">₹${prop.rent.toLocaleString()}/month</div>
          ${distStr}
          <a href="/properties/${prop._id}" style="
            display: inline-block;
            margin-top: 6px;
            background-color: #E21B3C;
            color: white;
            text-decoration: none;
            padding: 3px 10px;
            border-radius: 9999px;
            font-size: 9px;
            font-weight: bold;
            text-align: center;
          ">
            View Flat
          </a>
        </div>
      `, { maxWidth: 200 });

      propertyMarkersRef.current.push(pMarker);
    });

    const validCoords = properties
      .filter((p) => p.latitude && p.longitude)
      .map((p) => [p.latitude, p.longitude]);

    if (validCoords.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds([
        [tenantLocation.latitude, tenantLocation.longitude],
        ...validCoords,
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [properties, tenantLocation.latitude, tenantLocation.longitude]);

  const handleTenantLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setTenantLocation({
            latitude: parseFloat(latitude.toFixed(6)),
            longitude: parseFloat(longitude.toFixed(6)),
          });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 13);
          }
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

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

  const propertiesWithDistance = properties.map(prop => {
    if (prop.latitude && prop.longitude) {
      const dist = calculateDistance(
        tenantLocation.latitude,
        tenantLocation.longitude,
        prop.latitude,
        prop.longitude
      );
      return { ...prop, distanceKm: dist };
    }
    return prop;
  });

  const sortedProperties = [...propertiesWithDistance].sort((a, b) => {
    if (sortByProximity) {
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      if (a.distanceKm !== undefined) return -1;
      if (b.distanceKm !== undefined) return 1;
    }
    return 0;
  });

  return (
    <div className="bg-transparent min-h-screen pb-10">
      <div className="glass-box border-b border-white/20 sticky top-16 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-none border-x-0 border-t-0">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="bg-white/10 border border-white/20 text-white flex items-center rounded-full px-4 py-1.5 text-sm shrink-0 hover:bg-white/20 transition-colors">
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleBarFilterChange}
              className="outline-none bg-transparent cursor-pointer font-sans [&>option]:bg-[#0f172a] [&>option]:text-white"
            >
              <option value="all">All Properties</option>
              <option value="flat">Flats</option>
              <option value="shop">Shops</option>
              <option value="farmhouse">Farmhouses</option>
            </select>
          </div>

          {(filters.propertyType === 'flat' || filters.propertyType === 'all') && (
            <div className="bg-white/10 border border-white/20 text-white flex items-center rounded-full px-4 py-1.5 text-sm shrink-0 hover:bg-white/20 transition-colors">
              <select
                name="bhk"
                value={filters.bhk}
                onChange={handleBarFilterChange}
                className="outline-none bg-transparent cursor-pointer font-sans [&>option]:bg-[#0f172a] [&>option]:text-white"
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
            <div className="bg-white/10 border border-white/20 text-white flex items-center rounded-full px-4 py-1.5 text-sm shrink-0 hover:bg-white/20 transition-colors">
              <select
                name="furnishing"
                value={filters.furnishing || ''}
                onChange={handleBarFilterChange}
                className="outline-none bg-transparent cursor-pointer font-sans [&>option]:bg-[#0f172a] [&>option]:text-white"
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
            className="bg-white/10 border border-white/20 text-white flex items-center gap-1 rounded-full px-4 py-1.5 text-sm shrink-0 hover:bg-white/20 transition-colors cursor-pointer font-sans"
          >
            <SlidersHorizontal size={14} /> More Filters
          </button>

          <button
            type="button"
            onClick={() => setSortByProximity(prev => !prev)}
            className={`flex items-center gap-1 px-4 py-1.5 text-sm rounded-full cursor-pointer transition-all border font-sans font-medium ${
              sortByProximity 
                ? 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.2)]' 
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            📍 {sortByProximity ? 'Sorted by Proximity' : 'Sort by Nearest'}
          </button>

          {filtered && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-white/80 text-sm underline shrink-0 hover:text-white cursor-pointer font-sans transition-colors"
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
        {/* Left side: Property Cards List */}
        <div className="flex-1">
          <h1 className="text-2xl font-light text-white drop-shadow mb-6 font-sans">
            {sortedProperties.length} results | {typeLabel} for Rent
          </h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#38bdf8]" />
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className="glass-box p-8 text-center rounded-lg">
              <p className="text-gray-300 text-lg font-sans">No properties match your filters.</p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 text-[#38bdf8] underline text-sm cursor-pointer font-sans"
              >
                Reset filters
              </button>
            </div>
          ) : filtered || filters.propertyType !== 'all' ? (
            <div>
              {sortedProperties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          ) : (
            <div>
              {renderList('Flats & Apartments', sortedProperties.filter((p) => p.propertyType === 'flat'))}
              {renderList('Commercial Shops', sortedProperties.filter((p) => p.propertyType === 'shop'))}
              {renderList('Farmhouses', sortedProperties.filter((p) => p.propertyType === 'farmhouse'))}
            </div>
          )}
        </div>

        {/* Right side: Sticky Map panel for distance calculation */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="sticky top-[148px] glass-box rounded-lg p-4 z-10 border border-white/20">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-white font-sans drop-shadow">Dynamic Distance Finder</h2>
              <button
                type="button"
                onClick={handleTenantLocateMe}
                className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded border border-white/20 transition-colors cursor-pointer font-sans font-semibold"
              >
                📍 Locate Me
              </button>
            </div>
            
            <p className="text-xs text-gray-300 mb-3 font-sans leading-relaxed">
              Click anywhere on the map or drag the <strong>green pin</strong> to set your current house coordinate. We will calculate all flat distances instantly!
            </p>

            <div 
              id="properties-map" 
              className="w-full rounded-lg border border-white/20 mb-3 shadow-[0_0_15px_rgba(56,189,248,0.1)] z-10 opacity-90 hover:opacity-100 transition-opacity"
              style={{ height: '320px', minHeight: '320px' }}
            ></div>

            <div className="bg-white/5 p-2.5 rounded border border-white/10 text-[11px] space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Your Latitude:</span>
                <span className="font-semibold text-white">{tenantLocation.latitude.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Longitude:</span>
                <span className="font-semibold text-white">{tenantLocation.longitude.toFixed(6)}</span>
              </div>
              <div className="pt-2 mt-1.5 border-t border-white/10 flex justify-between items-center text-xs font-sans">
                <span className="text-gray-400">Nearest Property:</span>
                <span className="font-bold text-[#38bdf8]">
                  {(() => {
                    const withCoords = sortedProperties.filter(p => p.distanceKm !== undefined);
                    if (withCoords.length === 0) return 'N/A';
                    const nearest = [...withCoords].sort((a, b) => a.distanceKm - b.distanceKm)[0];
                    return `${nearest.distanceKm} km away`;
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
