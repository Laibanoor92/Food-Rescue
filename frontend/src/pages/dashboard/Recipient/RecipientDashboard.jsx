import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useLocation, Outlet, useNavigate } from 'react-router-dom'; // Import Outlet
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Badge,
  Avatar,
  useTheme,
  useMediaQuery,
  colors, // Import colors for grey shade
  Menu,
  MenuItem,
  ListItemButton
} from '@mui/material';
import { AuthContext } from '../../../contexts/AuthContext'; // Adjust path as needed
import {
  Search,
  Notifications,
  AccountCircle,
  // Chat, // Removed
  // CloudUpload, // Removed
  RateReview,
  Dashboard,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

// --- Configuration ---
const drawerWidth = 240;
const PRIMARY_GREEN = '#16A34A'; // Define primary green color

// --- Sidebar Component (White Theme) ---
const Sidebar = ({ open, handleDrawerClose }) => {
  const theme = useTheme();
  const location = useLocation();

  // Updated menuItems: Removed Messages and Documents
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/recipient/dashboard' },
    { text: 'Search & Filters', icon: <Search />, path: '/recipient/search' },
    // { text: 'Notifications', icon: <Badge badgeContent={3} color="error"><Notifications /></Badge>, path: '/recipient/notifications' }, // Placeholder badge count
    { text: 'Profile', icon: <AccountCircle />, path: '/recipient/profile' },
    // { text: 'Messages', icon: <Chat />, path: '/recipient/messages' }, // Removed
    // { text: 'Documents', icon: <CloudUpload />, path: '/recipient/documents' }, // Removed
    { text: 'Feedback', icon: <RateReview />, path: '/recipient/feedback' },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: `1px solid ${colors.grey[200]}`
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar,
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colors.grey[200]}`,
          px: 2
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: PRIMARY_GREEN }}>
          Food Rescue
        </Typography>
        <IconButton onClick={handleDrawerClose} sx={{ color: colors.grey[600] }}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path || (item.path === '/recipient/dashboard' && location.pathname === '/recipient')} // Handle index route selection
            sx={{
              color: '#333333',
              mb: 0.5,
              mx: 1,
              width: 'auto',
              borderRadius: 1.5,
              '&:hover': {
                backgroundColor: colors.green[50],
                color: colors.green[800],
                '& .MuiListItemIcon-root': { color: colors.green[700] },
              },
              '&.Mui-selected': {
                backgroundColor: colors.green[100],
                color: colors.green[900],
                fontWeight: '600',
                '& .MuiListItemIcon-root': { color: colors.green[800] },
              },
              py: 1.2,
              '& .MuiListItemIcon-root': {
                color: '#5E5E5E',
                minWidth: 40,
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.95rem' }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};


// --- Main Dashboard Layout Component ---
const RecipientDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  // Handle avatar menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = async () => {
    handleClose();
    try {
      await logout();
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Adjust sidebar based on screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerOpen = () => setSidebarOpen(true);
  const handleDrawerClose = () => setSidebarOpen(false);

  // --- Render Logic ---
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* --- AppBar --- */}
      <AppBar
        position="fixed"
        elevation={0} // Flatter look
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: PRIMARY_GREEN,
          color: '#ffffff',
          transition: theme.transitions.create(['margin', 'width'], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }),
          ...(sidebarOpen && {
            width: `calc(100% - ${drawerWidth}px)`, marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], { easing: theme.transitions.easing.easeOut, duration: theme.transitions.duration.enteringScreen }),
          }),
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ mr: 2, ...(sidebarOpen && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>Recipient Dashboard</Typography>
        
          <IconButton 
            color="inherit" 
            sx={{ ml: 1 }}
            onClick={handleMenu}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {/* TODO: Fetch user initial or avatar */}
            <Avatar sx={{ width: 32, height: 32, bgcolor: colors.green[800] }}>
              {user?.name?.[0]?.toUpperCase() || 'R'}
            </Avatar>
          </IconButton>
          
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => navigate('/recipient/profile')}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* --- Sidebar --- */}
      <Sidebar open={sidebarOpen} handleDrawerClose={handleDrawerClose} />

      {/* --- Main Content Area --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, p: { xs: 2, md: 3 },
          backgroundColor: colors.grey[100], // Light grey background
          minHeight: '100vh',
          transition: theme.transitions.create('margin', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }),
          marginLeft: `-${drawerWidth}px`,
          ...(sidebarOpen && {
            transition: theme.transitions.create('margin', { easing: theme.transitions.easing.easeOut, duration: theme.transitions.duration.enteringScreen }),
            marginLeft: 0,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}

        {/* --- Render Child Route Content Here --- */}
        <Outlet />

      </Box>
    </Box>
  );
};

export default RecipientDashboard;