import mongoose from 'mongoose';

const TrackingUpdateSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['assigned', 'en_route', 'arrived', 'picked_up', 'delivering', 'delivered'],
    required: true
  },
  message: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const TrackingUpdate = mongoose.model('TrackingUpdate', TrackingUpdateSchema);

export default TrackingUpdate;
