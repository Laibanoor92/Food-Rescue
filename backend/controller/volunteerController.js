import mongoose from 'mongoose';
import Task from '../models/Task.js'; // Add .js extension
import User from '../models/user.js'; // Add .js extension

// --- Dashboard ---
export const getVolunteerDashboardStats = async (req, res) => { // Use export
    try {
        const volunteerId = req.user._id;
        const user = await User.findById(volunteerId).select('tasksCompleted hoursVolunteered');
        if (!user) return res.status(404).json({ message: 'Volunteer not found' });

        const completedTasksCount = await Task.countDocuments({
            assignedVolunteer: volunteerId,
            status: 'Completed'
        });
        const mealsRescued = completedTasksCount * 10; // Example

        res.status(200).json({
            pickupsCompleted: user.tasksCompleted || completedTasksCount,
            hoursVolunteered: user.hoursVolunteered || 0,
            mealsRescued: mealsRescued,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

// --- Tasks ---
export const getUpcomingTasks = async (req, res) => { // Use export
    try {
        const volunteerId = req.user._id;
        const upcomingTasks = await Task.find({
            assignedVolunteer: volunteerId,
            status: { $in: ['Assigned', 'InProgress'] }
        }).sort({ 'pickupTimeWindow.start': 1 });
        res.status(200).json(upcomingTasks);
    } catch (error) {
        console.error("Error fetching upcoming tasks:", error);
        res.status(500).json({ message: 'Server error fetching upcoming tasks' });
    }
};

export const getAvailableTasks = async (req, res) => { // Use export
    try {
        const availableTasks = await Task.find({ status: 'Available' })
            .sort({ 'pickupTimeWindow.start': 1 });
        res.status(200).json(availableTasks);
    } catch (error) {
        console.error("Error fetching available tasks:", error);
        res.status(500).json({ message: 'Server error fetching available tasks' });
    }
};

export const getTaskHistory = async (req, res) => { // Use export
    try {
        const volunteerId = req.user._id;
        const historyTasks = await Task.find({
            assignedVolunteer: volunteerId,
            status: { $in: ['Completed', 'Cancelled', 'Failed'] }
        })
        .sort({ 'actualCompletionTime': -1, 'updatedAt': -1 })
        .limit(50);
        res.status(200).json(historyTasks);
    } catch (error) {
        console.error("Error fetching task history:", error);
        res.status(500).json({ message: 'Server error fetching task history' });
    }
};

export const claimTask = async (req, res) => { // Use export
    try {
        const { taskId } = req.params;
        const volunteerId = req.user._id;
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
             return res.status(400).json({ message: 'Invalid Task ID' });
        }
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, status: 'Available' },
            { $set: { assignedVolunteer: volunteerId, status: 'Assigned' } },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not available or already claimed' });
        res.status(200).json({ message: 'Task claimed successfully', task: updatedTask });
    } catch (error) {
        console.error("Error claiming task:", error);
        res.status(500).json({ message: 'Server error claiming task' });
    }
};

export const startTask = async (req, res) => { // Use export
     try {
        const { taskId } = req.params;
        const volunteerId = req.user._id;
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
             return res.status(400).json({ message: 'Invalid Task ID' });
        }
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, assignedVolunteer: volunteerId, status: 'Assigned' },
            { $set: { status: 'InProgress', actualStartTime: new Date() } },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not found or cannot be started' });
        res.status(200).json({ message: 'Task started', task: updatedTask });
    } catch (error) {
        console.error("Error starting task:", error);
        res.status(500).json({ message: 'Server error starting task' });
    }
};

export const completeTask = async (req, res) => { // Use export
     try {
        const { taskId } = req.params;
        const volunteerId = req.user._id;
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
             return res.status(400).json({ message: 'Invalid Task ID' });
        }
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, assignedVolunteer: volunteerId, status: 'InProgress' },
            { $set: { status: 'Completed', actualCompletionTime: new Date() } },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not found or cannot be completed' });
        await User.findByIdAndUpdate(volunteerId, { $inc: { tasksCompleted: 1 } });
        res.status(200).json({ message: 'Task completed', task: updatedTask });
    } catch (error) {
        console.error("Error completing task:", error);
        res.status(500).json({ message: 'Server error completing task' });
    }
};

// --- Profile ---
export const getVolunteerProfile = async (req, res) => { // Use export
    try {
        const userProfile = await User.findById(req.user._id).select('-password');
        if (!userProfile) return res.status(404).json({ message: 'Volunteer profile not found' });
        res.status(200).json(userProfile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

export const updateVolunteerProfile = async (req, res) => { // Use export
    try {
        const volunteerId = req.user._id;
        const { name, phoneNumber, address, availability, vehicleInfo } = req.body;
        const allowedUpdates = { name, phoneNumber, address, availability, vehicleInfo };
        Object.keys(allowedUpdates).forEach(key => allowedUpdates[key] === undefined && delete allowedUpdates[key]);

        const updatedUser = await User.findByIdAndUpdate(volunteerId, allowedUpdates, {
            new: true, runValidators: true
        }).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'Volunteer not found' });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error updating profile' });
    }
};