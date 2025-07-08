import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming api instance is configured elsewhere or passed via context/props
import {
  Grid,
  Typography,
  Box,
  Paper,
  List,
  ListItem, // Added for RequestHistoryItem
  ListItemText, // Added for RequestHistoryItem
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  colors // Assuming colors are needed from MUI
} from '@mui/material';
import {
  LocalShipping,
  AccessTime,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Restaurant
} from '@mui/icons-material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Configuration (can be moved to a central config file) ---
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CHART_COLORS = ['#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9'];

// --- API Service (Re-create or import the configured instance) ---
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add interceptor if not globally configured
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    // Basic error handling
    console.error("API Request Error:", error);
    return Promise.reject(error);
});


// --- Reusable Components (Consider moving to a 'components' directory) ---

const IncomingDonationCard = ({ donation, onAccept, onReject }) => (
  <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
       <Avatar sx={{ bgcolor: colors.green[100], color: colors.green[700] }}>
         {donation.icon || <Restaurant />}
       </Avatar>
       <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.green[800], mb: 0.5 }}>{donation.item || 'Unknown Item'}</Typography>
        <Typography variant="body1" sx={{ mb: 0.5 }}>Quantity: {donation.quantity || 'N/A'}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <AccessTime fontSize="small" sx={{ mr: 0.5 }} /> Expires: {donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : 'N/A'}
        </Typography>
        <Typography variant="caption" color="text.secondary">From: {donation.donor?.organizationName || donation.donor?.name || 'Unknown Donor'}</Typography>
       </Box>
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end', pb: 1.5, px: 2, borderTop: '1px solid #eee' }}>
      <Button size="small" variant="outlined" color="error" sx={{ borderRadius: 20 }} onClick={() => onReject(donation._id)}>Reject</Button>
      <Button size="small" variant="contained" sx={{ bgcolor: colors.green[600], '&:hover': { bgcolor: colors.green[700] }, borderRadius: 20 }} onClick={() => onAccept(donation._id)}>Accept</Button>
    </CardActions>
  </Card>
);

const TrackDelivery = ({ status }) => (
  <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', background: `linear-gradient(135deg, ${colors.green[50]} 0%, #ffffff 100%)` }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.green[800], mb: 1.5 }}>Track Delivery</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <LocalShipping sx={{ mr: 1, color: colors.green[700] }} />
      <Typography variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
        Status:&nbsp;
        <Chip
          label={status?.status || 'N/A'}
          color={status?.status === 'No Active Delivery' || !status?.status ? 'default' : 'success'}
          size="small"
          sx={{ fontWeight: 'bold', ml: 0.5 }}
        />
      </Typography>
    </Box>
    <Typography variant="body1" sx={{ mb: 0.5 }}>ETA: <strong>{status?.eta || 'N/A'}</strong></Typography>
    <Typography variant="caption" color="text.secondary">Driver: {status?.driver || 'N/A'}</Typography>
    {status?.status && status.status !== 'No Active Delivery' && (
        <Box sx={{ height: '5px', bgcolor: colors.green[200], borderRadius: '5px', mt: 2, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: status?.progress || '0%', bgcolor: colors.green[600] }} />
        </Box>
    )}
  </Paper>
);

const OverviewStats = ({ stats }) => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    <Grid item xs={6}>
      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: '100%' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.green[700] }}>{stats?.totalReceived || 0}</Typography>
        <Typography variant="body2" color="text.secondary">Total Received</Typography>
      </Paper>
    </Grid>
    <Grid item xs={6}>
      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.green[700], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stats?.mostReceivedItem || 'N/A'}</Typography>
        <Typography variant="body2" color="text.secondary">Most Received</Typography>
      </Paper>
    </Grid>
  </Grid>
);

const RequestHistoryItem = ({ request }) => {
  const getStatusChip = (status) => {
    const formattedStatus = status || 'Unknown';
    switch (formattedStatus.toLowerCase()) {
      case 'delivered': return <Chip label={formattedStatus} color="success" size="small" icon={<CheckCircle fontSize="small"/>} variant="outlined" />;
      case 'accepted':
      case 'confirmed': return <Chip label={formattedStatus} color="primary" size="small" icon={<CheckCircle fontSize="small"/>} variant="outlined" />;
      case 'pending':
      case 'pending_acceptance': return <Chip label={formattedStatus} color="warning" size="small" icon={<HourglassEmpty fontSize="small"/>} variant="outlined" />;
      case 'cancelled':
      case 'rejected':
      case 'rejected_by_recipient': return <Chip label={formattedStatus} color="error" size="small" icon={<Cancel fontSize="small"/>} variant="outlined" />;
      default: return <Chip label={formattedStatus} size="small" variant="outlined" />;
    }
  };
  return (
    <ListItem divider sx={{ py: 1.5, '&:last-child': { borderBottom: 0 } }}>
      <ListItemText
        primaryTypographyProps={{ fontWeight: 500 }}
        primary={request.item || 'Unknown Item'}
        secondary={`Requested: ${request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'}`}
      />
      {getStatusChip(request.status)}
    </ListItem>
  );
};

const AnalyticsSection = ({ monthlyData, categoryData }) => (
  <Paper sx={{ p: 2.5, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', mb: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.green[800], mb: 2 }}>Analytics</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Typography variant="subtitle1" align="center" sx={{ mb: 1, fontWeight: 500 }}>Monthly Donations (Quantity)</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0"/>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="donations" fill={colors.green[500]} barSize={20} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography variant="subtitle1" align="center" sx={{ mb: 1, fontWeight: 500 }}>Category Distribution (Quantity)</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  </Paper>
);

// --- Dashboard Home Component ---
const DashboardHome = () => {
  // State for data
  const [incomingDonations, setIncomingDonations] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState({});
  const [overviewStats, setOverviewStats] = useState({});
  const [requestHistory, setRequestHistory] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Function ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Define endpoints specific to the main dashboard view
      const endpoints = {
        donations: '/recipient/dashboard/incoming-donations',
        delivery: '/recipient/dashboard/delivery-status',
        stats: '/recipient/dashboard/overview-stats',
        history: '/recipient/dashboard/request-history',
        monthly: '/recipient/dashboard/analytics/monthly',
        category: '/recipient/dashboard/analytics/category',
      };

      // Fetch all data concurrently
      const [
        donationsRes, deliveryRes, statsRes, historyRes, monthlyRes, categoryRes
      ] = await Promise.all([
        api.get(endpoints.donations), api.get(endpoints.delivery), api.get(endpoints.stats),
        api.get(endpoints.history), api.get(endpoints.monthly), api.get(endpoints.category),
      ]);

      // Set state with fetched data, ensuring correct types
      setIncomingDonations(Array.isArray(donationsRes.data) ? donationsRes.data : []);
      setDeliveryStatus(typeof deliveryRes.data === 'object' && deliveryRes.data !== null ? deliveryRes.data : {});
      setOverviewStats(typeof statsRes.data === 'object' && statsRes.data !== null ? statsRes.data : {});
      setRequestHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      setMonthlyData(Array.isArray(monthlyRes.data) ? monthlyRes.data : []); // Adapt based on actual API response structure
      setCategoryData(Array.isArray(categoryRes.data) ? categoryRes.data : []); // Adapt based on actual API response structure

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      let message = 'Failed to load dashboard data. Please try again later.';
      if (err.response) {
        message = `Error ${err.response.status}: ${err.response.data?.message || err.response.statusText || 'Server error'}`;
        if (err.response.status === 401) message = 'Authentication failed. Please log in again.';
        else if (err.response.status === 404) message = `Could not find API endpoint(s). Please check backend routes.`;
      } else if (err.request) message = 'Network error. Could not connect to the server.';
      else message = `An unexpected error occurred: ${err.message}`;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // --- Initial Data Fetch ---
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // --- Handle Donation Actions ---
  const handleAcceptDonation = async (donationId) => {
      console.log("Accepting donation:", donationId);
      try {
          // Use the API instance to send the request
          await api.put(`/recipient/dashboard/donations/${donationId}/accept`);
          fetchData(); // Re-fetch data to reflect changes
      } catch (err) {
          console.error("Failed to accept donation:", err);
          setError(err.response?.data?.message || "Failed to accept donation.");
      }
  };

  const handleRejectDonation = async (donationId) => {
      console.log("Rejecting donation:", donationId);
      try {
          // Use the API instance to send the request
          await api.put(`/recipient/dashboard/donations/${donationId}/reject`);
          fetchData(); // Re-fetch data to reflect changes
      } catch (err) {
          console.error("Failed to reject donation:", err);
          setError(err.response?.data?.message || "Failed to reject donation.");
      }
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 128px)' }}> {/* Adjust height based on layout */}
        <CircularProgress sx={{ color: colors.green[600] }} />
        <Typography sx={{ ml: 2 }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  // Main content rendering - No Messages or Documents sections included
  return (
    <Grid container spacing={3}>
      {/* Left Column */}
      <Grid item xs={12} lg={8}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: colors.green[800] }}>Incoming Donations</Typography>
        {incomingDonations.length > 0 ? (
          incomingDonations.map(donation => (
            <IncomingDonationCard
              key={donation._id}
              donation={donation}
              onAccept={handleAcceptDonation}
              onReject={handleRejectDonation}
            />
          ))
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', color: colors.grey[600], borderRadius: 2 }}>
            <Typography sx={{ fontStyle: 'italic' }}>No incoming donations right now.</Typography>
          </Paper>
        )}

        <Box sx={{ mt: 4 }}>
          <AnalyticsSection monthlyData={monthlyData} categoryData={categoryData} />
        </Box>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} lg={4}>
        <TrackDelivery status={deliveryStatus} />
        <OverviewStats stats={overviewStats} />

        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.green[800], mb: 1 }}>Request History</Typography>
          {requestHistory.length > 0 ? (
            <List dense sx={{ padding: 0 }}>
              {requestHistory.map(req => (
                <RequestHistoryItem key={req._id} request={req} />
              ))}
            </List>
          ) : (
            <Typography sx={{ color: colors.grey[600], fontStyle: 'italic', p: 1 }}>No request history found.</Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardHome;
