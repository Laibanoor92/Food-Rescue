import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Alert, CircularProgress, Box } from '@mui/material';
import DonationTable from './DonationTable';
import DonationFilters from './DonationFilters';
import { donationService } from '../../../../services/api';
import { debounce } from 'lodash'; // Add this import or implement your own debounce

const DonationHistory = () => {
  const navigate = useNavigate(); // Add this line
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: null,
    endDate: null,
    search: ''
  });

  // This effect runs once on component mount
  useEffect(() => {
    fetchDonations(filters);
  }, []); 

  // Create a debounced version of fetchDonations for search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchDonations = React.useCallback(
    debounce((currentFilters) => {
      fetchDonations(currentFilters);
    }, 300),
    []
  );

  const fetchDonations = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare filter parameters using passed filters
      const params = {};
      
      if (currentFilters.status && currentFilters.status !== 'all') {
        params.status = currentFilters.status;
      }
      
      if (currentFilters.startDate) {
        try {
          params.startDate = currentFilters.startDate.toISOString();
        } catch (e) {
          console.error('Invalid start date:', currentFilters.startDate);
        }
      }
      
      if (currentFilters.endDate) {
        try {
          params.endDate = currentFilters.endDate.toISOString();
        } catch (e) {
          console.error('Invalid end date:', currentFilters.endDate);
        }
      }
      
      if (currentFilters.search) {
        params.search = currentFilters.search;
      }
      
      console.log('Fetching donations with params:', params);
      
      const response = await donationService.getDonationHistory(params);
      console.log('API response:', response);
      
      // Ensure we have an array even if API returns null
      const donationData = Array.isArray(response.data?.donations) 
        ? response.data.donations 
        : [];
        
      setDonations(donationData);
    } catch (err) {
      console.error('Error fetching donations:', err);
      
      // More detailed error message based on the response
      const errorMessage = err.response?.data?.message || 
                          'Failed to load donation history. Please try again.';
                          
      setError(errorMessage);
      setDonations([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    // Create updated filters object
    const updatedFilters = { 
      ...filters, 
      ...newFilters 
    };
    
    console.log('Applying filters:', updatedFilters);
    
    // Update state
    setFilters(updatedFilters);
    
    // Fetch with the new filters directly (avoiding race condition)
    fetchDonations(updatedFilters);
  };

  const handleSearch = (query) => {
    // Create updated filters with new search
    const updatedFilters = { 
      ...filters, 
      search: query 
    };
    
    console.log('Searching for:', query);
    
    // Update state
    setFilters(updatedFilters);
    
    // Use debounced fetch for search to prevent too many API calls
    debouncedFetchDonations(updatedFilters);
  };

  const handleViewDonation = (id) => {
    if (!id) {
      console.error('Missing donation ID for tracking');
      return;
    }
    
    console.log('Navigating to track donation with ID:', id);
    // Your navigation code here
    navigate(`/donor/track-donation/${id}`);
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        Donation History
      </Typography>
      
      {error && (
        <Alert severity="error" className="mb-4">{error}</Alert>
      )}
      
      <DonationFilters 
        onFilter={handleFilter}
        onSearch={handleSearch}
        initialFilters={filters}
      />
      
      {loading && donations.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DonationTable 
          donations={donations}
          loading={loading}
          onViewDonation={handleViewDonation}
          emptyMessage={
            filters.status !== 'all' || filters.startDate || filters.endDate || filters.search
              ? "No donations match your filters. Try adjusting your criteria."
              : "You haven't made any donations yet."
          }
        />
      )}
    </Container>
  );
};

export default DonationHistory;