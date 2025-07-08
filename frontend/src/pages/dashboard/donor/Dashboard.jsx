// import React, { useState, useEffect } from 'react';
// import { useAuth } from "../../../contexts/AuthContext";
// import axios from 'axios';
// import { 
//   Box, 
//   Typography, 
//   Grid, 
//   Paper, 
//   Divider, 
//   List, 
//   ListItem, 
//   ListItemText, 
//   ListItemIcon,
//   Chip,
//   Avatar,
//   Card,
//   CardContent
// } from '@mui/material';
// import {
//   AccessTime as TimeIcon,
//   LocationOn as LocationIcon,
//   ShoppingBasket as FoodIcon,
//   People as PeopleIcon,
//   CheckCircle as StatusIcon
// } from '@mui/icons-material';

// // Impact cards with icons
// const ImpactCard = ({ icon, title, value, subtext, color }) => (
//   <Paper elevation={2} sx={{ p: 3, height: '100%', borderTop: `4px solid ${color}` }}>
//     <Box display="flex" alignItems="center" mb={1}>
//       <Avatar sx={{ bgcolor: `${color}20`, color: color, mr: 2 }}>
//         {icon}
//       </Avatar>
//       <Typography variant="h6" color="text.secondary" fontWeight="medium">
//         {title}
//       </Typography>
//     </Box>
//     <Typography variant="h3" component="div" fontWeight="bold" color={color} mt={2}>
//       {value}
//     </Typography>
//     {subtext && (
//       <Typography variant="body2" color="text.secondary" mt={1}>
//         {subtext}
//       </Typography>
//     )}
//   </Paper>
// );

// // Status chip component
// const StatusChip = ({ status }) => {
//   let color = "default";
  
//   switch(status.toLowerCase()) {
//     case "pending":
//       color = "warning";
//       break;
//       case "picked":
//         color = "info";
//         break;
//     case "delivered":
//       color = "success";
//       break;
//     case "cancelled":
//       color = "error";
//       break;
//     default:
//       color = "default";
//   }
  
//   return (
//     <Chip 
//       label={status} 
//       color={color} 
//       size="small" 
//       variant={color === "default" ? "outlined" : "filled"}
//     />
//   );
// };

// const DonorDashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState({
//     mealsSaved: 0,
//     totalKg: 0,
//     totalDonations: 0,
//     co2Saved: 0
//   });
//   const [recentDonations, setRecentDonations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Inspirational quotes to rotate
//   const quotes = [
//     "Every meal saved is a life touched.",
//     "Small actions create big change.",
//     "Your generosity feeds hope.",
//     "Sharing food is sharing love."
//   ];
  
//   const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         const token = localStorage.getItem('authToken') || 
//         localStorage.getItem('token') || 
//         sessionStorage.getItem('authToken');

//         console.log("Token being sent:", token ? `${token.substring(0, 15)}...` : "No token found");

//         if (!token) {
//           throw new Error("Authentication token not found. Please log in again.");
//         }
        
//         // Get dashboard stats
//         const statsResponse = await axios.get('http://localhost:5000/api/donations/stats', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         // Get recent donations
//         const donationsResponse = await axios.get('http://localhost:5000/api/donations/recent', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         setStats(statsResponse.data);
//         setRecentDonations(donationsResponse.data);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchDashboardData();
//   }, []);

//   // Calculate CO2 saved (approx 2.5kg CO2 per kg food waste)
//   const co2Saved = (stats.totalKg * 2.5).toFixed(1);

//   return (
    
//     <Box sx={{ p: 3 , width: '100%', maxWidth: '100%'  }}>
//       {/* Welcome Section */}
//       <Paper 
//         elevation={0} 
//         sx={{ 
//           p: 4, 
//           mb: 4, 
//           borderRadius: 2,
//           background: 'linear-gradient(135deg, #f6feff 0%, #f0f7ea 100%)',
//           border: '1px solid #e0e7d5'
//         }}
//       >
//         <Typography variant="h4" color="primary.dark" gutterBottom fontWeight="bold">
//           Hey {user?.name || 'there'}, you're making a difference! 🌍
//         </Typography>
//         <Typography variant="subtitle1" color="text.secondary">
//           {randomQuote}
//         </Typography>
//       </Paper>

//       {/* Impact Stats Section */}
//       <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#2e7d32" }}>
//         Your Impact
//       </Typography>
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <ImpactCard 
//             icon={<FoodIcon />}
//             title="Meals Saved"
//             value={stats.mealsSaved}
//             subtext="Estimated meals provided"
//             color="#2e7d32" // green
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <ImpactCard 
//             icon={<TimeIcon />}
//             title="Total Donated"
//             value={`${stats.totalKg} kg`}
//             subtext="Food rescued from waste"
//             color="#1976d2" // blue
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <ImpactCard 
//             icon={<PeopleIcon />}
//             title="Donations"
//             value={stats.totalDonations}
//             subtext="Total donation events"
//             color="#ed6c02" // orange
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <ImpactCard 
//             icon={<div style={{ fontSize: '18px' }}>CO₂</div>}
//             title="CO₂ Saved"
//             value={`${co2Saved} kg`}
//             subtext="Environmental impact"
//             color="#9c27b0" // purple
//           />
//         </Grid>
//       </Grid>

//       {/* Recent Donations Section */}
//       <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#2e7d32" }}>
//         Recent Donations
//       </Typography>
      
//       {recentDonations.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9f9f9' }}>
//           <Typography variant="subtitle1" color="text.secondary">
//             No donations yet. Start making an impact by creating your first donation!
//           </Typography>
//         </Paper>
//       ) : (
//         <List sx={{ bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
//           {recentDonations.map((donation, index) => (
//             <React.Fragment key={donation.id || index}>
//               {index > 0 && <Divider variant="inset" component="li" />}
//               <ListItem alignItems="flex-start" sx={{ py: 2 }}>
//                 <Card sx={{ width: '100%', boxShadow: 'none' }}>
//                   <CardContent sx={{ pb: 1 }}>
//                     <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         {donation.foodType}
//                       </Typography>
//                       <StatusChip status={donation.status} />
//                     </Box>
                    
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <Box display="flex" alignItems="center" mt={1}>
//                           <ListItemIcon sx={{ minWidth: 36 }}>
//                             <LocationIcon color="action" fontSize="small" />
//                           </ListItemIcon>
//                           <ListItemText 
//                            primary={donation.address || "Location unavailable"}
//                             primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
//                           />
//                         </Box>
                        
//                         <Box display="flex" alignItems="center" mt={1}>
//                           <ListItemIcon sx={{ minWidth: 36 }}>
//                             <FoodIcon color="action" fontSize="small" />
//                           </ListItemIcon>
//                           <ListItemText 
//                             primary={`${donation.quantity} ${donation.quantityUnit}`}
//                             primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
//                           />
//                         </Box>
//                       </Grid>
                      
//                       <Grid item xs={12} sm={6}>
//                         <Box display="flex" alignItems="center" mt={1}>
//                           <ListItemIcon sx={{ minWidth: 36 }}>
//                             <TimeIcon color="action" fontSize="small" />
//                           </ListItemIcon>
//                           <ListItemText 
//                             primary={new Date(donation.createdAt).toLocaleDateString('en-US', { 
//                               year: 'numeric', 
//                               month: 'short', 
//                               day: 'numeric',
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             })}
//                             primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
//                           />
//                         </Box>
                        
//                         <Box display="flex" alignItems="center" mt={1}>
//                           <ListItemIcon sx={{ minWidth: 36 }}>
//                             <PeopleIcon color="action" fontSize="small" />
//                           </ListItemIcon>
//                           <ListItemText 
//                             primary={donation.recipient?.name || "Not assigned yet"}
//                             primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
//                           />
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               </ListItem>
//             </React.Fragment>
//           ))}
//         </List>
//       )}
//     </Box>
//   );
// };

// export default DonorDashboard;


import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../contexts/AuthContext";
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Chip,
  Avatar,
  Card,
  CardContent
} from '@mui/material';
import {
  AccessTime,
  LocationOn as LocationIcon,
  ShoppingBasket as FoodIcon,
  People as PeopleIcon,
  CheckCircle as StatusIcon,
  PendingActions as PendingIcon,
  LocalShipping as PickedIcon,
  DoneAll as DeliveredIcon,
  Cancel as CancelledIcon,
  Restaurant as MealsIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Impact cards with icons
const ImpactCard = ({ icon, title, value, subtext, color }) => (
  <Paper elevation={2} sx={{ p: 3, height: '100%', borderTop: `4px solid ${color}` }}>
    <Box display="flex" alignItems="center" mb={1}>
      <Avatar sx={{ bgcolor: `${color}20`, color: color, mr: 2 }}>
        {icon}
      </Avatar>
      <Typography variant="h6" color="text.secondary" fontWeight="medium">
        {title}
      </Typography>
    </Box>
    <Typography variant="h3" component="div" fontWeight="bold" color={color} mt={2}>
      {value}
    </Typography>
    {subtext && (
      <Typography variant="body2" color="text.secondary" mt={1}>
        {subtext}
      </Typography>
    )}
  </Paper>
);

// Status chip component
const StatusChip = ({ status }) => {
  let color = "default";
  
  switch(status.toLowerCase()) {
    case "pending":
      color = "warning";
      break;
    case "picked":
      color = "info";
      break;
    case "delivered":
      color = "success";
      break;
    case "cancelled":
      color = "error";
      break;
    default:
      color = "default";
  }
  
  return (
    <Chip 
      label={status} 
      color={color} 
      size="small" 
      variant={color === "default" ? "outlined" : "filled"}
    />
  );
};

// Status distribution chart component
const StatusDistributionChart = ({ statusData }) => {
  const data = [
    { name: 'Pending', value: statusData.pending, color: '#ff9800' },
    { name: 'Picked', value: statusData.picked, color: '#2196f3' },
    { name: 'Delivered', value: statusData.delivered, color: '#4caf50' },
    { name: 'Cancelled', value: statusData.cancelled, color: '#f44336' },
  ].filter(item => item.value > 0);

  // If no data or all zeroes, show placeholder
  if (data.length === 0 || data.every(item => item.value === 0)) {
    return (
      <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No donation status data available yet
        </Typography>
      </Box>
    );
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5, boxShadow: 2 }}>
          <Typography variant="body2" color="text.primary" fontWeight="medium">
            {payload[0].name}: {payload[0].value}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const DonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    mealsSaved: 0,
    totalKg: 0,
    totalDonations: 0,
    co2Saved: 0,
    pending: 0,
    picked: 0,
    delivered: 0, 
    cancelled: 0
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inspirational quotes to rotate
  const quotes = [
    "Every meal saved is a life touched.",
    "Small actions create big change.",
    "Your generosity feeds hope.",
    "Sharing food is sharing love."
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('authToken') || 
        localStorage.getItem('token') || 
        sessionStorage.getItem('authToken');

        console.log("Token being sent:", token ? `${token.substring(0, 15)}...` : "No token found");

        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }
        
        // Get dashboard stats
        const statsResponse = await axios.get('http://localhost:5000/api/donations/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get recent donations
        const donationsResponse = await axios.get('http://localhost:5000/api/donations/recent', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Calculate CO2 saved (approx 2.5kg CO2 per kg food waste)
        const co2Saved = (statsResponse.data.totalKg * 2.5).toFixed(1);
        
        setStats({
          ...statsResponse.data,
          co2Saved: parseFloat(co2Saved)
        });
        setRecentDonations(donationsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Get completion percentage
  const totalStatusCount = stats.pending + stats.picked + stats.delivered + stats.cancelled;
  const completionPercentage = totalStatusCount > 0 
    ? Math.round((stats.delivered / totalStatusCount) * 100) 
    : 0;

  return (
    <Box sx={{ p: 3 , width: '100%', maxWidth: '100%'  }}>
      {/* Welcome Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f6feff 0%, #f0f7ea 100%)',
          border: '1px solid #e0e7d5'
        }}
      >
        <Typography variant="h4" color="primary.dark" gutterBottom fontWeight="bold">
          Hey {user?.name || 'there'}, you're making a difference! 🌍
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {randomQuote}
        </Typography>
      </Paper>

      {/* Impact Stats Section */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#2e7d32" }}>
        Your Impact
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ImpactCard 
            icon={<MealsIcon />}
            title="Meals Saved"
            value={stats.mealsSaved}
            subtext="Estimated meals provided"
            color="#2e7d32" // green
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ImpactCard 
            icon={<FoodIcon />}
            title="Total Donated"
            value={`${stats.totalKg} kg`}
            subtext="Food rescued from waste"
            color="#1976d2" // blue
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ImpactCard 
            icon={<PeopleIcon />}
            title="Donations"
            value={stats.totalDonations}
            subtext="Total donation events"
            color="#ed6c02" // orange
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ImpactCard 
            icon={<div style={{ fontSize: '18px' }}>CO₂</div>}
            title="CO₂ Saved"
            value={`${stats.co2Saved} kg`}
            subtext="Environmental impact"
            color="#9c27b0" // purple
          />
        </Grid>
      </Grid>

      {/* Status Distribution Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="medium" color="text.secondary">
              Donation Status Distribution
            </Typography>
            <StatusDistributionChart statusData={stats} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="medium" color="text.secondary">
              Status Breakdown
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: '#ff980020', color: '#ff9800', mr: 2, width: 32, height: 32 }}>
                      <PendingIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pending
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {stats.pending}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: '#2196f320', color: '#2196f3', mr: 2, width: 32, height: 32 }}>
                      <PickedIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Picked
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {stats.picked}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: '#4caf5020', color: '#4caf50', mr: 2, width: 32, height: 32 }}>
                      <DeliveredIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Delivered
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {stats.delivered}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: '#f4433620', color: '#f44336', mr: 2, width: 32, height: 32 }}>
                      <CancelledIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Cancelled
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {stats.cancelled}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, borderTop: '1px solid #eee', pt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Completion Rate
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <Box sx={{ 
                      width: '100%', 
                      height: 6, 
                      bgcolor: '#f0f0f0', 
                      borderRadius: 5,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        width: `${completionPercentage}%`, 
                        height: '100%', 
                        bgcolor: '#4caf50',
                        borderRadius: 5
                      }} />
                    </Box>
                  </Box>
                  <Typography variant="body1" fontWeight="bold" color="#4caf50">
                    {completionPercentage}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Donations Section */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#2e7d32" }}>
        Recent Donations
      </Typography>
      
      {recentDonations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9f9f9' }}>
          <Typography variant="subtitle1" color="text.secondary">
            No donations yet. Start making an impact by creating your first donation!
          </Typography>
        </Paper>
      ) : (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
          {recentDonations.map((donation, index) => (
            <React.Fragment key={donation.id || index}>
              {index > 0 && <Divider variant="inset" component="li" />}
              <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                <Card sx={{ width: '100%', boxShadow: 'none' }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {donation.foodType}
                      </Typography>
                      <StatusChip status={donation.status} />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mt={1}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <LocationIcon color="action" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                           primary={donation.location?.address || "Location unavailable"}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          />
                        </Box>
                        
                        <Box display="flex" alignItems="center" mt={1}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <FoodIcon color="action" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${donation.quantity} ${donation.quantityUnit}`}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          />
                        </Box>
                        
                        {donation.estimatedPeopleServed && (
                          <Box display="flex" alignItems="center" mt={1}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <MealsIcon color="action" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={`Serves approximately ${donation.estimatedPeopleServed} people`}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                            />
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mt={1}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <AccessTime color="action" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={new Date(donation.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          />
                        </Box>

                        <Box display="flex" alignItems="center" mt={1}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                       <AccessTime color="action" fontSize="small" />
                     </ListItemIcon>
                     <ListItemText 
                       primary={`Expires: ${donation.expiryDate 
                        ? new Date(donation.expiryDate).toLocaleDateString() 
                        : 'Not specified'}`}
                       primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                     />
                     </Box>

                        <Box display="flex" alignItems="center" mt={1}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <PeopleIcon color="action" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={donation.recipient?.name || "Not assigned yet"}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          />
                        </Box>
                        
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default DonorDashboard;

