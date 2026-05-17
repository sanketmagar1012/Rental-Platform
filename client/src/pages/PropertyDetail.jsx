import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProperty } from '../services/propertyService';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProp = async () => {
      try {
        const res = await getProperty(id);
        setProperty(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProp();
  }, [id]);

  const buildDetailItems = (prop) => {
    const filters = prop?.filters || {};
    const pType = prop?.propertyType;
    const items = [
      { label: 'Deposit', value: `₹${prop.deposit.toLocaleString()}` },
      { label: 'Type', value: pType },
      { label: 'Status', value: prop.available ? 'Available' : 'Rented' },
    ];
    if (pType === 'flat') {
      items.push(
        { label: 'BHK', value: filters.bhk || '—' },
        { label: 'Furnishing', value: filters.furnishing || '—' },
        { label: 'Bathroom', value: filters.bathroomType || '—' }
      );
    }
    if (pType === 'shop' && filters.shopFeatures?.length) {
      items.push({ label: 'Shop features', value: filters.shopFeatures.join(', ') });
    }
    if (pType === 'farmhouse') {
      if (filters.maxGuests) items.push({ label: 'Max guests', value: filters.maxGuests });
      if (filters.farmhouseFeatures?.length) {
        items.push({ label: 'Features', value: filters.farmhouseFeatures.join(', ') });
      }
      if (filters.stayOptions?.length) {
        items.push({ label: 'Stay', value: filters.stayOptions.join(', ') });
      }
    }
    return items;
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!property) return <div className="text-center py-20">Property not found</div>;

  return (
    <div className="bg-mb-gray min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Navigation */}
        <div className="mb-4 text-sm text-gray-500">
          <Link to="/properties" className="hover:text-mb-red">Properties</Link> / 
          <span className="text-gray-700 ml-1">{property.city}</span> /
          <span className="text-gray-700 ml-1">{property.propertyType === 'flat' ? 'Flats' : 'Commercial'}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Images Section */}
          <div className="h-96 bg-gray-100 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {property.images && property.images.length > 0 ? (
              property.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Property ${idx}`} className="h-full w-auto object-cover snap-center shrink-0 border-r border-white" />
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Images Available</div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
               <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                  <p className="text-gray-600 text-lg">{property.address}, {property.city}</p>
               </div>
               <div className="mt-4 md:mt-0 text-right">
                  <div className="text-3xl font-bold text-gray-900">₹{property.rent.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">per month</div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded mb-8 border border-gray-100">
              {buildDetailItems(property).map((item) => (
                <div key={item.label}>
                  <p className="text-sm text-gray-500 uppercase">{item.label}</p>
                  <p className="font-semibold text-gray-800 capitalize">{item.value}</p>
                </div>
              ))}
            </div>

            {property.filters?.tenantPreference?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Tenant preference</h2>
                <p className="text-gray-700">{property.filters.tenantPreference.join(' · ')}</p>
              </div>
            )}

            {property.filters?.nearbyLocations?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Nearby</h2>
                <p className="text-gray-700">{property.filters.nearbyLocations.join(' · ')}</p>
              </div>
            )}

            {property.amenities?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full border">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
               <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Description</h2>
               <p className="text-gray-700 whitespace-pre-line leading-relaxed">{property.description}</p>
            </div>

            <div className="border-t pt-8">
               <h2 className="text-xl font-bold text-gray-800 mb-4">Interested? Contact the Owner</h2>
               <div className="bg-[#fff9e6] p-6 rounded-lg border border-yellow-200 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                    <p className="text-lg font-bold text-gray-800">{property.ownerId?.name || 'Owner'}</p>
                    <p className="text-gray-600 mb-2">Property listed by Owner</p>
                    <div className="bg-white px-4 py-2 rounded border border-gray-300 inline-block font-mono text-lg font-bold text-mb-red">
                      📞 {property.ownerId?.phoneNumber || 'No phone number provided'}
                    </div>
                 </div>
                 <a 
                   href={`tel:${property.ownerId?.phoneNumber || ''}`} 
                   className="bg-mb-red hover:bg-red-700 text-white font-bold py-3 px-10 rounded shadow transition-colors w-full md:w-auto text-center"
                 >
                   Call Now
                 </a>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
