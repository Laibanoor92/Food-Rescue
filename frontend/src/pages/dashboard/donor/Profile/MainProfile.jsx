// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
// import axios from 'axios';
// import ProfileDetails from './ProfileDetails';
// import ContributionHistory from './ContributionHistory';
// import EditProfileForm from './EditProfileForm';
// import { useNavigate, useLocation } from 'react-router-dom';

// const MainProfile = () => {
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Determine active tab based on current URL
//   const path = location.pathname;
//   const activeTab = path.includes('/contributions') ? 1 : 0;

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get('/api/users/profile', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUserProfile(response.data);
//     } catch (err) {
//       setError('Failed to load profile');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleTabChange = (event, newValue) => {
//     if (newValue === 0) {
//       navigate('/donor/profile');
//     } else {
//       navigate('/donor/profile/contributions');
//     }
//   };

//   const handleProfileUpdate = (updatedProfile) => {
//     setUserProfile(updatedProfile);
//     navigate('/donor/profile');
//   };

//   if (loading) {
//     return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
//   }

//   if (error) {
//     return <Alert severity="error">{error}</Alert>;
//   }

//   // Content to display based on current route
//   const renderContent = () => {
//     if (path.includes('/edit')) {
//       return <EditProfileForm userProfile={userProfile} onUpdate={handleProfileUpdate} />;
//     } else if (path.includes('/contributions')) {
//       return <ContributionHistory />;
//     } else {
//       return <ProfileDetails profile={userProfile} />;
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>My Profile</Typography>
      
//       <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//         <Tabs 
//           value={activeTab} 
//           onChange={handleTabChange}
//         >
//           <Tab label="Profile Details" />
//           <Tab label="Donation History" />
//         </Tabs>
//       </Box>

//       {renderContent()}
//     </Box>
//   );
// };

// export default MainProfile;

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress, Alert, Paper, Button } from '@mui/material';
import axios from 'axios';
import ProfileDetails from './ProfileDetails';
import EditProfileForm from './EditProfileForm';
import { useNavigate, useLocation } from 'react-router-dom';

const MainProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // API URL with fallback
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // Determine active tab based on current URL
  const path = location.pathname;
  const activeTab = path.includes('/contributions') ? 1 : 0;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try multiple token locations for better compatibility
      const token = localStorage.getItem('authToken') || 
                   localStorage.getItem('token') || 
                   sessionStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.data) {
        throw new Error('No profile data received');
      }
      
      setUserProfile(response.data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      });
      // More descriptive error messages based on error type
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Profile not found. Please complete your registration.');
      } else {
        setError(`Failed to load profile: ${err.message || 'Unknown error'}`);
      }
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate('/donor/profile');
    } else {
      navigate('/donor/profile/contributions');
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
    navigate('/donor/profile');
  };

  // Loading state with better feedback
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, gap: 2 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Loading your profile...</Typography>
      </Box>
    );
  }

  // Error state with more helpful UI
  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#fff4e5', mb: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" color="primary" onClick={fetchProfile}>
            Try Again
          </Button>
        </Box>
      </Paper>
    );
  }

  // Content to display based on current route
  const renderContent = () => {
    if (path.includes('/edit')) {
      return <EditProfileForm userProfile={userProfile} onUpdate={handleProfileUpdate} />;
    } else if (path.includes('/contributions')) {
      return <ContributionHistory />;
    } else {
      return <ProfileDetails profile={userProfile} loading={false} />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.main">
        My Profile
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Profile Details" />
        </Tabs>
      </Box>

      {renderContent()}
    </Box>
  );
};

export default MainProfile;