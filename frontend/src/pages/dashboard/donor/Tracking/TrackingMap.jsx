import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import axios from 'axios';

// Fix for marker icons in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons
const donationIcon = new L.Icon({
  iconUrl: '/icons/donation-marker.png', // Create this icon
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45]
});

const volunteerIcon = new L.Icon({
  iconUrl: '/icons/volunteer-marker.png', // Create this icon
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45]
});

const recipientIcon = new L.Icon({
  iconUrl: '/icons/recipient-marker.png', // Create this icon
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45]
});

// Component to fit bounds and update view
const MapController = ({ donationLocation, volunteerLocation, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (donationLocation && volunteerLocation) {
      const bounds = L.latLngBounds([
        [donationLocation.lat, donationLocation.lng],
        [volunteerLocation.lat, volunteerLocation.lng]
      ]);

      if (destination) {
        bounds.extend([destination.lat, destination.lng]);
      }

      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, donationLocation, volunteerLocation, destination]);

  return null;
};

const TrackingMap = ({ donationLocation, volunteerLocation, destination }) => {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      if (volunteerLocation && donationLocation) {
        setLoading(true);
        try {
          // Using OSRM service for routing
          const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${volunteerLocation.lng},${volunteerLocation.lat};${donationLocation.lng},${donationLocation.lat}?overview=full&geometries=polyline`
          );

          if (response.data && response.data.routes && response.data.routes.length > 0) {
            // Decode the polyline
            const encodedPolyline = response.data.routes[0].geometry;
            const decodedCoords = L.Polyline.fromEncoded(encodedPolyline).getLatLngs();
            setRoute(decodedCoords);
          }
        } catch (error) {
          console.error('Error fetching route:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRoute();
  }, [volunteerLocation, donationLocation]);

  if (!donationLocation) {
    return <div>Loading map...</div>;
  }

  // Calculate center if volunteer location is not available
  const center = volunteerLocation 
    ? [(donationLocation.lat + volunteerLocation.lat) / 2, (donationLocation.lng + volunteerLocation.lng) / 2]
    : [donationLocation.lat, donationLocation.lng];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Donation location marker */}
      <Marker position={[donationLocation.lat, donationLocation.lng]} icon={donationIcon}>
        <Popup>
          <div className="text-center">
            <strong>Pickup Location</strong>
            <p>{donationLocation.address || 'No address provided'}</p>
          </div>
        </Popup>
      </Marker>

      {/* Volunteer location marker */}
      {volunteerLocation && (
        <Marker position={[volunteerLocation.lat, volunteerLocation.lng]} icon={volunteerIcon}>
          <Popup>
            <div className="text-center">
              <strong>Volunteer's Location</strong>
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Recipient/Destination marker */}
      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={recipientIcon}>
          <Popup>
            <div className="text-center">
              <strong>Delivery Destination</strong>
              <p>{destination.address || 'No address provided'}</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Route polyline */}
      {route && (
        <Polyline 
          positions={route} 
          color="blue" 
          weight={4} 
          opacity={0.7} 
          dashArray="10,10" 
        />
      )}

      {/* Map controller to update view bounds */}
      <MapController 
        donationLocation={donationLocation} 
        volunteerLocation={volunteerLocation} 
        destination={destination} 
      />
    </MapContainer>
  );
};

export default TrackingMap;