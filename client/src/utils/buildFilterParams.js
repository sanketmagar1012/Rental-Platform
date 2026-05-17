/** Strip empty values before sending to API */
export const buildFilterParams = (filters, mode) => {
  const params = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) return;
    if (key === 'propertyType' && value === 'all') return;
    if (key === 'distance' && mode !== 'nearby') return;
    params[key] = value;
  });

  if (mode === 'nearby') {
    params.distance = filters.distance || 5;
  }

  return params;
};

export const hasActiveFilters = (filters) => {
  const keys = Object.keys(filters).filter(
    (k) => !['propertyType', 'distance'].includes(k)
  );
  return (
    filters.propertyType !== 'all' ||
    keys.some((k) => filters[k] !== '' && filters[k] != null)
  );
};
