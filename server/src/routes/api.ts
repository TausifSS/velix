import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { syncUserProfile, getUserProfile } from '../controllers/authController.js';

const router = Router();

// Secure User Auth Routes
router.post('/auth/sync', verifyFirebaseToken, syncUserProfile);
router.get('/auth/profile', verifyFirebaseToken, getUserProfile);

export default router;
