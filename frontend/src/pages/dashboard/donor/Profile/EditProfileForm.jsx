// import React, { useState, useEffect } from 'react';
// import { 
//   TextField, 
//   Button, 
//   Box, 
//   Typography, 
//   Avatar, 
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import { CameraAltOutlined } from '@mui/icons-material';
// import axios from 'axios';

// const EditProfileForm = ({ userProfile, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     bio: ''
//   });
//   const [profileImage, setProfileImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     if (userProfile) {
//       setFormData({
//         name: userProfile.name || '',
//         email: userProfile.email || '',
//         phone: userProfile.phone || '',
//         address: userProfile.address || '',
//         bio: userProfile.bio || ''
//       });
//       setImagePreview(userProfile.profilePicture || '');
//     }
//   }, [userProfile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files[0]) {
//       setProfileImage(e.target.files[0]);
//       setImagePreview(URL.createObjectURL(e.target.files[0]));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       let imageUrl = userProfile.profilePicture;

//       // Upload new image if selected
//       if (profileImage) {
//         const imageFormData = new FormData();
//         imageFormData.append('file', profileImage);
//         imageFormData.append('upload_preset', 'food_rescue_unsigned'); // Use imageFormData, not formData
      
//         const imageResponse = await axios.post(
//           'https://api.cloudinary.com/v1_1/dvfqnvuas/image/upload',
//           imageFormData // Use imageFormData, not formData
//         );
      
//         imageUrl = imageResponse.data.secure_url;
//       }

//       // Update user profile
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         '/api/profile',
//         { ...formData, profilePicture: imageUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSuccess('Profile updated successfully!');
//       if (onUpdate) onUpdate(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//       {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
//         <Avatar 
//           src={imagePreview} 
//           sx={{ width: 100, height: 100, mb: 2 }}
//           alt={formData.name}
//         />
//         <Button
//           component="label"
//           variant="outlined"
//           startIcon={<CameraAltOutlined />}
//           size="small"
//         >
//           Change Photo
//           <input
//             type="file"
//             hidden
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//         </Button>
//       </Box>

//       <TextField
//         margin="normal"
//         required
//         fullWidth
//         id="name"
//         label="Full Name"
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         autoFocus
//       />
//       <TextField
//         margin="normal"
//         required
//         fullWidth
//         id="email"
//         label="Email Address"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         type="email"
//       />
//       <TextField
//         margin="normal"
//         fullWidth
//         id="phone"
//         label="Phone Number"
//         name="phone"
//         value={formData.phone}
//         onChange={handleChange}
//       />
//       <TextField
//         margin="normal"
//         fullWidth
//         id="address"
//         label="Address"
//         name="address"
//         value={formData.address}
//         onChange={handleChange}
//         multiline
//         rows={2}
//       />
//       <TextField
//         margin="normal"
//         fullWidth
//         id="bio"
//         label="Bio"
//         name="bio"
//         value={formData.bio}
//         onChange={handleChange}
//         multiline
//         rows={3}
//         placeholder="Tell us a bit about yourself..."
//       />
      
//       <Button
//         type="submit"
//         fullWidth
//         variant="contained"
//         sx={{ mt: 3, mb: 2, bgcolor: 'green.600', ':hover': { bgcolor: 'green.700' } }}
//         disabled={loading}
//       >
//         {loading ? <CircularProgress size={24} /> : 'Save Changes'}
//       </Button>
//     </Box>
//   );
// };

// export default EditProfileForm;


import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Avatar, 
  CircularProgress,
  Alert
} from '@mui/material';
import { CameraAltOutlined } from '@mui/icons-material';
import axios from 'axios';

const EditProfileForm = ({ userProfile, onUpdate }) => {
  // API URL with fallback
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '', // Changed from phone to contact
    address: '',
    organization: '', // Added organization field
    bio: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        contact: userProfile.contact || userProfile.phone || '', // Support both field names
        address: userProfile.address || '',
        organization: userProfile.organization || '',
        bio: userProfile.bio || ''
      });
      setImagePreview(userProfile.profilePicture || userProfile.profileImage || '');
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let imageUrl = userProfile.profilePicture || userProfile.profileImage;

      // Upload new image if selected
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', profileImage);
        imageFormData.append('upload_preset', 'food_rescue_unsigned');
      
        console.log('Uploading image to Cloudinary...');
        const imageResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/dvfqnvuas/image/upload',
          imageFormData
        );
      
        imageUrl = imageResponse.data.secure_url;
        console.log('Image uploaded successfully:', imageUrl);
      }

      // Update user profile
      const token = localStorage.getItem('authToken') || 
                   localStorage.getItem('token') || 
                   sessionStorage.getItem('authToken');
                   
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log('Sending profile update to:', `${API_URL}/api/profile`);
      console.log('Profile data being sent:', { 
        ...formData, 
        profileImage: imageUrl 
      });
      
      const response = await axios.put(
        `${API_URL}/api/profile`,
        { 
          ...formData, 
          profileImage: imageUrl  // Backend might expect profileImage instead of profilePicture
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Profile updated successfully:', response.data);
      setSuccess('Profile updated successfully!');
      if (onUpdate) onUpdate(response.data);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar 
          src={imagePreview} 
          sx={{ width: 100, height: 100, mb: 2 }}
          alt={formData.name}
        />
        <Button
          component="label"
          variant="outlined"
          startIcon={<CameraAltOutlined />}
          size="small"
        >
          Change Photo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>

      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
      />
      <TextField
        margin="normal"
        fullWidth
        id="contact"
        label="Phone Number"
        name="contact" // Changed from "phone" to "contact"
        value={formData.contact}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="address"
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        multiline
        rows={2}
      />
      <TextField
        margin="normal"
        fullWidth
        id="organization"
        label="Organization"
        name="organization"
        value={formData.organization}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="bio"
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        multiline
        rows={3}
        placeholder="Tell us a bit about yourself..."
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, bgcolor: 'green.600', ':hover': { bgcolor: 'green.700' } }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
      </Button>
    </Box>
  );
};

export default EditProfileForm;