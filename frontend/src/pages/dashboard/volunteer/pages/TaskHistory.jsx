// import React from 'react';
// // Use MUI icons instead of Heroicons
// import {
//   FilterListOutlined as AdjustmentsHorizontalIcon,  // replaces AdjustmentsHorizontalIcon
//   DownloadOutlined as DocumentArrowDownIcon          // replaces DocumentArrowDownIcon
// } from '@mui/icons-material';

// const TaskHistory = () => {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Task History</h2>
//         <div className="flex space-x-2">
//           <button className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//             <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1.5 text-gray-500" />
//             Filters
//           </button>
//           <button className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//             <DocumentArrowDownIcon className="h-5 w-5 mr-1.5 text-gray-500" />
//             Download Log
//           </button>
//         </div>
//       </div>
//       <p className="mt-2 text-gray-600">
//         Past completed pickups and deliveries will be listed here. You'll be able to filter by date range, organization, and location.
//       </p>
//       {/* Placeholder for table or list */}
//       <div className="mt-4 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
//         History Table/List Area
//       </div>
//     </div>
//   );
// };

// export default TaskHistory;


import React, { useState, useEffect } from 'react';
import {
  FilterListOutlined as FilterIcon,
  DownloadOutlined as DownloadIcon,
  ErrorOutline as ErrorIcon,
  CheckCircleOutline as CompletedIcon,
  CancelOutlined as CancelledIcon,
  ReportProblemOutlined as FailedIcon, // Example for Failed status
} from '@mui/icons-material';
import {
  Box, Typography, Paper, Stack, Button, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tooltip
} from '@mui/material';
import { format } from 'date-fns'; // For formatting dates
import api from '../../../../services/api'; // Adjust path as needed

// Helper function to get status chip properties
const getStatusChipProps = (status) => {
  switch (status) {
    case 'Completed':
      return { color: 'success', icon: <CompletedIcon />, label: 'Completed' };
    case 'Cancelled':
      return { color: 'default', icon: <CancelledIcon />, label: 'Cancelled' };
    case 'Failed':
      return { color: 'error', icon: <FailedIcon />, label: 'Failed' };
    default:
      return { color: 'default', label: status || 'Unknown' };
  }
};

const TaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTaskHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/volunteer/tasks/history');
      setTasks(response.data || []);
    } catch (err) {
      console.error("Error fetching task history:", err);
      setError(err.response?.data?.message || 'Failed to load task history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskHistory();
  }, []); // Fetch on component mount

  const handleDownloadLog = () => {
    // Placeholder: Implement CSV/PDF download logic here
    alert('Download functionality not yet implemented.');
    // Example: You might use a library like 'papaparse' for CSV
  };

  const handleFilter = () => {
    // Placeholder: Implement filtering UI/logic here
    alert('Filtering functionality not yet implemented.');
  };

  // Helper to format dates safely
  const formatDateSafe = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Example format: Apr 23, 2025
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid Date';
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2}>
        <Typography variant="h6" gutterBottom sx={{ mb: { xs: 1, sm: 0 } }}>
          Task History
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterIcon />}
            onClick={handleFilter}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadLog}
          >
            Download Log
          </Button>
        </Stack>
      </Stack>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Your past completed, cancelled, or failed tasks are listed below.
      </Typography>

      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
          <Typography ml={2}>Loading history...</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }} aria-label="task history table">
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell>Date Completed</TableCell>
                <TableCell>Donor</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Items (Category)</TableCell>
                <TableCell align="center">Status</TableCell>
                {/* Add more columns if needed: Duration, Notes, etc. */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length > 0 ? tasks.map((task) => {
                const statusProps = getStatusChipProps(task.status);
                return (
                  <TableRow
                    key={task._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell component="th" scope="row">
                      {/* Use actualCompletionTime or updatedAt as the date */}
                      {formatDateSafe(task.actualCompletionTime || task.updatedAt)}
                    </TableCell>
                    <TableCell>{task.donorName || 'N/A'}</TableCell>
                    <TableCell>{task.recipientName || 'N/A'}</TableCell>
                    <TableCell>{task.foodCategory || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={statusProps.label} placement="top">
                        <Chip
                          icon={statusProps.icon}
                          label={statusProps.label}
                          color={statusProps.color}
                          size="small"
                          variant="outlined"
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No task history found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default TaskHistory;