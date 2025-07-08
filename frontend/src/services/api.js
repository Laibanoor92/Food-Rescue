import axios from 'axios';

// Keep your original base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token - keep as is
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - keep as is
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Create a new axios instance for specific donation routes
// This instance doesn't include the /api prefix in the base URL
const donationApi = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the same interceptors to the donation-specific API
donationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

donationApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Donation API calls - use the donation-specific API instance
export const donationService = {
  // Get dashboard stats - use full path
  getDashboardStats: () => donationApi.get('/api/donations/stats'),
  
  // Get chart data - use full path
  getChartData: () => donationApi.get('/api/donations/chart-data'),
  
  // Create donation - use full path
  createDonation: (donationData) => donationApi.post('/api/donations', donationData),
  
  // Get donation history - use full path
  getDonationHistory: (filters) => donationApi.get('/api/donations', { params: filters }),
  
  // Get donation details - use full path
  getDonationDetails: (id) => donationApi.get(`/api/donations/${id}`),
  
  // Get tracking info - use full path
  getTrackingInfo: (donationId) => donationApi.get(`/api/tracking/${donationId}`),
};

// Profile API calls - keep using the original api instance
export const profileService = {
  // Get user profile
  getProfile: () => api.get('/profile'),
  
  // Update user profile
  updateProfile: (profileData) => api.put('/profile', profileData),
  
  // Get contribution history
  getContributions: (page = 1) => api.get(`/donations/my-contributions?page=${page}`),
};

export default api;

// import axios from 'axios';

// // Keep your original base URL
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor for adding auth token - keep as is
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - keep as is
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle 401 Unauthorized errors (token expired)
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/signin';
//     }
//     return Promise.reject(error);
//   }
// );

// // Create a new axios instance for specific donation routes
// // This instance doesn't include the /api prefix in the base URL
// const donationApi = axios.create({
//   baseURL: 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add the same interceptors to the donation-specific API
// donationApi.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// donationApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/signin';
//     }
//     return Promise.reject(error);
//   }
// );

// // Donation API calls - use the donation-specific API instance
// export const donationService = {
//   // Get dashboard stats - use full path
//   getDashboardStats: () => donationApi.get('/api/donations/stats'),
  
//   // Get chart data - use full path
//   getChartData: () => donationApi.get('/api/donations/chart-data'),
  
//   // Create donation - use full path
//   createDonation: (donationData) => donationApi.post('/api/donations', donationData),
  
//   // Get donation history - use full path
//   getDonationHistory: (filters) => donationApi.get('/api/donations', { params: filters }),
  
//   // Get donation details - use full path
//   getDonationDetails: (id) => donationApi.get(`/api/donations/${id}`),
  
//   // Get tracking info - use full path
//   getTrackingInfo: (donationId) => donationApi.get(`/api/tracking/${donationId}`),
// };

// // Profile API calls - keep using the original api instance
// export const profileService = {
//   // Get user profile
//   getProfile: () => api.get('/profile'),
  
//   // Update user profile
//   updateProfile: (profileData) => api.put('/profile', profileData),
  
//   // Get contribution history
//   getContributions: (page = 1) => api.get(`/donations/my-contributions?page=${page}`),
// };

// export default api;