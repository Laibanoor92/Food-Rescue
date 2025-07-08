import mongoose from 'mongoose';
import Donation from '../models/Donation.js';  // Ensure you're using .js for ES module imports
import User from '../models/user.js';          // Ensure .js extension here too
import cloudinary from '../config/cloudinary.js';  // Use .js for cloudinary config

// Get donation statistics for dashboard
// In your donationController.js
export const getDonationStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const donorId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    
    // Get basic stats
    const totalDonations = await Donation.countDocuments({ donor: donorId });
    
    // Calculate total kg donated
    const donationSum = await Donation.aggregate([
      { $match: { donor: donorId } },
      { $group: { 
          _id: null, 
          totalKg: { $sum: "$quantity" } 
        }
      }
    ]);
    
    const totalKg = donationSum.length > 0 ? donationSum[0].totalKg : 0;
    
    // Status breakdown for pie chart
    const pending = await Donation.countDocuments({ 
      donor: donorId, 
      status: 'pending' 
    });
    
    const picked = await Donation.countDocuments({ 
      donor: donorId, 
      status: 'picked' 
    });
    
    const delivered = await Donation.countDocuments({ 
      donor: donorId, 
      status: 'delivered' 
    });
    
    const cancelled = await Donation.countDocuments({ 
      donor: donorId, 
      status: 'cancelled' 
    });
    
    // Calculate meals saved (approx 1kg = 2.5 meals)
    const mealsSaved = Math.round(totalKg * 2.5);
    
    res.json({
      totalDonations,
      totalKg,
      mealsSaved,
      pending,
      picked,
      delivered,
      cancelled
    });
  } catch (error) {
    console.error("Error getting donation stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get chart data for dashboard
export const getChartData = async (req, res) => {
  try {
    // Get status counts for pie chart
    const statusCounts = await Donation.aggregate([
      { $match: { donor: new mongoose.Types.ObjectId(req.user._id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Transform into object
    const statusObj = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { pending: 0, picked: 0, delivered: 0, cancelled: 0 });
    
    // Get monthly donation counts for bar chart
    const monthlyDonations = await Donation.aggregate([
      { $match: { donor: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]);
    
    // Transform into array with month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = monthlyDonations.map(item => ({
      month: months[item._id.month - 1],
      count: item.count
    }));
    
    return res.json({
      statusCounts: statusObj,
      monthlyDonations: monthlyData
    });
  } catch (error) {
    console.error('Error getting chart data:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create new donation
export const createDonation = async (req, res) => {
  try {
    const { 
      foodType, 
      quantity, 
      quantityUnit, 
      expiryDate, 
      location, 
      address, 
      description,
      images
    } = req.body;

    const newDonation = new Donation({
      donor: req.user._id,
      foodType,
      quantity,
      quantityUnit,
      expiryDate,
      location,
      address,
      description,
      images,
      status: 'pending'
    });

    await newDonation.save();

    // Update user stats
    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { totalDonations: 1 } }
    );

    return res.status(201).json({ 
      message: 'Donation created successfully',
      donation: newDonation
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all donations by the donor
// In donationController.js
export const getDonationHistory = async (req, res) => {
  try {
    // Add console.log for debugging
    console.log('Getting donation history for user:', req.user?.id);
    console.log('Query params:', req.query);
    
    // Get user ID from authenticated request
    const userId = req.user.id || req.user._id || req.user.userId;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in request' });
    }
    
    // Build query
    const query = { donor: userId };
    
    // Add status filter if provided
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }
    
    // Add date range filter if provided
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }
    
    // Get donations with query
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(req.query.limit ? parseInt(req.query.limit) : 50);
      
    console.log(`Found ${donations.length} donations`);
    
    return res.status(200).json({ 
      success: true,
      donations: donations || [] // Ensure we always return an array
    });
  } catch (error) {
    console.error('Error in getDonationHistory:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching donation history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add the missing getTrackingInfo function
export const getTrackingInfo = async (req, res) => {
  try {
    const donationId = req.params.id;
    const userId = req.user.id;

    // Find the donation
    const donation = await Donation.findOne({ 
      _id: donationId,
      donor: userId 
    });

    if (!donation) {
      return res.status(404).json({ 
        success: false,
        message: 'Donation not found or you do not have permission to view it' 
      });
    }

    // Get volunteer info if assigned
    let volunteer = null;
    if (donation.volunteer) {
      volunteer = await User.findById(donation.volunteer, 'name phone email');
    }

    // Create response object
    const donationData = {
      id: donation._id,
      foodType: donation.foodType,
      quantity: donation.quantity,
      quantityUnit: donation.quantityUnit,
      status: donation.status,
      createdAt: donation.createdAt,
      pickupAddress: donation.address,
      expiryDate: donation.expiryDate
    };

    return res.status(200).json({
      success: true,
      donation: donationData,
      volunteer: volunteer,
      // Add any other tracking info you need
    });
  } catch (error) {
    console.error('Error in getTrackingInfo:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching tracking information', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single donation details
export const getRecentDonations = async (req, res) => {
  console.log("✅ Hit getRecentDonations");

  try {
    if (!req.user || !(req.user.id || req.user._id)) {
      return res.status(401).json({ message: "Unauthorized - User not authenticated" });
    }

    // Use either _id or id, whichever is available
    const userId = req.user._id || req.user.id;
    const donorId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    const recentDonations = await Donation.find({ donor: donorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(); // Use lean() for better performance

    // Format the data to match frontend expectations
    const formattedDonations = recentDonations.map(donation => ({
      id: donation._id,
      foodType: donation.foodType,
      quantity: donation.quantity,
      quantityUnit: donation.quantityUnit,
      status: donation.status,
      createdAt: donation.createdAt,
      // This is the key change - move address into the location object
      location: {
        address: donation.address || 'Location unavailable',
        lat: donation.location?.lat,
        lng: donation.location?.lng
      },
      recipient: donation.recipient || null,
      volunteer: donation.volunteer || null
    }));

    console.log(`Found ${formattedDonations.length} recent donations`);
    
    res.json(formattedDonations);
  } catch (error) {
    console.error("Error fetching recent donations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get contribution stats and history
export const getContributions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    
    // Get donations
    const donations = await Donation.find({ donor: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    // Get total count
    const total = await Donation.countDocuments({ donor: req.user._id });
    
    // Calculate impact stats
    const stats = await Donation.aggregate([
      { $match: { donor: mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: null,
          foodWeight: { $sum: "$quantity" },
          peopleFed: { 
            $sum: { 
              $cond: [
                { $ifNull: ["$estimatedPeopleServed", false] },
                "$estimatedPeopleServed",
                3  // Default estimate if not specified
              ] 
            } 
          }
        }
      }
    ]);
    
    const impactStats = stats.length > 0 ? stats[0] : { foodWeight: 0, peopleFed: 0 };
    
    return res.json({
      donations,
      stats: {
        total,
        foodWeight: Math.round(impactStats.foodWeight * 10) / 10, // Round to 1 decimal
        peopleFed: impactStats.peopleFed
      },
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error getting contributions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get single donation details by ID
export const getDonationDetails = async (req, res) => {
  try {
    const donationId = req.params.id;
    const userId = req.user.id || req.user._id;
    
    console.log(`Fetching donation details for ID: ${donationId}, User: ${userId}`);
    
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid donation ID format'
      });
    }

    // Find the donation
    const donation = await Donation.findOne({
      _id: donationId,
      donor: userId
    }).lean();

    if (!donation) {
      return res.status(404).json({ 
        success: false,
        message: 'Donation not found or you do not have permission to view it'
      });
    }

    // Get recipient info if assigned
    let recipient = null;
    if (donation.recipient) {
      recipient = await User.findById(donation.recipient, 'name organization');
    }

    // Get volunteer info if assigned
    let volunteer = null;
    if (donation.volunteer) {
      volunteer = await User.findById(donation.volunteer, 'name phone email');
    }

    return res.status(200).json({
      success: true,
      donation: {
        ...donation,
        id: donation._id,
        recipient,
        volunteer
      }
    });
  } catch (error) {
    console.error('Error in getDonationDetails:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching donation details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
