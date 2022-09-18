import styled from "styled-components";

const Button = styled.button`
  padding: 16px 32px;
  border-radius: 32px;
  background: transparent;
  color: white;
  border: 1px solid;

  &:active,
  &:hover {
    background: white;
    color: black;
  }
`;

export default Button;
