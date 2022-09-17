import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import styled, { css } from "styled-components";
import { useGame } from "../../hooks/useGame";
import Modal from "../shared/Modal";
import Dice from "./components/Dice";

const GameApp = ({
  setPage,
  socket,
}: {
  setPage: (page: string) => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}) => {
  const {
    activePlayer,
    currentPlayer,
    opponentPlayer,
    makeTurn,
    gameState,
    currentDice,
    myScore,
    opponentScore,
    winner,
  } = useGame(socket);

  if (!gameState || !currentPlayer || !opponentPlayer || !currentDice) {
    console.log(gameState, currentPlayer, opponentPlayer, currentDice);
    return null;
  }
  console.log("currentPlayer ", currentPlayer);

  const myBoardState = gameState[currentPlayer];
  const opponentBoardState = gameState[opponentPlayer];

  console.log(
    "currentPlayer ",
    currentPlayer,
    "myBoardState ",
    myBoardState,
    "opponentBoardState ",
    opponentBoardState
  );

  const handleClick = (pos1: number, pos2: number) => {
    if (activePlayer !== currentPlayer) {
      console.error("Its not your turn yet");
      return;
    }
    const newState = gameState;
    newState[currentPlayer][pos1][pos2] = currentDice;
    makeTurn(newState);
  };

  const handleCloseEndGameModal = () => setPage("home");

  return (
    <GameAppContainer>
      <Modal isOpen={Boolean(winner)} onClose={handleCloseEndGameModal}>
        <p>{winner === currentPlayer ? "You won!!!" : "You lost :("}</p>
        <button onClick={handleCloseEndGameModal}>Return to main page</button>
      </Modal>
      <BoardsContainer>
        <Board $isActive={activePlayer === opponentPlayer}>
          <Column>
            <Dice side={opponentBoardState[0][0]} />
            <Dice side={opponentBoardState[0][1]} />
            <Dice side={opponentBoardState[0][2]} />
          </Column>
          <Column>
            <Dice side={opponentBoardState[1][0]} />
            <Dice side={opponentBoardState[1][1]} />
            <Dice side={opponentBoardState[1][2]} />
          </Column>
          <Column>
            <Dice side={opponentBoardState[2][0]} />
            <Dice side={opponentBoardState[2][1]} />
            <Dice side={opponentBoardState[2][2]} />
          </Column>
        </Board>
        <ScoreContainer>
          <Score>
            <MyScore $isWinning={myScore >= opponentScore}>{myScore}</MyScore> /{" "}
            <OpponentScore $isWinning={myScore <= opponentScore}>
              {opponentScore}
            </OpponentScore>
          </Score>
        </ScoreContainer>
        <Board $isActive={activePlayer === currentPlayer}>
          <Column>
            <Dice side={myBoardState[0][0]} onClick={() => handleClick(0, 0)} />
            <Dice side={myBoardState[0][1]} onClick={() => handleClick(0, 1)} />
            <Dice side={myBoardState[0][2]} onClick={() => handleClick(0, 2)} />
          </Column>
          <Column>
            <Dice side={myBoardState[1][0]} onClick={() => handleClick(1, 0)} />
            <Dice side={myBoardState[1][1]} onClick={() => handleClick(1, 1)} />
            <Dice side={myBoardState[1][2]} onClick={() => handleClick(1, 2)} />
          </Column>
          <Column>
            <Dice side={myBoardState[2][0]} onClick={() => handleClick(2, 0)} />
            <Dice side={myBoardState[2][1]} onClick={() => handleClick(2, 1)} />
            <Dice side={myBoardState[2][2]} onClick={() => handleClick(2, 2)} />
          </Column>
        </Board>
      </BoardsContainer>
      <Dice side={currentDice} />
    </GameAppContainer>
  );
};

const GameAppContainer = styled.div`
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
  gap: 16px;
`;

const glassCSS = css`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 16px;
`;

const Board = styled.div<{ $isActive: boolean }>`
  ${glassCSS}
  display: flex;

  ${({ $isActive }) =>
    $isActive &&
    css`
      outline: 3px solid white;
      box-shadow: 0 4px 30px rgba(0, 0, 0);
      transform: scale(1.05);
      transition: all 0.5s ease-out;
    `}
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Score = styled.div`
  color: white;
  font-size: xx-large;
  font-family: monospace;
  border-radius: 40px;
  padding: 16px;
  border: 2px solid white;
  background: rgb(197 197 197 / 28%);
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  flex: 1;
`;

const BoardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MyScore = styled.div<{ $isWinning: boolean }>`
  ${({ $isWinning }) => $isWinning && css``}
`;

const OpponentScore = styled.div<{ $isWinning: boolean }>`
  ${({ $isWinning }) => $isWinning && css``}
`;

export default GameApp;
