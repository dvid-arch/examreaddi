const express = require('express');
const { registerUser, loginUser, getUserProfile, refreshToken, logoutUser } = require('../controllers/authController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);


module.exports = router;