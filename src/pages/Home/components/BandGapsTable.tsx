import React from "react";
import styled from "styled-components";
import { CSSMediaSize } from "@utils/css-media-size";
import { BAND_MATRIX_ORDER, bandMatrix, classifyGap } from "../vtx";

type Props = {
  hardMhz: number;
  mildMhz: number;
};

const BandGapsTable = ({ hardMhz, mildMhz }: Props) => {
  return (
    <BandGapsTableStyle>
      <table className="table">
        <thead>
          <tr>
            <th>Band</th>
            {BAND_MATRIX_ORDER.map((name) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bandMatrix.map((row, r) => (
            <tr key={BAND_MATRIX_ORDER[r]}>
              <th>{BAND_MATRIX_ORDER[r]}</th>
              {row.map((cell, c) => {
                if (cell === "") return <td key={c} />;
                if (cell === null)
                  return (
                    <td key={c} className="diag">
                      -
                    </td>
                  );
                return (
                  <td key={c} className={classifyGap(cell, hardMhz, mildMhz)}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </BandGapsTableStyle>
  );
};

export { BandGapsTable };

const BandGapsTableStyle = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

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
      background: ${({ theme }) => theme.palette.surface};
      color: ${({ theme }) => theme.palette.text.primary};

      &.diag {
        color: ${({ theme }) => theme.palette.text.secondary};
      }

      &.hard {
        background: ${({ theme }) => theme.palette.conflict.hard};
        color: ${({ theme }) => theme.palette.conflict.hardText};
      }

      &.mild {
        background: ${({ theme }) => theme.palette.conflict.mild};
        color: ${({ theme }) => theme.palette.conflict.mildText};
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
