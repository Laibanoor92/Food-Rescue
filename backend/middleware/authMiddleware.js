

import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const IGNORE_ROUTES = [
    '/favicon.ico',  // Browser automatically requests this
    '/robots.txt',   // Search engines request this
    '/assets/',      // Static assets 
    '/public/'       // Public files
];

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/verify-email',
  '/api/auth/resend-verification'
];

const authMiddleware = async (req, res, next) => {
    // Log the request (more informative and structured)
    const timestamp = new Date().toISOString();
    const authHeader = req.header('Authorization');
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    console.log(`Auth header: ${authHeader ? 'Provided' : 'Not provided'}`);
    
    // Check if this is a public route or starts with a public path
    const path = req.originalUrl;

    if (
      PUBLIC_ROUTES.some(route => path === route || path.startsWith(route + '/')) || 
      IGNORE_ROUTES.some(route => path.startsWith(route))
    ) {
      console.log('Public route - bypassing authentication');
      return next();
    }
    
    try {
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            console.log('No token provided for protected route');
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized - No token provided' 
            });
        }

        console.log('Verifying token:', token.substring(0, 20) + '...');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token payload:', decoded);
        
        // Use userId instead of id
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            console.log('User not found with ID:', decoded.userId);
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized - User not found' 
            });
        }

        console.log('Authenticated user:', user.email, '(Role:', user.role, ')');
        
        // Store user in request object
        req.user = user;
        next();
    } catch (error) {
        console.log(`Auth error: ${error.message}`);
        return res.status(401).json({ 
            success: false,
            message: 'Invalid or expired token',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false,
            message: 'Access denied - Admins only' 
        });
    }
    next();
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log('🔍 Checking role:', req.user?.role, 'against allowed roles:', roles);
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: `Access denied - Role ${req.user?.role || 'unknown'} not authorized`
            });
        }
        next();
    };
};

export default authMiddleware;