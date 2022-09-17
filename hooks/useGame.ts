import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Session } from "../db/types";

export const useGame = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
) => {
  const currentPlayer = useRef<string | null>(null);
  const opponentPlayer = useRef<string | null>(null);
  const currentSession = useRef<Session | null>(null);
  const [gameState, getGameState] = useState<
    Record<string, number[][]> | undefined
  >(undefined);
  const [activePlayer, setActivePlayer] = useState<string | undefined>();
  const [currentDice, setCurrentDice] = useState<number | undefined>();
  const [myScore, setMyScore] = useState<number | undefined>();
  const [opponentScore, setOpponentScore] = useState<number | undefined>();

  useEffect(() => {
    const initSockets = async () => {
      if (!socket) return;
      const sessionFromLocalStore = localStorage.getItem("session");
      const socketIdFromLocalStore = localStorage.getItem("socketId");
      if (!socketIdFromLocalStore) {
        throw new Error("No socketId found in local storage");
      }
      currentPlayer.current = JSON.parse(socketIdFromLocalStore);
      if (!sessionFromLocalStore) {
        throw new Error("No session object found in local storage");
      }
      const session = JSON.parse(sessionFromLocalStore);
      currentSession.current = session;
      opponentPlayer.current =
        session.firstUserId === currentPlayer.current
          ? session.secondUserId
          : session.firstUserId;
      const urlParams = new URLSearchParams(Object.entries(session));

      socket.on("game-start", (msg) => {
        console.log("aaaaaa123");
        console.log("game-start ", msg);
        const {
          activePlayer: activePlayerFromServer,
          gameState: gameStateFromServer,
          currentDice: currentDiceFromServer,
        } = msg;
        setActivePlayer(activePlayerFromServer);
        getGameState(gameStateFromServer);
        setCurrentDice(currentDiceFromServer);
      });

      socket.on("turn-start", (msg) => {
        console.log("turn-start ", msg);
        const {
          activePlayer: activePlayerFromServer,
          gameState: gameStateFromServer,
          currentDice: currentDiceFromServer,
          scores,
        } = msg;
        setActivePlayer(activePlayerFromServer);
        getGameState(gameStateFromServer);
        setCurrentDice(currentDiceFromServer);
        if (!currentPlayer.current || !opponentPlayer.current) {
          console.error("Missing current or opponent player id");
          return;
        }
        setMyScore(scores[currentPlayer.current]);
        setOpponentScore(scores[opponentPlayer.current]);
      });

      socket.emit("player-ready", session);
    };

    initSockets();
  }, [socket]);

  const makeTurn = (newGameState: Record<string, number[][]>) => {
    if (!socket) {
      console.error("Socket not connected!");
      return;
    }
    console.log("newGameState ", newGameState);
    socket.emit("turn-request", {
      newGameState,
      sessionId: currentSession.current?.id,
      roomId: currentSession.current?.roomId,
    });
  };

  return {
    gameState,
    activePlayer,
    currentPlayer: currentPlayer.current,
    opponentPlayer: opponentPlayer.current,
    makeTurn,
    currentDice,
    myScore,
    opponentScore,
  };
};
