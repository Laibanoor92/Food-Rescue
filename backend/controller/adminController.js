import asyncHandler from 'express-async-handler'; // Or your preferred error handler wrapper
import User from '../models/user.js'; // Adjust path
import Donation from '../models/Donation.js'; // Adjust path
import Task from '../models/Task.js'; // Adjust path
import Setting from '../models/Setting.js'; // Adjust path
import Notification from '../models/Notification.js'; // Adjust path
// Add other necessary models or utilities (e.g., date-fns)

// === Overview Controllers ===

// @desc    Get summary stats for admin overview
// @route   GET /api/admin/overview/summary
// @access  Private/Admin
const getOverviewSummary = asyncHandler(async (req, res) => {
    const totalDonations = await Donation.countDocuments({}); // Example: Count all donations
    const activeDonors = await User.countDocuments({ role: 'donor', status: 'Approved' }); // Example
    const foodBanksServed = await User.countDocuments({ role: 'recipient', status: 'Approved' }); // Example
    // Example: Estimate meals rescued (needs logic based on donation quantities/types)
    const mealsRescued = await Donation.aggregate([
        { $match: { status: 'Completed' } }, // Only count completed donations
        { $group: { _id: null, totalQuantity: { $sum: '$estimatedMeals' } } } // Assuming an 'estimatedMeals' field
    ]);

    res.json({
        totalDonations,
        activeDonors,
        foodBanksServed,
        mealsRescued: mealsRescued[0]?.totalQuantity || 0,
    });
});

// @desc    Get data for weekly donations chart
// @route   GET /api/admin/overview/weekly
// @access  Private/Admin
const getWeeklyDonationsChart = asyncHandler(async (req, res) => {
    // --- Logic to get donations grouped by day for the last 7 days ---
    // This requires more complex date manipulation and aggregation
    // Example structure (implementation depends heavily on your needs and DB):
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Calculate actual dates
    const data = [12, 19, 3, 5, 2, 3, 9]; // Fetch and aggregate actual data

    res.json({ labels, data });
});

// @desc    Get data for category distribution chart
// @route   GET /api/admin/overview/categories
// @access  Private/Admin
const getCategoryDistributionChart = asyncHandler(async (req, res) => {
    const categoryData = await Donation.aggregate([
        { $match: { status: { $in: ['Pending', 'Completed'] } } }, // Consider relevant statuses
        { $group: { _id: '$foodCategory', count: { $sum: 1 } } }, // Group by category
        { $sort: { count: -1 } } // Sort by count descending
    ]);

    const labels = categoryData.map(cat => cat._id);
    const data = categoryData.map(cat => cat.count);

    res.json({ labels, data });
});


const getAllDonations = asyncHandler(async (req, res) => {
    const donations = await Donation.find({})
        // --- CHANGE HERE: Populate firstName and lastName ---
        .populate('donor', 'firstName lastName') // Select both fields
        .sort({ createdAt: -1 });
    res.json(donations);
});



// === User Controllers ===

// @desc    Get all users (donors, volunteers, recipients)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    // Add filtering (by role, status), sorting, pagination based on req.query
    const users = await User.find({ role: { $ne: 'admin' } }) // Exclude other admins maybe?
        .select('-password') // Exclude password field
        .sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Approve a pending user
// @route   PUT /api/admin/users/:id/approve
// @access  Private/Admin
const approveUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user && user.status === 'Pending') {
        user.status = 'Approved';
        await user.save();
        // TODO: Optionally send notification to user
        res.json({ message: 'User approved successfully' });
    } else {
        res.status(404);
        throw new Error('User not found or cannot be approved');
    }
});

// @desc    Reject a pending user
// @route   PUT /api/admin/users/:id/reject
// @access  Private/Admin
const rejectUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user && user.status === 'Pending') {
        user.status = 'Rejected';
        // Optionally add a rejection reason: user.rejectionReason = req.body.reason;
        await user.save();
        // TODO: Optionally send notification to user
        res.json({ message: 'User rejected successfully' });
    } else {
        res.status(404);
        throw new Error('User not found or cannot be rejected');
    }
});

// @desc    Ban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user && user.status !== 'Banned') {
        user.status = 'Banned';
        // Optionally add a ban reason: user.banReason = req.body.reason;
        await user.save();
        // TODO: Invalidate user's session/token if necessary
        res.json({ message: 'User banned successfully' });
    } else {
        res.status(404);
        throw new Error('User not found or already banned');
    }
});

// @desc    Unban a user
// @route   PUT /api/admin/users/:id/unban
// @access  Private/Admin
const unbanUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user && user.status === 'Banned') {
        // Decide whether to set status back to 'Approved' or 'Pending'
        user.status = 'Approved'; // Or 'Pending' if re-verification is needed
        user.banReason = undefined; // Clear ban reason
        await user.save();
        res.json({ message: 'User unbanned successfully' });
    } else {
        res.status(404);
        throw new Error('User not found or not banned');
    }
});

const getLiveInventory = asyncHandler(async (req, res) => {
    const now = new Date();
    const liveItems = await Donation.find({
        status: 'Pending',
        expiryDate: { $gt: now }
    })
    // --- CHANGE HERE: Populate firstName and lastName ---
    .populate('donor', 'firstName lastName') // Select both fields
    .sort({ expiryDate: 1 });

    res.json(liveItems);
});


// === Logistics Controllers ===

// @desc    Get active tasks (Assigned, InProgress)
// @route   GET /api/admin/logistics/active-tasks
// @access  Private/Admin
const getActiveTasks = asyncHandler(async (req, res) => {
    const activeTasks = await Task.find({
        status: { $in: ['Assigned', 'InProgress'] } // Adjust statuses as needed
    })
    .populate('donation', 'foodType quantity pickupAddress dropoffAddress') // Populate relevant donation details
    .populate('volunteer', 'name phone') // Populate volunteer details
    .populate('donor', 'firstName lastName') // Populate donor name
    .populate('recipient', 'name') // Populate recipient name
    .sort({ createdAt: 1 }); // Or sort by pickup time, etc.

    res.json(activeTasks);
});


// === Analytics & Reports Controllers ===

// @desc    Get data for analytics trends (filtered)
// @route   GET /api/admin/analytics/trends
// @access  Private/Admin
const getAnalyticsTrends = asyncHandler(async (req, res) => {
    const { startDate, endDate, donorType } = req.query;

    // --- Build query based on filters ---
    let matchQuery = {};
    if (startDate || endDate) {
        matchQuery.createdAt = {}; // Assuming filtering by creation date
        if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
        if (endDate) matchQuery.createdAt.$lte = new Date(endDate); // Adjust to include the whole end day if needed
    }
    // Add donorType filtering if needed (might require populating donor and matching)

    // --- Aggregate data (Example: Donations per day) ---
    const trends = await Donation.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by day
                meals: { $sum: '$estimatedMeals' }, // Sum estimated meals
                donations: { $sum: 1 } // Count donations
            }
        },
        { $sort: { _id: 1 } } // Sort by date
    ]);

    // Format for chart.js
    const labels = trends.map(t => t._id);
    const mealsData = trends.map(t => t.meals);
    const donationsData = trends.map(t => t.donations);

    res.json({ labels, meals: mealsData, donations: donationsData });
});

// @desc    Generate and download a report (Placeholder)
// @route   GET /api/admin/reports/download
// @access  Private/Admin
const downloadReport = asyncHandler(async (req, res) => {
    const { startDate, endDate, donorType, format } = req.query;

    // --- 1. Fetch data based on filters (similar to getAnalyticsTrends) ---
    // ... fetch relevant data ...
    const reportData = [
        { date: '2025-04-01', donor: 'Donor A', meals: 50 },
        { date: '2025-04-02', donor: 'Donor B', meals: 30 },
    ]; // Example fetched data

    // --- 2. Generate file content based on format ---
    if (format === 'csv') {
        // Use a library like 'papaparse' or build CSV string manually
        const csvHeader = "Date,Donor,Meals Rescued\n";
        const csvBody = reportData.map(row => `${row.date},"${row.donor}",${row.meals}`).join("\n");
        const csvContent = csvHeader + csvBody;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=report_${startDate}_to_${endDate}.csv`);
        res.status(200).send(csvContent);

    } else if (format === 'pdf') {
        // Use a library like 'pdfkit' or 'jspdf' (on backend requires Node support)
        // This is significantly more complex
        res.status(501).send('PDF generation not implemented yet.'); // 501 Not Implemented

    } else {
        res.status(400).send('Invalid report format requested.');
    }
});


// === Settings Controllers ===

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = asyncHandler(async (req, res) => {
    // Assuming a single document stores all settings
    let settings = await Setting.findOne();
    if (!settings) {
        // If no settings exist, create default ones
        settings = await Setting.create({
            foodCategories: ['Produce', 'Bakery', 'Dairy', 'Meat', 'Prepared Meals', 'Non-Perishable'],
            rules: { defaultExpiryHours: 4, defaultAdminRole: 'viewer' }
        });
    }
    res.json(settings);
});

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    // Assuming a single document stores all settings
    let settings = await Setting.findOne();
    if (!settings) {
        // Should ideally not happen if GET creates defaults, but handle anyway
        settings = new Setting();
    }

    // Update fields based on request body
    settings.foodCategories = req.body.foodCategories || settings.foodCategories;
    settings.rules = { ...settings.rules, ...(req.body.rules || {}) }; // Merge rules object

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
});


// === Notification Controllers ===

// @desc    Get unread notifications for admin
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getAdminNotifications = asyncHandler(async (req, res) => {
    const { unread, limit } = req.query;
    let query = { targetUser: req.user._id }; // Target the logged-in admin

    if (unread === 'true') {
        query.isRead = false;
    }

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit, 10) || 10); // Apply limit

    const unreadCount = await Notification.countDocuments({ targetUser: req.user._id, isRead: false });

    res.json({ notifications, unreadCount });
});

// @desc    Mark a notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Private/Admin
const markNotificationAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        targetUser: req.user._id // Ensure admin owns this notification
    });

    if (notification) {
        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// === Admin Profile Controllers ===

// @desc    Get logged-in admin's profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getAdminProfile = asyncHandler(async (req, res) => {
    // req.user should be populated by the 'protect' middleware
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('Admin user not found');
    }
});

// @desc    Update logged-in admin's profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateAdminProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // Add other updatable fields (phone, avatarUrl, etc.)
        if (req.body.password) {
            // Ensure password hashing is handled here or in a pre-save hook
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({ // Send back updated user data (excluding password)
             _id: updatedUser._id,
             name: updatedUser.name,
             email: updatedUser.email,
             role: updatedUser.role,
             // include other relevant fields
        });
    } else {
        res.status(404);
        throw new Error('Admin user not found');
    }
});


export {
    getOverviewSummary,
    getWeeklyDonationsChart,
    getCategoryDistributionChart,
    getAllDonations,
    getAllUsers,
    approveUser,
    rejectUser,
    banUser,
    unbanUser,
    getLiveInventory,
    getActiveTasks,
    getAnalyticsTrends,
    downloadReport,
    getSettings,
    updateSettings,
    getAdminNotifications,
    markNotificationAsRead,
    getAdminProfile,
    updateAdminProfile,
};