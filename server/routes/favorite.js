const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All favorite routes are protected

router.route('/')
  .get(getFavorites)
  .post(addFavorite);

router.delete('/:propertyId', removeFavorite);

module.exports = router;
