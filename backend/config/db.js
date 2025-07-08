import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Remove deprecated options
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ MongoDB Connected");
    console.log("Connection state:", mongoose.connection.readyState);
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    console.error("Error details:", error.message);
    process.exit(1);
  }
};

// Monitor for connection issues after initial connection
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

export default connectDB;

