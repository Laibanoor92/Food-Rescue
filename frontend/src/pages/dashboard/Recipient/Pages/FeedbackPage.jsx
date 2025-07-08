import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Rating, Paper, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { RateReview } from '@mui/icons-material';
 import api from '../../../../services/api';
// Assuming api is imported or configured globally
// import api from '../../api';

const FeedbackPage = () => {
  const [rating, setRating] = useState(null); // Use null initial state for Rating
  const [comments, setComments] = useState('');
  const [donationId, setDonationId] = useState(''); // To link feedback to a specific donation/delivery
  const [recentDonations, setRecentDonations] = useState([]); // Populate with recent completed donations
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- Fetch recent completed donations for selection ---
  useEffect(() => {
    const fetchRecentDonations = async () => {
      // --- TODO: Implement API call to get recent delivered/completed donations ---
      try {
        const response = await api.get('/recipient/donations/completed'); // Example endpoint
        setRecentDonations(response.data);
      } catch (err) {
        console.error("Failed to fetch recent donations", err);
      }

      // Placeholder:
      // setRecentDonations([
      //   { _id: 'd1_completed', item: 'Fresh Apples Delivery' },
      //   { _id: 'd2_completed', item: 'Milk Cartons Delivery' },
      // ]);
      // --- End Placeholder ---
    };
    fetchRecentDonations();
  }, []);

  // --- Handle Feedback Submission ---
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (rating === null || !donationId) {
        setError("Please select a donation and provide a rating.");
        return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const feedbackData = {
      rating,
      comments,
      donationId, // Link feedback to the donation
      // recipientId will likely be added by the backend based on the authenticated user
    };

    try {
      // --- TODO: Replace with actual API call ---
      console.log('Submitting feedback:', feedbackData);
      // await api.post('/feedback', feedbackData);

      // Placeholder:
      await new Promise(resolve => setTimeout(resolve, 1000));
      // --- End Placeholder ---

      setSuccess('Thank you for your feedback!');
      // Reset form
      setRating(null);
      setComments('');
      setDonationId('');
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <RateReview sx={{ mr: 1 }} /> Submit Feedback
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <Paper component="form" onSubmit={handleSubmitFeedback} sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
        <Typography variant="h6" gutterBottom>Rate a Recent Donation/Delivery</Typography>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="donation-select-label">Select Donation/Delivery</InputLabel>
          <Select
            labelId="donation-select-label"
            value={donationId}
            label="Select Donation/Delivery"
            onChange={(e) => setDonationId(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="" disabled><em>Select one...</em></MenuItem>
            {recentDonations.map((donation) => (
              <MenuItem key={donation._id} value={donation._id}>
                {donation.item} {/* Display relevant info */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography component="legend" sx={{ mt: 2 }}>Overall Rating*</Typography>
        <Rating
          name="feedback-rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          size="large"
          disabled={loading}
        />

        <TextField
          label="Comments (Optional)"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          variant="outlined"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={loading}
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading || rating === null || !donationId}>
          {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
        </Button>
      </Paper>
    </Box>
  );
};

export default FeedbackPage;