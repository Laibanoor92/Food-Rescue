// import React from 'react';
// import {
//   RoomOutlined as MapPinIcon,
//   CalendarTodayOutlined as CalendarIcon,
//   AccessTimeOutlined as ClockIcon,
//   PlayArrowOutlined as PlayIcon,
//   VisibilityOutlined as EyeIcon,
//   CheckOutlined as CheckIcon
// } from '@mui/icons-material';

// // Dummy Data
// const tasks = [
//   { id: 1, date: '2025-04-21', time: '10:00 AM', pickup: 'Green Grocer', dropoff: 'Community Shelter', status: 'Assigned' },
//   { id: 2, date: '2025-04-21', time: '02:00 PM', pickup: 'Bakery Delights', dropoff: 'Downtown Soup Kitchen', status: 'In-progress' },
//   { id: 3, date: '2025-04-22', time: '09:00 AM', pickup: 'Farm Fresh Co.', dropoff: 'Northside Food Bank', status: 'Assigned' },
// ];

// const getStatusClasses = (status) => {
//   switch (status) {
//     case 'Assigned': return 'bg-blue-100 text-blue-800';
//     case 'In-progress': return 'bg-yellow-100 text-yellow-800';
//     case 'Completed': return 'bg-green-100 text-green-800';
//     default: return 'bg-gray-100 text-gray-800';
//   }
// };

// const UpcomingTasks = () => {
//   return (
//     <div>
//       <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
//       <div className="space-y-4">
//         {tasks.map((task) => (
//           <div key={task.id} className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <div className="flex items-center text-sm text-gray-500 mb-1">
//                   <CalendarIcon className="h-4 w-4 mr-1.5" /> {task.date}
//                   <ClockIcon className="h-4 w-4 ml-3 mr-1.5" /> {task.time}
//                 </div>
//                 <div className="flex items-center text-sm text-gray-700 font-medium mb-1">
//                   <MapPinIcon className="h-4 w-4 mr-1.5 text-primary" /> Pickup: {task.pickup}
//                 </div>
//                 <div className="flex items-center text-sm text-gray-700 font-medium">
//                   <MapPinIcon className="h-4 w-4 mr-1.5 text-red-500" /> Drop-off: {task.dropoff}
//                 </div>
//               </div>
//               <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col items-start sm:items-end space-y-2">
//                 <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(task.status)}`}>
//                   {task.status}
//                 </span>
//                 <div className="flex space-x-2 mt-2">
//                   {task.status === 'Assigned' && (
//                     <button className="inline-flex items-center rounded-md bg-primary px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
//                       <PlayIcon className="h-4 w-4 mr-1" /> Start
//                     </button>
//                   )}
//                   {task.status === 'In-progress' && (
//                     <button className="inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
//                       <CheckIcon className="h-4 w-4 mr-1" /> Done
//                     </button>
//                   )}
//                   <button className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//                     <EyeIcon className="h-4 w-4 mr-1" /> Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UpcomingTasks;

import React, { useState, useEffect } from 'react';
import {
  RoomOutlined as MapPinIcon,
  CalendarTodayOutlined as CalendarIcon,
  AccessTimeOutlined as ClockIcon,
  PlayArrowOutlined as PlayIcon,
  VisibilityOutlined as EyeIcon,
  CheckOutlined as CheckIcon,
  ErrorOutline as ErrorIcon,
  HourglassEmpty as AssignedIcon, // Example for Assigned
  DirectionsRun as InProgressIcon, // Example for InProgress
} from '@mui/icons-material';
import {
  Box, Typography, Paper, Stack, Button, CircularProgress, Alert, Chip, Tooltip
} from '@mui/material';
import { format } from 'date-fns'; // For formatting dates
import api from '../../../../services/api';// Adjust path as needed

// Helper function to get status chip properties
const getStatusChipProps = (status) => {
  switch (status) {
    case 'Assigned':
      return { color: 'info', icon: <AssignedIcon />, label: 'Assigned' };
    case 'InProgress':
      return { color: 'warning', icon: <InProgressIcon />, label: 'In Progress' };
    // Add other relevant statuses if needed
    default:
      return { color: 'default', label: status || 'Unknown' };
  }
};

// Helper to format time windows
const formatTimeWindow = (start, end) => {
  if (!start || !end) return 'Time not specified';
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Example format: Apr 23, 10:00 AM - 12:00 PM
    return `${format(startDate, 'MMM d, h:mm a')} - ${format(endDate, 'h:mm a')}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid time';
  }
};

const UpcomingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null); // Track which task is being updated

  const fetchUpcomingTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/volunteer/tasks/upcoming');
      setTasks(response.data || []);
    } catch (err) {
      console.error("Error fetching upcoming tasks:", err);
      setError(err.response?.data?.message || 'Failed to load upcoming tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingTasks();
  }, []); // Fetch on component mount

  const handleUpdateTaskStatus = async (taskId, action) => {
    setUpdatingTaskId(taskId);
    setError(null);
    const endpoint = `/volunteer/tasks/${taskId}/${action}`; // action is 'start' or 'complete'
    try {
      await api.patch(endpoint);
      // Refetch the list to update the task status and potentially remove completed tasks
      await fetchUpcomingTasks();
      // Optionally show a success message
    } catch (err) {
      console.error(`Error ${action}ing task ${taskId}:`, err);
      setError(err.response?.data?.message || `Failed to ${action} task ${taskId}.`);
    } finally {
      setUpdatingTaskId(null); // Reset loading state for this task
    }
  };

  const handleShowDetails = (taskId) => {
    // Placeholder: Implement logic to show task details (e.g., open a modal, navigate)
    alert(`Show details for task ${taskId} (not implemented)`);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom mb={2}>
        Upcoming Tasks
      </Typography>

      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
          <CircularProgress />
          <Typography ml={2}>Loading upcoming tasks...</Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {tasks.length > 0 ? tasks.map((task) => {
            const statusProps = getStatusChipProps(task.status);
            const isUpdating = updatingTaskId === task._id;

            return (
              <Paper
                key={task._id}
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
                {/* Task Details */}
                <Box sx={{ flexGrow: 1, mb: { xs: 2, sm: 0 }, mr: { sm: 2 } }}>
                  <Tooltip title="Pickup Time Window" placement="top">
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <ClockIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatTimeWindow(task.pickupTimeWindow?.start, task.pickupTimeWindow?.end)}
                      </Typography>
                    </Stack>
                  </Tooltip>
                  <Tooltip title="Pickup Location" placement="top">
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <MapPinIcon fontSize="small" color="primary" />
                      <Typography variant="body1" fontWeight="medium">
                        Pickup: {task.donorName || task.pickupLocation?.address || 'N/A'}
                      </Typography>
                    </Stack>
                  </Tooltip>
                   <Tooltip title="Dropoff Location" placement="top">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <MapPinIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                      <Typography variant="body1" fontWeight="medium">
                        Dropoff: {task.recipientName || task.dropoffLocation?.address || 'N/A'}
                      </Typography>
                    </Stack>
                  </Tooltip>
                  {/* Optional: Add food category/items */}
                  {task.foodCategory && (
                     <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Items: {task.foodCategory} {task.quantity ? `(${task.quantity})` : ''}
                     </Typography>
                  )}
                </Box>

                {/* Status & Actions */}
                <Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1} sx={{ minWidth: '120px' }}>
                  <Tooltip title={statusProps.label} placement="top">
                    <Chip
                      icon={statusProps.icon}
                      label={statusProps.label}
                      color={statusProps.color}
                      size="small"
                      variant="outlined"
                    />
                  </Tooltip>
                  <Stack direction="row" spacing={1} mt={1}>
                    {task.status === 'Assigned' && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : <PlayIcon />}
                        onClick={() => handleUpdateTaskStatus(task._id, 'start')}
                        disabled={isUpdating || !!updatingTaskId} // Disable while any update is in progress
                        sx={{ minWidth: '80px' }}
                      >
                        {isUpdating ? 'Starting...' : 'Start'}
                      </Button>
                    )}
                    {task.status === 'InProgress' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
                        onClick={() => handleUpdateTaskStatus(task._id, 'complete')}
                        disabled={isUpdating || !!updatingTaskId} // Disable while any update is in progress
                        sx={{ minWidth: '80px' }}
                      >
                        {isUpdating ? 'Saving...' : 'Done'}
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EyeIcon />}
                      onClick={() => handleShowDetails(task._id)}
                      disabled={isUpdating} // Disable details while updating status
                    >
                      Details
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            );
          }) : (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderColor: 'grey.300', borderStyle: 'dashed' }}>
              <Typography color="text.secondary">
                You have no upcoming tasks assigned. Check the "Available Tasks" section!
              </Typography>
            </Paper>
          )}
        </Stack>
      )}
    </Paper>
  );
};

export default UpcomingTasks;