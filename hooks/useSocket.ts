import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    const initSockets = async () => {
      await fetch("/api/sockets/lobby");
      setSocket(io());
    };

    initSockets();

    return () => {
      if (socket)
        // при размонтировании компонента выполняем отключение сокета
        socket.disconnect();
    };
  }, []);

  return { socket };
};
