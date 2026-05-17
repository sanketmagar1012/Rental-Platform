import React, { useState } from 'react';
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
  const [formData, setFormData] = useState(getDefaultFormState('flat'));
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData(getDefaultFormState(type));
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
      const core = ['title', 'description', 'propertyType', 'rent', 'deposit', 'city', 'address'];
      core.forEach((key) => data.append(key, formData[key]));

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
    <div className="bg-mb-gray min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Post New Property</h1>
          <p className="text-sm text-gray-500 mb-6">
            Form fields change based on property type — flats, shops, and farmhouses have different options.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
                    placeholder="Describe your property in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleTypeChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
                    placeholder="e.g. Pune"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
                    placeholder="e.g. Kothrud, near Main Road"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rent ({type === 'farmhouse' ? 'per day or month — specify in description' : 'per month'})
                  </label>
                  <input
                    type="number"
                    name="rent"
                    required
                    min="0"
                    value={formData.rent}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
                    placeholder="₹"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deposit</label>
                  <input
                    type="number"
                    name="deposit"
                    required
                    min="0"
                    value={formData.deposit}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
                    placeholder="₹"
                  />
                </div>
              </div>
            </section>

            {type === 'flat' && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Flat configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BHK</label>
                    <select
                      name="bhk"
                      value={formData.bhk}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
                    >
                      {FLAT_OPTIONS.bhk.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
                    <select
                      name="furnishing"
                      value={formData.furnishing}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
                    >
                      {FLAT_OPTIONS.furnishing.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathroom type</label>
                    <select
                      name="bathroomType"
                      value={formData.bathroomType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
                    >
                      <option value="">Select bathroom type</option>
                      {FLAT_OPTIONS.bathroomType.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
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
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Shop features</h2>
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
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Farmhouse details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max guests</label>
                    <input
                      type="number"
                      name="maxGuests"
                      min="1"
                      value={formData.maxGuests}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red"
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
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Amenities</h2>
              <CheckboxGroup
                label="Select amenities available"
                options={amenityOptions}
                selected={formData.amenities}
                onChange={(v) => setArrayField('amenities', v)}
                columns={2}
              />
            </section>

            <section>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Property Photos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full cursor-pointer" />
                <p className="text-xs text-gray-500 mt-2">You can upload multiple images (JPG, PNG)</p>
              </div>
            </section>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/my-properties')}
                className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-2 rounded font-medium text-white ${loading ? 'bg-red-400' : 'bg-mb-red hover:bg-red-700'}`}
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
