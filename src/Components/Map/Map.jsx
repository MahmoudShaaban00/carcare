import React, { useContext, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import GeocoderControl from "./GeocoderControl";
import LeafletRoutingMachine from "./LeafletRoutingMachine";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LocationContext } from "../../Context/LocationContext"; // ✅ Import Context

// proporties of marker
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

// Component to handle map clicks
function LocationMarker() {
  const { setCoordinates } = useContext(LocationContext); // ✅ Use Context
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setCoordinates([lat, lng]); // ✅ Store in Context
      console.log("Selected Coordinates:", lat, lng);
    }
  });

  return position ? (
    <Marker position={position}>
      <Popup>Latitude: {position[0]} <br /> Longitude: {position[1]}</Popup>
    </Marker>
  ) : null;
}

export default function Map() {
  const { coordinates } = useContext(LocationContext); // ✅ Use Context
  const navigate = useNavigate();

  // function locate technical
  const updateTechnicalLocation = async (latitude, longitude) => {
    try {
      const technicalId = localStorage.getItem("tecId");

      if (!technicalId) {
        console.error("Technical ID not found in local storage.");
        return;
      }

      const dataTec = {
        id: technicalId,
        techLatitude: latitude,
        techLongitude: longitude
      };

      await axios.put("https://carcareapp.runasp.net/api/account/Update-Technical-Location", dataTec, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Location updated successfully");
      alert("Location updated successfully")
      navigate("/confiromemail"); // Navigate to requests page after updating location

    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  // handle coordinates of place
  const handleSendCoordinates = () => {
    if (coordinates) {
      updateTechnicalLocation(coordinates[0], coordinates[1]);
    } else {
      console.warn("No coordinates selected.");
    }
  };

  return (
    <div style={{ width: "100%", height: "510px" }}>
      <MapContainer center={[30.06, 31.25]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <GeocoderControl />
        <LeafletRoutingMachine />
      </MapContainer>

      <div className="flex justify-center items-center">
        <button className="p-2 bg-red-700 text-white rounded mt-2"
          onClick={handleSendCoordinates}>
          Send Coordinates
        </button>
      </div>
    </div>
  );
}
