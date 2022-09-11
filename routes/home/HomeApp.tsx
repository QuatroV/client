import { useState } from "react";
import styled from "styled-components";
import { useLobby } from "../../hooks/useLobby";
import Modal from "../shared/Modal";

const HomeApp = () => {
  return <GameAppContainer></GameAppContainer>;
};

const GameAppContainer = styled.div`
  width: 100%;
  height: 100vh;
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
