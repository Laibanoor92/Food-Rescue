import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" />;
  }

  // Check if user has permission to access this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'donor') {
      return <Navigate to="/donor/dashboard" />;
    } else if (user.role === 'recipient') {
      return <Navigate to="/recipient/dashboard" />;
    } else if (user.role === 'volunteer') {
      return <Navigate to="/volunteer-dashboard" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" />;
    }
    
    // Fallback
    return <Navigate to="/" />;
  }

  // User is authenticated and authorized
  return children;
};

export default PrivateRoute;