import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Ensure you have AuthContext


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();  

  axios.defaults.withCredentials = true;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        console.log('Attempting login with:', { email, password, rememberMe });
        
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password,
            rememberMe,
        });

        console.log('Login response:', response.data);

        // Check if response contains token and user
        if (!response.data.token || !response.data.user) {
            throw new Error('Invalid response from server');
        }

        const { token, user } = response.data;

        // Store token based on rememberMe
        // if (rememberMe) {
        //     localStorage.setItem('authToken', token);
        // } else {
        //     sessionStorage.setItem('authToken', token);
        // }

        // // Set user in context
        // setUser(user,token);

        setUser(user, token, rememberMe);
        console.log('User set in context:', user);
        console.log('User role:', user.role);

        // Redirect to user-specific dashboard
        if (user.role === 'donor') {
          navigate('/donor');
      } else if (user.role === 'recipient') {
          navigate('/recipient/dashboard');
      } else if (user.role === 'volunteer') {
          navigate('/volunteer/dashboard');
      } else if (user.role === 'admin') { // Explicitly check for 'admin'
        navigate('/admin/overview'); // Navigate to the correct default admin route
    } else {
        console.warn('Unknown user role:', user.role);
        navigate('/'); 
    }

    } catch (err) {
        console.error('Login error:', err);
        
        // More detailed error handling
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response:', err.response.data);
            setError(err.response.data.message || 'Server error. Please try again.');
        } else if (err.request) {
            // The request was made but no response was received
            console.error('Error request:', err.request);
            setError('No response from server. Please check your connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', err.message);
            setError(err.message || 'Failed to sign in. Please try again.');
        }
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="bg-green-50 max-h-screen max-w-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-center">
          <h1 className="text-green-700 text-2xl font-bold">Food Rescue</h1>
          <p className="text-gray-800 mt-1">Reducing waste, feeding communities</p>
        </div>

        <div className="p-8">
          <h2 className="text-green-700 text-xl font-semibold mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div>
                <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-800">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-green-600 hover:text-green-800 font-medium">
                Sign Up
              </a>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 py-4 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500">© 2025 Food Rescue. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;



