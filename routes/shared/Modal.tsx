import { ReactNode } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return isOpen
    ? createPortal(
        <ModalBackground
          onClick={(e) => {
            onClose();
          }}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {children}
          </ModalContent>
        </ModalBackground>,
        document.body
      )
    : null;
};

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  background: #0000006f 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 16px;
  width: 80%;
  text-shadow: 4px 4px 20px rgb(0 0 0);
`;

export default Modal;
