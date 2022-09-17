import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const useLobby = (
  setPage: (page: string) => void,
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
) => {
  const [roomId, setRoomId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!socket) return;
    socket.on("room-created", (msg) => {
      console.log("room-created ", msg);
      setRoomId(msg);
    });

    socket.on("room-not-found", (msg) => {
      console.log("room-not-found", msg);
    });

    socket.on("room-gathered", (msg) => {
      localStorage.setItem("session", JSON.stringify(msg));
      localStorage.setItem("socketId", JSON.stringify(socket.id));
      setPage("game");
    });
  }, [setPage, socket]);

  const createRoom = () => {
    if (!socket) {
      console.error("Socket not connected!");
      return;
    }
    socket.emit("create-room");
  };

  const joinRoom = (roomId: string) => {
    if (!socket) {
      console.error("Socket not connected!");
      return;
    }
    socket.emit("join-room", { roomId });
  };

  return { createRoom, roomId, joinRoom };
};
