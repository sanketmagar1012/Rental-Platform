const express = require('express');
const { createProperty, getProperties, getProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('owner'), upload.array('images', 5), createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, authorize('owner'), upload.array('images', 5), updateProperty)
  .delete(protect, authorize('owner'), deleteProperty);

module.exports = router;
