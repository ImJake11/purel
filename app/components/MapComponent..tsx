import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface CenterLoc {
  lat: number;
  lng: number;
}
const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function MapComponent() {
  const [center, setCenter] = useState<CenterLoc | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCrMfOvySRqZHimAJPnjzFvNkD5CnKOR_c", // Replace with your API key
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  if (!center) return <div></div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      <Marker position={center} />
    </GoogleMap>
  );
}
