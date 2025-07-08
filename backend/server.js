import express from "express";
import http from 'http';
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from './routes/donationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import recipientRoutes from './routes/recipientRoutes.js'; 
import volunteerRoutes from './routes/volunteerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { Server } from 'socket.io';
import initSocketHandlers from './config/socketHandlers.js';

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  const authHeader = req.headers.authorization || '';
  console.log('Auth header:', authHeader ? `${authHeader.substring(0, 15)}...` : 'Not provided');
  next();
});

// Middleware
app.use(cors({ 
  credentials: true, 
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL || "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/recipient/dashboard', recipientRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Server error",
    error: err.message
  });
});

// Create HTTP server
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize socket handlers
initSocketHandlers(io);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});