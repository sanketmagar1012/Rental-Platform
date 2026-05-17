const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All message routes are protected

router.route('/')
  .get(getMessages)
  .post(sendMessage);

module.exports = router;
