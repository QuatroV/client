import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const useGame = () => {
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );

  useEffect(() => {
    const initSockets = async () => {
      const sessionFromLocalStore = localStorage.getItem("session");
      if (!sessionFromLocalStore) {
        throw new Error("No session object found in local storage");
      }
      const session = JSON.parse(sessionFromLocalStore);
      const urlParams = new URLSearchParams(Object.entries(session));

      await fetch(`/api/sockets/game?${urlParams}`);
      socketRef.current = io();

      socketRef.current.on("room-created", (msg) => {
        console.log("room-created ", msg);
      });
    };

    initSockets();

    return () => {
      if (socketRef.current)
        // при размонтировании компонента выполняем отключение сокета
        socketRef.current.disconnect();
    };
  }, []);

  return {};
};
