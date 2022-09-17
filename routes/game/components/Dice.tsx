import { memo } from "react";
import styled, { css } from "styled-components";

const Dice = ({ side, onClick }: { side: number; onClick?: () => void }) => {
  return (
    <DiceSide $totalCount={side} onClick={onClick}>
      {side > 0 &&
        side < 4 &&
        Array(side)
          .fill(undefined)
          .map((el, index) => <Dot key={index} />)}
      {side === 4 && (
        <>
          <Column>
            <Dot />
            <Dot />
          </Column>
          <Column>
            <Dot />
            <Dot />
          </Column>
        </>
      )}
      {side === 5 && (
        <>
          <Column>
            <Dot />
            <Dot />
          </Column>
          <Column>
            <Dot />
          </Column>
          <Column>
            <Dot />
            <Dot />
          </Column>
        </>
      )}
      {side === 6 && (
        <>
          <Column>
            <Dot />
            <Dot />
            <Dot />
          </Column>
          <Column>
            <Dot />
            <Dot />
            <Dot />
          </Column>
        </>
      )}
    </DiceSide>
  );
};

const DiceSide = styled.div<{ $totalCount: number }>`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: white;
  border: 1px solid black;
  padding: 8px;
  margin: 4px;

  ${({ $totalCount }) => {
    switch ($totalCount) {
      case 0:
        return css`
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgb(126 126 126 / 20%);
        `;
      case 1:
        return css`
          display: flex;
          justify-content: center;
          align-items: center;
        `;
      case 2:
        return css`
          display: flex;
          justify-content: space-between;

          ${Dot}:nth-of-type(2) {
            align-self: flex-end;
          }
        `;
      case 3:
        return css`
          display: flex;

          justify-content: space-between;

          ${Dot}:nth-of-type(3) {
            align-self: flex-end;
          }

          ${Dot}:nth-of-type(2) {
            align-self: center;
          }
        `;
      case 4:
        return css`
          display: flex;

          justify-content: space-between;

          ${Column} {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        `;
      case 5:
        return css`
          display: flex;

          justify-content: space-between;

          ${Column} {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          ${Column}:nth-of-type(2) {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        `;
      case 6:
        return css`
          display: flex;

          justify-content: space-between;

          ${Column} {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        `;
    }
  }};
`;

const Dot = styled.div`
  height: 12px;
  background-color: black;
  width: 12px;
  border-radius: 50%;
`;

const Column = styled.div``;

export default memo(Dice);
