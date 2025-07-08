// import React, { useState } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import {
//   Box, CssBaseline, AppBar, Toolbar, IconButton, Typography,
//   Drawer, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Badge,
//   Tooltip, Menu, MenuItem, Divider, useTheme, useMediaQuery
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   RestaurantMenu as RestaurantMenuIcon, // Represents Donations
//   People as PeopleIcon,
//   Inventory2 as InventoryIcon,
//   LocalShipping as LogisticsIcon,
//   Notifications as NotificationsIcon,
//   BarChart as AnalyticsIcon,
//   Settings as SettingsIcon,
//   Logout as LogoutIcon
// } from '@mui/icons-material';

// const drawerWidth = 240;

// const navItems = [
//   { text: 'Overview', icon: <DashboardIcon />, path: '/admin/overview' },
//   { text: 'Donations', icon: <RestaurantMenuIcon />, path: '/admin/donations' },
//   { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
//   { text: 'Inventory', icon: <InventoryIcon />, path: '/admin/inventory' },
//   { text: 'Logistics', icon: <LogisticsIcon />, path: '/admin/logistics' },
//   { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics' },
//   { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
// ];

// function AdminLayout() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [anchorElUser, setAnchorElUser] = useState(null);
//   const [anchorElNotifications, setAnchorElNotifications] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   const handleOpenNotificationsMenu = (event) => {
//     setAnchorElNotifications(event.currentTarget);
//   };

//   const handleCloseNotificationsMenu = () => {
//     setAnchorElNotifications(null);
//   };

//   const handleLogout = () => {
//     // Add actual logout logic here
//     console.log("Logging out...");
//     handleCloseUserMenu();
//     navigate('/signin'); // Redirect to sign-in page
//   };

//   const drawer = (
//     <div>
//       <Toolbar sx={{ justifyContent: 'center' }}>
//         <Typography variant="h6" noWrap component="div" color="primary">
//           Food Rescue
//         </Typography>
//       </Toolbar>
//       <Divider />
//       <List>
//         {navItems.map((item) => (
//           <ListItemButton
//             key={item.text}
//             selected={location.pathname === item.path}
//             onClick={() => {
//               navigate(item.path);
//               if (isMobile) setMobileOpen(false);
//             }}
//             sx={{
//               '&.Mui-selected': {
//                 backgroundColor: theme.palette.action.selected,
//                 '&:hover': {
//                   backgroundColor: theme.palette.action.hover,
//                 },
//               },
//             }}
//           >
//             <ListItemIcon sx={{ color: location.pathname === item.path ? theme.palette.primary.main : 'inherit' }}>
//               {item.icon}
//             </ListItemIcon>
//             <ListItemText primary={item.text} />
//           </ListItemButton>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//           backgroundColor: 'white',
//           color: theme.palette.text.primary,
//           boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)'
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//             {/* Dynamically set title based on route or keep it static */}
//             Admin Dashboard
//           </Typography>

//           {/* Notifications */}
//           <Tooltip title="Notifications">
//             <IconButton color="inherit" onClick={handleOpenNotificationsMenu} sx={{ mr: 1 }}>
//               <Badge badgeContent={4} color="error"> {/* Replace 4 with actual count */}
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//           </Tooltip>
//           <Menu
//             sx={{ mt: '45px' }}
//             id="menu-notifications"
//             anchorEl={anchorElNotifications}
//             anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//             keepMounted
//             transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//             open={Boolean(anchorElNotifications)}
//             onClose={handleCloseNotificationsMenu}
//           >
//             {/* Replace with actual notifications */}
//             <MenuItem onClick={handleCloseNotificationsMenu}>
//               <Typography textAlign="center">Notification 1: Food expiring soon</Typography>
//             </MenuItem>
//             <MenuItem onClick={handleCloseNotificationsMenu}>
//               <Typography textAlign="center">Notification 2: New user signup</Typography>
//             </MenuItem>
//           </Menu>

//           {/* User Avatar & Menu */}
//           <Tooltip title="Admin Settings">
//             <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//               <Avatar alt="Admin User" src="/static/images/avatar/2.jpg" /> {/* Placeholder image */}
//             </IconButton>
//           </Tooltip>
//           <Menu
//             sx={{ mt: '45px' }}
//             id="menu-appbar"
//             anchorEl={anchorElUser}
//             anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//             keepMounted
//             transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//             open={Boolean(anchorElUser)}
//             onClose={handleCloseUserMenu}
//           >
//             <MenuItem onClick={handleCloseUserMenu}>
//               <Typography textAlign="center">Profile</Typography>
//             </MenuItem>
//             <MenuItem onClick={handleLogout}>
//               <ListItemIcon>
//                 <LogoutIcon fontSize="small" />
//               </ListItemIcon>
//               <Typography textAlign="center">Logout</Typography>
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>
//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//         aria-label="mailbox folders"
//       >
//         {/* Mobile Drawer */}
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile.
//           }}
//           sx={{
//             display: { xs: 'block', sm: 'none' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//         >
//           {drawer}
//         </Drawer>
//         {/* Desktop Drawer */}
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: 'none', sm: 'block' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           backgroundColor: theme.palette.grey[100], // Light background for content area
//           minHeight: '100vh'
//         }}
//       >
//         <Toolbar /> {/* Necessary spacer for content below AppBar */}
//         <Outlet /> {/* Child route components render here */}
//       </Box>
//     </Box>
//   );
// }

// export default AdminLayout;


import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, CssBaseline, AppBar, Toolbar, IconButton, Typography,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Badge,
  Tooltip, Menu, MenuItem, Divider, useTheme, useMediaQuery, CircularProgress, // Added CircularProgress
  Skeleton // Added Skeleton for avatar loading
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  RestaurantMenu as RestaurantMenuIcon, // Represents Donations
  People as PeopleIcon,
  Inventory2 as InventoryIcon,
  LocalShipping as LogisticsIcon,
  Notifications as NotificationsIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ErrorOutline as ErrorIcon // Added ErrorIcon
} from '@mui/icons-material';
import { AuthContext } from '../../../contexts/AuthContext';  // Adjust path to your AuthContext
import api from '../../../services/api';  // Adjust path as needed

const drawerWidth = 240;

const navItems = [
  { text: 'Overview', icon: <DashboardIcon />, path: '/admin/overview' },
  { text: 'Donations', icon: <RestaurantMenuIcon />, path: '/admin/donations' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/admin/inventory' },
  { text: 'Logistics', icon: <LogisticsIcon />, path: '/admin/logistics' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // --- State for Backend Data ---
  const { user, logout } = useContext(AuthContext); // Get user and logout from context
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingUser, setLoadingUser] = useState(!user); // Start loading if user isn't immediately available from context

  // --- Fetch Notifications ---
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        // Adjust endpoint if needed
        const response = await api.get('/admin/notifications?unread=true&limit=5');
        setNotifications(response.data?.notifications || []);
        setNotificationCount(response.data?.unreadCount || 0);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        // Optionally show an error message
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
    // Optional: Set up polling or WebSocket for real-time notifications
    // const intervalId = setInterval(fetchNotifications, 60000); // Fetch every minute
    // return () => clearInterval(intervalId);
  }, []);

  // --- Handle User Loading (if context loads async) ---
  useEffect(() => {
    if (user) {
      setLoadingUser(false);
    }
    // If your AuthContext doesn't provide user immediately, you might need
    // to fetch user details here using apiService based on an ID from context/token
  }, [user]);


  // --- Event Handlers ---
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  // --- Logout Handler ---
  const handleLogout = async () => {
    handleCloseUserMenu();
    try {
      await logout(); // Call logout function from AuthContext
      navigate('/signin', { replace: true }); // Redirect after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
    }
  };

  // --- Mark Notification Read (Example) ---
  const handleNotificationClick = async (notificationId) => {
    handleCloseNotificationsMenu();
    // Navigate to relevant page based on notification, e.g., /admin/users/pending
    console.log("Navigate based on notification:", notificationId);

    // Optimistically remove from list/decrement count
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
    setNotificationCount(prev => Math.max(0, prev - 1));

    // Send request to backend to mark as read
    try {
      await apiService.put(`/admin/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Optionally revert optimistic update or show error
    }
  };


  // --- Drawer Content ---
  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" color="primary">
          Food Rescue
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname.startsWith(item.path)} // Use startsWith for nested routes
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname.startsWith(item.path) ? theme.palette.primary.main : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  // --- Main Return ---
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: theme.palette.text.primary,
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleOpenNotificationsMenu} sx={{ mr: 1 }}>
              <Badge badgeContent={notificationCount} color="error">
                {loadingNotifications ? <CircularProgress size={24} color="inherit" /> : <NotificationsIcon />}
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-notifications"
            anchorEl={anchorElNotifications}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotificationsMenu}
            PaperProps={{ style: { maxHeight: 400, width: '30ch' } }}
          >
            {loadingNotifications ? (
              <MenuItem disabled><Typography>Loading...</Typography></MenuItem>
            ) : notifications.length === 0 ? (
              <MenuItem disabled><Typography>No new notifications</Typography></MenuItem>
            ) : (
              notifications.map((notif) => (
                <MenuItem key={notif._id} onClick={() => handleNotificationClick(notif._id)}>
                  {/* Adjust based on your notification structure */}
                  <Typography variant="body2" noWrap>
                    {notif.message || 'Notification message missing'}
                  </Typography>
                </MenuItem>
              ))
            )}
             {/* Optional: Link to see all notifications */}
             {notifications.length > 0 && <Divider />}
             <MenuItem onClick={() => { handleCloseNotificationsMenu(); navigate('/admin/notifications'); }}>
                <Typography color="primary" sx={{textAlign: 'center', width: '100%'}}>View All</Typography>
             </MenuItem>
          </Menu>

          {/* User Avatar & Menu */}
          <Tooltip title="Admin Settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {loadingUser ? (
                 <Skeleton variant="circular" width={40} height={40} />
              ) : (
                 // Use user data from context or fetched data
                 <Avatar alt={user?.name || 'Admin'} src={user?.avatarUrl || '/static/images/avatar/default.jpg'} />
              )}
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin/profile'); }}> {/* Link to profile page */}
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.grey[100],
          minHeight: '100vh'
        }}
      >
        <Toolbar /> {/* Spacer */}
        <Outlet /> {/* Child route components render here */}
      </Box>
    </Box>
  );
}

export default AdminLayout;