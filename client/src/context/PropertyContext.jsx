import React, { createContext, useState } from 'react';

export const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    propertyType: 'flat',
    distance: 5
  });
  const [userLocation, setUserLocation] = useState(null);

  return (
    <PropertyContext.Provider value={{
      properties, setProperties,
      filters, setFilters,
      userLocation, setUserLocation
    }}>
      {children}
    </PropertyContext.Provider>
  );
};
