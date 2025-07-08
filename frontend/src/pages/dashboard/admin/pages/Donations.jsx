import React, { useState, useEffect } from 'react';
import { Box, Chip, Select, MenuItem, FormControl, InputLabel, Alert, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { CheckCircle, HourglassEmpty, Cancel, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import api from '../../../../services/api';  // Adjust path as needed
import { format } from 'date-fns'; // For formatting dates in the grid if needed

// Map for status chips
const statusMap = {
  Pending: { icon: <HourglassEmpty fontSize="small" />, color: 'warning' },
  Completed: { icon: <CheckCircle fontSize="small" />, color: 'success' },
  Expired: { icon: <Cancel fontSize="small" />, color: 'error' },
  // Add other statuses from your backend if necessary
};

// Define columns for DataGrid
const columns = [
  // Use '_id' if your backend uses MongoDB's default ID
  { field: '_id', headerName: 'ID', width: 220 },
  {
    field: 'donor', // Still refers to the donor object
    headerName: 'Donor Name',
    flex: 1.5,
    // --- CHANGE HERE: Combine firstName and lastName ---
    valueGetter: (value, row) => {
      const firstName = row.donor?.firstName;
      const lastName = row.donor?.lastName;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
      return firstName || lastName || 'Unknown Donor'; // Fallback if one is missing
    },
  }, // Assuming 'donorName' field from backend
  { field: 'foodType', headerName: 'Food Category', flex: 1 }, // Assuming 'foodCategory' field
  { field: 'quantity', headerName: 'Quantity', width: 130 },
  {
    field: 'expiryDate', // Assuming 'expiryDate' field
    headerName: 'Expiry Time',
    width: 180,
    type: 'dateTime',
    valueGetter: (value) => value ? new Date(value) : null, // Handle potential null values
    valueFormatter: (value) => value ? format(new Date(value), 'Pp') : '', // Format date nicely
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => {
      const statusInfo = statusMap[params.value] || { label: params.value, color: 'default' };
      return <Chip icon={statusInfo.icon} label={params.value} color={statusInfo.color} size="small" variant="outlined" />;
    },
  },
  // Add more columns based on your backend data (e.g., assignedVolunteer, pickupTime, etc.)
];

function Donations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Note: Filtering is handled by GridToolbar's quick filter for now.
  // Server-side filtering would require more state and API changes.

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust endpoint if needed
        const response = await api.get('/admin/donations');
        // Assuming response.data is an array of donation objects
        // Ensure each object has a unique '_id' or 'id' field
        setRows(response.data || []);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError(err.response?.data?.message || 'Failed to load donations.');
        setRows([]); // Clear rows on error
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []); // Fetch data on component mount

  return (
    <Box sx={{ height: 650, width: '100%' }}>
      <Typography variant="h6" gutterBottom>Manage Donations</Typography>

      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* DataGrid handles its own loading overlay */}
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading} // Pass loading state to DataGrid
        getRowId={(row) => row._id} // Specify the unique ID field from your backend data
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'expiryDate', sort: 'asc' }] }, // Adjust field name if needed
        }}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true, // Enable quick filtering
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
            // Styling adjustments if needed
            '& .MuiDataGrid-root': {
                border: 1,
                borderColor: 'divider',
            },
            '& .MuiDataGrid-cell': {
                borderBottom: 1,
                borderColor: 'divider',
            },
            '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'grey.100',
                borderBottom: 1,
                borderColor: 'divider',
            },
        }}
      />
    </Box>
  );
}

export default Donations;