import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Default Marker Icon Fix for Leaflet
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function UserLocationMap({ userLatitude, userLongitude }) {
  // Ensure longitude is within valid range
  const validLongitude = userLongitude > 180 ? userLongitude - 360 : userLongitude;

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <MapContainer center={[userLatitude, validLongitude]} zoom={13} style={{ height: "400px", width: "100%", borderRadius: "10px" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Alternative: "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
        <Marker position={[userLatitude, validLongitude]} icon={defaultIcon}>
          <Popup>
            📍 User's Location <br />
            Latitude: {userLatitude} <br />
            Longitude: {validLongitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
