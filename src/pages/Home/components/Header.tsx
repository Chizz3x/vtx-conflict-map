import React from "react";
import styled from "styled-components";
import type { ThemeMode } from "@theme/index";

type Props = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

const Header = ({ mode, onToggleTheme }: Props) => {
  return (
    <HeaderStyle>
      <h1 className="title">VTX Band Conflict Map</h1>
      <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {mode === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </HeaderStyle>
  );
};

export { Header };

const HeaderStyle = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border};
  background: ${({ theme }) => theme.palette.surface};

  .title {
    margin: 0;
    font-size: 24px;
  }

  .theme-toggle {
    flex-shrink: 0;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: 14px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.palette.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.palette.surface};
    color: ${({ theme }) => theme.palette.text.primary};

    &:hover {
      border-color: ${({ theme }) => theme.palette.primary};
    }
  }
`;
