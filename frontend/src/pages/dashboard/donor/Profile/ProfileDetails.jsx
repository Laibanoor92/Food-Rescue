// import React from 'react';
// import { 
//   Card, 
//   CardContent, 
//   Typography, 
//   Avatar, 
//   Button, 
//   Divider,
//   Grid
// } from '@mui/material';
// import { PencilIcon } from '@heroicons/react/outline';
// import { Link } from 'react-router-dom';

// const ProfileDetails = ({ profile }) => {
//   if (!profile) return null;

//   const {
//     name,
//     email,
//     phone,
//     address,
//     profileImage,
//     donationStats
//   } = profile;

//   return (
//     <div>
//       <Card className="mb-6">
//         <CardContent>
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
//             <Avatar 
//               src={profileImage || '/default-avatar.png'} 
//               alt={name} 
//               sx={{ width: 120, height: 120 }}
//               className="border-4 border-green-100"
//             />
            
//             <div className="flex-1">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <Typography variant="h5" className="font-bold">{name}</Typography>
//                   <Typography variant="subtitle1" color="green" fontWeight='bold' textTransform='uppercase'>Donor</Typography>
//                 </div>
//                 <Link to="/donor/profile/edit">
//                   <Button 
//                     variant="outlined" 
//                     startIcon={<PencilIcon className="h-4 w-4" />}
//                     size="small"
//                   >
//                     Edit Profile
//                   </Button>
//                 </Link>
//               </div>
              
//               <Divider className="my-4" />
              
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Typography variant="body2" color="textSecondary">Email</Typography>
//                   <Typography variant="body1">{email}</Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography variant="body2" color="textSecondary">Phone</Typography>
//                   <Typography variant="body1">{phone || 'Not provided'}</Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="body2" color="textSecondary">Address</Typography>
//                   <Typography variant="body1">{address || 'Not provided'}</Typography>
//                 </Grid>
//               </Grid>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardContent>
//           <Typography variant="h6" className="font-bold mb-4">Donation Statistics</Typography>
          
//           <Grid container spacing={4} className="mb-4">
//             <Grid item xs={6} md={3}>
//               <div className="text-center p-3 bg-green-50 rounded-lg">
//                 <Typography variant="h4" className="font-bold text-green-600">
//                   {donationStats?.totalDonations || 0}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Total Donations
//                 </Typography>
//               </div>
//             </Grid>
            
//             <Grid item xs={6} md={3}>
//               <div className="text-center p-3 bg-blue-50 rounded-lg">
//                 <Typography variant="h4" className="font-bold text-blue-600">
//                   {donationStats?.totalQuantity || 0} kg
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Food Donated
//                 </Typography>
//               </div>
//             </Grid>
            
//             <Grid item xs={6} md={3}>
//               <div className="text-center p-3 bg-purple-50 rounded-lg">
//                 <Typography variant="h4" className="font-bold text-purple-600">
//                   {donationStats?.peopleFed || 0}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   People Fed
//                 </Typography>
//               </div>
//             </Grid>
            
//             <Grid item xs={6} md={3}>
//               <div className="text-center p-3 bg-yellow-50 rounded-lg">
//                 <Typography variant="h4" className="font-bold text-yellow-600">
//                   {donationStats?.co2Saved || 0} kg
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   CO₂ Saved
//                 </Typography>
//               </div>
//             </Grid>
//           </Grid>
          
//           <Typography variant="body2" className="text-gray-500 italic text-center">
//             Thank you for your contributions to reducing food waste and feeding those in need!
//           </Typography>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ProfileDetails;


import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Button, 
  Divider,
  Grid,
  Box,
  Skeleton,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const ProfileDetails = ({ profile, loading }) => {
  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <Card sx={{ mb: 3, p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="error">
          Could not load profile data. Please refresh and try again.
        </Typography>
      </Card>
    );
  }

  const {
    name,
    email,
    contact,
    address,
    profileImage,
    donationStats
  } = profile;

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 3
          }}>
            <Avatar 
              src={profileImage || '/default-avatar.png'} 
              alt={name} 
              sx={{ 
                width: 120, 
                height: 120,
                border: '4px solid #e8f5e9'
              }}
            />
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{name}</Typography>
                  <Typography 
                    variant="subtitle1" 
                    color="success.main" 
                    sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                  >
                    Donor
                  </Typography>
                </Box>
                <Link to="/donor/profile/edit" style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    size="small"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{contact || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Address</Typography>
                  <Typography variant="body1">{address || 'Not provided'}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Donation Statistics
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                bgcolor: 'success.light', 
                borderRadius: 2 
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                  {donationStats?.totalDonations || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Donations
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                bgcolor: 'primary.light', 
                borderRadius: 2 
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  {donationStats?.totalQuantity || 0} kg
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Food Donated
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                bgcolor: '#f3e5f5', 
                borderRadius: 2 
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                  {donationStats?.peopleFed || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  People Fed
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                bgcolor: '#fff8e1', 
                borderRadius: 2 
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                  {donationStats?.co2Saved || 0} kg
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CO₂ Saved
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontStyle: 'italic', 
              textAlign: 'center' 
            }}
          >
            Thank you for your contributions to reducing food waste and feeding those in need!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

// Loading skeleton
const ProfileSkeleton = () => (
  <Box>
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 3
        }}>
          <Skeleton variant="circular" width={120} height={120} />
          
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 2
            }}>
              <Box>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={80} height={24} />
              </Box>
              <Skeleton variant="rectangular" width={120} height={36} />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3}>
              {[0, 1, 2].map((item) => (
                <Grid item xs={12} md={item === 2 ? 12 : 6} key={item}>
                  <Skeleton variant="text" width={80} height={20} />
                  <Skeleton variant="text" width="100%" height={28} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent>
        <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[0, 1, 2, 3].map((item) => (
            <Grid item xs={6} md={3} key={item}>
              <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        
        <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
      </CardContent>
    </Card>
  </Box>
);

export default ProfileDetails;