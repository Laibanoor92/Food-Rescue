// import React from 'react';
// import {
//   FilterListOutlined as FunnelIcon,    // replaces Heroicon FunnelIcon
//   RoomOutlined as MapPinIcon,          // replaces Heroicon MapPinIcon
//   AccessTimeOutlined as ClockIcon,     // replaces Heroicon ClockIcon
//   StarsOutlined as SparklesIcon        // replaces Heroicon SparklesIcon
// } from '@mui/icons-material';

// // Dummy Data
// const availableTasks = [
//   { id: 101, distance: '2 miles', time: 'Flexible (Today)', org: 'City Harvest', items: 'Bread, Pastries' },
//   { id: 102, distance: '5 miles', time: 'Tomorrow Morning', org: 'Local Food Bank', items: 'Canned Goods' },
// ];

// const AvailableTasks = () => {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
//           Available Tasks / Opportunities
//         </h2>
//         <button className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//           <FunnelIcon className="h-5 w-5 mr-1.5 text-gray-500" />
//           Filters (Distance, Time)
//         </button>
//       </div>
//       <p className="mt-2 text-gray-600 mb-4">
//         Unassigned tasks needing volunteers will appear here. Claim a task that fits your schedule and location.
//       </p>
//       {/* Placeholder for task list */}
//       <div className="space-y-4">
//         {availableTasks.map(task => (
//           <div key={task.id} className="border border-gray-200 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:border-primary transition-colors duration-150">
//             <div>
//               <p className="font-medium text-gray-800">
//                 {task.items} for {task.org}
//               </p>
//               <div className="flex items-center text-sm text-gray-500 mt-1">
//                 <MapPinIcon className="h-4 w-4 mr-1" /> {task.distance} away
//                 <ClockIcon className="h-4 w-4 ml-3 mr-1" /> {task.time}
//               </div>
//             </div>
//             <button className="mt-3 sm:mt-0 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
//               <SparklesIcon className="h-4 w-4 mr-1.5" />
//               Claim Task
//             </button>
//           </div>
//         ))}
//         {availableTasks.length === 0 && (
//           <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
//             No available tasks match your current filters.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvailableTasks;


import React, { useState, useEffect } from 'react';
import {
  FilterListOutlined as FunnelIcon,
  RoomOutlined as MapPinIcon,
  AccessTimeOutlined as ClockIcon,
  StarsOutlined as SparklesIcon,
  ErrorOutline as ErrorIcon,
  HourglassEmpty as LoadingIcon, // Or use a CircularProgress from MUI
} from '@mui/icons-material';
import { CircularProgress, Alert, Button, Box, Typography, Paper, Stack, Chip } from '@mui/material'; // Import MUI components
 import api from '../../../../services/api';// Adjust the path to your API service
import { format } from 'date-fns'; // For formatting dates

const AvailableTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimingTaskId, setClaimingTaskId] = useState(null); // Track which task is being claimed

  const fetchAvailableTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/volunteer/tasks/available'); // Use your API service
      setTasks(response.data || []); // Assuming the data is in response.data
    } catch (err) {
      console.error("Error fetching available tasks:", err);
      setError(err.response?.data?.message || 'Failed to load available tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableTasks();
  }, []); // Fetch tasks on component mount

  const handleClaimTask = async (taskId) => {
    setClaimingTaskId(taskId); // Indicate loading for this specific task
    setError(null); // Clear previous errors
    try {
      await api.patch(`/volunteer/tasks/${taskId}/claim`);
      // Refetch the list to remove the claimed task
      await fetchAvailableTasks();
      // Optionally show a success message
    } catch (err) {
      console.error(`Error claiming task ${taskId}:`, err);
      setError(err.response?.data?.message || `Failed to claim task ${taskId}. It might have been claimed already.`);
    } finally {
      setClaimingTaskId(null); // Reset loading state for this task
    }
  };

  // Helper to format time windows
  const formatTimeWindow = (start, end) => {
    if (!start || !end) return 'Time not specified';
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      // Example format: "Apr 23, 10:00 AM - 12:00 PM"
      return `${format(startDate, 'MMM d, h:mm a')} - ${format(endDate, 'h:mm a')}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid time';
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2}>
        <Typography variant="h6" gutterBottom sx={{ mb: { xs: 1, sm: 0 } }}>
          Available Tasks / Opportunities
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FunnelIcon />}
          sx={{ color: 'text.secondary', borderColor: 'grey.400' }}
        >
          Filters {/* Add filter functionality later */}
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Unassigned tasks needing volunteers will appear here. Claim a task that fits your schedule and location.
      </Typography>

      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
          <CircularProgress />
          <Typography ml={2}>Loading available tasks...</Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {tasks.length > 0 ? tasks.map(task => (
            <Paper
              key={task._id} // Use _id from MongoDB
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                '&:hover': { borderColor: 'primary.main' },
                transition: 'border-color 0.2s'
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {/* Display relevant info like items/category and donor */}
                  {task.foodCategory || 'Items'} from {task.donorName || 'Donor'}
                </Typography>
                <Stack direction="row" spacing={2} mt={1} alignItems="center" flexWrap="wrap">
                   {/* Display pickup location - adjust based on your data */}
                  <Chip
                    icon={<MapPinIcon fontSize="small" />}
                    label={task.pickupLocation?.address || 'Location unspecified'}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                  />
                  <Chip
                    icon={<ClockIcon fontSize="small" />}
                    label={formatTimeWindow(task.pickupTimeWindow?.start, task.pickupTimeWindow?.end)}
                    size="small"
                    variant="outlined"
                    sx={{ mb: { xs: 1, sm: 0 } }}
                  />
                   {/* Optionally add quantity or other details */}
                   {task.quantity && <Chip label={`Qty: ${task.quantity}`} size="small" />}
                </Stack>
              </Box>
              <Button
                variant="contained"
                size="small"
                startIcon={claimingTaskId === task._id ? <CircularProgress size={16} color="inherit" /> : <SparklesIcon />}
                onClick={() => handleClaimTask(task._id)}
                disabled={claimingTaskId === task._id || !!claimingTaskId} // Disable while any claim is in progress
                sx={{ mt: { xs: 2, sm: 0 }, minWidth: '110px' }}
              >
                {claimingTaskId === task._id ? 'Claiming...' : 'Claim Task'}
              </Button>
            </Paper>
          )) : (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderColor: 'grey.300', borderStyle: 'dashed' }}>
              <Typography color="text.secondary">
                No available tasks found at the moment. Check back later!
              </Typography>
            </Paper>
          )}
        </Stack>
      )}
    </Paper>
  );
};

export default AvailableTasks;