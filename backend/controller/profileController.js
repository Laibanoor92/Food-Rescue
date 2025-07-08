// import Donation from '../models/Donation.js';
// import User from '../models/user.js';
// const mongoose = require('mongoose');
// const cloudinary = require('../config/cloudinary');

// // Get user profile
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     // Get donation stats
//     const donationStats = await Donation.aggregate([
//       { $match: { donor: mongoose.Types.ObjectId(req.user._id) } },
//       {
//         $group: {
//           _id: null,
//           totalDonations: { $sum: 1 },
//           totalFoodSaved: { $sum: "$quantity" },
//           peopleFed: { 
//             $sum: { 
//               $cond: [
//                 { $ifNull: ["$estimatedPeopleServed", false] },
//                 "$estimatedPeopleServed",
//                 3  // Default estimate
//               ] 
//             } 
//           }
//         }
//       }
//     ]);
    
//     const stats = donationStats.length > 0 ? donationStats[0] : { 
//       totalDonations: 0, 
//       totalFoodSaved: 0,
//       peopleFed: 0
//     };
    
//     return res.json({
//       ...user.toObject(),
//       stats: {
//         totalDonations: stats.totalDonations,
//         totalFoodSaved: Math.round(stats.totalFoodSaved * 10) / 10,
//         peopleFed: stats.peopleFed
//       }
//     });
//   } catch (error) {
//     console.error('Error getting profile:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// // Update user profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const { name, phone, address, bio, profilePicture } = req.body;
    
//     // Update user
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       { name, phone, address, bio, profilePicture },
//       { new: true }
//     ).select('-password');
    
//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     return res.json(updatedUser);
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

import User from '../models/user.js';
import Donation from '../models/Donation.js';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

// Get user profile
export const getProfile = async (req, res) => {
  try {
    console.log('Profile request received:', req.user);
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.user.id || req.user._id;
    
    // Fix: Always use new when creating an ObjectId
    let userObjectId;
    try {
      userObjectId = typeof userId === 'string' 
        ? new ObjectId(userId) // Use new here
        : userId;
    } catch (err) {
      console.error('Invalid ObjectId format:', err);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    console.log('Looking for user with ID:', userObjectId);
    
    const user = await User.findById(userObjectId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get donation stats if user is a donor
    let donationStats = {
      totalDonations: 0,
      totalQuantity: 0,
      peopleFed: 0,
      co2Saved: 0
    };
    
    if (user.role === 'donor') {
      try {
        const totalDonations = await Donation.countDocuments({ donor: userObjectId });
        
        // Only run aggregate if there are donations
        let totalQuantity = 0;
        if (totalDonations > 0) {
          const donationSum = await Donation.aggregate([
            { $match: { donor: userObjectId } },
            { $group: { 
                _id: null, 
                totalQuantity: { $sum: "$quantity" } 
              }
            }
          ]);
          
          totalQuantity = donationSum.length > 0 ? donationSum[0].totalQuantity : 0;
        }
        
        // Calculate impact metrics
        const peopleFed = Math.round(totalQuantity * 2.5);
        const co2Saved = parseFloat((totalQuantity * 2.5).toFixed(1));
        
        donationStats = {
          totalDonations,
          totalQuantity,
          peopleFed,
          co2Saved
        };
      } catch (statsError) {
        console.error('Error calculating donation stats:', statsError);
        // Continue with basic profile data even if stats calculation fails
      }
    }
    
    // Return user profile with stats
    return res.status(200).json({
      ...user.toJSON(),
      donationStats
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({ 
      message: 'Server error while retrieving profile',
      error: error.message 
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    console.log("✏️ updateProfile called");
    
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.user._id;
    const { name, email, contact , address, organization } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    
    // Check for unique email if it's changed
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use by another account" });
    }
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        email, 
        contact, 
        address,
        organization
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User profile not found" });
    }
    
    console.log(`✅ Profile updated for user: ${updatedUser.name}`);
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Error in updateProfile:", error);
    res.status(500).json({ 
      message: "Server error while updating profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
