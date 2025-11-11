const express = require('express');
const { handleAiChat, handleGenerateGuide, handleResearch } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// All AI routes should be protected to manage credits and usage
router.post('/chat', protect, handleAiChat);
router.post('/generate-guide', protect, handleGenerateGuide);
router.post('/research', protect, handleResearch);

module.exports = router;
