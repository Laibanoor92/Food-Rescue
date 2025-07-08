

// import { Route, Routes, Navigate, Outlet } from "react-router-dom";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import React, { useEffect } from 'react';
// import CssBaseline from "@mui/material/CssBaseline";
// import Layout from "./components/Layout.jsx"; // Main public layout
// import Home from "./pages/Home.jsx";
// import About from "./pages/About.jsx";
// import Signup from "./pages/SignUp.jsx";
// import SignIn from "./pages/SignIn.jsx";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
// import HowItWorksPage from "./pages/how-it-works-page.jsx";

// // import RecipientLayout from './pages/dashboard/recipient/RecipientLayout'; // Import Recipient Layout if you have one
// import VolunteerDashboard from './pages/dashboard/VolunteerDashboard';
// import AdminDashboard from './pages/dashboard/AdminDashboard';
// import VerifyEmail from './pages/VerifyEmail';
// import PrivateRoute from './components/PrivateRoute';

// // --- Donor Specific Imports ---
// import DonorLayout from './pages/dashboard/donor/DonorLayout';
// import DonorDashboard from './pages/dashboard/donor/Dashboard';
// import CreateDonation from './pages/dashboard/donor/CreateDonation/CreateDonationForm';
// import DonationHistory from './pages/dashboard/donor/History/DonationHistory';
// import TrackDonation from './pages/dashboard/donor/Tracking/TrackDonation';
// import Profile from './pages/dashboard/donor/Profile/MainProfile';
// import ProfileEdit from './pages/dashboard/donor/Profile/EditProfileForm'; // Corrected import

// // ---- Recipient Specific Imports ----  ///

// import RecipientDashboard from './pages/dashboard/Recipient/RecipientDashboard'; // Layout
// import DashboardHome from './pages/dashboard/Recipient/Pages/DashBoardHome';
// import SearchPage from './pages/dashboard/Recipient/Pages/SearchPage';

// import ProfilePage from './pages/dashboard/Recipient/Pages/ProfilePage';
// import FeedbackPage from './pages/dashboard/Recipient/Pages/FeedbackPage';

// import socketService from './services/socketService';

// const theme = createTheme({
//   palette: { primary: { main: "#4caf50" }, secondary: { main: "#ff9800" } },
//   typography: { fontFamily: "Roboto, Arial, sans-serif" },
// });

// // --- Placeholder Recipient Layout (if you don't have one) ---
// // Create a file like src/pages/dashboard/recipient/RecipientLayout.jsx
// // import React from 'react';
// // import { Outlet } from 'react-router-dom';
// // // Import Sidebar, AppBar specific to Recipient if needed
// // const RecipientLayout = () => (
// //   <div>
// //     {/* Add Recipient Sidebar/AppBar here */}
// //     <h1>Recipient Area</h1> {/* Placeholder */}
// //     <main>
// //       <Outlet /> {/* Child routes will render here */}
// //     </main>
// //   </div>
// // );
// // export default RecipientLayout;
// // --- End Placeholder ---


// function App() {
//   // Initialize socket connection
//   useEffect(() => {
//     // Consider checking user role before connecting if sockets are role-specific
//     if (localStorage.getItem('authToken')) { // Use consistent token name
//       socketService.connect();
//     }

//     return () => {
//       socketService.disconnect();
//     };
//   }, []);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Routes>
//         {/* Public/main routes WITH header/footer */}
//         <Route element={<Layout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/howitworks" element={<HowItWorksPage />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           <Route path="/verify-email/:token" element={<VerifyEmail />} />
//         </Route>

//         {/* --- Donor Dashboard Routes --- */}
//         <Route path="/donor" element={
//           <PrivateRoute allowedRoles={['donor']}>
//             <DonorLayout />
//           </PrivateRoute>
//         }>
//           {/* Redirect /donor to /donor/dashboard */}
//           <Route index element={<Navigate to="/donor/dashboard" replace />} />
//           <Route path="dashboard" element={<DonorDashboard />} />
//           <Route path="create-donation" element={<CreateDonation />} />
//           <Route path="donation-history" element={<DonationHistory />} />
//           <Route path="track-donation/:id" element={<TrackDonation />} />
//           <Route path="profile" element={<Profile />} />
//           {/* Note: profile/edit might need its own route element if Profile doesn't handle it */}
//           <Route path="profile/edit" element={<ProfileEdit />} />
//           {/* <Route path="profile/contributions" element={<ContributionsPage />} />  If separate page */}
//         </Route>

//         {/* --- Recipient Dashboard Routes --- */}
       
//         <Route
//             path="/recipient"
//             element={
//               // <ProtectedRoute role="recipient"> {/* Wrap with ProtectedRoute if needed */}
//                 <RecipientDashboard />
//               // </ProtectedRoute>
//             }
//           >
//             {/* Index route defaults to DashboardHome when path is exactly "/recipient" */}
//             <Route index element={<DashboardHome />} />
//             {/* Explicit path for dashboard */}
//             <Route path="dashboard" element={<DashboardHome />} />
//             <Route path="search" element={<SearchPage />} />
           
//             <Route path="profile" element={<ProfilePage />} />
//             <Route path="feedback" element={<FeedbackPage />} />
//             {/* Add other recipient sub-routes here if needed */}
//           </Route>



//         {/* --- Volunteer Dashboard Route --- */}
//         <Route path="/volunteer-dashboard" element={ // Consider /volunteer/dashboard pattern
//           <PrivateRoute allowedRoles={['volunteer']}>
//             <VolunteerDashboard />
//             {/* Or use a VolunteerLayout similar to Donor/Recipient */}
//           </PrivateRoute>
//         } />

//         {/* --- Admin Dashboard Route --- */}
//         <Route path="/admin-dashboard" element={ // Consider /admin/dashboard pattern
//           <PrivateRoute allowedRoles={['admin']}>
//             <AdminDashboard />
//             {/* Or use an AdminLayout */}
//           </PrivateRoute>
//         } />

//         {/* Optional: Redirect logged-in users based on role if they hit '/' */}
//         {/* Add logic inside Home or a dedicated redirect component if needed */}

//         {/* Catch-all for undefined routes (Optional) */}
//         {/* <Route path="*" element={<NotFoundPage />} /> */}

//       </Routes>
//     </ThemeProvider>
//   );
// }

// export default App;


import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useEffect } from 'react';
import CssBaseline from "@mui/material/CssBaseline";

// --- Core Layout & Public Pages ---
import Layout from "./components/Layout.jsx"; // Main public layout
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Signup from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import HowItWorksPage from "./pages/how-it-works-page.jsx";
import VerifyEmail from './pages/VerifyEmail';

// --- Authentication & Utilities ---
import PrivateRoute from './components/PrivateRoute';
import socketService from './services/socketService';

// --- Chart.js Config ---
import './config/chartConfig'; // Import Chart.js config

// --- Donor Specific Imports ---
import DonorLayout from './pages/dashboard/donor/DonorLayout';
import DonorDashboard from './pages/dashboard/donor/Dashboard';
import CreateDonation from './pages/dashboard/donor/CreateDonation/CreateDonationForm';
import DonationHistory from './pages/dashboard/donor/History/DonationHistory';
import TrackDonation from './pages/dashboard/donor/Tracking/TrackDonation';
import DonorProfile from './pages/dashboard/donor/Profile/MainProfile';
import DonorProfileEdit from './pages/dashboard/donor/Profile/EditProfileForm';

// --- Recipient Specific Imports ---
import RecipientLayout from './pages/dashboard/Recipient/RecipientDashboard'; // Using RecipientDashboard as Layout
import RecipientDashboardHome from './pages/dashboard/Recipient/Pages/DashBoardHome';
import SearchPage from './pages/dashboard/Recipient/Pages/SearchPage';
import RecipientProfilePage from './pages/dashboard/Recipient/Pages/ProfilePage';
import FeedbackPage from './pages/dashboard/Recipient/Pages/FeedbackPage';

// --- Volunteer Specific Imports ---
import VolunteerLayout from './pages/dashboard/volunteer/VolunteerDashboard'; // Assuming this is the layout
import WelcomeSection from './pages/dashboard/volunteer/pages/WelcomeSection';
import UpcomingTasks from './pages/dashboard/volunteer/pages/UpcomingTasks';
import TaskHistory from './pages/dashboard/volunteer/pages/TaskHistory';
import AvailableTasks from './pages/dashboard/volunteer/pages/AvailableTasks';
import MapView from './pages/dashboard/volunteer/pages/MapView';
import VolunteerProfile from './pages/dashboard/volunteer/pages/VolunteerProfile';
import HelpSupport from './pages/dashboard/volunteer/pages/HelpSupport';

// --- Admin Specific Imports ---
import AdminLayout from './pages/dashboard/admin/AdminLayout'; // Corrected path for Admin Layout
import Overview from './pages/dashboard/admin/pages/Overview'; // Corrected path
import Donations from './pages/dashboard/admin/pages/Donations'; // Corrected path
import Users from './pages/dashboard/admin/pages/Users'; // Corrected path
import Inventory from './pages/dashboard/admin/pages/Inventory'; // Corrected path
import Logistics from './pages/dashboard/admin/pages/Logistics'; // Corrected path
import Analytics from './pages/dashboard/admin/pages/Analytics'; // Corrected path
import Settings from './pages/dashboard/admin/pages/Settings'; // Corrected path

// --- MUI Theme ---
const theme = createTheme({
  palette: {
    primary: { main: "#4caf50" }, // Green
    secondary: { main: "#ff9800" } // Orange
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 8, // Slightly rounded cards
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)' // Softer shadow
            }
        }
    }
  }
});

function App() {
  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect();
    }

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* --- Public Routes (with Header/Footer) --- */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/howitworks" element={<HowItWorksPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>

        {/* --- Donor Dashboard Routes --- */}
        <Route
          path="/donor"
          element={
            <PrivateRoute allowedRoles={['donor']}>
              <DonorLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="create-donation" element={<CreateDonation />} />
          <Route path="donation-history" element={<DonationHistory />} />
          <Route path="track-donation/:id" element={<TrackDonation />} />
          <Route path="profile" element={<DonorProfile />} />
          <Route path="profile/edit" element={<DonorProfileEdit />} />
        </Route>

        {/* --- Recipient Dashboard Routes --- */}
        <Route
          path="/recipient"
          element={
            <PrivateRoute allowedRoles={['recipient']}>
              <RecipientLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RecipientDashboardHome />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<RecipientProfilePage />} />
          <Route path="feedback" element={<FeedbackPage />} />
        </Route>

        {/* --- Volunteer Dashboard Routes --- */}
        <Route
          path="/volunteer"
          element={
            <PrivateRoute allowedRoles={['volunteer']}>
              <VolunteerLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<WelcomeSection />} />
          <Route path="upcoming" element={<UpcomingTasks />} />
          <Route path="history" element={<TaskHistory />} />
          <Route path="available" element={<AvailableTasks />} />
          <Route path="map" element={<MapView />} />
          <Route path="profile" element={<VolunteerProfile />} />
          <Route path="help" element={<HelpSupport />} />
        </Route>

        {/* --- Admin Dashboard Routes --- */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminLayout /> {/* Use the imported AdminLayout */}
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} /> 
          <Route path="overview" element={<Overview />} />
          <Route path="donations" element={<Donations />} />
          <Route path="users" element={<Users />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Optional: Catch-all for undefined routes */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
        {/* Or redirect unknown paths to home or a specific dashboard */}
         <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </ThemeProvider>
  );
}

export default App;