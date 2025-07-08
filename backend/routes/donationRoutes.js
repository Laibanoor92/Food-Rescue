// Fix your routes order
import express from 'express';
import * as donationController from '../controller/donationController.js';
import authMiddleware, {authorizeRoles} from '../middleware/authMiddleware.js';

const router = express.Router(); 

// Dashboard stats and charts - KEEP THESE FIRST
router.get('/stats', authMiddleware, authorizeRoles('donor'), donationController.getDonationStats);
router.get('/chart-data', authMiddleware, authorizeRoles('donor'), donationController.getChartData);
router.get('/recent', authMiddleware, authorizeRoles('donor'), donationController.getRecentDonations);
router.get('/my-contributions', authMiddleware, authorizeRoles('donor'), donationController.getContributions);

// CRUD operations
router.post('/', authMiddleware, authorizeRoles('donor'), donationController.createDonation);
router.get('/', authMiddleware, authorizeRoles('donor'), donationController.getDonationHistory);

// ID-specific routes MUST BE LAST
router.get('/:id', authMiddleware, authorizeRoles('donor'), donationController.getDonationDetails);
router.get('/:id/track', authMiddleware, authorizeRoles('donor'), donationController.getTrackingInfo);

export default router;