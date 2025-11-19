import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Coordinates } from "./useRoutes";

const socket = io(
  __DEV__
    ? `ws://${Constants.expoConfig?.hostUri?.split(":").shift()}:3000`
    : "wss://suba-api.onrender.com",
  {}
);

type Bus = {
  id: string;
  coordinate: Coordinates;
};

export function useBusesPosition() {
  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.info("🟢 Conectado al servidor de sockets.");
    });

    socket.on("disconnect", (reason) => {
      console.info(`🔴 Server disconnected. REASON: ${reason}`);
      if (reason === "io server disconnect") {
        console.log("Retry reconnect");
        socket.connect();
      }
    });

    socket.on("reconnect", (attemptNumber) => {
      console.info(
        `🟡 Successfully reconnected after ${attemptNumber} attempts.`
      );
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connect error: ", err.message);
    });

    socket.on("message", (message) => {
      const result = JSON.parse(message);
      setBuses(result);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.off("connect_error");
      socket.off("message");
    };
  }, []);

  return { buses };
}
