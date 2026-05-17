const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const favorite = await Favorite.create({
      userId: req.user.id,
      propertyId
    });
    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    // Handle duplicate key error (already favorited)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Property already in favorites' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.user.id,
      propertyId: req.params.propertyId
    });
    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id })
      .populate('propertyId');
    res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
