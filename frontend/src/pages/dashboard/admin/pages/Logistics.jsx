// // filepath: src/pages/admin/Logistics.jsx
// import React from 'react';
// import { Box, Chip } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { PendingActions, LocalShipping, CheckCircle, Person } from '@mui/icons-material';

// // Placeholder data
// const rows = [
//   { id: 201, pickup: 'Good Foods Market', drop: 'Community Shelter', status: 'Assigned', driver: 'John Doe' },
//   { id: 202, pickup: 'City Bakery', drop: 'Downtown Soup Kitchen', status: 'En Route', driver: 'Jane Smith' },
//   { id: 203, pickup: 'Corner Cafe', drop: 'Northside Food Bank', status: 'Delivered', driver: 'John Doe' },
//   { id: 204, pickup: 'Warehouse A', drop: 'Community Shelter', status: 'Assigned', driver: 'Unassigned' },
// ];

//  const statusMap = {
//   Assigned: { icon: <PendingActions fontSize="small" />, color: 'info' },
//   'En Route': { icon: <LocalShipping fontSize="small" />, color: 'warning' },
//   Delivered: { icon: <CheckCircle fontSize="small" />, color: 'success' },
// };

// const columns = [
//   { field: 'id', headerName: 'Delivery ID', width: 120 },
//   { field: 'pickup', headerName: 'Pickup Location', flex: 1.5 },
//   { field: 'drop', headerName: 'Drop-off Location', flex: 1.5 },
//   {
//     field: 'status',
//     headerName: 'Status',
//     width: 150,
//      renderCell: (params) => {
//       const statusInfo = statusMap[params.value] || {};
//       return <Chip icon={statusInfo.icon} label={params.value} color={statusInfo.color} size="small" variant="outlined" />;
//     },
//   },
//   {
//     field: 'driver',
//     headerName: 'Driver',
//     flex: 1,
//     renderCell: (params) => (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {params.value !== 'Unassigned' && <Person sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />}
//             {params.value}
//         </Box>
//     )
//   },
// ];

// function Logistics() {
//   return (
//     <Box sx={{ height: 600, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: { paginationModel: { pageSize: 10 } },
//         }}
//         pageSizeOptions={[5, 10, 25]}
//         slots={{ toolbar: GridToolbar }}
//          slotProps={{
//           toolbar: {
//             showQuickFilter: true,
//           },
//         }}
//       />
//     </Box>
//   );
// }

// export default Logistics;

import React, { useState, useEffect } from 'react';
import { Box, Chip, Typography, Alert, Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    DirectionsRun, // In Progress
    AssignmentInd, // Assigned
    CheckCircle,   // Completed (might not show here often)
    ErrorOutline as ErrorIcon,
    MapOutlined as MapIcon // Placeholder for map
} from '@mui/icons-material';
import api from '../../../../services/api';  // Adjust path as needed
import { format } from 'date-fns'; // For formatting dates

// Map for status chips
const statusMap = {
  Assigned: { icon: <AssignmentInd fontSize="small" />, color: 'info' },
  InProgress: { icon: <DirectionsRun fontSize="small" />, color: 'warning' },
  Completed: { icon: <CheckCircle fontSize="small" />, color: 'success' },
  // Add other relevant statuses like 'Pending Pickup', 'En Route', etc.
};

// Format time window safely
const formatTimeWindow = (start, end) => {
    if (!start || !end) return 'N/A';
    try {
        return `${format(new Date(start), 'h:mm a')} - ${format(new Date(end), 'h:mm a')}`;
    } catch {
        return 'Invalid Time';
    }
};

// Define columns for DataGrid
const columns = [
  { field: '_id', headerName: 'Task ID', width: 220 },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => {
      const statusInfo = statusMap[params.value] || { label: params.value, color: 'default' };
      return <Chip icon={statusInfo.icon} label={params.value} color={statusInfo.color} size="small" variant="outlined" />;
    },
  },
  { field: 'volunteerName', headerName: 'Volunteer', flex: 1 }, // Assuming 'volunteerName' field
  { field: 'donorName', headerName: 'Donor', flex: 1 }, // Assuming 'donorName' field
  { field: 'recipientName', headerName: 'Recipient', flex: 1 }, // Assuming 'recipientName' field
  {
    field: 'pickupTimeWindow',
    headerName: 'Pickup Window',
    flex: 1,
    valueGetter: (value) => value ? formatTimeWindow(value.start, value.end) : 'N/A',
  },
  {
    field: 'estimatedDropoffTime', // Or actual dropoff time if available
    headerName: 'Est. Dropoff',
    width: 150,
    type: 'dateTime',
    valueGetter: (value) => value ? new Date(value) : null,
    valueFormatter: (value) => value ? format(new Date(value), 'Pp') : 'N/A',
  },
  // Add more columns: e.g., Food Category, Quantity, Current Location (if available)
];

function Logistics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust endpoint if needed, e.g., '/admin/tasks?status=Assigned,InProgress'
        const response = await api.get('/admin/logistics/active-tasks');
        // Assuming response.data is an array of active task objects
        setTasks(response.data || []);
      } catch (err) {
        console.error("Error fetching active tasks:", err);
        setError(err.response?.data?.message || 'Failed to load active tasks.');
        setTasks([]); // Clear tasks on error
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTasks();
    // Optional: Set up polling or WebSocket for real-time updates
    // const intervalId = setInterval(fetchActiveTasks, 30000); // Fetch every 30 seconds
    // return () => clearInterval(intervalId); // Cleanup interval
  }, []); // Fetch data on component mount

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Logistics Overview</Typography>

      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Active Tasks Grid */}
      <Paper sx={{ height: 400, width: '100%', mb: 3 }}>
        <Typography variant="h6" sx={{ p: 2 }}>Active Tasks</Typography>
        <DataGrid
          rows={tasks}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id} // Use the unique ID field from your backend data
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
            sorting: { sortModel: [{ field: 'pickupTimeWindow', sort: 'asc' }] }, // Adjust field if needed
          }}
          pageSizeOptions={[5, 10, 20]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{ border: 0 }} // Remove default border inside Paper
        />
      </Paper>

      {/* Map Placeholder */}
      <Paper sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px dashed', borderColor: 'divider' }}>
         <MapIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
         <Typography variant="h6" color="text.secondary">
            Live Map View (Placeholder)
         </Typography>
         <Typography color="text.secondary">
            Integration with a map library (e.g., Mapbox GL JS, Leaflet) is needed here.
         </Typography>
      </Paper>

    </Box>
  );
}

export default Logistics;