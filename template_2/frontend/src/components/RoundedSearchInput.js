import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: 1px solid #ffffff80;
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  background: black;
  color: white;

  &:focus {
    border-color: white;
    background: black;
  }

  &::placeholder {
    color: #ffffff80;
  }
`;

const SubmitButton = styled.button`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ffffff80;

    svg {
      color: white;
      transform: translateX(2px);
    }
  }

  svg {
    width: 20px;
    height: 20px;
    color: black;
    transition: all 0.2s;
  }
`;

const RoundedSearchInput = ({ placeholder, onSubmit, hasEnter = true }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target.querySelector('input').value;
    onSubmit?.(value);
  };

  return (
    <InputWrapper as="form" onSubmit={handleSubmit}>
      <Input 
        type="text" 
        placeholder={placeholder}
      />
      {hasEnter && (
        <SubmitButton type="submit">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </SubmitButton>
      )}
    </InputWrapper>
  );
};

export default RoundedSearchInput; 