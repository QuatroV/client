import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket: any;

const Home: NextPage = () => {
  useEffect(() => {
    socketInitializer();
  }, []);

  const [messages, setMessages] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update-input", (msg: string) => {
      console.log("msg ", msg);
      setMessages((state) => [...state, msg]);
    });
  };

  const handleSend = () => {
    console.log(socket);
    socket.emit("input-change", draft);
  };

  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
      <input type="text" onChange={(e) => setDraft(e.target.value)} />
      <button onClick={handleSend}>Send message</button>
    </div>
  );
};

export default Home;
