import express from 'express';
// Correctly import the default and named exports
import authMiddleware, { authorizeRoles } from '../middleware/authmiddleware.js';
import {
    getVolunteerDashboardStats,
    getUpcomingTasks,
    getAvailableTasks,
    getTaskHistory,
    getVolunteerProfile,
    updateVolunteerProfile,
    claimTask,
    startTask,
    completeTask,
} from '../controller/volunteerController.js'; // Corrected path

const router = express.Router();

// Apply the authentication middleware first, then the role authorization
router.use(authMiddleware, authorizeRoles('volunteer'));

// --- Routes ---
router.get('/dashboard/stats', getVolunteerDashboardStats);
router.get('/tasks/upcoming', getUpcomingTasks);
router.get('/tasks/available', getAvailableTasks);
router.get('/tasks/history', getTaskHistory);
router.patch('/tasks/:taskId/claim', claimTask);
router.patch('/tasks/:taskId/start', startTask);
router.patch('/tasks/:taskId/complete', completeTask);
router.get('/profile', getVolunteerProfile);
router.put('/profile', updateVolunteerProfile);

export default router;