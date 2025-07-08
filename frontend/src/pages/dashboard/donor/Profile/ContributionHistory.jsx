import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { 
  CalendarToday, 
  LocalShipping, 
  Restaurant, 
  LocationOn,
  AccessTime 
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

// Helper function for status color
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'warning';
    case 'picked': return 'info';
    case 'delivered': return 'success';
    default: return 'default';
  }
};

const ContributionCard = ({ donation }) => {
  return (
    <Card sx={{ mb: 3, overflow: 'visible' }}>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <CardMedia
            component="img"
            height="160"
            image={donation.images?.[0]?.url || '/placeholder-food.jpg'}
            alt={donation.foodType}
            sx={{ objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Typography variant="h6" component="div">
                {donation.foodType}
              </Typography>
              <Chip 
                label={donation.status} 
                color={getStatusColor(donation.status)} 
                size="small"
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Restaurant fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {donation.quantity} {donation.quantityUnit}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LocationOn fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {donation.address || 'Location not specified'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(donation.createdAt), 'MMM dd, yyyy')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Expires: {format(new Date(donation.expiryDate), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            </Box>
            
            {donation.volunteerId && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Typography variant="body2" color="text.secondary">
                  Picked by: {donation.volunteerName || 'Volunteer #' + donation.volunteerId}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

const ContributionHistory = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 // At the start of your component, initialize stats with default values
const [stats, setStats] = useState({
  total: 0,
  foodWeight: 0,
  peopleFed: 0
});

// In your useEffect API call
useEffect(() => {
  const fetchContributions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/donations/my-contributions?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setContributions(response.data.donations || []);
      setTotalPages(response.data.totalPages || 1);
      
      // Safely set stats with fallbacks
      if (response.data.stats) {
        setStats({
          total: response.data.stats.total || 0,
          foodWeight: response.data.stats.foodWeight || 0,
          peopleFed: response.data.stats.peopleFed || 0
        });
      }
    } catch (err) {
      setError('Failed to load contribution history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchContributions();
}, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading && page === 1) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.default', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Contribution Impact</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="primary">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Donations</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="primary">{stats.foodWeight} kg</Typography>
              <Typography variant="body2" color="text.secondary">Food Rescued</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="primary">{stats.peopleFed}</Typography>
              <Typography variant="body2" color="text.secondary">People Fed</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" sx={{ mb: 3 }}>Your Donations</Typography>
      
      {contributions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">You haven't made any donations yet.</Typography>
        </Paper>
      ) : (
        <>
          {contributions.map((donation) => (
            <ContributionCard key={donation._id} donation={donation} />
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ContributionHistory;