
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(undefined)

// IMPORTANT: Define a consistent token key name
const TOKEN_KEY = "token"; // Use the same key everywhere!

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in, using consistent TOKEN_KEY
    const storedToken = localStorage.getItem(TOKEN_KEY);
    
    if (storedToken) {
      try {
        console.log("Found stored token, attempting to decode");
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded token:", decodedToken);

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log("Token is expired");
          localStorage.removeItem(TOKEN_KEY);
        } else {
          // Token is valid
          setToken(storedToken);
          setIsAuthenticated(true);
          
          // Store user info from token
          if (decodedToken.userId) {
            setUser({
              id: decodedToken.userId,
              role: decodedToken.role || 'unknown'
            });
          }
        }
      } catch (error) {
        // Invalid token
        console.error("Invalid token:", error);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    
    setLoading(false);
  }, []);

  // Login function that handles both user data and token
  const login = (userData, newToken) => {
    console.log("Logging in with token");
    
    if (newToken) {
      // Store token consistently
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    }
    
    if (userData) {
      setUser(userData);
    }
    
    setIsAuthenticated(true);
  };

  // This can be an alias for login if needed
  const setUserData = (userData, newToken) => {
    login(userData, newToken);
  };

  const logout = () => {
    console.log("Logging out");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser: setUserData,
        login, // Add explicit login function 
        token, 
        isAuthenticated, 
        loading,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
