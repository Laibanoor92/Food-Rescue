import express from 'express';
// Import middleware - ensure authorizeRoles is exported from authMiddleware.js
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';
import {
    getIncomingDonations,
    getDeliveryStatus,
    getOverviewStats,
    getRequestHistory,
    getMonthlyAnalytics,
    getCategoryAnalytics,
    acceptDonation,
    rejectDonation,
    searchAvailableDonations,
    getProfile,
    updateProfile 

} from '../controller/recipientController.js';

const router = express.Router();

// Apply auth middleware to all recipient dashboard routes first
router.use(authMiddleware);
// Apply role authorization for 'recipient' to all subsequent routes in this router
router.use(authorizeRoles('recipient'));


// --- Search Route ---
router.get('/search', searchAvailableDonations); // <-- ADD THIS LINE

// --- Profile Routes ---
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// --- Dashboard Data Routes ---
// Keep general routes before ID-specific ones
router.get('/incoming-donations', getIncomingDonations);
router.get('/delivery-status', getDeliveryStatus);
router.get('/overview-stats', getOverviewStats);
router.get('/request-history', getRequestHistory);

// --- Analytics Routes ---
router.get('/analytics/monthly', getMonthlyAnalytics);
router.get('/analytics/category', getCategoryAnalytics);

// --- Action Routes (ID-specific - place towards the end) ---
// Use :donationId or a consistent parameter name
router.put('/donations/:donationId/accept', acceptDonation);
router.put('/donations/:donationId/reject', rejectDonation);

// Example: If you add a route to get details of a specific received donation
// router.get('/donations/:donationId', getReceivedDonationDetails); // Place ID routes last

export default router;