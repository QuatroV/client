import { Server } from "socket.io";
import {
  addSecondUserToSession,
  createSession,
  findSessionByRoomId,
} from "../../../db/requests";
import { generateRoomId } from "../../../utils";

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("input-change", (msg) => {
        socket.broadcast.emit("update-input", msg);
      });

      socket.on("create-room", async (msg) => {
        const roomId = generateRoomId();
        await createSession({
          roomId: roomId,
          firstUserId: socket.id,
          secondUserId: undefined,
        });
        socket.emit("room-created", roomId);
      });

      socket.on("join-room", async (props) => {
        const { roomId } = props;
        const session = await findSessionByRoomId(roomId);

        if (!session) {
          socket.emit("room-not-found", roomId);
        } else {
          socket.join(roomId);
          const session = await addSecondUserToSession(roomId, socket.id);
          socket.emit("room-gathered", session);
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
