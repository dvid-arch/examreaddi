const express = require('express');
const { getPapers, getGuides, getLeaderboard, addLeaderboardScore, getPerformance, addPerformanceResult } = require('../controllers/dataController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Public routes
router.get('/papers', getPapers);
router.get('/guides', getGuides);
router.get('/leaderboard', getLeaderboard);

// Protected routes
router.post('/leaderboard', protect, addLeaderboardScore);
router.get('/performance', protect, getPerformance);
router.post('/performance', protect, addPerformanceResult);

module.exports = router;
