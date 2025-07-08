import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  quantityUnit: {
    type: String,
    default: 'kg',
    enum: ['kg', 'lbs', 'items', 'servings', 'packages']
  },
  expiryDate: {
    type: Date,
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
  address: {
    type: String
  },
  description: {
    type: String
  },
  images: [{
    url: String,
    public_id: String
  }],
  status: {
    type: String,
    enum: ['pending', 'picked', 'delivered', 'cancelled', 'accepted','rejected'],
    default: 'pending'
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pickupTime: {
    type: Date
  },
  deliveryTime: {
    type: Date
  },
  estimatedPeopleServed: {
    type: Number
  },
  // For tracking
  currentLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date
  }
}, { timestamps: true });

const Donation=mongoose.model('Donation', DonationSchema);

export default Donation;
