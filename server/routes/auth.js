const express = require('express');
const { register, login, googleLogin, completeProfile, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/complete-profile', protect, completeProfile);
router.get('/me', protect, getMe);

module.exports = router;
