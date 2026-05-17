const Property = require('../models/Property');
const buildPropertyQuery = require('../utils/buildPropertyQuery');

exports.createProperty = async (req, res) => {
  try {
    const data = req.body;
    data.ownerId = req.user.id;
    
    if (typeof data.filters === 'string') {
      data.filters = JSON.parse(data.filters);
    }
    if (typeof data.amenities === 'string') {
      data.amenities = JSON.parse(data.amenities);
    }

    if (req.files) {
      data.images = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    }

    const property = await Property.create(data);
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const { ownerId, ...filterParams } = req.query;
    const base = ownerId ? { ownerId } : {};
    const query = buildPropertyQuery(filterParams, base);

    const properties = await Property.find(query).populate('ownerId', 'name email phoneNumber');
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name email phoneNumber');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    
    // Check ownership
    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
      req.body.images = [...property.images, ...newImages];
    }

    if (typeof req.body.filters === 'string') {
      req.body.filters = JSON.parse(req.body.filters);
    }
    if (typeof req.body.amenities === 'string') {
      req.body.amenities = JSON.parse(req.body.amenities);
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    
    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
