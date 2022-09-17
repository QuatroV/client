import type { NextPage } from "next";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";
import GameApp from "../routes/game/GameApp";
import HomeApp from "../routes/home/HomeApp";

const Home: NextPage = () => {
  const { socket } = useSocket();
  console.log(socket);
  const [page, setPage] = useState("home");
  switch (page) {
    case "home":
      return <HomeApp setPage={setPage} socket={socket} />;

    case "game":
      return <GameApp setPage={setPage} socket={socket} />;
    default:
      return <div />;
  }
};

export default Home;
