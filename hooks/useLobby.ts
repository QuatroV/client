import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const useLobby = () => {
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );

  const [roomId, setRoomId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const initSockets = async () => {
      await fetch("/api/sockets/lobby");
      socketRef.current = io();

      socketRef.current.on("room-created", (msg) => {
        console.log("room-created ", msg);
        setRoomId(msg);
      });

      socketRef.current.on("room-not-found", (msg) => {
        console.log("room-not-found", msg);
      });

      socketRef.current.on("room-gathered", (msg) => {
        localStorage.setItem("session", JSON.stringify(msg));
        router.push("/game");
      });
    };

    initSockets();

    return () => {
      if (socketRef.current)
        // при размонтировании компонента выполняем отключение сокета
        socketRef.current.disconnect();
    };
  }, []);

  const createRoom = () => {
    if (!socketRef.current) {
      console.error("Socket not connected!");
      return;
    }
    socketRef.current.emit("create-room");
  };

  const joinRoom = (roomId: string) => {
    if (!socketRef.current) {
      console.error("Socket not connected!");
      return;
    }
    socketRef.current.emit("join-room", { roomId });
  };

  return { createRoom, roomId, joinRoom };
};
