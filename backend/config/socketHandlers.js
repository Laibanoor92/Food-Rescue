import Tracking from '../models/TrackingUpdate.js';
import Donation from '../models/Donation.js';

const initSocketHandlers = (io) => {
  // Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    // Here you would verify the token
    // For simplicity, we're just checking if a token exists
    if (token) {
      next();
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join a tracking room for a specific donation
    socket.on('joinTrackingRoom', ({ donationId }) => {
      socket.join(`tracking:${donationId}`);
      console.log(`Client ${socket.id} joined tracking room for donation ${donationId}`);
    });
    
    // Leave a tracking room
    socket.on('leaveTrackingRoom', ({ donationId }) => {
      socket.leave(`tracking:${donationId}`);
      console.log(`Client ${socket.id} left tracking room for donation ${donationId}`);
    });
    
    // Update location (from volunteer app)
    socket.on('updateLocation', async (data) => {
      try {
        const { donationId, location, status } = data;
        
        // Update location in database
        await Tracking.findOneAndUpdate(
          { donation: donationId },
          { 
            currentLocation: location,
            ...(status && { status })
          }
        );
        
        // Broadcast to all clients in the tracking room
        io.to(`tracking:${donationId}`).emit('locationUpdate', {
          donationId,
          location,
          status
        });
        
      } catch (error) {
        console.error('Error updating location:', error);
      }
    });
    
    // Update donation status (from volunteer app)
    socket.on('updateDonationStatus', async (data) => {
      try {
        const { donationId, status } = data;
        
        // Update status in database
        await Donation.findByIdAndUpdate(donationId, { status });
        await Tracking.findOneAndUpdate(
          { donation: donationId },
          { status }
        );
        
        // Broadcast to all clients in the tracking room
        io.to(`tracking:${donationId}`).emit('statusUpdate', {
          donationId,
          status
        });
        
      } catch (error) {
        console.error('Error updating donation status:', error);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export default initSocketHandlers;