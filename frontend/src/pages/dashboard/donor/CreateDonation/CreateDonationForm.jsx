// import React, { useState, useEffect } from 'react';
// import { 
//   TextField, 
//   Button, 
//   MenuItem, 
//   FormControl, 
//   InputLabel, 
//   Select, 
//   Typography, 
//   Paper, 
//   Box,
//   Grid 
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import LocationPicker from './LocationPicker';
// import ImageUploader from './ImageUploader';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const foodTypes = [
//   'Fruits & Vegetables',
//   'Cooked Food',
//   'Bakery Items',
//   'Dairy Products',
//   'Canned Food',
//   'Beverages',
//   'Grains & Cereals',
//   'Others'
// ];

// const CreateDonationForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     foodType: '',
//     quantity: '',
//     quantityUnit: 'kg',
//     expiryDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow by default
//     location: { lat: 0, lng: 0 },
//     address: '',
//     images: [],
//     description: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [isComponentMounted, setIsComponentMounted] = useState(true);

//   // Set up effect to mark component as unmounted
//   useEffect(() => {
//     return () => {
//       setIsComponentMounted(false);
//       // Additional cleanup
//       if (window.google && window.google.maps) {
//         // Clean up any remaining listeners
//         try {
//           window.google.maps.event.clearListeners(window, 'resize');
//         } catch (e) {
//           console.log('Map cleanup error:', e);
//         }
//       }
//     };
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleLocationChange = async (location) => {
//     setFormData(prev => ({
//       ...prev,
//       location
//     }));
    
//     try {
//       // Using Google Maps Geocoding API instead of OpenStreetMap
//       const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
//       if (!apiKey) {
//         throw new Error("Google Maps API key is missing");
//       }
      
//       // FIX: Explicitly set withCredentials to false to avoid CORS issues
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`,
//         { withCredentials: false } // This prevents sending cookies with the request
//       );
      
//       if (response.data.status === "OK" && response.data.results.length > 0) {
//         const formattedAddress = response.data.results[0].formatted_address;
//         setFormData(prev => ({
//           ...prev,
//           address: formattedAddress
//         }));
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           address: "Address not found, please enter manually"
//         }));
//       }
//     } catch (error) {
//       console.error("Error getting address:", error);
      
//       // Better error handling with more specific message
//       if (error.message === 'Network Error') {
//         setFormData(prev => ({
//           ...prev,
//           address: "Could not fetch address due to network issue. Please enter manually."
//         }));
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           address: ""
//         }));
//       }
//     }
//   };

//   const handleImagesChange = (images) => {
//     setFormData(prev => ({
//       ...prev,
//       images
//     }));
//   };

//   const handleExpiryDateChange = (date) => {
//     setFormData(prev => ({
//       ...prev,
//       expiryDate: date
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.foodType) return "Food type is required";
//     if (!formData.quantity) return "Quantity is required";
    
//     // Better location validation
//     if (
//       !formData.location || 
//       (Math.abs(formData.location.lat) < 0.000001 && Math.abs(formData.location.lng) < 0.000001)
//     ) {
//       return "Please select a pickup location on the map";
//     }
    
//     if (formData.images.length === 0) return "Please upload at least one image";
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`${import.meta.env.VITE_API_URL}/donations`, formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       // Show success message
//       setSuccess(true);
//       // Wait before redirecting to let user see the success message
//       setTimeout(() => {
//         navigate('/donor/donation-history');
//       }, 1500);
//     } catch (error) {
//       console.error('Error creating donation:', error);
//       setError(error.response?.data?.message || 'Failed to create donation. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/donor/dashboard');
//   };

//   return (
//     <Paper elevation={3} className="p-6 max-w-4xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <Button 
//           variant="outlined" 
//           onClick={handleCancel}
//           startIcon={<ArrowBackIcon />}
//         >
//           Back to Dashboard
//         </Button>
//         <Typography variant="h5" component="h2" className="text-center font-bold text-green-700">
//           Create New Donation
//         </Typography>
//       </div>

//       {error && (
//         <Box className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
//           {error}
//         </Box>
//       )}

//       {success && (
//         <Box className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
//           Donation created successfully! Redirecting...
//         </Box>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Food Type */}
//           <FormControl fullWidth>
//             <InputLabel id="food-type-label">Food Type</InputLabel>
//             <Select
//               labelId="food-type-label"
//               name="foodType"
//               value={formData.foodType}
//               label="Food Type"
//               onChange={handleChange}
//               required
//             >
//               {foodTypes.map((type) => (
//                 <MenuItem key={type} value={type}>{type}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* Quantity */}
//           <div className="flex space-x-2">
//             <TextField
//               label="Quantity"
//               name="quantity"
//               type="number"
//               value={formData.quantity}
//               onChange={handleChange}
//               required
//               fullWidth
//               inputProps={{ min: "0.1", step: "0.1" }}
//             />
//             <FormControl style={{ width: '30%' }}>
//               <InputLabel id="unit-label">Unit</InputLabel>
//               <Select
//                 labelId="unit-label"
//                 name="quantityUnit"
//                 value={formData.quantityUnit}
//                 label="Unit"
//                 onChange={handleChange}
//               >
//                 <MenuItem value="kg">Kg</MenuItem>
//                 <MenuItem value="g">Gram</MenuItem>
//                 <MenuItem value="l">Liter</MenuItem>
//                 <MenuItem value="ml">ml</MenuItem>
//                 <MenuItem value="pcs">Pieces</MenuItem>
//                 <MenuItem value="servings">Servings</MenuItem>
//               </Select>
//             </FormControl>
//           </div>
//         </div>

       
// <Box display="flex" flexDirection="column" gap={2}>
//   <LocalizationProvider dateAdapter={AdapterDateFns}>
//     <DatePicker
//       label="Expiry Date"
//       value={formData.expiryDate}
//       onChange={handleExpiryDateChange}
//       slotProps={{ textField: { fullWidth: true } }}
//       minDate={new Date()}
//     />
//   </LocalizationProvider>

//   {/* Description */}
//   <TextField
//     label="Description"
//     name="description"
//     value={formData.description}
//     onChange={handleChange}
//     multiline
//     rows={3}
//     fullWidth
//     placeholder="Add any additional details about the food donation..."
//   />
// </Box>

//         {/* Address */}
//         {/* <TextField
//           label="Address"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           required
//           fullWidth
//           placeholder="Full address for pickup"
//         /> */}
       
// {/* Location Picker */}
// <div className="mt-4">
//   <Typography variant="subtitle1" className="mb-2 font-medium">
//     Select Pickup Location
//   </Typography>
//   {/* Force complete re-render by using a div with unique key */}
//   <div key={`map-container-${Date.now()}`} className="w-full">
//     <LocationPicker onChange={handleLocationChange} />
//   </div>
// </div>

//         {/* Image Uploader */}
//         <div className="mt-4">
//           <ImageUploader onChange={handleImagesChange} />
//         </div>

//         {/* Submit and Cancel Buttons */}
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <Button 
//               variant="outlined"
//               color="secondary"
//               onClick={handleCancel}
//               fullWidth
//               className="py-3 text-lg"
//             >
//               Cancel
//             </Button>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Button 
//               type="submit" 
//               variant="contained" 
//               color="primary"
//               disabled={loading}
//               fullWidth
//               className="bg-green-600 hover:bg-green-700 py-3 text-lg"
//             >
//               {loading ? 'Creating Donation...' : 'Create Donation'}
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Paper>
//   );
// };

// export default CreateDonationForm;

import React, { useState, useEffect, useCallback } from 'react';
import { 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Typography, 
  Paper, 
  Box,
  Grid 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LocationPicker from './LocationPicker';
import ImageUploader from './ImageUploader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FORM_STORAGE_KEY = 'donationFormData';

const foodTypes = [
  'Fruits & Vegetables',
  'Cooked Food',
  'Bakery Items',
  'Dairy Products',
  'Canned Food',
  'Beverages',
  'Grains & Cereals',
  'Others'
];

const CreateDonationForm = () => {
  const navigate = useNavigate();
  
  // Initialize state from localStorage if it exists
  const [formData, setFormData] = useState(() => {
    const savedForm = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      return {
        ...parsedForm,
        expiryDate: parsedForm.expiryDate ? new Date(parsedForm.expiryDate) : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      };
    }
    return {
      foodType: '',
      quantity: '',
      quantityUnit: 'kg',
      expiryDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      description: '',
      location: null,
      address: '',
      images: []
      
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [isLocationSelected, setIsLocationSelected] = useState(false);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
      // Only clear if not navigating after successful submission
      if (!success) {
        localStorage.removeItem(FORM_STORAGE_KEY);
      }
      // Clean up map listeners
      if (window.google && window.google.maps) {
        try {
          window.google.maps.event.clearListeners(window, 'resize');
        } catch (e) {
          console.log('Map cleanup error:', e);
        }
      }
    };
  }, [success]);

  // Log location changes for debugging
  useEffect(() => {
    console.log("Location updated:", formData.location);
    
    if (
      formData.location && 
      !(Math.abs(formData.location.lat) < 0.000001 && Math.abs(formData.location.lng) < 0.000001)
    ) {
      setIsLocationSelected(true);
    } else {
      setIsLocationSelected(false);
    }
  }, [formData.location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = async (location) => {
    console.log("Location selected:", location);
    
    if (
      location && 
      !(Math.abs(location.lat) < 0.000001 && Math.abs(location.lng) < 0.000001)
    ) {
      console.log("Valid location selected");
    } else {
      console.log("Invalid or default location coordinates");
    }
    
    setFormData(prev => ({
      ...prev,
      location
    }));
    
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        throw new Error("Google Maps API key is missing");
      }
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`,
        { withCredentials: false }
      );
      
      if (response.data.status === "OK" && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setFormData(prev => ({
          ...prev,
          address: formattedAddress
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          address: "Address not found, please enter manually"
        }));
      }
    } catch (error) {
      console.error("Error getting address:", error);
      
      if (error.message === 'Network Error') {
        setFormData(prev => ({
          ...prev,
          address: "Could not fetch address due to network issue. Please enter manually."
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          address: ""
        }));
      }
    }
    
    try {
      // Using Google Maps Geocoding API instead of OpenStreetMap
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        throw new Error("Google Maps API key is missing");
      }
      
      // FIX: Explicitly set withCredentials to false to avoid CORS issues
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`,
        { withCredentials: false } // This prevents sending cookies with the request
      );
      
      if (response.data.status === "OK" && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setFormData(prev => ({
          ...prev,
          address: formattedAddress
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          address: "Address not found, please enter manually"
        }));
      }
    } catch (error) {
      console.error("Error getting address:", error);
      
      // Better error handling with more specific message
      if (error.message === 'Network Error') {
        setFormData(prev => ({
          ...prev,
          address: "Could not fetch address due to network issue. Please enter manually."
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          address: ""
        }));
      }
    }
  };

  const handleImagesChange = (images) => {
    console.log("Images updated:", images);
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const handleExpiryDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      expiryDate: date
    }));
  };

  const validateForm = () => {
    if (!formData.foodType) return "Food type is required";
    if (!formData.quantity) return "Quantity is required";
    
    // Better location validation
    if (
      !formData.location || 
      (Math.abs(formData.location.lat) < 0.000001 && Math.abs(formData.location.lng) < 0.000001)
    ) {
      return "Please select a pickup location on the map";
    }
    
    if (formData.images.length === 0) return "Please upload at least one image";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get token from both possible storage locations
      const token = localStorage.getItem('token') || sessionStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Format donation data
      const donationData = {
        foodType: formData.foodType,
        quantity: formData.quantity,
        quantityUnit: formData.quantityUnit,
        expiryDate: formData.expiryDate,
        location: formData.location,
        address: formData.address || "Address not provided",
        description: formData.description || "",
        // Ensure images are in the expected format (array of strings)
        images: formData.images.map(img =>
          typeof img === 'string'
            ? { url: img, public_id: '' } // Add public_id if you have it
            : img
        )
        
      };
      
      console.log("Submitting donation data:", donationData);
      console.log('Token being sent:', token);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/donations`, donationData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Donation created successfully:', response.data);
      
      // Show success message
      setSuccess(true);
      // Wait before redirecting to let user see the success message
      setTimeout(() => {
        navigate('/donor/donation-history');
      }, 1500);
    } catch (error) {
      console.error('Error creating donation:', error);
      
      // More detailed error handling
      if (error.response) {
        console.error('Server response:', error.response.data);
        setError(error.response.data.message || `Error: ${error.response.status}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('Server did not respond. Please check your connection and try again.');
      } else {
        setError(error.message || 'Failed to create donation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/donor/dashboard');
  };

  return (
    <Paper elevation={3} className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outlined" 
          onClick={handleCancel}
          startIcon={<ArrowBackIcon />}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h5" component="h2" className="text-center font-bold text-green-700">
          Create New Donation
        </Typography>
      </div>

      {error && (
        <Box className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </Box>
      )}

      {success && (
        <Box className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          Donation created successfully! Redirecting...
        </Box>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Food Type */}
          <FormControl fullWidth>
            <InputLabel id="food-type-label">Food Type</InputLabel>
            <Select
              labelId="food-type-label"
              name="foodType"
              value={formData.foodType}
              label="Food Type"
              onChange={handleChange}
              required
            >
              {foodTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Quantity */}
          <div className="flex space-x-2">
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: "0.1", step: "0.1" }}
            />
            <FormControl style={{ width: '30%' }}>
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select
                labelId="unit-label"
                name="quantityUnit"
                value={formData.quantityUnit}
                label="Unit"
                onChange={handleChange}
              >
                <MenuItem value="kg">Kg</MenuItem>
                <MenuItem value="g">Gram</MenuItem>
                <MenuItem value="l">Liter</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="pcs">Pieces</MenuItem>
                <MenuItem value="servings">Servings</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

       
        <Box display="flex" flexDirection="column" gap={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Expiry Date"
              value={formData.expiryDate}
              onChange={handleExpiryDateChange}
              slotProps={{ textField: { fullWidth: true } }}
              minDate={new Date()}
            />
          </LocalizationProvider>

          {/* Description */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            placeholder="Add any additional details about the food donation..."
          />
        </Box>

        {/* Location Picker */}
        <div className="mt-4">
          <Typography variant="subtitle1" className="mb-2 font-medium">
            Select Pickup Location
          </Typography>
          
          {/* Location selection instructions */}
      
          
          {/* Force complete re-render by using a div with unique key */}
          <div key={`map-container-${Date.now()}`} className="w-full">
            <LocationPicker onChange={handleLocationChange} />
          </div>
          
          {/* Location selection status */}
          <Box sx={{ mt: 2 }}>
            {isLocationSelected ? (
              <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  Location selected: {formData.address || `${formData.location.lat.toFixed(5)}, ${formData.location.lng.toFixed(5)}`}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 2, bgcolor: '#fff4e5', borderRadius: 1 }}>
                <Typography variant="body2" color="warning.dark">
                  ⚠️ You must select a pickup location on the map before submitting
                </Typography>
              </Box>
            )}
          </Box>
        </div>

        {/* Image Uploader */}
        <div className="mt-4">
          <Typography variant="subtitle1" className="mb-2 font-medium">
            Upload Images
          </Typography>
          <ImageUploader onChange={handleImagesChange} />
        </div>

        {/* Submit and Cancel Buttons */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button 
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              fullWidth
              className="py-3 text-lg"
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              fullWidth
              className="bg-green-600 hover:bg-green-700 py-3 text-lg"
            >
              {loading ? 'Creating Donation...' : 'Create Donation'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreateDonationForm;