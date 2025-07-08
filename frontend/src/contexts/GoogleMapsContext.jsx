import React, { createContext, useContext, useState, useEffect } from 'react';
// Remove this import
// import { useJsApiLoader } from '@react-google-maps/api';

const GoogleMapsContext = createContext(null);

// Create a single loader instance outside the component
let googleMapsLoaded = false;
let googleMapsError = null;
let loadPromise = null;

// Function to load Google Maps only once
const loadGoogleMapsApi = () => {
  if (loadPromise) return loadPromise;
  
  loadPromise = new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      googleMapsLoaded = true;
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      googleMapsLoaded = true;
      resolve();
    };
    
    script.onerror = (error) => {
      googleMapsError = error;
      reject(error);
    };
    
    document.head.appendChild(script);
  });
  
  return loadPromise;
};

export const GoogleMapsProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(googleMapsLoaded);
  const [loadError, setLoadError] = useState(googleMapsError);

  useEffect(() => {
    // Don't do anything if already loaded or has error
    if (isLoaded || loadError) return;
    
    loadGoogleMapsApi()
      .then(() => {
        console.log("Google Maps API loaded successfully");
        setIsLoaded(true);
      })
      .catch(err => {
        console.error("Error loading Google Maps API:", err);
        setLoadError(err);
      });
  }, []);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};