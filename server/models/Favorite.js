const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only favorite a property once
FavoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
