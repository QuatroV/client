import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import GameApp from "../routes/game/GameApp";
import HomeApp from "../routes/home/HomeApp";

const Home: NextPage = () => {
  const { socket } = useSocket();
  const [page, setPage] = useState("home");

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });

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
