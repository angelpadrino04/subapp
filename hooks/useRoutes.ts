import { useEffect, useState } from "react";
// TODO: add in .env
const OSRM_URL = "http://192.168.10.135:5001";

//TODO: change to file types
export type Coordinate = {
  lat: number;
  lng: number;
};

export async function useRoutes(
  coordinateA: Coordinate,
  coordinateB: Coordinate
) {
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const getRoutes = async () => {
    const coordsQuery = `${coordinateA.lng},${coordinateA.lat};${coordinateB.lng},${coordinateB.lat}`;

    const url = `${OSRM_URL}/route/v1/driving/${coordsQuery}?geometries=geojson&overview=full`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`OSRM error: ${res.status}`);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry.coordinates;

        const leafletCoords = routeGeometry.map(
          ([lon, lat]: [lon: number, lat: number]) => ({
            lat: lat,
            lng: lon,
          })
        );

        setRouteCoordinates(leafletCoords);
      } else {
        console.warn("OSRM not found");
        setRouteCoordinates([]);
      }
    } catch (error) {
      console.error("Error OSRM: ", error);
      setRouteCoordinates([]);
    }
  };

  useEffect(() => {
    getRoutes();
  }, [coordinateA, coordinateB]);

  return {
    routeCoordinates,
  };
}
