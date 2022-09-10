import { Server } from "socket.io";
import { User, Session, Room } from "../../db/models";
import { generateRoomId } from "../../utils";

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
        const room = await Room.create({ roomCode: roomId });
        let user = await User.findOne({
          where: { socketId: socket.id },
        });
        if (!user) {
          user = await User.create({
            socketId: socket.id,
          });
        }
        await Session.create({
          roomId: room.get("id"),
          firstUserId: user.get("id"),
        });
        socket.emit("room-created", roomId);
      });

      socket.on("join-room", async (props) => {
        const { roomId } = props;
        const room = await Room.findOne({ where: { roomCode: roomId } });
        if (!room) {
          socket.emit("room-not-found", roomId);
          return;
        }
        const session = await Session.findOne({
          where: { roomId: room?.get("id") },
        });

        if (!session) {
          socket.emit("room-not-found", roomId);
        } else {
          socket.join(roomId);
          const user = await User.create({
            socketId: socket.id,
          });
          await session.update({ secondUserId: user.get("id") });
          socket.emit("room-joined", roomId);
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
