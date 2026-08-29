import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterStyle>
      <span>Analog 5.8 GHz - VTX band conflict map</span>
      <span> | </span>
      <a className="link" href="https://chizz3x.space" target="_blank" rel="noopener noreferrer">
        chizz3x.space
      </a>
    </FooterStyle>
  );
};

export { Footer };

const FooterStyle = styled.footer`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.palette.border};
  background: ${({ theme }) => theme.palette.surface};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 13px;

  .link {
    color: ${({ theme }) => theme.palette.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
