import express from 'express';
import {
    // Overview
    getOverviewSummary,
    getWeeklyDonationsChart,
    getCategoryDistributionChart,

    // Donations
    getAllDonations,
    // getDonationById, // Optional detail view

    // Users
    getAllUsers,
    approveUser,
    rejectUser,
    banUser,
    unbanUser,
    // getUserById, // Optional detail view

    // Inventory
    getLiveInventory,

    // Logistics
    getActiveTasks,
    // getTaskById, // Optional detail view

    // Analytics & Reports
    getAnalyticsTrends,
    downloadReport, // Placeholder for report generation

    // Settings
    getSettings,
    updateSettings,

    // Notifications
    getAdminNotifications,
    markNotificationAsRead,

    // Profile (Assuming admin's own profile)
    getAdminProfile,
    updateAdminProfile,

} from '../controller/adminController.js'; // Adjust path as needed

// Import middleware according to authmiddleware.js exports
import authMiddleware, { isAdmin } from '../middleware/authmiddleware.js'; // Import default and named export

const router = express.Router();

// Apply authentication and admin authorization to all routes in this file
router.use(authMiddleware); // Use the default export for authentication
router.use(isAdmin);        // Use the named export for admin check

// --- Overview ---
router.get('/overview/summary', getOverviewSummary);
router.get('/overview/weekly', getWeeklyDonationsChart);
router.get('/overview/categories', getCategoryDistributionChart);

// --- Donations ---
router.get('/donations', getAllDonations);
// router.get('/donations/:id', getDonationById);

// --- Users ---
router.get('/users', getAllUsers);
// router.get('/users/:id', getUserById);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/reject', rejectUser);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);

// --- Inventory ---
router.get('/inventory/live', getLiveInventory);

// --- Logistics ---
router.get('/logistics/active-tasks', getActiveTasks);
// router.get('/logistics/:id', getTaskById);

// --- Analytics & Reports ---
router.get('/analytics/trends', getAnalyticsTrends);
router.get('/reports/download', downloadReport); // GET request to trigger download

// --- Settings ---
router.route('/settings')
    .get(getSettings)
    .put(updateSettings); // Use PUT to update the single settings document/resource

// --- Notifications ---
router.get('/notifications', getAdminNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

// --- Admin Profile ---
router.route('/profile') // Refers to the logged-in admin's profile
    .get(getAdminProfile)
    .put(updateAdminProfile);


export default router;