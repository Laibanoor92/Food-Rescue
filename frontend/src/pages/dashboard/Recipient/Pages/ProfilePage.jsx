

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, CircularProgress,
  Alert, Grid, Avatar, Divider, Stack // Added Divider and Stack
} from '@mui/material';
import { AccountCircle, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material'; // Added more icons
import api from '../../../../services/api';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organizationName: '',
    address: '', // Added address back to state
    contactNumber: '',
  });
  const [initialData, setInitialData] = useState({}); // Store initial data to reset on cancel
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Separate state for saving
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- Fetch Profile Data ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching profile...');
        const response = await api.get('/recipient/dashboard/profile'); // Ensure this endpoint is correct
        const profileData = {
          // Combine first/last name if they exist, otherwise use name, default to empty
          name: response.data.firstName && response.data.lastName
                ? `${response.data.firstName} ${response.data.lastName}`
                : response.data.name || '',
          email: response.data.email || '',
          organizationName: response.data.organization.name || '', // Assuming direct field or adjust as needed
          address: response.data.address || '', // Assuming direct field
          contactNumber: response.data.contact || '', // Assuming backend sends 'contact'
        };
        setFormData(profileData);
        setInitialData(profileData); // Store initial data for reset

      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || 'Failed to load profile data.');
        // Set empty form data on error to avoid issues with controlled components
        const emptyData = { name: '', email: '', organizationName: '', address: '', contactNumber: '' };
        setFormData(emptyData);
        setInitialData(emptyData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If cancelling, reset form data to initial state
      setFormData(initialData);
      setError(null); // Clear errors on cancel
      setSuccess(null); // Clear success messages on cancel
    }
    setIsEditing(!isEditing);
  };

  // --- Handle Profile Update ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true); // Use saving state
    setError(null);
    setSuccess(null);

    const updatePayload = {
      organizationName: formData.organizationName,
      contactNumber: formData.contactNumber,
      // Only include fields that are meant to be updated by the recipient
      // Exclude email/name if they aren't meant to be updated via this form
    };

    try {
      console.log('Updating profile with:', updatePayload);
      // --- TODO: Uncomment and adjust API call ---
      const response = await api.put('/recipient/dashboard/profile', updatePayload); // Ensure endpoint is correct
      const updatedData = { ...formData, ...response.data }; // Merge potentially updated data
      setFormData(updatedData);
      setInitialData(updatedData); // Update initial data to reflect saved changes
      // --- End API Call ---

      // Placeholder:
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // setInitialData(formData); // Update initial data to current form data on successful save
      // --- End Placeholder ---

      setSuccess('Profile updated successfully!');
      setIsEditing(false); // Exit edit mode on success
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false); // Use saving state
    }
  };

  // Initial loading state
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto' }}> {/* Center content and limit width */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}> {/* Add elevation and padding */}
        <Stack direction="row" spacing={2} alignItems="center" mb={3}> {/* Header stack */}
          <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
            {formData.name ? formData.name.charAt(0).toUpperCase() : <AccountCircle />}
          </Avatar>
          <Typography variant="h4" component="h1">
            Profile
          </Typography>
        </Stack>

        {/* Alerts */}
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

        {/* Form */}
        <Box component="form" onSubmit={handleUpdateProfile}>
          <Grid container spacing={3}> {/* Consistent spacing */}

            {/* --- Read-only Section --- */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="filled" // Use filled for read-only
                helperText="Name cannot be changed here."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="filled"
                helperText="Email cannot be changed."
              />
            </Grid>

            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid> {/* Divider */}

            {/* --- Editable Section --- */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Organization Name"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{ readOnly: !isEditing }}
                variant={isEditing ? "outlined" : "filled"} // Switch variant based on mode
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                fullWidth
                InputProps={{ readOnly: !isEditing }}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
            <Grid item xs={12}> {/* Address field spanning full width */}
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3} // Allow more space for address
                InputProps={{ readOnly: !isEditing }}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>

            {/* --- Action Buttons --- */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                {isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleEditToggle}
                      disabled={saving}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleEditToggle}
                    startIcon={<EditIcon />}
                  >
                    Edit Profile
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;