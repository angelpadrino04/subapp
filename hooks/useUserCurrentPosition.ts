import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Coordinates } from "./useRoutes";

export function useUserCurrentPosition() {
  const [position, setPosition] = useState<Coordinates | null>();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setPosition({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }

    getCurrentLocation();
  }, []);

  return { position, errorMsg };
}
