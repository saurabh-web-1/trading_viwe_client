// src/hooks/useAlertEngine.js
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export function useAlertEngine(onTrigger) {
  useEffect(() => {
    socket.on("alert_triggered", (data) => {
      onTrigger(data);
    });

    return () => socket.off("alert_triggered");
  }, []);
}
