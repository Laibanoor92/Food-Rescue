import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { 
  Card, 
  CardContent, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  CircularProgress,
  Chip
} from '@mui/material';
import TrackingMap from './TrackingMap';

const TrackDonation = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [volunteer, setVolunteer] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(socketInstance);

    // Fetch donation details
    const fetchDonationDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/donations/${id}/track`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDonation(response.data.donation);
        setVolunteer(response.data.volunteer);
        if (response.data.currentLocation) {
          setCurrentLocation(response.data.currentLocation);
        }
      } catch (err) {
        console.error('Error fetching donation tracking:', err);
        setError('Failed to load tracking information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetails();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [id]);

  useEffect(() => {
    if (socket && donation) {
      // Join the tracking room
      socket.emit('join-tracking-room', { id });
      
      // Listen for location updates
      socket.on('location-update', (data) => {
        if (data.id === id) {
          setCurrentLocation(data.location);
        }
      });
      
      // Listen for status updates
      socket.on('status-update', (data) => {
        if (data.donationId === id) {
          setDonation(prevDonation => ({
            ...prevDonation,
            status: data.status,
            statusHistory: [...(prevDonation.statusHistory || []), {
              status: data.status,
              timestamp: new Date().toISOString()
            }]
          }));
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off('location-update');
        socket.off('status-update');
      }
    };
  }, [socket, donation, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <Typography>Donation not found or you don't have permission to track it.</Typography>
      </div>
    );
  }

  // Define steps based on the donation status
  const steps = ['Pending', 'Volunteer Assigned', 'On The Way', 'Picked Up', 'Delivered'];
  const currentStep = steps.indexOf(donation.status);

  return (
    <div>
      <Typography variant="h5" className="mb-6">Track Donation #{donation.id}</Typography>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Donation and status info */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardContent>
              <Typography variant="h6" className="font-bold">Donation Details</Typography>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <Typography variant="body2" color="textSecondary">Food Type</Typography>
                  <Typography variant="body1">{donation.foodType}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="textSecondary">Quantity</Typography>
                  <Typography variant="body1">{donation.quantity} {donation.quantityUnit}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="textSecondary">Current Status</Typography>
                  <Chip 
                    label={donation.status} 
                    color={donation.status === 'Delivered' ? 'success' : 'primary'} 
                    size="small" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {volunteer && (
            <Card className="mb-6">
              <CardContent>
                <Typography variant="h6" className="font-bold">Volunteer Information</Typography>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <Typography variant="body2" color="textSecondary">Name</Typography>
                    <Typography variant="body1">{volunteer.name}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2" color="textSecondary">Phone</Typography>
                    <Typography variant="body1">{volunteer.phone}</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" className="font-bold">Tracking Progress</Typography>
              <div className="mt-6">
                <Stepper activeStep={currentStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Map */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="h-full">
              <Typography variant="h6" className="font-bold mb-4">Live Tracking</Typography>
              {currentLocation ? (
                <div className="h-96">
                  <TrackingMap 
                    donationLocation={donation.location} 
                    volunteerLocation={currentLocation} 
                    destination={donation.recipient ? donation.recipient.location : null}
                  />
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                  <Typography color="textSecondary">
                    {donation.status === 'Pending' 
                      ? 'Waiting for volunteer assignment...'
                      : 'Waiting for volunteer location updates...'}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackDonation;