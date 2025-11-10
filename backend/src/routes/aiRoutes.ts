import express from 'express';
import { handleAiChat, handleGenerateGuide, handleResearch } from '../controllers/aiController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

// All AI routes should be protected to manage credits and usage
router.post('/chat', protect, handleAiChat);
router.post('/generate-guide', protect, handleGenerateGuide);
router.post('/research', protect, handleResearch);

export default router;
