const express = require('express');
const router = express.Router();
const { authUser, registerUser, googleLogin } = require('../controllers/authController');

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/google-login', googleLogin);

module.exports = router;
