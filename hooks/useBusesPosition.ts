import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Coordinates } from "./useRoutes";

const socket = io("ws://192.168.10.135:3000", {});

type Bus = {
  id: string;
  coordinate: Coordinates;
};

export function useBusesPosition() {
  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    socket.on("message", (message) => {
      const result = JSON.parse(message);
      setBuses(result);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return { buses };
}
