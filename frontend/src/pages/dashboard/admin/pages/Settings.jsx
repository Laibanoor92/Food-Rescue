// // filepath: src/pages/admin/Settings.jsx
// import React, { useState } from 'react';
// import { Box, Grid, Card, CardContent, Typography, TextField, Button, MenuItem, List, ListItem, ListItemText, IconButton } from '@mui/material';
// import { Save, AddCircle, Delete } from '@mui/icons-material';

// function Settings() {
//   const [foodCategories, setFoodCategories] = useState(['Produce', 'Bakery', 'Dairy', 'Prepared Meals']);
//   const [newCategory, setNewCategory] = useState('');
//   const [expiryHours, setExpiryHours] = useState(4); // Default expiry hours

//   const handleAddCategory = () => {
//     if (newCategory && !foodCategories.includes(newCategory)) {
//       setFoodCategories([...foodCategories, newCategory]);
//       setNewCategory('');
//     }
//   };

//   const handleDeleteCategory = (categoryToDelete) => {
//     setFoodCategories(foodCategories.filter(cat => cat !== categoryToDelete));
//   };

//   const handleSaveSettings = () => {
//       console.log("Saving settings:", { foodCategories, expiryHours });
//       // Add API call to save settings
//   }

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>Platform Settings</Typography>
//       <Grid container spacing={3}>
//         {/* Food Categories */}
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>Manage Food Categories</Typography>
//               <List dense>
//                 {foodCategories.map((cat) => (
//                   <ListItem
//                     key={cat}
//                     secondaryAction={
//                       <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(cat)}>
//                         <Delete color="error" />
//                       </IconButton>
//                     }
//                   >
//                     <ListItemText primary={cat} />
//                   </ListItem>
//                 ))}
//               </List>
//               <Box sx={{ display: 'flex', mt: 2 }}>
//                 <TextField
//                   label="New Category"
//                   variant="outlined"
//                   size="small"
//                   value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   sx={{ flexGrow: 1, mr: 1 }}
//                 />
//                 <Button
//                   variant="contained"
//                   startIcon={<AddCircle />}
//                   onClick={handleAddCategory}
//                   disabled={!newCategory}
//                 >
//                   Add
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Platform Rules */}
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>Platform Rules</Typography>
//               <TextField
//                 label="Default Expiry Alert (Hours)"
//                 type="number"
//                 variant="outlined"
//                 fullWidth
//                 value={expiryHours}
//                 onChange={(e) => setExpiryHours(e.target.value)}
//                 InputProps={{ inputProps: { min: 1 } }}
//                 sx={{ mb: 2 }}
//               />
//                <TextField
//                 select
//                 label="Default Admin Role for New Users"
//                 variant="outlined"
//                 fullWidth
//                 defaultValue="viewer"
//                 sx={{ mb: 2 }}
//               >
//                 <MenuItem value="admin">Admin</MenuItem>
//                 <MenuItem value="editor">Editor</MenuItem>
//                  <MenuItem value="viewer">Viewer</MenuItem>
//               </TextField>
//               {/* Add more settings fields as needed */}
//             </CardContent>
//           </Card>
//         </Grid>

//          {/* Save Button */}
//          <Grid item xs={12}>
//              <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={<Save />}
//                 onClick={handleSaveSettings}
//              >
//                 Save All Settings
//              </Button>
//          </Grid>
//       </Grid>
//     </Box>
//   );
// }

// export default Settings;


import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, TextField, Button, MenuItem,
    List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { Save, AddCircle, Delete, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import api from '../../../../services/api'; // Adjust path as needed

function Settings() {
  // State for settings values
  const [foodCategories, setFoodCategories] = useState([]);
  const [expiryHours, setExpiryHours] = useState(''); // Initialize as empty or default
  const [defaultAdminRole, setDefaultAdminRole] = useState(''); // Initialize as empty or default

  // State for UI control
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch existing settings on component mount
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Adjust endpoint if needed
      const response = await api.get('/admin/settings');
      const settings = response.data;
      if (settings) {
        setFoodCategories(settings.foodCategories || []);
        setExpiryHours(settings.rules?.defaultExpiryHours || 4); // Example structure
        setDefaultAdminRole(settings.rules?.defaultAdminRole || 'viewer'); // Example structure
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(err.response?.data?.message || 'Failed to load settings.');
      // Set defaults on error?
      setFoodCategories(['Produce', 'Bakery', 'Dairy']); // Example defaults
      setExpiryHours(4);
      setDefaultAdminRole('viewer');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handlers for category management (remain client-side until save)
  const handleAddCategory = () => {
    if (newCategory && !foodCategories.includes(newCategory.trim())) {
      setFoodCategories([...foodCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    setFoodCategories(foodCategories.filter(cat => cat !== categoryToDelete));
  };

  // Handle saving all settings to the backend
  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    setSnackbar({ open: false, message: '' }); // Close previous snackbar

    // Structure the data as expected by your backend API
    const settingsToSave = {
      foodCategories: foodCategories,
      rules: {
        defaultExpiryHours: parseInt(expiryHours, 10) || 4, // Ensure it's a number
        defaultAdminRole: defaultAdminRole,
        // Add other rules here
      },
      // Add other top-level settings if needed
    };

    try {
      // Use PUT or POST depending on your API design
      await api.put('/admin/settings', settingsToSave);
      setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
    } catch (err) {
      console.error("Error saving settings:", err);
      const errMsg = err.response?.data?.message || 'Failed to save settings.';
      setError(errMsg); // Show persistent error if needed
      setSnackbar({ open: true, message: errMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Platform Settings</Typography>

      {error && !saving && ( // Show persistent error only if not currently saving
        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
          <Typography ml={2}>Loading settings...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Food Categories */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Manage Food Categories</Typography>
                <List dense sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                  {foodCategories.map((cat) => (
                    <ListItem
                      key={cat}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(cat)}>
                          <Delete color="error" />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={cat} />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <TextField
                    label="New Category"
                    variant="outlined"
                    size="small"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    sx={{ flexGrow: 1, mr: 1 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddCircle />}
                    onClick={handleAddCategory}
                    disabled={!newCategory || foodCategories.includes(newCategory.trim())}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Platform Rules */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Platform Rules</Typography>
                <TextField
                  label="Default Expiry Alert (Hours)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={expiryHours}
                  onChange={(e) => setExpiryHours(e.target.value)}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{ mb: 2 }}
                  disabled={loading} // Disable while loading initial data
                />
                <TextField
                  select
                  label="Default Admin Role for New Users"
                  variant="outlined"
                  fullWidth
                  value={defaultAdminRole}
                  onChange={(e) => setDefaultAdminRole(e.target.value)}
                  sx={{ mb: 2 }}
                  disabled={loading} // Disable while loading initial data
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </TextField>
                {/* Add more settings fields as needed */}
              </CardContent>
            </Card>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
              onClick={handleSaveSettings}
              disabled={loading || saving} // Disable while loading or saving
            >
              {saving ? 'Saving...' : 'Save All Settings'}
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;