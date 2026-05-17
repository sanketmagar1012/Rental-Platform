const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All notification routes are protected

router.route('/')
  .get(getNotifications);

router.put('/read', markAsRead);

module.exports = router;
