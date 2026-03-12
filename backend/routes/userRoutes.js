const express = require('express');
const router = express.Router();
const { authUser, registerUser, googleLogin, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/google-login', googleLogin);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
