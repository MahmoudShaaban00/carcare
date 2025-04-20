import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import marche from "../../assets/marche.gif"; // Adjust the path if needed

const LeafletRoutingMachine = () => {
  const map = useMap();
  const [waypoints, setWaypoints] = useState([]);

  let DefaultIcon = L.icon({
    iconUrl: marche,
    iconSize: [90, 90],
  });

  useEffect(() => {
    if (waypoints.length < 2) return; // Only calculate route if 2 points are selected

    const marker = L.marker(waypoints[0], { icon: DefaultIcon }).addTo(map);

    const routingControl = L.Routing.control({
      waypoints: waypoints.map((wp) => L.latLng(wp[0], wp[1])),
      lineOptions: {
        styles: [{ color: "blue", weight: 4, opacity: 0.7 }],
      },
      routeWhileDragging: false,
      geocoder: L.Control.Geocoder.nominatim(),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: true,
    })
      .on("routesfound", function (e) {
        const route = e.routes[0].coordinates;
        route.forEach((c, i) => {
          setTimeout(() => {
            marker.setLatLng([c.lat, c.lng]); // Move the marker along the route
          }, 1000 * i);
        });
      })
      .addTo(map);

    return () => {
      map.removeControl(routingControl); // Clean up previous routes
    };
  }, [waypoints, map]);

  // Click handler to select start & end points
  useEffect(() => {
    const handleClick = (e) => {
      setWaypoints((prev) => {
        const updatedWaypoints = [...prev, [e.latlng.lat, e.latlng.lng]];
        return updatedWaypoints.length > 2 ? updatedWaypoints.slice(1) : updatedWaypoints; // Keep only 2 points
      });
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map]);

  return null;
};

export default LeafletRoutingMachine;
