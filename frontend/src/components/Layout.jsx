

import { Outlet } from "react-router-dom";
import { useState, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton
} from "@mui/material";
import { AccountCircle, Dashboard, Settings, Logout } from '@mui/icons-material';
import { AuthContext } from "../contexts/AuthContext";

function Layout({ children }) {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/signin');
  };

  const handleDashboard = () => {
    handleMenuClose();
    if (user?.role) {
      navigate(`/${user.role}-dashboard`);
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user?.firstName) return 'U';
    return user.firstName.charAt(0);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ color: "white", textDecoration: "none" }}>
              FoodShare
            </RouterLink>
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button color="inherit" component={RouterLink} to="/about">
              About
            </Button>
            <Button color="inherit" component={RouterLink} to="/howitworks">
              How it works
            </Button>
            
            {isAuthenticated && user ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'secondary.main',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {getInitials()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1">{user.firstName} {user.lastName}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'inline-block',
                        bgcolor: 'success.light',
                        color: 'success.dark',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        mt: 0.5,
                        textTransform: 'capitalize'
                      }}
                    >
                      {user.role}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleDashboard}>
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Profile Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" variant="outlined" sx={{ borderRadius: '20px', padding: '8px 20px' }} component={RouterLink} to="/signup">
                  Sign Up
                </Button>
                
                <Button color="inherit" variant="outlined" sx={{ borderRadius: '20px', padding: '8px 20px' }} component={RouterLink} to="/signin">
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* <Container component="main">{children}</Container> */}
      <Container component="main" maxWidth={false} disableGutters={true}>
        {children}
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;

