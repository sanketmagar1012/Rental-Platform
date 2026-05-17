export const PROPERTY_TYPES = [
  { value: 'flat', label: 'Flat / Apartment' },
  { value: 'shop', label: 'Commercial Shop' },
  { value: 'farmhouse', label: 'Farmhouse' },
];

export const FLAT_OPTIONS = {
  bhk: ['1RK', '1BHK', '2BHK', '3BHK'],
  furnishing: ['Furnished', 'Semi Furnished', 'Unfurnished'],
  bathroomType: ['Indian Toilet', 'Western Toilet', 'Attached Bathroom'],
  tenantPreference: [
    'Bachelor Allowed',
    'Family Allowed',
    'Student Friendly',
    'Veg Only',
    'Non-Veg Allowed',
  ],
  amenities: [
    'Parking',
    'Lift',
    'Balcony',
    'WiFi',
    'AC',
    'CCTV',
    'Power Backup',
    'Water Supply',
  ],
  nearbyLocations: [
    'Near College',
    'Near Metro',
    'Near Bus Stop',
    'Near Hospital',
    'Near Market',
  ],
};

export const SHOP_OPTIONS = {
  shopFeatures: [
    'Road Touch',
    'Highway Touch',
    'Commercial Area',
    'Parking Available',
    'Washroom',
    'Storage Room',
    'Office Type',
    'Warehouse Type',
    'Market Area',
  ],
};

export const FARMHOUSE_OPTIONS = {
  farmhouseFeatures: [
    'Swimming Pool',
    'Party Allowed',
    'Garden',
    'Parking',
    'Mountain View',
    'Lake View',
  ],
  stayOptions: ['Daily Stay', 'Weekly Stay'],
};

export const getDefaultFormState = (propertyType = 'flat') => ({
  title: '',
  description: '',
  propertyType,
  rent: '',
  deposit: '',
  city: 'Pune',
  address: '',
  bhk: '1BHK',
  furnishing: 'Unfurnished',
  bathroomType: '',
  tenantPreference: [],
  amenities: [],
  nearbyLocations: [],
  shopFeatures: [],
  farmhouseFeatures: [],
  stayOptions: [],
  maxGuests: '',
});

export const buildFiltersPayload = (formData) => {
  const { propertyType } = formData;

  if (propertyType === 'flat') {
    return {
      bhk: formData.bhk,
      furnishing: formData.furnishing,
      bathroomType: formData.bathroomType || undefined,
      tenantPreference: formData.tenantPreference,
      nearbyLocations: formData.nearbyLocations,
    };
  }

  if (propertyType === 'shop') {
    return { shopFeatures: formData.shopFeatures };
  }

  return {
    farmhouseFeatures: formData.farmhouseFeatures,
    stayOptions: formData.stayOptions,
    maxGuests: formData.maxGuests ? Number(formData.maxGuests) : undefined,
  };
};

export const getAmenitiesForType = (propertyType) => {
  if (propertyType === 'flat') return FLAT_OPTIONS.amenities;
  if (propertyType === 'shop') {
    return ['Parking', 'Water Supply', 'Power Backup', 'CCTV', 'WiFi'];
  }
  return ['Parking', 'Garden', 'WiFi', 'Power Backup', 'Water Supply'];
};
