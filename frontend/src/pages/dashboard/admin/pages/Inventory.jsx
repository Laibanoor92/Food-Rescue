


// import React, { useState, useEffect, useCallback } from 'react';
// import { Grid, Card, CardContent, Typography, Box, Chip, CircularProgress, Alert } from '@mui/material';
// import { AccessTime, ErrorOutline as ErrorIcon } from '@mui/icons-material';
// import api from '../../../../services/api';  // Adjust path as needed

// // Function to calculate time difference (remains the same)
// const getTimeLeft = (expiryDate) => {
//   if (!expiryDate) return { total: -1, days: 0, hours: 0, minutes: 0, seconds: 0 }; // Handle null/undefined expiry
//   const total = Date.parse(expiryDate) - Date.parse(new Date());
//   const seconds = Math.floor((total / 1000) % 60);
//   const minutes = Math.floor((total / 1000 / 60) % 60);
//   const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
//   const days = Math.floor(total / (1000 * 60 * 60 * 24));
//   return { total, days, hours, minutes, seconds };
// };

// // Function to format time left (remains the same)
// const formatTimeLeft = (timeLeft) => {
//   if (!timeLeft || timeLeft.total < 0) return 'Expired';
//   if (timeLeft.days > 0) return `${timeLeft.days}d ${timeLeft.hours}h`;
//   if (timeLeft.hours > 0) return `${timeLeft.hours}h ${timeLeft.minutes}m`;
//   if (timeLeft.minutes > 0) return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
//   return `${timeLeft.seconds}s`;
// };

// // Function to get chip color (remains the same)
// const getChipColor = (timeLeft) => {
//   if (!timeLeft || timeLeft.total < 0) return "default"; // Or 'error' if you prefer for expired
//   if (timeLeft.hours < 1 && timeLeft.days === 0) return "error";
//   if (timeLeft.hours < 4 && timeLeft.days === 0) return "warning";
//   return "success";
// };

// function Inventory() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch initial inventory data
//   const fetchInventory = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Adjust endpoint if needed, e.g., '/admin/inventory/live' or '/donations?status=Pending'
//       const response = await api.get('/admin/inventory/live');
//       // Assuming response.data is an array of items with an 'expiryDate' field
//       const fetchedItems = response.data || [];

//       // Calculate initial timeLeft and filter out already expired items (optional, backend might do this)
//       const processedItems = fetchedItems
//         .map(item => ({
//           ...item,
//           // Ensure you use the correct expiry field name from your backend (e.g., expiryDate)
//           timeLeft: getTimeLeft(item.expiryDate)
//         }))
//         .filter(item => item.timeLeft.total > 0); // Only keep items not yet expired

//       setItems(processedItems);
//     } catch (err) {
//       console.error("Error fetching inventory:", err);
//       setError(err.response?.data?.message || 'Failed to load live inventory.');
//       setItems([]); // Clear items on error
//     } finally {
//       setLoading(false);
//     }
//   }, []); // Empty dependency array means this runs once on mount

//   // Effect for initial fetch
//   useEffect(() => {
//     fetchInventory();
//   }, [fetchInventory]);

//   // Effect for countdown timer (updates timeLeft and filters expired items)
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setItems(prevItems =>
//         prevItems
//           .map(item => ({
//             ...item,
//             // Ensure you use the correct expiry field name
//             timeLeft: getTimeLeft(item.expiryDate)
//           }))
//           .filter(item => item.timeLeft.total > 0) // Remove items as they expire
//       );
//     }, 1000); // Update every second

//     return () => clearInterval(timer); // Cleanup timer on unmount
//   }, []); // Empty dependency array, runs once and cleans up

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>Live Inventory</Typography>

//       {error && (
//         <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
//           <CircularProgress />
//           <Typography ml={2}>Loading inventory...</Typography>
//         </Box>
//       ) : (
//         <Grid container spacing={3}>
//           {items.length > 0 ? items
//             .sort((a, b) => a.timeLeft.total - b.timeLeft.total) // Sort by soonest expiry
//             .map((item) => (
//               // Use backend ID field (e.g., item._id)
//               <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
//                 <Card variant="outlined">
//                   <CardContent>
//                     <Typography variant="h6" component="div" gutterBottom>
//                       {/* Use backend field name (e.g., item.foodItemName) */}
//                       {item.foodItemName || 'Unnamed Item'}
//                     </Typography>
//                     <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                       {/* Use backend field name (e.g., item.donorName) */}
//                       From: {item.donorName || 'Unknown Donor'}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mb: 1 }}>
//                       {/* Use backend field name */}
//                       Quantity: {item.quantity || 'N/A'}
//                     </Typography>
//                     <Chip
//                       icon={<AccessTime fontSize="small" />}
//                       label={`Expires in: ${formatTimeLeft(item.timeLeft)}`}
//                       color={getChipColor(item.timeLeft)}
//                       size="small"
//                     />
//                   </CardContent>
//                 </Card>
//               </Grid>
//             )) : (
//               <Grid item xs={12}>
//                 <Typography sx={{ textAlign: 'center', mt: 4 }}>
//                   No available items in inventory currently.
//                 </Typography>
//               </Grid>
//             )}
//         </Grid>
//       )}
//       {/* Optional Map Placeholder */}
//       {/* ... */}
//     </Box>
//   );
// }

// export default Inventory;


import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Alert, Chip } from '@mui/material';
import { AccessTime, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import api from '../../../../services/api';  // Adjust path as needed
import { formatDistanceToNowStrict, differenceInMilliseconds } from 'date-fns';

// Helper function to calculate time left and determine urgency
const getTimeLeft = (expiryDate) => {
  if (!expiryDate) return { text: 'No expiry', total: Infinity, urgency: 'low' };
  const now = new Date();
  const expiry = new Date(expiryDate);
  const totalMs = differenceInMilliseconds(expiry, now);

  if (totalMs <= 0) {
    return { text: 'Expired', total: totalMs, urgency: 'expired' };
  }

  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  let urgency = 'low';
  if (days < 1) urgency = 'high'; // Less than 1 day
  else if (days < 3) urgency = 'medium'; // Less than 3 days

  return {
    text: formatDistanceToNowStrict(expiry, { addSuffix: true }),
    total: totalMs,
    urgency: urgency,
  };
};

// Map urgency to chip colors
const urgencyColors = {
  high: 'error',
  medium: 'warning',
  low: 'success',
  expired: 'default'
};

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Adjust endpoint if needed
      const response = await api.get('/admin/inventory/live');
      const fetchedItems = response.data || [];

      // Process items: calculate time left and filter out expired ones *before* setting state
      const processedItems = fetchedItems
        .map(item => ({
          ...item,
          timeLeft: getTimeLeft(item.expiryDate) // Calculate time left
        }))
        .filter(item => item.timeLeft.total > 0) // Keep only items not yet expired
        .sort((a, b) => a.timeLeft.total - b.timeLeft.total); // Sort by soonest expiry

      setItems(processedItems);

    } catch (err) {
      console.error("Error fetching live inventory:", err);
      setError(err.response?.data?.message || 'Failed to load inventory.');
      setItems([]); // Clear items on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    // Optional: Set up polling to refresh inventory periodically
    // const intervalId = setInterval(fetchInventory, 30000); // Refresh every 30 seconds
    // return () => clearInterval(intervalId);
  }, [fetchInventory]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Live Inventory (Pending Donations)</Typography>

      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          No pending inventory items found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {/* --- FIX 1: Use foodCategory --- */}
                      {item.foodCategory || 'Unknown Item'}
                    </Typography>
                    <Chip
                      icon={<AccessTime fontSize="small" />}
                      label={item.timeLeft.text}
                      color={urgencyColors[item.timeLeft.urgency]}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {/* --- FIX 2: Use item.donor.name --- */}
                    Donor: {item.donor?.name || 'Unknown Donor'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity || 'N/A'}
                  </Typography>
                  {/* Add other relevant details like pickup location if available */}
                  {/* e.g., <Typography variant="body2" color="text.secondary">Location: {item.pickupAddress?.street || 'N/A'}</Typography> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Inventory;
