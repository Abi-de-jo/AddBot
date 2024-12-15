import  { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

// Map configuration
const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 41.7151, // Tbilisi, Georgia
  lng: 44.8271,
};

// Generate 5 random points within Georgia's latitude and longitude range
const generateRandomPoints = () => {
  const minLat = 41.2; // Approx min latitude for Georgia
  const maxLat = 43.5; // Approx max latitude for Georgia
  const minLng = 41.5; // Approx min longitude for Georgia
  const maxLng = 46.5; // Approx max longitude for Georgia

  const points = Array.from({ length: 5 }, () => ({
    lat: parseFloat((Math.random() * (maxLat - minLat) + minLat).toFixed(6)),
    lng: parseFloat((Math.random() * (maxLng - minLng) + minLng).toFixed(6)),
  }));

  return points;
};

const Map = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Generate and set random points when the component mounts
    const points = generateRandomPoints();
    setMarkers(points);
  }, []);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
      {/* Add markers for random points */}
      {markers.map((point, index) => (
        <Marker key={index} position={point} />
      ))}
    </GoogleMap>
  );
};

export default Map;
