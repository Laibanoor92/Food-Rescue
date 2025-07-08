
// import React from 'react';
// import { Box, Button, Chip } from '@mui/material';
// import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
// import { CheckCircle, Cancel, Block, VerifiedUser, HourglassEmpty } from '@mui/icons-material';

// // Placeholder data
// const rows = [
//   { id: 1, name: 'Good Foods Market', type: 'Grocery Store', location: 'Downtown', contributions: 55, status: 'Approved' },
//   { id: 2, 'name': 'City Bakery', type: 'Restaurant', location: 'Uptown', contributions: 30, status: 'Pending' },
//   { id: 3, 'name': 'Community Shelter', type: 'Food Bank', location: 'Westside', contributions: 0, status: 'Approved' },
//   { id: 4, 'name': 'Bad Apples Inc.', type: 'Grocery Store', location: 'Eastside', contributions: 5, status: 'Banned' },
// ];

// const statusMap = {
//     Approved: { color: 'success', icon: <VerifiedUser fontSize="small" /> },
//     Pending: { color: 'warning', icon: <HourglassEmpty fontSize="small" /> },
//     Banned: { color: 'error', icon: <Block fontSize="small" /> },
//     Rejected: { color: 'default', icon: <Cancel fontSize="small" /> },
// };

// const columns = [
//   { field: 'id', headerName: 'ID', width: 80 },
//   { field: 'name', headerName: 'Name', flex: 1.5 },
//   { field: 'type', headerName: 'Type', flex: 1 },
//   { field: 'location', headerName: 'Location', flex: 1 },
//   { field: 'contributions', headerName: 'Contributions', type: 'number', width: 130 },
//   {
//     field: 'status',
//     headerName: 'Status',
//     width: 130,
//     renderCell: (params) => {
//         const statusInfo = statusMap[params.value] || {};
//         return <Chip label={params.value} color={statusInfo.color} size="small" icon={statusInfo.icon} variant="outlined" />;
//     }
//   },
//   {
//     field: 'actions',
//     type: 'actions',
//     headerName: 'Actions',
//     width: 180,
//     getActions: (params) => [
//       <GridActionsCellItem
//         icon={<CheckCircle color="success" />}
//         label="Approve"
//         onClick={() => console.log('Approve', params.id)}
//         disabled={params.row.status === 'Approved' || params.row.status === 'Banned'}
//         showInMenu={false} // Show directly in the cell
//       />,
//       <GridActionsCellItem
//         icon={<Cancel color="warning" />}
//         label="Reject"
//         onClick={() => console.log('Reject', params.id)}
//         disabled={params.row.status === 'Approved' || params.row.status === 'Banned'}
//         showInMenu={false}
//       />,
//       <GridActionsCellItem
//         icon={<Block color="error" />}
//         label={params.row.status === 'Banned' ? 'Unban' : 'Ban'}
//         onClick={() => console.log('Ban/Unban', params.id)}
//         showInMenu={false}
//       />,
//     ],
//   },
// ];

// function Users() {
//   return (
//     <Box sx={{ height: 600, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: { paginationModel: { pageSize: 10 } },
//         }}
//         pageSizeOptions={[5, 10, 25]}
//         checkboxSelection
//         disableRowSelectionOnClick
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

// export default Users;



import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Chip, Alert, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import {
    CheckCircle, Cancel, Block, VerifiedUser, HourglassEmpty, ErrorOutline as ErrorIcon
} from '@mui/icons-material';
import api from '../../../../services/api';  // Adjust path as needed

// Status map remains the same
const statusMap = {
    Approved: { color: 'success', icon: <VerifiedUser fontSize="small" /> },
    Pending: { color: 'warning', icon: <HourglassEmpty fontSize="small" /> },
    Banned: { color: 'error', icon: <Block fontSize="small" /> },
    Rejected: { color: 'default', icon: <Cancel fontSize="small" /> },
    // Add other statuses if needed
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch users function
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Adjust endpoint if needed
      const response = await api.get('/admin/users');
      // Assuming response.data is an array of user objects
      // Ensure each object has a unique '_id' or 'id' field
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || 'Failed to load users.');
      setUsers([]); // Clear users on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Action Handlers ---
  const handleUserAction = useCallback(async (action, userId, currentStatus) => {
    setSnackbar({ open: false, message: '' }); // Close previous snackbar
    let endpoint = '';
    let successMessage = '';
    let newStatus = '';

    switch (action) {
      case 'approve':
        endpoint = `/admin/users/${userId}/approve`;
        successMessage = 'User approved successfully!';
        newStatus = 'Approved';
        break;
      case 'reject':
        endpoint = `/admin/users/${userId}/reject`;
        successMessage = 'User rejected successfully!';
        newStatus = 'Rejected';
        break;
      case 'ban':
        endpoint = `/admin/users/${userId}/ban`;
        successMessage = 'User banned successfully!';
        newStatus = 'Banned';
        break;
      case 'unban':
        endpoint = `/admin/users/${userId}/unban`;
        successMessage = 'User unbanned successfully!';
        newStatus = 'Approved'; // Or 'Pending' depending on your logic
        break;
      default:
        console.error('Unknown user action:', action);
        return;
    }

    try {
      // Use PUT or POST based on your API design
      await api.put(endpoint);

      // Update local state optimistically or refetch
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
      setSnackbar({ open: true, message: successMessage, severity: 'success' });

      // Optionally refetch all users to ensure consistency:
      // fetchUsers();

    } catch (err) {
      console.error(`Error performing action ${action} on user ${userId}:`, err);
      const errMsg = err.response?.data?.message || `Failed to ${action} user.`;
      setSnackbar({ open: true, message: errMsg, severity: 'error' });
    }
  }, [fetchUsers]); // Include fetchUsers if you refetch instead of optimistic update

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Define columns with updated actions
  const columns = [
    // Use '_id' if your backend uses MongoDB's default ID
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'name', headerName: 'Name', flex: 1.5 }, // Assuming 'name' field
    { field: 'role', headerName: 'Type', flex: 1 }, // Assuming 'role' field (e.g., 'donor', 'volunteer', 'recipient')
    { field: 'address', headerName: 'Location', flex: 1, valueGetter: (value) => value?.city || 'N/A' }, // Example: Extract city from address object
    // { field: 'contributions', headerName: 'Contributions', type: 'number', width: 130 }, // Remove if not directly available, calculate if needed
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
          const statusInfo = statusMap[params.value] || { label: params.value, color: 'default' };
          return <Chip label={params.value} color={statusInfo.color} size="small" icon={statusInfo.icon} variant="outlined" />;
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,
      getActions: (params) => {
        const isApproved = params.row.status === 'Approved';
        const isBanned = params.row.status === 'Banned';
        const isPending = params.row.status === 'Pending';

        let actions = [];

        if (isPending) {
            actions.push(
                <GridActionsCellItem
                    key="approve"
                    icon={<CheckCircle color="success" />}
                    label="Approve"
                    onClick={() => handleUserAction('approve', params.id, params.row.status)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    key="reject"
                    icon={<Cancel color="warning" />}
                    label="Reject"
                    onClick={() => handleUserAction('reject', params.id, params.row.status)}
                    showInMenu={false}
                />
            );
        }

        if (!isBanned) {
             actions.push(
                <GridActionsCellItem
                    key="ban"
                    icon={<Block color="error" />}
                    label="Ban"
                    onClick={() => handleUserAction('ban', params.id, params.row.status)}
                    showInMenu={false}
                />
             );
        } else {
             actions.push(
                <GridActionsCellItem
                    key="unban"
                    icon={<VerifiedUser color="success" />} // Or a different icon for unban
                    label="Unban"
                    onClick={() => handleUserAction('unban', params.id, params.row.status)}
                    showInMenu={false}
                />
             );
        }
        return actions;
      },
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
       <Typography variant="h6" gutterBottom>Manage Users</Typography>

       {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataGrid
        rows={users}
        columns={columns}
        loading={loading} // Pass loading state
        getRowId={(row) => row._id} // Specify the unique ID field
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'name', sort: 'asc' }] }, // Adjust default sort
        }}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
         slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Users;