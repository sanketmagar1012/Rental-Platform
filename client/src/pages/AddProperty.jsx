import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/propertyService';
import CheckboxGroup from '../components/CheckboxGroup';
import {
  PROPERTY_TYPES,
  FLAT_OPTIONS,
  SHOP_OPTIONS,
  FARMHOUSE_OPTIONS,
  getDefaultFormState,
  buildFiltersPayload,
  getAmenitiesForType,
} from '../utils/propertyOptions';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => {
    const defaultState = getDefaultFormState('flat');
    return {
      ...defaultState,
      latitude: 18.5204,
      longitude: 73.8567,
    };
  });
  const [files, setFiles] = useState([]);

  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.L) return;
    const L = window.L;
    const center = [formData.latitude || 18.5204, formData.longitude || 73.8567];

    if (mapInstanceRef.current) {
      return;
    }

    const map = L.map('map-picker').setView(center, 13);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const customPinIcon = L.divIcon({
      html: `
        <div style="
          background-color: #E21B3C; 
          width: 32px; 
          height: 32px; 
          border-radius: 50% 50% 50% 0; 
          position: absolute; 
          transform: rotate(-45deg); 
          left: 50%; 
          top: 50%; 
          margin: -16px 0 0 -16px;
          border: 2px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background-color: white; 
            width: 10px; 
            height: 10px; 
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker(center, { 
      draggable: true,
      icon: customPinIcon,
    }).addTo(map);
    markerInstanceRef.current = marker;

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      setFormData((prev) => ({
        ...prev,
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
      }));
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setFormData((prev) => ({
        ...prev,
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
      }));
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
    };
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const center = [latitude, longitude];
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(center, 15);
          }
          if (markerInstanceRef.current) {
            markerInstanceRef.current.setLatLng(center);
          }
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(latitude.toFixed(6)),
            longitude: parseFloat(longitude.toFixed(6)),
          }));
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const defaultState = getDefaultFormState(type);
    setFormData({
      ...defaultState,
      latitude: formData.latitude || 18.5204,
      longitude: formData.longitude || 73.8567,
    });
  };

  const setArrayField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      const core = ['title', 'description', 'propertyType', 'rent', 'deposit', 'address'];
      core.forEach((key) => data.append(key, formData[key]));
      data.append('city', 'Pune');
      if (formData.latitude) data.append('latitude', formData.latitude);
      if (formData.longitude) data.append('longitude', formData.longitude);

      const filters = buildFiltersPayload(formData);
      data.append('filters', JSON.stringify(filters));
      data.append('amenities', JSON.stringify(formData.amenities));

      for (let i = 0; i < files.length; i++) {
        data.append('images', files[i]);
      }

      await createProperty(data);
      alert('Property Added Successfully!');
      navigate('/my-properties');
    } catch (error) {
      console.error(error);
      const exactError = error.response?.data?.message || error.message;
      alert(`Failed to add property. Error: ${exactError}`);
    } finally {
      setLoading(false);
    }
  };

  const type = formData.propertyType;
  const amenityOptions = getAmenitiesForType(type);

  return (
    <div className="bg-transparent min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="glass-box rounded-xl border border-white/20 p-8">
          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow">Post New Property</h1>
          <p className="text-sm text-gray-400 mb-6">
            Form fields change based on property type — flats, shops, and farmhouses have different options.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Basic details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Property Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-500"
                    placeholder={
                      type === 'flat'
                        ? 'e.g. Spacious 2BHK in Koregaon Park'
                        : type === 'shop'
                          ? 'e.g. Road-touch shop in Deccan'
                          : 'e.g. Weekend farmhouse with pool'
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-500"
                    placeholder="Describe your property in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleTypeChange}
                    className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all [&>option]:bg-[#0f172a] [&>option]:text-white"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Local Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-500 mb-4"
                    placeholder="e.g. Kothrud, near Main Road"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-300">Exact Property Location on Map</label>
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded border border-white/20 transition-colors cursor-pointer"
                    >
                      📍 Locate Me (GPS)
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Click on the map or drag the red pin to mark your property's exact location.
                  </p>
                  <div 
                    id="map-picker" 
                    className="w-full rounded-lg border border-white/20 shadow-[0_0_15px_rgba(56,189,248,0.1)] z-10 opacity-90 hover:opacity-100 transition-opacity"
                    style={{ height: '280px', minHeight: '280px' }}
                  ></div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400 bg-white/5 border border-white/10 p-2 rounded">
                    <span>Latitude: <strong className="text-[#38bdf8]">{formData.latitude || 'Not set'}</strong></span>
                    <span>Longitude: <strong className="text-[#38bdf8]">{formData.longitude || 'Not set'}</strong></span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Rent ({type === 'farmhouse' ? 'per day or month — specify in description' : 'per month'})
                  </label>
                  <input
                    type="number"
                    name="rent"
                    required
                    min="0"
                    value={formData.rent}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-500"
                    placeholder="₹"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Deposit</label>
                  <input
                    type="number"
                    name="deposit"
                    required
                    min="0"
                    value={formData.deposit}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-500"
                    placeholder="₹"
                  />
                </div>
              </div>
            </section>

            {type === 'flat' && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Flat configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">BHK</label>
                    <select
                      name="bhk"
                      value={formData.bhk}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all [&>option]:bg-[#0f172a] [&>option]:text-white"
                    >
                      {FLAT_OPTIONS.bhk.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Furnishing</label>
                    <select
                      name="furnishing"
                      value={formData.furnishing}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all [&>option]:bg-[#0f172a] [&>option]:text-white"
                    >
                      {FLAT_OPTIONS.furnishing.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bathroom type</label>
                    <select
                      name="bathroomType"
                      value={formData.bathroomType}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all [&>option]:bg-[#0f172a] [&>option]:text-white"
                    >
                      <option value="">Select bathroom type</option>
                      {FLAT_OPTIONS.bathroomType.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <CheckboxGroup
                  label="Tenant preference"
                  options={FLAT_OPTIONS.tenantPreference}
                  selected={formData.tenantPreference}
                  onChange={(v) => setArrayField('tenantPreference', v)}
                />
                <CheckboxGroup
                  label="Nearby locations"
                  options={FLAT_OPTIONS.nearbyLocations}
                  selected={formData.nearbyLocations}
                  onChange={(v) => setArrayField('nearbyLocations', v)}
                  columns={2}
                />
              </section>
            )}

            {type === 'shop' && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Shop features</h2>
                <CheckboxGroup
                  label="Select all that apply"
                  options={SHOP_OPTIONS.shopFeatures}
                  selected={formData.shopFeatures}
                  onChange={(v) => setArrayField('shopFeatures', v)}
                  columns={2}
                />
              </section>
            )}

            {type === 'farmhouse' && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Farmhouse details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Max guests</label>
                    <input
                      type="number"
                      name="maxGuests"
                      min="1"
                      value={formData.maxGuests}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-500"
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>
                <CheckboxGroup
                  label="Amenities & views"
                  options={FARMHOUSE_OPTIONS.farmhouseFeatures}
                  selected={formData.farmhouseFeatures}
                  onChange={(v) => setArrayField('farmhouseFeatures', v)}
                  columns={2}
                />
                <CheckboxGroup
                  label="Stay options"
                  options={FARMHOUSE_OPTIONS.stayOptions}
                  selected={formData.stayOptions}
                  onChange={(v) => setArrayField('stayOptions', v)}
                />
              </section>
            )}

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Amenities</h2>
              <CheckboxGroup
                label="Select amenities available"
                options={amenityOptions}
                selected={formData.amenities}
                onChange={(v) => setArrayField('amenities', v)}
                columns={2}
              />
            </section>

            <section>
              <label className="block text-sm font-medium text-gray-300 mb-1">Upload Property Photos</label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center bg-white/5 hover:bg-white/10 transition-colors">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full cursor-pointer text-gray-300" />
                <p className="text-xs text-gray-400 mt-2">You can upload multiple images (JPG, PNG)</p>
              </div>
            </section>

            <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/my-properties')}
                className="px-6 py-2 border border-white/20 rounded font-medium text-gray-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-2 rounded-full font-bold text-[#0f172a] transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] ${loading ? 'bg-sky-300 opacity-60' : 'bg-[#38bdf8] hover:bg-sky-400'}`}
              >
                {loading ? 'Posting...' : 'Post Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
