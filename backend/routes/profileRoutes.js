import express from 'express';
import * as profileController from '../controller/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user profile
router.get('/', authMiddleware, profileController.getProfile);

// Update user profile
router.put('/', authMiddleware, profileController.updateProfile);

export default router;
