import express from 'express';
import * as trackingController from '../controller/trackingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Middleware to check for donor role
const isDonor = (req, res, next) => {
  if (req.user.role !== 'donor') {
    return res.status(403).json({ message: 'Access denied. Donor role required.' });
  }
  next();
};

// Get tracking data for a donation
const router = express.Router();
router.get('/:id', authMiddleware, isDonor, trackingController.getTrackingData);

export default router;
