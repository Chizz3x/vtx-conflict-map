import React from "react";
import styled from "styled-components";
import type { TabKey } from "../vtx";

type Props = {
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

const Tabs = ({ tab, onTabChange }: Props) => {
  return (
    <TabsStyle role="tablist">
      <button
        type="button"
        role="tab"
        className={tab === "matrix" ? "tab is-active" : "tab"}
        onClick={() => onTabChange("matrix")}
      >
        Conflict matrix
      </button>
      <button
        type="button"
        role="tab"
        className={tab === "bands" ? "tab is-active" : "tab"}
        onClick={() => onTabChange("bands")}
      >
        Band gaps
      </button>
    </TabsStyle>
  );
};

export { Tabs };

const TabsStyle = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border};
  background: ${({ theme }) => theme.palette.surface};

  .tab {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: 14px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.palette.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.palette.surface};
    color: ${({ theme }) => theme.palette.text.secondary};
    transition: border-color 0.12s ease, color 0.12s ease;

    &:hover {
      color: ${({ theme }) => theme.palette.primary};
      border-color: ${({ theme }) => theme.palette.primary};
    }

    &.is-active {
      color: ${({ theme }) => theme.palette.primary};
      border-color: ${({ theme }) => theme.palette.primary};
      font-weight: 600;
    }
  }
`;
