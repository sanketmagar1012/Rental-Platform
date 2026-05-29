const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['flat', 'shop', 'farmhouse'],
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  amenities: [String],
  images: [String],
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  filters: {
    // Basic Flat
    bhk: { type: String }, // '1RK', '1BHK', '2BHK', '3BHK'
    furnishing: { type: String }, // 'Furnished', 'Semi Furnished', 'Unfurnished'
    bathroomType: { type: String }, // 'Indian Toilet', 'Western Toilet', 'Attached Bathroom'
    tenantPreference: [String], // ['Bachelor Allowed', 'Family Allowed', ...]
    
    // Shop Specific
    shopFeatures: [String], // ['Road Touch', 'Commercial Area', ...]
    
    // Farmhouse Specific
    farmhouseFeatures: [String], // ['Swimming Pool', 'Party Allowed', ...]
    maxGuests: { type: Number }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', PropertySchema);
