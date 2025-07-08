import Donation from '../models/Donation.js';
import User from '../models/user.js'; 
import mongoose from 'mongoose';


// Helper function for error responses
const handleError = (res, error, message = "Server Error", statusCode = 500) => {
    console.error(`Error: ${message}`, error);
    res.status(statusCode).json({ message, error: error.message });
};

// --- Get Incoming Donations ---
// Fetches AVAILABLE donations (pending and unassigned)
export const getIncomingDonations = async (req, res) => {
    try {
        // const recipientId = req.user._id; // We don't need recipientId for finding available donations

        // Find donations that are 'pending' (available) and NOT assigned to any recipient yet.
        const availableDonations = await Donation.find({
            status: 'pending',          // Find donations that are available
            recipient: null            // And not yet assigned to a recipient
            // Optional: Add filters based on recipient's location/preferences if needed later
        })
        .populate('donor', 'name organization') // Populate donor name/org
        .sort({ createdAt: -1 }) // Show newest first
        .limit(20); // Limit results for performance

        // Format data slightly if needed
        const formattedDonations = availableDonations.map(d => ({
            _id: d._id, // Use _id for keys/actions in frontend
            item: d.foodType,
            quantity: `${d.quantity} ${d.quantityUnit || 'units'}`,
            expiryDate: d.expiryDate, // Send the date object or formatted string
            donor: d.donor, // Send populated donor object
            // Add other relevant fields for the card display
        }));

        res.status(200).json(formattedDonations);
    } catch (error) {
        handleError(res, error, "Failed to fetch available donations");
    }
};



// --- Search Available Donations ---
export const searchAvailableDonations = async (req, res) => {
    try {
        const { query, categories, location } = req.query;

        // Base query: only available donations
        const filter = {
            status: 'pending',
            recipient: null
        };

        // Add search term filter (e.g., search foodType or description)
        if (query) {
            // Simple case-insensitive search on foodType
            filter.foodType = { $regex: query, $options: 'i' };
            // You could expand this to search other fields using $or:
            // filter.$or = [
            //   { foodType: { $regex: query, $options: 'i' } },
            //   { description: { $regex: query, $options: 'i' } } // If you have a description field
            // ];
        }

        // Add category filter
        if (categories) {
            const categoryArray = categories.split(','); // Assuming comma-separated string
            filter.foodType = { ...(filter.foodType || {}), $in: categoryArray }; // Add $in to existing foodType filter or create new
        }

        // Add location filter (basic example - requires proper location data/indexing)
        // This is a placeholder - real location search is more complex (GeoJSON, $near, etc.)
        if (location) {
            // Example: Simple text search on an address field if you have one
            // filter['location.address'] = { $regex: location, $options: 'i' };
            console.warn('Location filtering is not fully implemented in this search example.');
        }

        const results = await Donation.find(filter)
            .populate('donor', 'name organization') // Populate donor info
            .sort({ createdAt: -1 }) // Show newest first
            .limit(50); // Limit results

        res.status(200).json(results);

    } catch (error) {
        handleError(res, error, "Failed to perform donation search");
    }
};

// ... rest of the controller ...

// --- Get Delivery Status ---
// Fetches the status of the current active delivery for the recipient
export const getDeliveryStatus = async (req, res) => {
    try {
        const recipientId = req.user._id;

        // Find the most recent donation that is currently being delivered
        const activeDelivery = await Donation.findOne({
            recipient: recipientId,
            status: { $in: ['accepted', 'assigned_volunteer', 'en_route'] } // Example statuses indicating active delivery process
        })
        .populate('volunteer', 'name') // Get volunteer/driver name
        .sort({ updatedAt: -1 }); // Get the latest updated one

        if (!activeDelivery) {
            // No active delivery found
            return res.status(200).json({ eta: 'N/A', status: 'No Active Delivery', driver: 'N/A' });
        }

        // --- ETA Calculation Placeholder ---
        // Real ETA calculation is complex. It might involve:
        // - Volunteer's current location (if tracked)
        // - Recipient's address
        // - Traffic data APIs (Google Maps etc.)
        // - Estimated pickup/delivery times stored in the donation
        // For now, we'll use a placeholder based on status.
        let eta = 'Calculating...';
        if (activeDelivery.status === 'en_route') {
            eta = 'Approx. 15 minutes'; // Placeholder
        } else if (activeDelivery.status === 'accepted' || activeDelivery.status === 'assigned_volunteer') {
            eta = 'Awaiting pickup';
        }
        // --- End Placeholder ---

        const status = {
            eta: eta,
            status: activeDelivery.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format status nicely
            driver: activeDelivery.volunteer ? activeDelivery.volunteer.name : 'Assigning Driver'
        };

        res.status(200).json(status);
    } catch (error) {
        handleError(res, error, "Failed to fetch delivery status");
    }
};

// --- Get Overview Stats ---
// Calculates total received donations and most frequent item type
export const getOverviewStats = async (req, res) => {
    try {
        const recipientId = req.user._id;

        // 1. Total Donations Received
        const totalReceivedCount = await Donation.countDocuments({
            recipient: recipientId,
            status: 'delivered'
        });

        // 2. Most Received Item Type (using aggregation)
        const categoryAggregation = await Donation.aggregate([
            { $match: { recipient: new mongoose.Types.ObjectId(recipientId), status: 'delivered' } },
            { $group: { _id: '$foodType', count: { $sum: 1 } } }, // Group by foodType and count occurrences
            { $sort: { count: -1 } }, // Sort by count descending
            { $limit: 1 } // Take the top one
        ]);

        const mostReceivedItem = categoryAggregation.length > 0 ? categoryAggregation[0]._id : 'N/A';

        const stats = {
            totalReceived: totalReceivedCount,
            mostReceivedItem: mostReceivedItem
        };

        res.status(200).json(stats);
    } catch (error) {
        handleError(res, error, "Failed to fetch overview stats");
    }
};

// --- Get Request History ---
// Fetches a list of past donations associated with the recipient
export const getRequestHistory = async (req, res) => {
    try {
        const recipientId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15; // Add pagination
        const skip = (page - 1) * limit;

        const history = await Donation.find({ recipient: recipientId })
            .select('foodType createdAt status quantity quantityUnit') // Select only needed fields
            .sort({ createdAt: -1 }) // Sort by creation date descending
            .skip(skip)
            .limit(limit);

        const formattedHistory = history.map(item => ({
            id: item._id,
            item: `${item.foodType} (${item.quantity} ${item.quantityUnit || 'units'})`,
            date: item.createdAt, // Use createdAt or deliveredAt as needed
            status: item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) // Format status
        }));

        // Optionally, get total count for pagination headers/metadata
        // const totalCount = await Donation.countDocuments({ recipient: recipientId });

        res.status(200).json(formattedHistory);
        // Consider adding pagination metadata to response:
        // res.status(200).json({ data: formattedHistory, total: totalCount, page, limit });

    } catch (error) {
        handleError(res, error, "Failed to fetch request history");
    }
};

// --- Get Monthly Analytics ---
// Aggregates total quantity of delivered donations per month
export const getMonthlyAnalytics = async (req, res) => {
    try {
        const recipientId = req.user._id;
        const currentYear = new Date().getFullYear(); // Get current year

        // Aggregate donations delivered in the current year, grouped by month
        const monthlyData = await Donation.aggregate([
            {
                $match: {
                    recipient: new mongoose.Types.ObjectId(recipientId),
                    status: 'delivered',
                    // Filter by date, e.g., delivered within the last 12 months or current year
                    deliveredAt: { // Assuming you have a deliveredAt field
                        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
                    }
                    // If using createdAt:
                    // createdAt: { $gte: new Date(Date.now() - 365*24*60*60*1000) }
                }
            },
            {
                $group: {
                    // Group by month (1-12)
                    _id: { $month: "$deliveredAt" }, // Or $month: "$createdAt"
                    // Sum the quantity for each month
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $sort: { "_id": 1 } // Sort by month number (1 to 12)
            }
        ]);

        // Format data for Recharts { name: 'Jan', donations: 120 }
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedData = monthNames.map((name, index) => {
            const monthResult = monthlyData.find(item => item._id === (index + 1));
            return {
                name: name,
                donations: monthResult ? monthResult.totalQuantity : 0 // Use 'donations' key as expected by frontend
            };
        });

        res.status(200).json(formattedData);
    } catch (error) {
        handleError(res, error, "Failed to fetch monthly analytics");
    }
};

// --- Get Category Analytics ---
// Aggregates total quantity of delivered donations per food category
export const getCategoryAnalytics = async (req, res) => {
    try {
        const recipientId = req.user._id;

        const categoryData = await Donation.aggregate([
            {
                $match: {
                    recipient: new mongoose.Types.ObjectId(recipientId),
                    status: 'delivered'
                }
            },
            {
                $group: {
                    _id: "$foodType", // Group by the food type field
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $project: { // Reshape the output for Recharts
                    _id: 0, // Exclude the default _id
                    name: "$_id", // Rename _id to name
                    value: "$totalQuantity" // Rename totalQuantity to value
                }
            },
            { $sort: { value: -1 } } // Optional: sort by quantity
        ]);

        res.status(200).json(categoryData);
    } catch (error) {
        handleError(res, error, "Failed to fetch category analytics");
    }
};


// --- Accept Donation ---
export const acceptDonation = async (req, res) => {
    try {
        const { donationId } = req.params;
        const recipientId = req.user._id;

        // Find the donation, ensure it's 'pending' and unassigned
        const donation = await Donation.findOne({
             _id: donationId,
             status: 'pending', // Can only accept if it's pending
             recipient: null    // And not already taken
        });

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found or already accepted/assigned.' });
        }

        // Assign to recipient and update status to 'pending_acceptance' or 'accepted'
        // 'pending_acceptance' implies the recipient accepted, but maybe a volunteer needs assignment?
        // 'accepted' might be simpler if acceptance directly leads to delivery planning. Choose one.
        donation.recipient = recipientId;
        donation.status = 'accepted'; // Or 'pending_acceptance' depending on your workflow
        // You might want to add an 'acceptedAt' timestamp here
        // donation.acceptedAt = new Date();

        await donation.save();

        // Optional: Notify donor/admin

        res.status(200).json({ message: 'Donation accepted successfully.' });

    } catch (error) {
        handleError(res, error, 'Failed to accept donation');
    }
};


// --- Reject Donation ---
// This function might be for rejecting a donation *already assigned* to the recipient
// If it's for rejecting an *offer* from the available list, it might not be needed,
// as the recipient simply doesn't "accept" it.
// Let's assume it's for rejecting an assigned donation (e.g., status was 'pending_acceptance')
export const rejectDonation = async (req, res) => {
    try {
        const { donationId } = req.params;
        const recipientId = req.user._id;

        // Find the donation assigned to this recipient (e.g., if status was 'pending_acceptance')
        const donation = await Donation.findOne({
            _id: donationId,
            recipient: recipientId,
            // status: 'pending_acceptance' // Or 'accepted' if they can reject after full acceptance
        });

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found or not assigned to you.' });
        }

        // Update status and potentially unassign recipient so it might become available again or cancelled
        donation.status = 'rejected';
        donation.recipient = null; // Make it available again? Or does rejection cancel it? Decide workflow.
        // You might want to add a 'rejectedAt' timestamp
        // donation.rejectedAt = new Date();

        await donation.save();

        // Optional: Notify donor/admin

        res.status(200).json({ message: 'Donation rejected.' });

    } catch (error) {
        handleError(res, error, 'Failed to reject donation');
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from authMiddleware

        // Fetch user data, excluding the password
        const userProfile = await User.findById(userId).select('-password');

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        res.status(200).json(userProfile);

    } catch (error) {
        handleError(res, error, "Failed to fetch user profile");
    }
};

// ... imports ...

export const updateProfile = async (req, res) => {
    try {
      console.log("✏️ updateProfile called");
  
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
  
      const userId = req.user.id || req.user._id;
      // Destructure fields sent from the frontend
      const { organizationName, contactNumber, address } = req.body;
      // Note: name and email are usually not updated here by recipient,
      // but if they were, they'd be destructured too.
  
      // Find the user first to handle nested updates correctly
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }
  
      // Prepare updates
      // Update standard fields directly if they exist in req.body
      if (contactNumber !== undefined) user.contact = contactNumber; // Assuming model field is 'contact'
      if (address !== undefined) user.address = address;
  
      // --- Handle Organization Name ---
      if (organizationName !== undefined) {
          // Assuming User model has: organization: { name: String }
          if (user.organization && typeof user.organization === 'object') {
              user.organization.name = organizationName;
          } else {
              // If organizationName is a direct field, or if you need to initialize the object
              // Option 1: Direct field
              // user.organizationName = organizationName;
              // Option 2: Initialize object (if it might not exist)
               user.organization = { name: organizationName };
          }
          // Choose the correct logic based on your User schema!
      }
  
      // --- Optional: Handle Name/Email if they were editable ---
      // if (name !== undefined) user.name = name;
      // if (email !== undefined) {
      //    // Add email uniqueness check here if allowing email update
      //    user.email = email;
      // }
  
  
      // Save the updated user document
      // Mongoose's save() will run validators by default
      const updatedUser = await user.save();
  
      // Respond with updated data (excluding password)
      const userResponse = updatedUser.toObject();
      delete userResponse.password;
  
      console.log(`✅ Profile updated for user: ${userResponse.name}`);
      res.status(200).json(userResponse);
  
    } catch (error) {
      console.error("❌ Error in updateProfile:", error);
      // Handle potential validation errors from save()
      if (error.name === 'ValidationError') {
          return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({
        message: "Server error while updating profile",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
  
 
