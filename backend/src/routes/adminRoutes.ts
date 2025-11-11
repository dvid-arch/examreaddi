import express from 'express';
import { getUsers, updateUserSubscription, getAdminStats, deletePaper, deleteGuide } from '../controllers/adminController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { admin } from '../middleware/adminMiddleware.ts';

const router = express.Router();

// All routes in this file are protected and require admin privileges
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/subscription', updateUserSubscription);

// Content management routes
router.delete('/papers/:id', deletePaper);
router.delete('/guides/:id', deleteGuide);

// Placeholder routes for content management (POST/PUT)
// In a full app, these would have their own controller functions
router.post('/papers', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.put('/papers/:id', (req, res) => res.status(501).json({ message: 'Not implemented' }));

router.post('/guides', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.put('/guides/:id', (req, res) => res.status(501).json({ message: 'Not implemented' }));


export default router;