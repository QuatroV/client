import { Server } from "socket.io";
import {
  addActivePlayerAndGameStateToSession,
  addSecondUserToSession,
  createSession,
  findSessionByRoomId,
  updateGameStateInSession,
} from "../../../db/requests";
import { generateDiceSide, generateRoomId } from "../../../utils";

const calcTotalScore = (arr: number[][]) => {
  return arr.reduce((prevRes, col) => {
    let valObj: Record<string, number> = {};
    col.forEach((el) => {
      if (!valObj[el]) {
        valObj[el] = 1;
      } else {
        valObj[el] += 1;
      }
    });

    return (
      prevRes +
      Object.entries(valObj).reduce(
        (res, [key, val]) => res + Number(key) * val * val,
        0
      )
    );
  }, 0);
};

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("create-room", async (msg) => {
        const roomId = generateRoomId();
        console.log("roomId ", roomId);
        await createSession({
          roomId: roomId,
          firstUserId: socket.id,
          secondUserId: undefined,
        });
        socket.join(String(roomId));
        io.to(String(roomId)).emit("room-created", roomId);
      });

      socket.on("join-room", async (props) => {
        const { roomId } = props;
        const session = await findSessionByRoomId(roomId);

        if (!session) {
          socket.emit("room-not-found", roomId);
        } else {
          const session = await addSecondUserToSession(roomId, socket.id);
          socket.join(String(roomId));
          io.to(String(roomId)).emit("room-gathered", session);
        }
      });

      socket.on("player-ready", async (msg) => {
        console.log("AAAAAAAAAA ", msg, "req.query ", req.query);
        const { id: sessionId, roomId } = msg;
        const session = await addActivePlayerAndGameStateToSession(
          Number(sessionId)
        );
        const currentDice = generateDiceSide();
        console.log("ssesion", session);
        io.to(String(roomId)).emit("game-start", {
          ...session,
          currentDice,
        });
      });

      socket.on("turn-request", async (msg) => {
        console.log("turn requset ", msg);
        const session = await updateGameStateInSession(
          msg.sessionId,
          msg.newGameState
        );
        if (!session || !session.gameState || !session.secondUserId) {
          console.error("Missing properties");
          return;
        }
        const scores = {
          [session.firstUserId]: calcTotalScore(
            session.gameState[session.firstUserId]
          ),

          [session.secondUserId]: calcTotalScore(
            session.gameState[session.secondUserId]
          ),
        };
        const currentDice = generateDiceSide();
        io.to(String(msg.roomId)).emit("turn-start", {
          ...session,
          currentDice,
          scores,
        });
      });
    });
  }
  res.end();
};

export default SocketHandler;
