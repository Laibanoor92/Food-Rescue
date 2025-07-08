import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware for updating user profile
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, contact, email, currentPassword } = req.body;
        const userId = req.user.id; // Extract user ID from JWT token

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify current password if updating email
        if (email && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

            // Update email & reset verification status
            user.email = email.toLowerCase();
            user.isVerified = false; // Require re-verification
        }

        // Update other fields
        if (firstName) user.firstName = firstName.trim();
        if (lastName) user.lastName = lastName.trim();

        // Validate and update contact number
        if (contact && !/^\d{10}$/.test(contact)) {
            return res.status(400).json({ message: 'Invalid contact number' });
        }
        if (contact) user.contact = contact.trim();

        // Ensure organization fields for donor & recipient
        if (user.role !== 'volunteer' && (!user.organizationName || !user.organizationType)) {
            return res.status(400).json({ message: 'Organization Name and Type are required for Donor and Recipient' });
        }

        // Save updated user
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
