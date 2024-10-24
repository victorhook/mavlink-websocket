import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

/*
icon={{
  url: "path_to_your_drone_icon.png",
  scale: 0.1,
  rotation: dronePosition.heading,
}}
*/

function DroneMap({ dronePosition }) {
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Wait until Google Maps is loaded
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (window.google) {
        setGoogleLoaded(true);
        clearInterval(intervalId);
      }
    }, 100); // Check every 100ms for google object
    return () => clearInterval(intervalId);
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      {googleLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={dronePosition || center}
          zoom={15}
        >
          <Marker
            position={dronePosition}
            icon={{
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 5,
              rotation: dronePosition.heading || 0,
            }}
          />
        </GoogleMap>
      )}
    </LoadScript>
  );
}

export default React.memo(DroneMap);
