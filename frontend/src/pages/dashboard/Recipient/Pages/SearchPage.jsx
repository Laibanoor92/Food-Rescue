import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    Paper
} from '@mui/material';
import { Restaurant, AccessTime } from '@mui/icons-material';
 import api from '../../../../services/api'; // Adjust path to your configured Axios instance

const SearchPage = () => {
    // --- State Variables ---
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [locationFilter, setLocationFilter] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Example categories - consider fetching from backend if dynamic
    const [availableCategories, setAvailableCategories] = useState(['Produce', 'Dairy', 'Bakery', 'Canned Goods', 'Prepared Meals']);

    // --- Fetch Categories (Optional) ---
    // useEffect(() => {
    //   const fetchCategories = async () => {
    //     try {
    //       // const response = await api.get('/categories'); // Example endpoint
    //       // setAvailableCategories(response.data.map(cat => cat.name)); // Assuming API returns objects
    //     } catch (err) {
    //       console.error("Failed to fetch categories", err);
    //       // Handle error fetching categories if needed
    //     }
    //   };
    //   fetchCategories();
    // }, []);

    // --- Handle Search ---
    const handleSearch = async (e) => {
        if (e) e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError(null);
        setSearchResults([]); // Clear previous results

        try {
            console.log('Searching with:', { searchTerm, categoryFilter, locationFilter });

            // --- Actual API Call ---
            const response = await api.get('/recipient/dashboard/search', { // Ensure this endpoint exists on your backend
                params: {
                    query: searchTerm || undefined, // Send search term (or undefined if empty)
                    categories: categoryFilter.length > 0 ? categoryFilter.join(',') : undefined, // Send comma-separated string (or undefined if empty)
                    location: locationFilter || undefined, // Send location (or undefined if empty)
                    // Add other potential filters your backend supports
                    status: 'pending', // Only search for available donations
                    recipient: null    // Only search for unassigned donations
                }
            });
            setSearchResults(response.data); // Update state with data from backend
            // --- End API Call ---

        } catch (err) {
            console.error("Search failed:", err);
            setError(err.response?.data?.message || 'Failed to perform search.');
            setSearchResults([]); // Clear results on error
        } finally {
            setLoading(false);
        }
    };

    // --- Handle Requesting a Donation ---
    const handleRequestDonation = async (donationId) => {
        console.log("Requesting donation:", donationId);
        // --- TODO: Implement API call to request/accept a specific donation ---
        // This should likely call the same 'acceptDonation' endpoint used on the dashboard
        try {
            // Example using the accept endpoint structure:
            await api.post(`/recipient/donations/${donationId}/accept`); // Adjust endpoint if needed
            alert('Donation requested/accepted successfully!');
            // Optionally remove the item from search results or refresh search
            setSearchResults(prevResults => prevResults.filter(d => d._id !== donationId));
        } catch (err) {
            console.error("Failed to request donation:", err);
            alert(err.response?.data?.message || 'Failed to request donation.');
        }
        // alert(`Request functionality for ${donationId} not fully implemented.`); // Remove placeholder alert
    };

    // --- Handle Category Selection Change ---
    const handleCategoryChange = (event) => {
        const {
            target: { value },
        } = event;
        setCategoryFilter(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    // --- Render Component ---
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Search Available Donations</Typography>

            {/* Search and Filter Form */}
            <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    label="Search by item name"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: '200px' }}
                />
                <FormControl sx={{ minWidth: 150 }} size="small">
                    <InputLabel id="category-filter-label">Category</InputLabel>
                    <Select
                        labelId="category-filter-label"
                        multiple
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                        label="Category"
                        renderValue={(selected) => selected.join(', ')}
                        // MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }} // Optional: limit dropdown height
                    >
                        {availableCategories.map((category) => (
                            <MenuItem key={category} value={category}>
                                <Checkbox checked={categoryFilter.indexOf(category) > -1} />
                                <ListItemText primary={category} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Location (Zip/City)"
                    variant="outlined"
                    size="small"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    sx={{ minWidth: '150px' }}
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
            </Paper>

            {/* Error Display */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Search Results */}
            <Typography variant="h6" gutterBottom>Results</Typography>
            {loading && !error && <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}

            {!loading && !error && searchResults.length === 0 && (
                <Typography sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 2 }}>
                    No donations found matching your criteria.
                </Typography>
            )}

            {!loading && !error && searchResults.length > 0 && (
                <Grid container spacing={2}>
                    {searchResults.map((donation) => (
                        <Grid item xs={12} sm={6} md={4} key={donation._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {donation.item || donation.foodType || 'Unknown Item'} {/* Adjust based on backend field name */}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {/* Adjust quantity display based on backend format */}
                                        Quantity: {typeof donation.quantity === 'string' ? donation.quantity : `${donation.quantity} ${donation.quantityUnit || 'units'}`}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} /> Expires: {donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {/* Adjust donor display based on backend data */}
                                        Donor: {donation.donor?.organizationName || donation.donor?.name || 'Unknown'}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end' }}>
                                    {/* Ensure button is disabled if donation is already requested/accepted by this user? */}
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleRequestDonation(donation._id)}
                                        // disabled={donation.status !== 'pending'} // Example: disable if not pending
                                    >
                                        Request
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default SearchPage;