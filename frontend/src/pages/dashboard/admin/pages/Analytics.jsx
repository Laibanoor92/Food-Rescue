// // filepath: src/pages/admin/Analytics.jsx
// import React from 'react';
// import { Grid, Card, CardContent, Typography, Box, TextField, Button, MenuItem } from '@mui/material';
// import { Bar } from 'react-chartjs-2';
// import { Download } from '@mui/icons-material';

// // Placeholder data
// const monthlyData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//   datasets: [
//     {
//       label: 'Meals Rescued per Month',
//       data: [1200, 1900, 3000, 5000, 2300, 3200],
//       backgroundColor: 'rgba(153, 102, 255, 0.6)',
//     },
//     {
//       label: 'Donations Received per Month',
//       data: [80, 120, 150, 210, 100, 160],
//       backgroundColor: 'rgba(255, 159, 64, 0.6)',
//     },
//   ],
// };

// function Analytics() {

//   const handleDownload = (format) => {
//     console.log(`Downloading report as ${format}...`);
//     // Add actual report generation logic here (e.g., using jsPDF, PapaParse)
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>Analytics & Reports</Typography>
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Start Date"
//                 type="date"
//                 size="small"
//                 InputLabelProps={{ shrink: true }}
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="End Date"
//                 type="date"
//                 size="small"
//                 InputLabelProps={{ shrink: true }}
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 select
//                 label="Donor Type"
//                 size="small"
//                 defaultValue="All"
//                 fullWidth
//               >
//                 <MenuItem value="All">All Donor Types</MenuItem>
//                 <MenuItem value="Restaurant">Restaurant</MenuItem>
//                 <MenuItem value="Grocery">Grocery Store</MenuItem>
//                 <MenuItem value="Other">Other</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <Button variant="outlined" startIcon={<Download />} onClick={() => handleDownload('CSV')}>
//                     Download CSV
//                 </Button>
//             </Grid>
//              <Grid item xs={12} sm={6}>
//                 <Button variant="outlined" startIcon={<Download />} onClick={() => handleDownload('PDF')}>
//                     Download PDF
//                 </Button>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>Monthly Trends</Typography>
//           <Bar data={monthlyData} options={{ responsive: true }} />
//         </CardContent>
//       </Card>

//       {/* Add more charts/tables as needed */}

//     </Box>
//   );
// }

// export default Analytics;



import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Card, CardContent, Typography, Box, TextField, Button, MenuItem, CircularProgress, Alert, Stack } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Download, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import api from '../../../../services/api'; // Adjust path as needed
import { format } from 'date-fns'; // For default dates

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Initial empty chart data structure
const initialChartData = {
  labels: [],
  datasets: [
    {
      label: 'Meals Rescued', // Adjust label based on your data
      data: [],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    },
    {
      label: 'Donations Received', // Adjust label based on your data
      data: [],
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
    },
  ],
};

// Default date range (e.g., last 30 days)
const defaultEndDate = new Date();
const defaultStartDate = new Date();
defaultStartDate.setDate(defaultEndDate.getDate() - 30);

function Analytics() {
  const [startDate, setStartDate] = useState(format(defaultStartDate, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(defaultEndDate, 'yyyy-MM-dd'));
  const [donorType, setDonorType] = useState('All');
  const [chartData, setChartData] = useState(initialChartData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch and format data
  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Example endpoint: /admin/analytics/trends
      // Pass filters as query parameters
      const response = await api.get('/admin/analytics/trends', {
        params: {
          startDate,
          endDate,
          donorType: donorType === 'All' ? undefined : donorType, // Don't send 'All'
        },
      });

      // --- Format the response data for Chart.js ---
      // This depends HEAVILY on your backend response structure.
      // Example: Assuming response.data is { labels: ['Jan', 'Feb'], meals: [100, 150], donations: [10, 15] }
      const backendData = response.data;
      if (backendData && backendData.labels && backendData.meals && backendData.donations) {
         setChartData({
            labels: backendData.labels,
            datasets: [
              {
                ...initialChartData.datasets[0], // Keep styling
                data: backendData.meals,
              },
              {
                ...initialChartData.datasets[1], // Keep styling
                data: backendData.donations,
              },
            ],
         });
      } else {
         // Handle cases where data might be missing or in unexpected format
         console.warn("Received data might be incomplete or in unexpected format:", backendData);
         setChartData(initialChartData); // Reset to empty chart
      }
      // --- End Formatting ---

    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(err.response?.data?.message || 'Failed to load analytics data.');
      setChartData(initialChartData); // Reset chart on error
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, donorType]); // Dependency array for useCallback

  // Fetch data on initial load and when filters change
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]); // Use the memoized fetch function

  const handleDownload = async (format) => {
    console.log(`Downloading report as ${format}...`);
    setError(null);
    // Option 1: Trigger backend download
    try {
        // Example: Backend endpoint generates and returns the file
        const response = await api.get('/admin/reports/download', {
            params: {
                startDate,
                endDate,
                donorType: donorType === 'All' ? undefined : donorType,
                format: format.toLowerCase(), // 'csv' or 'pdf'
            },
            responseType: 'blob', // Important for file downloads
        });

        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const filename = `report_${startDate}_to_${endDate}.${format.toLowerCase()}`;
        link.setAttribute('download', filename); // Set download filename
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (err) {
        console.error(`Error downloading ${format} report:`, err);
        setError(err.response?.data?.message || `Failed to download ${format} report.`);
        // Handle blob error if necessary (e.g., response might be JSON error)
        if (err.response?.data instanceof Blob && err.response?.data.type === "application/json") {
            try {
                const errorJson = JSON.parse(await err.response.data.text());
                setError(errorJson.message || `Failed to download ${format} report.`);
            } catch (parseError) {
                // Fallback error
            }
        }
    }

    // Option 2: Frontend generation (more complex, requires libraries like jsPDF, PapaParse)
    // Example:
    // if (format === 'CSV') { /* Use PapaParse with chartData */ }
    // if (format === 'PDF') { /* Use jsPDF with chartData and potentially chart image */ }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Analytics & Reports</Typography>

      {/* Filters Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="End Date"
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                select
                label="Donor Type"
                size="small"
                value={donorType}
                onChange={(e) => setDonorType(e.target.value)}
                fullWidth
              >
                <MenuItem value="All">All Donor Types</MenuItem>
                <MenuItem value="Restaurant">Restaurant</MenuItem>
                <MenuItem value="Grocery">Grocery Store</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                {/* Add more types if needed */}
              </TextField>
            </Grid>
            {/* Apply Filters Button - Optional, triggers fetch explicitly */}
            {/* <Grid item xs={12} md={3}>
              <Button variant="contained" onClick={fetchAnalyticsData} disabled={loading}>
                Apply Filters
              </Button>
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Chart Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Monthly Trends</Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <CircularProgress />
            </Box>
          ) : chartData.labels && chartData.labels.length > 0 ? (
            <Box sx={{ position: 'relative', height: { xs: '300px', md: '400px' } }}>
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Box>
          ) : (
             <Typography sx={{ textAlign: 'center', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No data available for the selected period.
             </Typography>
          )}
        </CardContent>
      </Card>

      {/* Download Buttons Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Download Reports</Typography>
          <Stack direction="row" spacing={2}>
             <Button variant="outlined" startIcon={<Download />} onClick={() => handleDownload('CSV')}>
                Download CSV
             </Button>
             <Button variant="outlined" startIcon={<Download />} onClick={() => handleDownload('PDF')}>
                Download PDF
             </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Add more charts/tables as needed */}

    </Box>
  );
}

export default Analytics;