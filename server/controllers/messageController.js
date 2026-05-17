const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Property = require('../models/Property');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, propertyId, message } = req.body;
    
    const newMessage = await Message.create({
      senderId: req.user.id,
      receiverId,
      propertyId,
      message
    });

    // Create notification for receiver
    const property = await Property.findById(propertyId);
    await Notification.create({
      userId: receiverId,
      title: 'New Message',
      message: `You have a new message about ${property.title} from ${req.user.name}`
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    // Get all messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
    })
    .populate('senderId', 'name')
    .populate('receiverId', 'name')
    .populate('propertyId', 'title')
    .sort('-createdAt');

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
