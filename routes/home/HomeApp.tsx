import { useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import styled from "styled-components";
import { useLobby } from "../../hooks/useLobby";
import Modal from "../shared/Modal";

const HomeApp = ({
  setPage,
  socket,
}: {
  setPage: (page: string) => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}) => {
  const { createRoom, roomId, joinRoom } = useLobby(setPage, socket);
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const handleCreateGame = () => {
    createRoom();
    setShowCreateGameModal(true);
  };

  const handleJoinGame = () => {
    joinRoom(roomCode);
    setShowJoinGameModal(false);
  };

  return (
    <HomeAppContainer>
      <Modal
        isOpen={showCreateGameModal}
        onClose={() => setShowCreateGameModal(false)}
      >
        <ModalTitle>Create game</ModalTitle>
        <RoomCode>{roomId}</RoomCode>
      </Modal>
      <Modal
        isOpen={showJoinGameModal}
        onClose={() => setShowJoinGameModal(false)}
      >
        <ModalTitle>Join game</ModalTitle>
        <Input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
        <Button onClick={handleJoinGame}>Join</Button>
      </Modal>
      <ContentContainer>
        <Title>Knucklebones</Title>
        <Button onClick={handleCreateGame}>Create game</Button>
        <Button onClick={() => setShowJoinGameModal(true)}>Join game</Button>
      </ContentContainer>
    </HomeAppContainer>
  );
};

const RoomCode = styled.code``;

const Title = styled.h1`
  margin: 0px;
  color: white;
`;

const ModalTitle = styled.h3`
  margin: 0px;
  color: white;
`;

const Input = styled.input``;

const Button = styled.button``;

const ContentContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  gap: 8px;
`;

const HomeAppContainer = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background: rgb(0, 39, 154);
  background: radial-gradient(
    circle,
    rgba(0, 39, 154, 1) 0%,
    rgba(0, 1, 41, 1) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default HomeApp;
