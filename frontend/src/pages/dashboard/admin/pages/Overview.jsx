// // filepath: src/pages/admin/Overview.jsx
// import React from 'react';
// import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
// import { Bar, Pie } from 'react-chartjs-2';
// import { PeopleAlt, Restaurant, LocalShipping, Fastfood } from '@mui/icons-material';

// // Placeholder data - replace with actual data fetching
// const summaryStats = [
//   { title: 'Total Donations', value: '1,280', icon: <Restaurant color="primary" />, color: '#e3f2fd' },
//   { title: 'Active Donors', value: '150', icon: <PeopleAlt color="secondary" />, color: '#fff3e0' },
//   { title: 'Food Banks Served', value: '35', icon: <LocalShipping color="success" />, color: '#e8f5e9' },
//   { title: 'Meals Rescued (Est.)', value: '15,000+', icon: <Fastfood color="error" />, color: '#ffebee' },
// ];

// const weeklyData = {
//   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//   datasets: [
//     {
//       label: 'Donations This Week',
//       data: [65, 59, 80, 81, 56, 55, 40],
//       backgroundColor: 'rgba(75, 192, 192, 0.6)',
//       borderColor: 'rgba(75, 192, 192, 1)',
//       borderWidth: 1,
//     },
//   ],
// };

// const categoryData = {
//   labels: ['Produce', 'Bakery', 'Dairy', 'Prepared Meals', 'Other'],
//   datasets: [
//     {
//       label: 'Donation Categories',
//       data: [300, 150, 100, 200, 50],
//       backgroundColor: [
//         '#4caf50',
//         '#ff9800',
//         '#2196f3',
//         '#f44336',
//         '#9e9e9e',
//       ],
//       hoverOffset: 4,
//     },
//   ],
// };

// function Overview() {
//   return (
//     <Box>
//       <Grid container spacing={3}>
//         {/* Summary Cards */}
//         {summaryStats.map((stat, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: stat.color }}>
//               <Box sx={{ mr: 2 }}>{stat.icon}</Box>
//               <Box>
//                 <Typography variant="subtitle2" color="text.secondary">{stat.title}</Typography>
//                 <Typography variant="h5" component="div">{stat.value}</Typography>
//               </Box>
//             </Card>
//           </Grid>
//         ))}

//         {/* Weekly Donations Chart */}
//         <Grid item xs={12} md={8}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>Weekly Donations</Typography>
//               <Bar data={weeklyData} options={{ responsive: true, maintainAspectRatio: true }} />
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Donation Categories Chart */}
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>Donation Categories</Typography>
//               <Pie data={categoryData} options={{ responsive: true, maintainAspectRatio: true }} />
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// export default Overview;


import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { PeopleAlt, Restaurant, LocalShipping, Fastfood, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import api from '../../../../services/api';// Adjust path as needed

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Initial empty/default data structures
const initialSummaryStats = [
  { title: 'Total Donations', value: '0', icon: <Restaurant color="primary" />, color: '#e3f2fd' },
  { title: 'Active Donors', value: '0', icon: <PeopleAlt color="secondary" />, color: '#fff3e0' },
  { title: 'Food Banks Served', value: '0', icon: <LocalShipping color="success" />, color: '#e8f5e9' },
  { title: 'Meals Rescued (Est.)', value: '0', icon: <Fastfood color="error" />, color: '#ffebee' },
];

const initialChartData = {
  labels: [],
  datasets: [{
    label: 'Loading...',
    data: [],
    backgroundColor: 'rgba(199, 199, 199, 0.6)', // Grey color for loading state
  }],
};

const initialPieData = {
  labels: [],
  datasets: [{
    label: 'Loading...',
    data: [],
    backgroundColor: ['#cccccc'], // Grey color for loading state
    hoverOffset: 4,
  }],
};

function Overview() {
  const [summaryData, setSummaryData] = useState(initialSummaryStats);
  const [weeklyChartData, setWeeklyChartData] = useState(initialChartData);
  const [categoryChartData, setCategoryChartData] = useState(initialPieData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data concurrently
        const [summaryRes, weeklyRes, categoryRes] = await Promise.all([
          api.get('/admin/overview/summary'), // Endpoint for summary stats
          api.get('/admin/overview/weekly'),  // Endpoint for weekly donations
          api.get('/admin/overview/categories') // Endpoint for category distribution
        ]);

        // --- Process Summary Stats ---
        // Assuming summaryRes.data is an object like:
        // { totalDonations: 1280, activeDonors: 150, foodBanksServed: 35, mealsRescued: 15000 }
        const backendSummary = summaryRes.data;
        if (backendSummary) {
            setSummaryData([
                { ...initialSummaryStats[0], value: backendSummary.totalDonations?.toLocaleString() || '0' },
                { ...initialSummaryStats[1], value: backendSummary.activeDonors?.toLocaleString() || '0' },
                { ...initialSummaryStats[2], value: backendSummary.foodBanksServed?.toLocaleString() || '0' },
                { ...initialSummaryStats[3], value: backendSummary.mealsRescued?.toLocaleString() || '0' },
            ]);
        } else {
            setSummaryData(initialSummaryStats); // Reset or keep defaults if data is missing
        }


        // --- Process Weekly Data ---
        // Assuming weeklyRes.data is like: { labels: ['Mon', ...], data: [65, ...] }
        const backendWeekly = weeklyRes.data;
        if (backendWeekly && backendWeekly.labels && backendWeekly.data) {
            setWeeklyChartData({
                labels: backendWeekly.labels,
                datasets: [{
                    label: 'Donations This Week',
                    data: backendWeekly.data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            });
        } else {
            setWeeklyChartData(initialChartData); // Reset or keep defaults
        }

        // --- Process Category Data ---
        // Assuming categoryRes.data is like: { labels: ['Produce', ...], data: [300, ...] }
        const backendCategory = categoryRes.data;
         if (backendCategory && backendCategory.labels && backendCategory.data) {
            setCategoryChartData({
                labels: backendCategory.labels,
                datasets: [{
                    label: 'Donation Categories',
                    data: backendCategory.data,
                    backgroundColor: [ // Define enough colors or generate dynamically
                        '#4caf50', '#ff9800', '#2196f3', '#f44336', '#9e9e9e',
                        '#795548', '#607d8b', '#ffeb3b', '#cddc39', '#00bcd4'
                    ],
                    hoverOffset: 4,
                }],
            });
        } else {
            setCategoryChartData(initialPieData); // Reset or keep defaults
        }

      } catch (err) {
        console.error("Error fetching overview data:", err);
        setError(err.response?.data?.message || 'Failed to load overview data.');
        // Reset states on error
        setSummaryData(initialSummaryStats);
        setWeeklyChartData(initialChartData);
        setCategoryChartData(initialPieData);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []); // Fetch on component mount

  return (
    <Box>
      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Summary Cards */}
        {summaryData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: stat.color, height: '100%' }}>
              <Box sx={{ mr: 2 }}>{stat.icon}</Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{stat.title}</Typography>
                {loading ? <CircularProgress size={24} sx={{mt: 0.5}} /> : <Typography variant="h5" component="div">{stat.value}</Typography>}
              </Box>
            </Card>
          </Grid>
        ))}

        {/* Weekly Donations Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Weekly Donations</Typography>
              {loading ? (
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <CircularProgress />
                 </Box>
              ) : (
                 <Box sx={{ position: 'relative', height: { xs: '250px', sm: '300px' } }}>
                    <Bar data={weeklyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                 </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Donation Categories Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Donation Categories</Typography>
               {loading ? (
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <CircularProgress />
                 </Box>
              ) : (
                 <Box sx={{ position: 'relative', height: { xs: '250px', sm: '300px' } }}>
                    <Pie data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                 </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Overview;