// import React from 'react';
// // Use MUI icons instead of Heroicons
// import {
//   PersonOutline as UserCircleIcon,
//   EditOutlined as PencilSquareIcon,
//   DownloadOutlined as DocumentCheckIcon
// } from '@mui/icons-material';

// const VolunteerProfile = () => {
//   // Dummy data
//   const profile = {
//     name: 'Alex Volunteer',
//     email: 'alex.v@example.com',
//     phone: '555-123-4567',
//     availability: 'Weekends, Weekday evenings',
//     maxDistance: '10 miles',
//   };

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//         <div className="flex items-center">
//           <UserCircleIcon className="h-10 w-10 text-gray-500 mr-3" />
//           <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
//         </div>
//         <button className="mt-3 sm:mt-0 inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//           <PencilSquareIcon className="h-5 w-5 mr-1.5 text-gray-500" />
//           Edit Profile & Preferences
//         </button>
//       </div>

//       <div className="space-y-3 text-sm text-gray-700">
//         <p><span className="font-medium text-gray-900">Name:</span> {profile.name}</p>
//         <p><span className="font-medium text-gray-900">Email:</span> {profile.email}</p>
//         <p><span className="font-medium text-gray-900">Phone:</span> {profile.phone}</p>
//         <p><span className="font-medium text-gray-900">Availability:</span> {profile.availability}</p>
//         <p><span className="font-medium text-gray-900">Max Travel Distance:</span> {profile.maxDistance}</p>
//       </div>

//       <div className="mt-6 border-t pt-4">
//         <button className="inline-flex items-center rounded-md bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-dark shadow-sm ring-1 ring-inset ring-primary-200 hover:bg-primary-100">
//           <DocumentCheckIcon className="h-5 w-5 mr-1.5" />
//           Download Certificate (Placeholder)
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VolunteerProfile;

import React, { useState, useEffect } from 'react';
import {
  PersonOutline as UserCircleIcon,
  EditOutlined as PencilSquareIcon,
  DownloadOutlined as DocumentCheckIcon,
  EmailOutlined as EmailIcon,
  PhoneOutlined as PhoneIcon,
  EventAvailableOutlined as AvailabilityIcon,
  DirectionsCarOutlined as VehicleIcon, // Example for vehicle
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import {
  Box, Typography, Paper, Stack, Button, CircularProgress, Alert, Avatar,
  List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import api from '../../../../services/api';// Adjust path as needed

// Helper to format availability (example)
const formatAvailability = (availability) => {
  if (!availability || typeof availability !== 'object' || Object.keys(availability).length === 0) {
    return 'Not specified';
  }
  // Simple example: Join days and times
  return Object.entries(availability)
    .map(([day, times]) => `${day}: ${times.join(', ')}`)
    .join('; ');
};

const VolunteerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/volunteer/profile');
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching volunteer profile:", err);
        setError(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Fetch on component mount

  const handleEditProfile = () => {
    // Placeholder: Navigate to an edit profile page or open a modal
    alert('Edit profile functionality not yet implemented.');
  };

  const handleDownloadCertificate = () => {
    // Placeholder: Implement certificate download logic
    alert('Certificate download functionality not yet implemented.');
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Use Avatar for profile picture placeholder */}
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.light' }}>
            <UserCircleIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6">My Profile</Typography>
        </Stack>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PencilSquareIcon />}
          onClick={handleEditProfile}
          sx={{ mt: { xs: 2, sm: 0 } }}
        >
          Edit Profile & Preferences
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
          <CircularProgress />
          <Typography ml={2}>Loading profile...</Typography>
        </Box>
      ) : profile ? (
        <>
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <UserCircleIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Name" secondary={profile.name || 'N/A'} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={profile.email || 'N/A'} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PhoneIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Phone" secondary={profile.phoneNumber || 'N/A'} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AvailabilityIcon color="action" />
              </ListItemIcon>
              {/* Adjust formatting based on how availability is stored */}
              <ListItemText primary="Availability" secondary={formatAvailability(profile.availability)} />
            </ListItem>
             <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <VehicleIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Vehicle Info" secondary={profile.vehicleInfo || 'Not specified'} />
            </ListItem>
            {/* Add other fields like address, maxDistance if available */}
            {/* <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <MapIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Address" secondary={profile.address || 'N/A'} />
            </ListItem> */}
          </List>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" justifyContent="flex-start" mt={2}>
             <Button
                variant="contained"
                color="secondary" // Or another appropriate color
                size="small"
                startIcon={<DocumentCheckIcon />}
                onClick={handleDownloadCertificate}
              >
                Download Certificate (Placeholder)
              </Button>
          </Stack>
        </>
      ) : (
         <Typography color="text.secondary" textAlign="center">Profile data not found.</Typography>
      )}
    </Paper>
  );
};

export default VolunteerProfile;