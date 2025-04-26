import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  height: 45px;
  padding: 0 24px;
  border-radius: 50px;
  font-size: 1rem;
  background: white;
  color: black;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #ffffff80;
    color: white;
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;

const RoundedButton = ({ children, onClick, ...props }) => {
  return (
    <StyledButton onClick={onClick} {...props}>
      {children}
    </StyledButton>
  );
};

export default RoundedButton; 