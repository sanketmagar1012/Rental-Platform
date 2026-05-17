/**
 * Builds a MongoDB query from search/filter query params.
 * Shared by GET /properties and GET /search/nearby.
 */
function buildPropertyQuery(query = {}, baseQuery = {}) {
  const mongoQuery = { ...baseQuery };

  if (query.ownerId) {
    mongoQuery.ownerId = query.ownerId;
  }

  if (query.propertyType && query.propertyType !== 'all') {
    mongoQuery.propertyType = query.propertyType;
  }

  if (query.city) {
    mongoQuery.city = new RegExp(query.city.trim(), 'i');
  }

  if (query.available !== undefined) {
    mongoQuery.available = query.available === 'true';
  } else if (!mongoQuery.ownerId) {
    mongoQuery.available = true;
  }

  // Flat filters
  if (query.bhk) mongoQuery['filters.bhk'] = query.bhk;
  if (query.furnishing) mongoQuery['filters.furnishing'] = query.furnishing;
  if (query.bathroomType) mongoQuery['filters.bathroomType'] = query.bathroomType;

  if (query.tenantPreference) {
    mongoQuery['filters.tenantPreference'] = { $in: [query.tenantPreference] };
  }

  if (query.nearbyLocation) {
    mongoQuery['filters.nearbyLocations'] = { $in: [query.nearbyLocation] };
  }

  // Shop filters
  if (query.shopFeature) {
    mongoQuery['filters.shopFeatures'] = { $in: [query.shopFeature] };
  }

  // Farmhouse filters
  if (query.farmhouseFeature) {
    mongoQuery['filters.farmhouseFeatures'] = { $in: [query.farmhouseFeature] };
  }

  if (query.stayOption) {
    mongoQuery['filters.stayOptions'] = { $in: [query.stayOption] };
  }

  if (query.minGuests) {
    mongoQuery['filters.maxGuests'] = { $gte: Number(query.minGuests) };
  }

  // Amenities (comma-separated)
  if (query.amenities) {
    const list = String(query.amenities)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length) mongoQuery.amenities = { $all: list };
  }

  // Rent range
  if (query.minRent || query.maxRent) {
    mongoQuery.rent = {};
    if (query.minRent) mongoQuery.rent.$gte = Number(query.minRent);
    if (query.maxRent) mongoQuery.rent.$lte = Number(query.maxRent);
  }

  // Deposit range
  if (query.minDeposit || query.maxDeposit) {
    mongoQuery.deposit = {};
    if (query.minDeposit) mongoQuery.deposit.$gte = Number(query.minDeposit);
    if (query.maxDeposit) mongoQuery.deposit.$lte = Number(query.maxDeposit);
  }

  return mongoQuery;
}

module.exports = buildPropertyQuery;
