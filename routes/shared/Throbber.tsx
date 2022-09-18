import styled, { keyframes } from "styled-components";

const Throbber = ({ size }: { size: number }) => {
  return (
    <ThrobberContainer size={size}>
      <div /> <div />
    </ThrobberContainer>
  );
};

const ripple = (num: number) => keyframes` 
    0% {
      top: ${num}px;
      left: ${num}px;
      width: 0;
      height: 0;
      opacity: 0;
    }
    4.9% {
      top: ${num}px;
      left: ${num}px;
      width: 0;
      height: 0;
      opacity: 0;
    }
    5% {
      top: ${num}px;
      left: ${num}px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: ${num * 2}px;
      height: ${num * 2}px;
      opacity: 0;
    }`;

const ThrobberContainer = styled.div<{ size?: number }>`
  display: inline-block;
  position: relative;
  width: ${({ size }) => (size || 24) * 2}px;
  height: ${({ size }) => (size || 24) * 2}px;

  > div {
    position: absolute;
    border: 2px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: ${({ size }) => ripple(size || 24)} 1s
      cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  div:nth-child(2) {
    animation-delay: -0.5s;
  }
`;

export default Throbber;
