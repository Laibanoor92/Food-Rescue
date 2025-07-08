// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
// import { Box, CircularProgress, Typography, Button, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
// import MyLocationIcon from '@mui/icons-material/MyLocation';
// import MapIcon from '@mui/icons-material/Map';
// import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// const defaultCenter = {
//   lat: 20.5937,
//   lng: 78.9629
// };

// // Use libraries array for more stability
// const libraries = ['places'];

// // Helper function to get saved location from localStorage
// const getSavedLocation = () => {
//   try {
//     const savedLocation = localStorage.getItem('userMapLocation');
//     if (savedLocation) {
//       return JSON.parse(savedLocation);
//     }
//   } catch (error) {
//     console.error("Error reading location from localStorage:", error);
//   }
//   return null;
// };

// // Helper function to save location to localStorage
// const saveLocation = (location) => {
//   try {
//     localStorage.setItem('userMapLocation', JSON.stringify(location));
//     console.log("Location saved to localStorage:", location);
//   } catch (error) {
//     console.error("Error saving location to localStorage:", error);
//   }
// };

// const LocationPicker = ({ onChange }) => {
//   // Try to get saved location first
//   const savedLocation = getSavedLocation();
  
//   // Use useLoadScript instead of useJsApiLoader
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   // Initialize with saved location or default
//   const [position, setPosition] = useState(savedLocation || defaultCenter);
//   const [map, setMap] = useState(null);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [locationError, setLocationError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [mapType, setMapType] = useState('roadmap');
//   const isMounted = useRef(true);
//   const geoLocationAttempted = useRef(false);

//   // Force component to remount on navigation using a unique key
//   const [mapKey] = useState(() => `map-instance-${Date.now()}`);

//   // Notify parent of initial position if we have a saved one
//   useEffect(() => {
//     if (savedLocation) {
//       console.log("Using saved location:", savedLocation);
//       onChange(savedLocation);
//     }
//   }, []);

//   // Cleanup when component unmounts
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       console.log("Component unmounting");
//     };
//   }, []);

//   // This effect runs when the map is set or changes
//   useEffect(() => {
//     if (map && !geoLocationAttempted.current && !savedLocation) {
//       console.log("Map is ready, no saved location, attempting geolocation");
//       setTimeout(() => {
//         getMyLocation();
//       }, 300);
//     } else if (map && savedLocation) {
//       console.log("Map is ready with saved location:", savedLocation);
//     }
//   }, [map]);

//   const getMyLocation = () => {
//     if (locationLoading) return;
    
//     setLocationLoading(true);
//     setLocationError(false);
//     setErrorMessage("");
//     geoLocationAttempted.current = true;
    
//     if (!navigator.geolocation) {
//       console.error("Geolocation is not supported");
//       setLocationError(true);
//       setErrorMessage("Your browser doesn't support geolocation");
//       setLocationLoading(false);
//       return;
//     }
    
//     // Add specific error handling for debugging
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         console.log("Got position:", position.coords);
//         if (!isMounted.current) return;
        
//         const newPosition = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         };
        
//         // Save to localStorage for future use
//         saveLocation(newPosition);
        
//         setPosition(newPosition);
//         onChange(newPosition);
        
//         if (map) {
//           try {
//             console.log("Centering map to:", newPosition);
//             map.panTo(newPosition);
//             map.setZoom(16);
//           } catch (e) {
//             console.error("Error centering map:", e);
//           }
//         }
        
//         setLocationLoading(false);
//       },
//       (error) => {
//         // Detailed error handling
//         let errorMsg = "";
//         switch(error.code) {
//           case 1:
//             errorMsg = "Location permission denied. Please enable location in your browser settings.";
//             break;
//           case 2:
//             errorMsg = "Location unavailable. Try again or select manually.";
//             break;
//           case 3:
//             errorMsg = "Location request timed out. Try again.";
//             break;
//           default:
//             errorMsg = `Location error: ${error.message}`;
//         }
//         console.error(`Geolocation error ${error.code}:`, errorMsg);
//         setLocationError(true);
//         setErrorMessage(errorMsg);
//         setLocationLoading(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 300000 // 5-minute cache
//       }
//     );
//   };

//   const onLoad = useCallback(function callback(mapInstance) {
//     console.log("Map loaded - setting map instance");
//     setMap(mapInstance);
//   }, []);

//   const onUnmount = useCallback(function callback() {
//     console.log("Map unmounting");
//     setMap(null);
//   }, []);

//   const handleMapClick = (event) => {
//     if (!isMounted.current) return;
    
//     const newPosition = {
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng()
//     };
//     console.log("Map clicked at:", newPosition);
    
//     // Save to localStorage
//     saveLocation(newPosition);
    
//     setPosition(newPosition);
//     onChange(newPosition);
//   };

//   const handleMarkerDragEnd = (event) => {
//     if (!isMounted.current) return;
    
//     const newPosition = {
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng()
//     };
//     console.log("Marker dragged to:", newPosition);
    
//     // Save to localStorage
//     saveLocation(newPosition);
    
//     setPosition(newPosition);
//     onChange(newPosition);
//   };

//   const handleMapTypeChange = (event, newMapType) => {
//     if (newMapType !== null) {
//       setMapType(newMapType);
//       if (map) {
//         map.setMapTypeId(newMapType);
//       }
//     }
//   };

//   if (loadError) {
//     return (
//       <Box className="w-full h-96 flex items-center justify-center bg-red-50 rounded-lg border border-red-300">
//         <Typography color="error">
//           Error loading Google Maps: {loadError.message}
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 relative">
//       {!isLoaded ? (
//         <Box className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
//           <CircularProgress size={40} />
//           <Typography className="mt-2">
//             Loading map...
//           </Typography>
//         </Box>
//       ) : (
//         <div className="relative h-full">
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={position}
//             zoom={15}
//             onLoad={onLoad}
//             onUnmount={onUnmount}
//             onClick={handleMapClick}
//             options={{
//               fullscreenControl: false,
//               streetViewControl: false,
//               mapTypeId: mapType,
//               mapTypeControl: false,
//               zoomControl: true,
//               zoomControlOptions: {
//                 position: window.google?.maps?.ControlPosition?.RIGHT_TOP
//               }
//             }}
//           >
//             <Marker
//               position={position}
//               draggable={true}
//               onDragEnd={handleMarkerDragEnd}
//               animation={window.google?.maps?.Animation?.DROP}
//             />
//           </GoogleMap>
          
//           {/* Map Type Controls */}
//           <div className="absolute top-2 left-2 z-10">
//             <ToggleButtonGroup
//               value={mapType}
//               exclusive
//               onChange={handleMapTypeChange}
//               size="small"
//               aria-label="map type"
//               sx={{ 
//                 bgcolor: 'white', 
//                 boxShadow: 2, 
//                 '& .MuiToggleButton-root': { 
//                   py: 0.5,
//                   px: 1
//                 }
//               }}
//             >
//               <ToggleButton value="roadmap" aria-label="map view">
//                 <MapIcon fontSize="small" />
//                 <Typography sx={{ ml: 0.5, fontSize: '0.75rem' }}>Map</Typography>
//               </ToggleButton>
//               <ToggleButton value="satellite" aria-label="satellite view">
//                 <SatelliteAltIcon fontSize="small" />
//                 <Typography sx={{ ml: 0.5, fontSize: '0.75rem' }}>Satellite</Typography>
//               </ToggleButton>
//             </ToggleButtonGroup>
//           </div>
          
//           {/* My Location Button */}
//           <div className="absolute top-2 right-2 z-10">
//             <Button
//               variant="contained"
//               size="small"
//               onClick={getMyLocation}
//               startIcon={<MyLocationIcon />}
//               disabled={locationLoading}
//               sx={{ 
//                 bgcolor: 'white', 
//                 color: 'primary.main', 
//                 '&:hover': { bgcolor: 'grey.100' },
//                 boxShadow: 2 
//               }}
//             >
//               {locationLoading ? 'Getting Location...' : 'My Location'}
//             </Button>
//           </div>
          
//           {/* Location Error Alert with Specific Message */}
//           {locationError && (
//             <div className="absolute bottom-2 left-2 right-2 z-10 mx-auto max-w-md">
//               <Alert 
//                 severity="warning" 
//                 sx={{ boxShadow: 2, opacity: 0.95 }}
//                 action={
//                   <Button 
//                     color="inherit" 
//                     size="small" 
//                     onClick={getMyLocation}
//                     disabled={locationLoading}
//                   >
//                     Try Again
//                   </Button>
//                 }
//               >
//                 {errorMessage || "Unable to get your location. Please check browser permissions or select location manually."}
//               </Alert>
//             </div>
//           )}
          
//           {/* Loading Indicator */}
//           {locationLoading && (
//             <div className="absolute top-12 right-2 bg-white px-3 py-1 rounded-md shadow-sm z-10 flex items-center">
//               <CircularProgress size={16} sx={{ mr: 1 }} />
//               <Typography variant="caption">Getting location...</Typography>
//             </div>
//           )}
//         </div>
//       )}
      
//       <div className="mt-2 text-sm text-gray-500 p-2">
//         <div className="flex justify-between items-center">
//           <Typography variant="caption">
//             Click on the map or drag the marker to select a location
//           </Typography>
//           <Typography variant="caption" fontWeight="bold">
//             {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
//           </Typography>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationPicker;


import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Box, CircularProgress, Typography, Button, Alert, TextField, ToggleButtonGroup, ToggleButton } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const libraries = ['places'];

const getSavedLocation = () => {
  try {
    const saved = localStorage.getItem('userMapLocation');
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('Error reading location from localStorage:', err);
    return null;
  }
};

const saveLocation = (location) => {
  try {
    localStorage.setItem('userMapLocation', JSON.stringify(location));
  } catch (err) {
    console.error('Error saving location to localStorage:', err);
  }
};

const LocationPicker = ({ onChange }) => {
  const savedLocation = getSavedLocation();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [position, setPosition] = useState(savedLocation || defaultCenter);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mapType, setMapType] = useState('roadmap');
  const [address, setAddress] = useState('');

  const mapRef = useRef(null);
  const geoLocationAttempted = useRef(false);

  // Memoize the onChange so the component is not forced to re-mount
  const memoizedOnChange = useCallback(onChange, [onChange]);

  const onLoad = useCallback(
    (mapInstance) => {
      console.log('Map loaded - setting map instance');
      mapRef.current = mapInstance;
      if (!savedLocation && !geoLocationAttempted.current) {
        geoLocationAttempted.current = true;
        getMyLocation();
      } else {
        mapInstance.setCenter(position);
        mapInstance.setZoom(16);
      }
    },
    [savedLocation, position]
  );

  const onUnmount = useCallback(() => {
    console.log('Map unmounting');
    mapRef.current = null;
  }, []);

  // Update map center when position changes.
  useEffect(() => {
    if (mapRef.current && position) {
      console.log('Updating map center to:', position);
      mapRef.current.setCenter(position);
      mapRef.current.panTo(position);
      mapRef.current.setZoom(16);
    }
  }, [position]);

  const getMyLocation = useCallback(() => {
    if (locationLoading) return;
    setLocationLoading(true);
    setLocationError(false);
    setErrorMessage('');
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      setLocationError(true);
      setErrorMessage("Your browser doesn't support geolocation");
      setLocationLoading(false);
      return;
    }
    console.log("Requesting geolocation...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Got position:", pos.coords);
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        saveLocation(newPos);
        setPosition(newPos);
        memoizedOnChange(newPos);
        if (mapRef.current) {
          mapRef.current.panTo(newPos);
          mapRef.current.setZoom(16);
        }
        setLocationLoading(false);
      },
      (error) => {
        let msg = "";
        switch (error.code) {
          case 1:
            msg = "Location permission denied.";
            break;
          case 2:
            msg = "Location unavailable.";
            break;
          case 3:
            msg = "Location request timed out.";
            break;
          default:
            msg = error.message;
        }
        console.error("Geolocation error:", msg);
        setLocationError(true);
        setErrorMessage(msg);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  }, [locationLoading, memoizedOnChange]);

  // New function: geocode address and update map position
  const handleAddressSearch = useCallback(() => {
    if (!address || !window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const newPos = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        console.log("Geocoded address:", newPos);
        saveLocation(newPos);
        setPosition(newPos);
        memoizedOnChange(newPos);
        if (mapRef.current) {
          mapRef.current.panTo(newPos);
          mapRef.current.setZoom(16);
        }
      } else {
        console.error("Geocode was not successful for the following reason:", status);
        setLocationError(true);
        setErrorMessage("Unable to locate the address");
      }
    });
  }, [address, memoizedOnChange]);

  const handleMapClick = (event) => {
    const newPos = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    console.log("Map clicked at:", newPos);
    saveLocation(newPos);
    setPosition(newPos);
    memoizedOnChange(newPos);
  };

  const handleMarkerDragEnd = (event) => {
    const newPos = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    console.log("Marker dragged to:", newPos);
    saveLocation(newPos);
    setPosition(newPos);
    memoizedOnChange(newPos);
  };

  const handleMapTypeChange = (event, newType) => {
    if (newType !== null) {
      setMapType(newType);
      if (mapRef.current) {
        mapRef.current.setMapTypeId(newType);
      }
    }
  };

  if (loadError) {
    return (
      <Box className="w-full h-96 flex items-center justify-center bg-red-50 rounded-lg border border-red-300">
        <Typography color="error">
          Error loading Google Maps: {loadError.message}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="w-full">
      {/* Address search field */}
      <div className="mb-2 flex gap-2">
        <TextField
          fullWidth
          label="Enter address"
          variant="outlined"
          size="small"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddressSearch}>
          Search
        </Button>
      </div>
      <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 relative">
        {!isLoaded ? (
          <Box className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <CircularProgress size={40} />
            <Typography className="mt-2">Loading map...</Typography>
          </Box>
        ) : (
          <div className="relative h-full">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={position}
              zoom={15}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={handleMapClick}
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeId: mapType,
                mapTypeControl: false,
                zoomControl: true,
                zoomControlOptions: {
                  position: window.google?.maps?.ControlPosition?.RIGHT_TOP,
                },
              }}
            >
              <Marker
                position={position}
                draggable
                onDragEnd={handleMarkerDragEnd}
                animation={window.google?.maps?.Animation?.DROP}
              />
            </GoogleMap>

            <div className="absolute top-2 left-2 z-10">
              <ToggleButtonGroup
                value={mapType}
                exclusive
                onChange={handleMapTypeChange}
                size="small"
                aria-label="map type"
                sx={{
                  bgcolor: "white",
                  boxShadow: 2,
                  "& .MuiToggleButton-root": { py: 0.5, px: 1 },
                }}
              >
                <ToggleButton value="roadmap" aria-label="map view">
                  <MapIcon fontSize="small" />
                  <Typography sx={{ ml: 0.5, fontSize: "0.75rem" }}>Map</Typography>
                </ToggleButton>
                <ToggleButton value="satellite" aria-label="satellite view">
                  <SatelliteAltIcon fontSize="small" />
                  <Typography sx={{ ml: 0.5, fontSize: "0.75rem" }}>Satellite</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="contained"
                size="small"
                onClick={getMyLocation}
                startIcon={<MyLocationIcon />}
                disabled={locationLoading}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "grey.100" },
                  boxShadow: 2,
                }}
              >
                {locationLoading ? "Getting Location..." : "My Location"}
              </Button>
            </div>

            {locationError && (
              <div className="absolute bottom-2 left-2 right-2 z-10 mx-auto max-w-md">
                <Alert
                  severity="warning"
                  sx={{ boxShadow: 2, opacity: 0.95 }}
                  action={
                    <Button color="inherit" size="small" onClick={getMyLocation} disabled={locationLoading}>
                      Try Again
                    </Button>
                  }
                >
                  {errorMessage || "Unable to get your location. Please check permissions."}
                </Alert>
              </div>
            )}
          </div>
        )}

        <div className="mt-2 text-sm text-gray-500 p-2">
          <div className="flex justify-between items-center">
            <Typography variant="caption">
              Click on the map or drag the marker to select a location
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LocationPicker);


