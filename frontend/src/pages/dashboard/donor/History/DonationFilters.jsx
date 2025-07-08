

import React, { useState } from 'react';
import { 
  TextField, 
  MenuItem, 
  Button, 
  Box, 
  Paper, 
  Grid,
  Typography,
  InputAdornment,
  Divider
} from '@mui/material';
// Use simple HTML date inputs to avoid MUI X license issues
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const DonationFilters = ({ onFilter, onSearch }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const applyFilters = () => {
    onFilter({
      status: statusFilter,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    });
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    onFilter({
      status: 'all',
      startDate: null,
      endDate: null
    });
    onSearch('');
  };

  return (
    <Paper elevation={2} className="mb-6 overflow-hidden">
      {/* Filter Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 1.5, px: 2 }}>
        <Typography variant="subtitle1" fontWeight="medium">
          <FilterAltIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Filter Donations
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Search Bar */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <form onSubmit={handleSearchSubmit}>
          <TextField
            label="Search donations"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by ID or food type"
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ minWidth: '36px', height: '36px', ml: 1 }}
                  >
                    <SearchIcon fontSize="small" />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>
      
      <Divider />
      
      {/* Filter Controls */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Status Filter */}
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={handleStatusChange}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ bgcolor: 'white' }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="picked">Picked</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          
          {/* Date Range */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                  sx={{ bgcolor: 'white' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                  sx={{ bgcolor: 'white' }}
                />
              </Grid>
            </Grid>
          </Grid>
          
          {/* Action Buttons */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={applyFilters}
                startIcon={<FilterAltIcon />}
              >
                Apply Filters
              </Button>
              <Button 
                variant="outlined"
                onClick={clearFilters}
                startIcon={<ClearAllIcon />}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DonationFilters;