// import Donation from '../models/Donation.js';
// import TrackingUpdate from '../models/TrackingUpdate.js';
// const mongoose = require('mongoose');

// // Get tracking data for a donation
// exports.getTrackingData = async (req, res) => {
//   try {
//     const donationId = req.params.id;
    
//     // Get the donation
//     const donation = await Donation.findById(donationId)
//       .populate('volunteer', 'name phone profilePicture');
      
//     if (!donation) {
//       return res.status(404).json({ message: 'Donation not found' });
//     }
    
//     // Check if the user is the donor of this donation
//     if (donation.donor.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
    
//     // Get tracking updates
//     const trackingUpdates = await TrackingUpdate.find({ donation: donationId })
//       .sort({ timestamp: -1 });
      
//     return res.json({
//       donation,
//       trackingUpdates,
//       currentLocation: donation.currentLocation
//     });
//   } catch (error) {
//     console.error('Error getting tracking data:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

import Donation from '../models/Donation.js';
import TrackingUpdate from '../models/TrackingUpdate.js';
import mongoose from 'mongoose';

// Get tracking data for a donation
// In trackingController.js
export const getTrackingData = async (req, res) => {
  try {
    const donationId = req.params.id;
    
    if (!donationId) {
      return res.status(400).json({ 
        success: false,
        message: 'Donation ID is required' 
      });
    }
    
    console.log(`Getting tracking data for donation: ${donationId}`);
    
    // Fetch the donation first to verify it exists and belongs to this user
    const donation = await Donation.findOne({ 
      _id: donationId,
      donor: req.user.id || req.user._id || req.user.userId
    });
    
    if (!donation) {
      return res.status(404).json({ 
        success: false,
        message: 'Donation not found or you do not have permission to view it' 
      });
    }
    
    // Get tracking data
    const trackingData = await TrackingEvent.find({ donation: donationId })
      .sort({ timestamp: 1 });
      
    return res.status(200).json({
      success: true,
      tracking: trackingData || [], // Ensure we always return an array
      donation: {
        id: donation._id,
        status: donation.status,
        foodType: donation.foodType,
        quantity: donation.quantity,
        quantityUnit: donation.quantityUnit,
        createdAt: donation.createdAt,
        expiryDate: donation.expiryDate
      }
    });
  } catch (error) {
    console.error('Error in getTrackingData:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching tracking data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};