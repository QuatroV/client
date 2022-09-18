import Image from "next/image";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import styled from "styled-components";
import { useLobby } from "../../hooks/useLobby";
import Modal from "../shared/Modal";
import Throbber from "../shared/Throbber";
import copyIcon from "../../public/copy.svg";
import rollingDicesIcon from "../../public/rolling-dices.svg";
import Button from "../shared/Button";

const HomeApp = ({
  setPage,
  socket,
}: {
  setPage: (page: string) => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}) => {
  const { createRoom, roomId, joinRoom, setRoomId } = useLobby(setPage, socket);
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [showCode, setShowCode] = useState(true);

  const handleCreateGame = () => {
    setRoomId(null);
    createRoom();
    setShowCreateGameModal(true);
  };

  const handleJoinGame = () => {
    joinRoom(roomCode);
    setShowJoinGameModal(false);
  };

  const handleCopyCode = () => {
    if (roomId) {
      setShowCode(false);
      navigator.clipboard.writeText(String(roomId));
    }
  };

  useEffect(() => {
    if (!showCode) {
      setTimeout(() => setShowCode(true), 1000);
    }
  }, [showCode]);

  return (
    <HomeAppContainer>
      <Modal
        isOpen={showCreateGameModal}
        onClose={() => setShowCreateGameModal(false)}
      >
        <ModalContent>
          <ModalTitle>Create game</ModalTitle>
          <HorizontalLine />
          <ModalText>
            Tell a friend your code below to start game. Game will start
            automatically as your friend connects to your room
            <RoomCodeContainer onClick={handleCopyCode}>
              {(roomId && (
                <RoomCode>
                  {showCode ? (
                    <>
                      {roomId}{" "}
                      <Image src={copyIcon} alt="" height={24} width={24} />
                    </>
                  ) : (
                    "Copied!"
                  )}
                </RoomCode>
              )) || <Throbber size={20} />}
            </RoomCodeContainer>
          </ModalText>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showJoinGameModal}
        onClose={() => setShowJoinGameModal(false)}
      >
        <ModalContent>
          <ModalTitle>Join game</ModalTitle>
          <HorizontalLine />
          <ContentWrapper>
            <ModalText>
              Ask your friend to give you the code to connect to the room
            </ModalText>
            <Input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              type="number"
              min="0000"
              max="9999"
            />
            <Button onClick={handleJoinGame}>Join</Button>
          </ContentWrapper>
        </ModalContent>
      </Modal>
      <Modal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)}>
        <ModalTitle>Game rules</ModalTitle>
        <HorizontalLine />
        <ModalContent>
          <ContentWrapper>
            <ModalText>
              Players turns rolling a six-sided die and placing it in one of
              three columns. Each die is worth the equivalent amount of points
              on its face; that is to say, a die with the number 5 on top is
              worth 5 points, a die with the number 3 on top is worth 3 points,
              and so on.
              <Subtitle>Combos & wipes</Subtitle>
              The real trick, however, comes down to the combos - placing two of
              the same number in a column will significantly multiply your
              score. Combos are great for racking up your score, but
              there&apos;s one more important rule: placing a die removes all
              dice of the same number on your opponents board. It doesn&apos;t
              matter if you have three 6s in a column on your side -- if your
              opponent can place one 6 in their column on the opposite side, it
              will wipe out all of your dice in that column.
              <Subtitle>End of the game</Subtitle>A game of Knucklebones ends
              when one player fills up their side of the board with dice. And
              yes, that means it&apos;s possible for someone to end the game by
              placing their last die and lose because they have a lower score
              than their opponent.
            </ModalText>
            <Button onClick={() => setShowRulesModal(false)}>Clear</Button>
          </ContentWrapper>
        </ModalContent>
      </Modal>
      <ContentContainer>
        <Image src={rollingDicesIcon} alt="" height={96} width={96} />
        <Title>Knucklebones</Title>
        <Button onClick={handleCreateGame}>Create game</Button>
        <Button onClick={() => setShowJoinGameModal(true)}>Join game</Button>
        <Button onClick={() => setShowRulesModal(true)}>Show rules</Button>
      </ContentContainer>
    </HomeAppContainer>
  );
};

const RoomCodeContainer = styled.div`
  display: flex;
  padding: 16px;
  justify-content: center;
  font-size: 34px;
  color: white;
  border: 1px solid #7d84ad;
  border-radius: 16px;
  background: linear-gradient(153deg, #4b6cb7 0%, #182848 100%);
  transition: all 0.5s ease-out;

  &:active {
    filter: brightness(60%);
  }
`;

const RoomCode = styled.code``;

const Subtitle = styled.h4`
  margin: 0;
`;

const Title = styled.h1`
  margin: 0px;
  color: white;
`;

const ModalTitle = styled.h2`
  margin: 0px;
  color: white;
`;

const Input = styled.input`
  border: none;
  padding: 16px;
  border-radius: 16px;
  width: 100%;
  box-sizing: border-box;
`;

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

const ModalText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: white;
  text-align: justify;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const HorizontalLine = styled.hr`
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default HomeApp;
