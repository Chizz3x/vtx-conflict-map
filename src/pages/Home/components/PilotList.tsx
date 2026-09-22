import React from "react";
import styled from "styled-components";

export type Pilot = { code: string; freq: number; name: string };

type Props = {
  pilots: Pilot[];
  expanded: boolean;
  noedit: boolean;
  onToggle: () => void;
  onRename: (code: string, name: string) => void;
};

const PilotList = ({ pilots, expanded, noedit, onToggle, onRename }: Props) => {
  return (
    <PilotListStyle className="pilot-list">
      <button type="button" className="pilot-toggle" onClick={onToggle} aria-expanded={expanded}>
        <span className={expanded ? "chevron open" : "chevron"} />
        <span>Pilots ({pilots.length})</span>
      </button>
      {expanded && (
        <div className="panel">
          {pilots.length === 0 ? (
            <span className="empty">No channels selected.</span>
          ) : (
            <table className="pilot-table">
              <tbody>
                {pilots.map((pilot) => (
                  <tr key={pilot.code}>
                    <td className="channel">
                      {pilot.code} ({pilot.freq})
                    </td>
                    <td className="name">
                      <input
                        type="text"
                        value={pilot.name}
                        disabled={noedit}
                        placeholder="Name"
                        onChange={(e) => onRename(pilot.code, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </PilotListStyle>
  );
};

export { PilotList };

const PilotListStyle = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-top: none;
  border-radius: 0 0 ${({ theme }) => theme.radius.sm} ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.palette.surface};

  .pilot-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.xs};
    width: 100%;
    padding: 6px 10px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.palette.text.primary};

    &:hover {
      color: ${({ theme }) => theme.palette.primary};
    }
  }

  .chevron {
    width: 6px;
    height: 6px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg);
    transition: transform 0.15s ease;

    &.open {
      transform: rotate(225deg);
    }
  }

  .panel {
    max-height: 220px;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.xs};
    text-align: left;
  }

  .empty {
    display: block;
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: 13px;
    color: ${({ theme }) => theme.palette.text.secondary};
    text-align: center;
  }

  .pilot-table {
    width: 100%;
    border-collapse: collapse;

    td {
      border: none;
      padding: 4px 8px;
      font-size: 13px;
      background: transparent;
      color: ${({ theme }) => theme.palette.text.primary};
    }

    .channel {
      width: 1%;
      white-space: nowrap;
      color: ${({ theme }) => theme.palette.text.secondary};
    }

    .name input {
      width: 100%;
      padding: ${({ theme }) => theme.spacing.xs};
      font-size: 13px;
      border: 1px solid ${({ theme }) => theme.palette.border};
      border-radius: ${({ theme }) => theme.radius.sm};
      background: ${({ theme }) => theme.palette.surface};
      color: ${({ theme }) => theme.palette.text.primary};

      &:disabled {
        cursor: default;
        opacity: 0.8;
        border-color: transparent;
      }
    }
  }
`;
