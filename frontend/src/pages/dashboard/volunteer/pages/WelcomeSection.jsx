// import React from 'react';
// // MUI Icons
// import {
//   CheckCircleOutline as CheckCircleIcon,
//   AccessTimeOutlined as ClockIcon,
//   FastfoodOutlined as GiftIcon
// } from '@mui/icons-material';

// const volunteerName = "Alex";
// // Replace these with real data fetch
// const stats = [
//   { name: 'Pickups Completed', value: '42', icon: CheckCircleIcon },
//   { name: 'Hours Volunteered', value: '128', icon: ClockIcon },
//   { name: 'Meals Rescued', value: '1,500+', icon: GiftIcon },
// ];

// const WelcomeSection = () => {
//   return (
//     <div>
//       {/* Welcome Message */}
//       <h1 className="text-2xl font-semibold text-gray-900 mb-6">
//         Welcome back, {volunteerName}!
//       </h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//          {stats.map((stat) => { 
//           const Icon = stat.icon;
//           return (
//             <div
//               key={stat.name}
//               className="overflow-hidden rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
//             >
//               <div className="flex items-center">
//                 <div className="flex-shrink-0 rounded-md bg-primary-100 p-3">
//                   <Icon className="h-6 w-6 text-primary-dark" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="truncate text-sm font-medium text-gray-500">
//                       {stat.name}
//                     </dt>
//                     <dd className="text-2xl font-semibold tracking-tight text-gray-900">
//                       {stat.value}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Quick Links / Notices */}
//       <div className="mt-8 p-6 bg-white rounded-2xl shadow-md">
//         <h2 className="text-lg font-medium text-gray-900">Quick Links</h2>
//         <p className="mt-2 text-sm text-gray-600">
//           Check upcoming tasks or view your history to keep track of your impact.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default WelcomeSection;

import React, { useState, useEffect } from 'react';
import {
  CheckCircleOutline as CheckCircleIcon,
  AccessTimeOutlined as ClockIcon,
  FastfoodOutlined as GiftIcon, // Assuming this represents meals/food
  ErrorOutline as ErrorIcon,
  Link as LinkIcon, // For quick links
} from '@mui/icons-material';
import {
  Box, Typography, Paper, Grid, Stack, CircularProgress, Alert, Avatar, Link as MuiLink, Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // For navigation links
import api from '../../../../services/api'; // Adjust path as needed

const WelcomeSection = () => {
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    pickupsCompleted: 0,
    hoursVolunteered: 0,
    mealsRescued: 0, // Adjust key based on your API response
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both profile (for name) and stats concurrently
        const [profileRes, statsRes] = await Promise.all([
          api.get('/volunteer/profile'),
          api.get('/volunteer/dashboard/stats')
        ]);

        setUserName(profileRes.data?.name || 'Volunteer'); // Fallback name
        setStats({
            pickupsCompleted: statsRes.data?.pickupsCompleted || 0,
            hoursVolunteered: statsRes.data?.hoursVolunteered || 0,
            mealsRescued: statsRes.data?.mealsRescued || 0, // Adjust key if needed
        });

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
        // Set default values even on error?
        setUserName('Volunteer');
        setStats({ pickupsCompleted: 0, hoursVolunteered: 0, mealsRescued: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch on component mount

  // Define stats structure for mapping after data is fetched
  const displayStats = [
    { name: 'Pickups Completed', value: stats.pickupsCompleted, icon: CheckCircleIcon, color: 'success.light' },
    { name: 'Hours Volunteered', value: stats.hoursVolunteered, icon: ClockIcon, color: 'info.light' },
    { name: 'Meals Rescued (Est.)', value: stats.mealsRescued, icon: GiftIcon, color: 'warning.light' }, // Adjust name/icon if needed
  ];

  return (
    <Stack spacing={3}>
      {/* Welcome Message */}
      <Typography variant="h5" component="h1" gutterBottom>
        Welcome back, {loading ? '...' : userName}!
      </Typography>

      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
          <CircularProgress />
          <Typography ml={2}>Loading stats...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayStats.map((stat) => (
            <Grid item xs={12} sm={6} md={4} key={stat.name}>
              <Paper
                elevation={2}
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 3,
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 3 }
                }}
              >
                <Avatar sx={{ bgcolor: stat.color, width: 50, height: 50, mr: 2 }}>
                  <stat.icon sx={{ color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {stat.name}
                  </Typography>
                  <Typography variant="h5" component="p" fontWeight="medium">
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Quick Links / Notices */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Quick Links</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Jump to your tasks or review your contributions.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
           <Button
              component={RouterLink} // Use RouterLink for internal navigation
              to="../upcoming" // Relative path to upcoming tasks sibling route
              variant="outlined"
              startIcon={<ClockIcon />}
            >
              Upcoming Tasks
            </Button>
            <Button
              component={RouterLink}
              to="../available" // Relative path to available tasks sibling route
              variant="outlined"
              startIcon={<GiftIcon />} // Or a different relevant icon
            >
              Available Tasks
            </Button>
           <Button
              component={RouterLink}
              to="../history" // Relative path to history sibling route
              variant="outlined"
              startIcon={<CheckCircleIcon />}
            >
              Task History
            </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default WelcomeSection;