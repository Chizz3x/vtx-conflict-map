import React from "react";
import styled from "styled-components";
import { CSSMediaSize } from "@utils/css-media-size";
import {
  VTX_BANDS,
  CellId,
  conflictWithOtherSelections,
  conflictWithSelections,
  isCellSelected,
} from "../vtx";
import { Pilot, PilotList } from "./PilotList";

type Props = {
  selectedCells: CellId[];
  multiSelect: boolean;
  hardMhz: number;
  mildMhz: number;
  onToggleCell: (cell: CellId) => void;
  pilots: Pilot[];
  expanded: boolean;
  noedit: boolean;
  onTogglePilots: () => void;
  onRename: (code: string, name: string) => void;
};

const MatrixTable = ({
  selectedCells,
  multiSelect,
  hardMhz,
  mildMhz,
  onToggleCell,
  pilots,
  expanded,
  noedit,
  onTogglePilots,
  onRename,
}: Props) => {
  return (
    <MatrixTableStyle className={noedit ? "readonly" : undefined}>
      <div className="table-block">
        <div className="scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Band / Ch</th>
                {Array.from({ length: 8 }, (_, i) => (
                  <th key={i}>{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VTX_BANDS.map((band, b) => (
                <tr key={band.name}>
                  <th>{band.name}</th>
                  {band.freqs.map((freq, c) => {
                    const cell: CellId = { band: b, channel: c };
                    const cellSelected = isCellSelected(selectedCells, cell);
                    let className = "";
                    if (cellSelected) {
                      className = "selected";
                      const lvl = conflictWithOtherSelections(
                        selectedCells,
                        hardMhz,
                        mildMhz,
                        b,
                        c,
                      );
                      if (lvl === "hard") className += " selected-hard";
                      else if (lvl === "mild") className += " selected-mild";
                    } else {
                      className = conflictWithSelections(selectedCells, hardMhz, mildMhz, b, c);
                    }
                    return (
                      <td
                        key={c}
                        className={className}
                        title={`${band.name}${c + 1} - ${freq} MHz`}
                        onClick={noedit ? undefined : () => onToggleCell(cell)}
                      >
                        {freq}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {multiSelect && (
          <PilotList
            pilots={pilots}
            expanded={expanded}
            noedit={noedit}
            onToggle={onTogglePilots}
            onRename={onRename}
          />
        )}
      </div>
    </MatrixTableStyle>
  );
};

export { MatrixTable };

const MatrixTableStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;

  .table-block {
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
  }

  .scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid ${({ theme }) => theme.palette.border};
    margin: 0 auto;
    font-size: 13px;

    th,
    td {
      border-right: 1px solid ${({ theme }) => theme.palette.border};
      border-bottom: 1px solid ${({ theme }) => theme.palette.border};
      padding: 6px 10px;
      text-align: center;
      min-width: 52px;
    }

    thead th,
    tbody th {
      background: ${({ theme }) => theme.palette.surface};
      font-weight: 600;
      color: ${({ theme }) => theme.palette.text.primary};
    }

    thead th:first-child,
    tbody th {
      position: sticky;
      left: 0;
      z-index: 1;
    }

    thead th:first-child {
      z-index: 2;
    }

    td {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.12s ease;
      background: ${({ theme }) => theme.palette.surface};
      color: ${({ theme }) => theme.palette.text.primary};

      &.hard {
        background: ${({ theme }) => theme.palette.conflict.hard};
        color: ${({ theme }) => theme.palette.conflict.hardText};
      }

      &.mild {
        background: ${({ theme }) => theme.palette.conflict.mild};
        color: ${({ theme }) => theme.palette.conflict.mildText};
      }

      &.selected {
        color: ${({ theme }) => theme.palette.text.primary};
        outline: 2px solid ${({ theme }) => theme.palette.selected.border};
        outline-offset: -2px;
      }

      &.selected-hard {
        outline: 2px solid ${({ theme }) => theme.palette.conflict.hard};
        outline-offset: -2px;
      }

      &.selected-mild {
        outline: 2px solid ${({ theme }) => theme.palette.conflict.mild};
        outline-offset: -2px;
      }
    }

    ${CSSMediaSize.phone} {
      font-size: 12px;

      th,
      td {
        padding: 4px 6px;
        min-width: 40px;
      }
    }
  }
`;
