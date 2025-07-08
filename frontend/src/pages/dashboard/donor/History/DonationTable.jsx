import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  IconButton,
  CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Status color mapping
const statusColors = {
  pending: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Pending'
  },
  picked: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Picked Up'
  },
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Delivered'
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Cancelled'
  }
};

const DonationTable = ({ donations = [], loading, emptyMessage = "No donations found" }) => {
  const navigate = useNavigate();
  
  console.log('Rendering DonationTable with donations:', donations);

  const handleViewDonation = (id) => {
    console.log('View button clicked with ID:', id);
    if (!id) {
      console.error('Donation ID is missing');
      return;
    }
    
    // Make sure to include the ID parameter
    const trackingUrl = `/donor/track-donation/${id}`;
    console.log('Navigating to:', trackingUrl);
    navigate(trackingUrl);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <CircularProgress />
      </div>
    );
  }

  if (!Array.isArray(donations) || donations.length === 0) {
    return (
      <Paper className="p-6 text-center text-gray-500">
        {emptyMessage}
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table aria-label="donations table">
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="font-semibold">Donation ID</TableCell>
            <TableCell className="font-semibold">Food Type</TableCell>
            <TableCell className="font-semibold">Quantity</TableCell>
            <TableCell className="font-semibold">Status</TableCell>
            <TableCell className="font-semibold">Created Date</TableCell>
            <TableCell className="font-semibold">Expiry Date</TableCell>
            <TableCell className="font-semibold text-center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {donations.map((donation) => {
            console.log('Rendering donation:', donation._id);
            const status = statusColors[donation.status.toLowerCase()] || statusColors.pending;
            
            return (
              <TableRow key={donation._id} hover>
                <TableCell className="font-mono text-sm">
                  {donation._id.slice(-8).toUpperCase()}
                </TableCell>
                <TableCell>{donation.foodType}</TableCell>
                <TableCell>{donation.quantity} {donation.quantityUnit}</TableCell>
                <TableCell>
                  <Chip 
                    label={status.label} 
                    className={`${status.bg} ${status.text}`} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(donation.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(donation.expiryDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell align="center">
        <IconButton 
          color="primary" 
          onClick={() => {
            console.log('View button clicked for donation:', donation._id);
            handleViewDonation(donation._id);
          }}
          size="small"
        >
          <VisibilityIcon />
        </IconButton>
      </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DonationTable;