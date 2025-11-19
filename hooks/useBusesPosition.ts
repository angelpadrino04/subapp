import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Coordinate } from "./useRoutes";

const socket = io("ws://192.168.10.135:3000", {});

type Bus = {
  id: string;
  coordinate: Coordinate;
};

export function useBusesPosition() {
  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    socket.on("message", (message) => {
      const result = JSON.parse(message);

      //TODO: change to array of buses to display buses and create join rooms for  several buses nearest
      setBuses(result);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return { buses };
}
