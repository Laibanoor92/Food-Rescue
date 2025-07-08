import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    targetUser: { // The user who should receive the notification (e.g., an admin)
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to the User model
    },
    message: { // The content of the notification
        type: String,
        required: true,
        trim: true,
    },
    type: { // Category of notification (optional, but useful for filtering/icons)
        type: String,
        enum: ['newUser', 'pendingDonation', 'taskUpdate', 'systemAlert', 'reportReady', 'other'],
        default: 'other',
    },
    link: { // Optional URL to navigate to when clicked (e.g., /admin/users/pending/USER_ID)
        type: String,
        trim: true,
    },
    isRead: { // Status of the notification
        type: Boolean,
        required: true,
        default: false,
    },
    // You could add a 'relatedDocument' field to link to a specific Donation, User, Task etc.
    // relatedDocument: {
    //   docId: { type: mongoose.Schema.Types.ObjectId },
    //   docModel: { type: String } // e.g., 'Donation', 'User'
    // }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Index for efficient querying of user's unread notifications
notificationSchema.index({ targetUser: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;