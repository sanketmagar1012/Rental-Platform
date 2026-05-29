import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, AlertCircle } from 'lucide-react';

const typeLabel = { flat: 'Flat', shop: 'Shop', farmhouse: 'Farmhouse' };

const PropertyCard = ({ property }) => {
  const f = property.filters || {};
  const isFlat = property.propertyType === 'flat';
  const isShop = property.propertyType === 'shop';
  const isFarmhouse = property.propertyType === 'farmhouse';

  const headline = isFlat
    ? `${f.bhk || ''} Flat for Rent in ${property.address}, ${property.city}`
    : `${typeLabel[property.propertyType] || 'Property'} for Rent in ${property.address}, ${property.city}`;

  return (
    <div className="glass-box rounded-lg overflow-hidden flex flex-col md:flex-row hover:shadow-[0_4px_30px_rgba(56,189,248,0.15)] transition-all mb-4 border border-white/20 group">
      <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 bg-white/5">
        <img
          src={
            property.images?.[0]
              ? property.images[0]
              : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-[#38bdf8] border border-white/20 text-[10px] px-2 py-0.5 rounded font-medium capitalize">
          {property.propertyType}
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link
              to={`/properties/${property._id}`}
              className="text-lg font-medium text-white line-clamp-1 hover:underline hover:text-[#38bdf8]"
            >
              {headline}
            </Link>
            <p className="text-sm text-gray-400 mt-0.5">{property.title}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded p-3 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-2">
          {isFlat && (
            <>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Furnishing</p>
                <p className="font-medium text-white truncate">{f.furnishing || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">BHK</p>
                <p className="font-medium text-white truncate">{f.bhk || '—'}</p>
              </div>
            </>
          )}
          {isShop && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 uppercase font-medium">Features</p>
              <p className="font-medium text-white truncate">
                {f.shopFeatures?.length ? f.shopFeatures.join(', ') : '—'}
              </p>
            </div>
          )}
          {isFarmhouse && (
            <>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Max guests</p>
                <p className="font-medium text-white">{f.maxGuests || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Features</p>
                <p className="font-medium text-white truncate">
                  {f.farmhouseFeatures?.slice(0, 2).join(', ') || '—'}
                </p>
              </div>
            </>
          )}
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Rent</p>
            <p className="font-medium text-[#38bdf8]">₹{property.rent?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Status</p>
            <p className="font-medium text-white">{property.available ? 'Available' : 'Rented'}</p>
          </div>
        </div>

        {property.amenities?.length > 0 && (
          <p className="text-xs text-gray-400 mb-2">
            Amenities: {property.amenities.slice(0, 4).join(' · ')}
            {property.amenities.length > 4 ? '…' : ''}
          </p>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-t border-white/10 pt-3">
          <div className="flex-1">
            <p className="text-sm text-gray-300 line-clamp-2">{property.description}</p>
            <div className="mt-2 text-xs text-gray-400 flex items-center gap-2 flex-wrap">
              <span>
                Owner: <span className="font-medium text-white">{property.ownerId?.name || 'Owner'}</span>
              </span>
              {property.distanceKm && (
                <span className="bg-[#38bdf8]/20 text-[#38bdf8] px-2 py-0.5 rounded border border-[#38bdf8]/30 font-medium shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                  {property.distanceKm} km away
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0 min-w-[140px]">
            <span className="text-xl font-bold text-[#38bdf8]">₹{property.rent?.toLocaleString()}</span>
            <Link
              to={`/properties/${property._id}`}
              className="mt-2 bg-[#38bdf8] hover:bg-sky-400 text-[#0f172a] text-sm font-bold py-2 px-4 rounded-full text-center transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)]"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
