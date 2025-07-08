import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    donationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        required: true
    },
    pickupLocation: {
        address: String,
        coordinates: { type: [Number], index: '2dsphere' }
    },
    dropoffLocation: {
        address: String,
        coordinates: { type: [Number], index: '2dsphere' }
    },
    pickupTimeWindow: {
        start: Date,
        end: Date
    },
    dropoffTimeWindow: {
        start: Date,
        end: Date
    },
    status: {
        type: String,
        enum: ['Pending', 'Available', 'Assigned', 'InProgress', 'Completed', 'Cancelled', 'Failed'],
        default: 'Pending'
    },
    assignedVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    pickupNotes: String,
    dropoffNotes: String,
    estimatedDuration: Number,
    actualStartTime: Date,
    actualCompletionTime: Date,
    foodCategory: String,
    quantity: String,
    donorName: String,
    recipientName: String,
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task; // Use export default