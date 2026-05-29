import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProperty } from '../services/propertyService';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.L || !property || !property.latitude || !property.longitude) return;
    const L = window.L;

    // Guard against multiple instances
    if (mapInstanceRef.current) return;

    const lat = property.latitude;
    const lng = property.longitude;

    const map = L.map('detail-map').setView([lat, lng], 15);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const flatIcon = L.divIcon({
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
          <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker([lat, lng], { icon: flatIcon }).addTo(map);
    marker.bindPopup(`<div class='font-bold text-center font-sans'>${property.title}</div>`).openPopup();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [property]);

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

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;
  if (!property) return <div className="text-white text-center py-20">Property not found</div>;

  return (
    <div className="bg-transparent min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Navigation */}
        <div className="mb-4 text-sm text-gray-400">
          <Link to="/properties" className="hover:text-[#38bdf8] transition-colors">Properties</Link> / 
          <span className="text-gray-300 ml-1">{property.city}</span> /
          <span className="text-gray-300 ml-1">{property.propertyType === 'flat' ? 'Flats' : 'Commercial'}</span>
        </div>

        <div className="glass-box rounded-lg overflow-hidden border border-white/20">
          {/* Images Section */}
          <div className="h-96 bg-white/5 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {property.images && property.images.length > 0 ? (
              property.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Property ${idx}`} className="h-full w-auto object-cover snap-center shrink-0 border-r border-white/10" />
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Images Available</div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
               <div>
                  <h1 className="text-3xl font-bold text-white mb-2 drop-shadow">{property.title}</h1>
                  <p className="text-gray-300 text-lg">{property.address}, {property.city}</p>
               </div>
               <div className="mt-4 md:mt-0 text-right">
                  <div className="text-3xl font-bold text-[#38bdf8] drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">₹{property.rent.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">per month</div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 border border-white/10 p-4 rounded mb-8">
              {buildDetailItems(property).map((item) => (
                <div key={item.label}>
                  <p className="text-sm text-gray-400 uppercase">{item.label}</p>
                  <p className="font-semibold text-white capitalize">{item.value}</p>
                </div>
              ))}
            </div>

            {property.filters?.tenantPreference?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-2">Tenant preference</h2>
                <p className="text-gray-300">{property.filters.tenantPreference.join(' · ')}</p>
              </div>
            )}

            {property.filters?.nearbyLocations?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-2">Nearby</h2>
                <p className="text-gray-300">{property.filters.nearbyLocations.join(' · ')}</p>
              </div>
            )}

            {property.amenities?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-white mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="bg-white/10 text-gray-200 border border-white/20 text-sm px-3 py-1 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
               <h2 className="text-xl font-bold text-white mb-3 border-b border-white/10 pb-2">Description</h2>
               <p className="text-gray-300 whitespace-pre-line leading-relaxed">{property.description}</p>
            </div>

            {property.latitude && property.longitude && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-3 border-b border-white/10 pb-2 font-sans">Exact Flat Location</h2>
                <p className="text-xs text-gray-400 mb-3 font-sans leading-relaxed">
                  Here is the precise visual location of this flat on Pune's local area map.
                </p>
                <div 
                  id="detail-map" 
                  className="w-full rounded-lg border border-white/20 shadow-[0_0_15px_rgba(56,189,248,0.1)] z-10 opacity-90 hover:opacity-100 transition-opacity"
                  style={{ height: '350px', minHeight: '350px' }}
                ></div>
              </div>
            )}

            <div className="border-t border-white/10 pt-8">
               <h2 className="text-xl font-bold text-white mb-4">Interested? Contact the Owner</h2>
               <div className="bg-[#38bdf8]/10 border border-[#38bdf8]/30 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
                 <div>
                    <p className="text-lg font-bold text-white">{property.ownerId?.name || 'Owner'}</p>
                    <p className="text-gray-300 mb-2">Property listed by Owner</p>
                    <div className="bg-white/10 border border-[#38bdf8]/40 px-4 py-2 rounded inline-block font-mono text-lg font-bold text-[#38bdf8]">
                      📞 {property.ownerId?.phoneNumber || 'No phone number provided'}
                    </div>
                 </div>
                 <a 
                   href={`tel:${property.ownerId?.phoneNumber || ''}`} 
                   className="bg-[#38bdf8] hover:bg-sky-400 text-[#0f172a] font-bold py-3 px-10 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all w-full md:w-auto text-center"
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
