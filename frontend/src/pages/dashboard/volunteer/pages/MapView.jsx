// import React from 'react';
// // Replace Heroicons with MUI icons
// import MapIcon from '@mui/icons-material/Map';
// import LaunchIcon from '@mui/icons-material/Launch';

// const MapView = () => {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-900">Live Map View</h2>
//         <button className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//           <LaunchIcon className="h-5 w-5 mr-1.5 text-gray-500" />
//           Get Directions (Placeholder)
//         </button>
//       </div>
//       <p className="mt-2 text-gray-600 mb-4">
//         A map showing nearby task markers and your current location will be embedded here. (Integration with Google Maps or another provider needed).
//       </p>
//       {/* Placeholder for map embed */}
//       <div className="mt-4 border border-dashed border-gray-300 rounded-lg h-96 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
//         <MapIcon className="h-12 w-12 mb-2" />
//         Map Area Placeholder
//       </div>
//     </div>
//   );
// };

// export default MapView;


import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Launch as LaunchIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { Box, Typography, Paper, Stack, Button, CircularProgress, Alert, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import api from '../../../../services/api'; // Adjust path as needed

const MapView = () => {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  // const [volunteerLocation, setVolunteerLocation] = useState(null); // If you track volunteer location
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch available tasks (potentially filtered by proximity if backend supports it)
        const availableRes = await api.get('/volunteer/tasks/available');
        setAvailableTasks(availableRes.data || []);

        // Fetch upcoming/assigned tasks
        const upcomingRes = await api.get('/volunteer/tasks/upcoming');
        setUpcomingTasks(upcomingRes.data || []);

        // Optional: Fetch volunteer's current location if tracked
        // const locationRes = await apiService.get('/volunteer/location');
        // setVolunteerLocation(locationRes.data);

      } catch (err) {
        console.error("Error fetching map data:", err);
        setError(err.response?.data?.message || 'Failed to load map data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch on component mount

  // Placeholder function for directions
  const handleGetDirections = () => {
    // In a real implementation, you'd use the selected task's coordinates
    // and potentially the volunteer's location to open Google Maps/Waze etc.
    alert("Directions functionality requires map integration.");
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Live Map View</Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<LaunchIcon />}
          onClick={handleGetDirections}
        >
          Get Directions (Placeholder)
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Map showing nearby task markers and your current location. (Requires map library integration).
      </Typography>

      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
          <Typography ml={2}>Loading map data...</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            height: { xs: 300, sm: 400, md: 500 }, // Responsive height
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            bgcolor: 'grey.100',
            color: 'text.secondary',
            p: 2
          }}
        >
          <MapIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="subtitle1" gutterBottom>Map Area Placeholder</Typography>
          <Typography variant="body2">
            Map integration needed (e.g., Google Maps, Leaflet).
          </Typography>
          {/* Display fetched data counts as confirmation */}
          <Typography variant="caption" mt={2}>
            Fetched: {availableTasks.length} available tasks, {upcomingTasks.length} upcoming tasks.
            {/* {volunteerLocation && ' Volunteer location available.'} */}
          </Typography>
          {/* You could list task locations here temporarily */}
          {/* <List dense sx={{ maxWidth: 300, mt: 1 }}>
            {availableTasks.slice(0, 3).map(task => (
              <ListItem key={task._id} disablePadding>
                <ListItemIcon sx={{ minWidth: 30 }}><MapIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary={task.pickupLocation?.address || 'Unknown Address'} secondary="Available" primaryTypographyProps={{ fontSize: '0.8rem' }}/>
              </ListItem>
            ))}
             {upcomingTasks.slice(0, 2).map(task => (
              <ListItem key={task._id} disablePadding>
                <ListItemIcon sx={{ minWidth: 30 }}><MapIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary={task.pickupLocation?.address || 'Unknown Address'} secondary="Upcoming" primaryTypographyProps={{ fontSize: '0.8rem' }}/>
              </ListItem>
            ))}
          </List> */}
        </Box>
      )}
    </Paper>
  );
};

export default MapView;