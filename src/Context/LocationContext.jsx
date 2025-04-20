import { createContext, useState } from "react";

export const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [coordinates, setCoordinates] = useState(null);

  return (
    <LocationContext.Provider value={{ coordinates, setCoordinates }}>
      {children}
    </LocationContext.Provider>
  );
}
