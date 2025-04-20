import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css"; // Import Geocoder CSS

const GeocoderControl = () => {
  const map = useMap(); // Get the map instance

  useEffect(() => {
    if (!map) return;

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", function (e) {
        const { center } = e.geocode;
        map.setView(center, 13);
        L.marker(center).addTo(map).bindPopup(e.geocode.name).openPopup();
      })
      .addTo(map);

    return () => map.removeControl(geocoder);
  }, [map]);

  return null;
};

export default GeocoderControl;
