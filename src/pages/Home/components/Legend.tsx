import React from "react";
import styled from "styled-components";

type Props = {
  hardMhz: number;
  mildMhz: number;
};

const Legend = ({ hardMhz, mildMhz }: Props) => {
  return (
    <LegendStyle>
      <div className="legend-item">
        <span className="swatch hard" />
        <span>hard conflict (&lt;= {hardMhz} MHz)</span>
      </div>
      <div className="legend-item">
        <span className="swatch mild" />
        <span>mild ({hardMhz}-{mildMhz} MHz)</span>
      </div>
      <div className="legend-item">
        <span className="swatch selected" />
        <span>selected</span>
      </div>
      <div className="legend-item">
        <span className="swatch none" />
        <span>all good</span>
      </div>
    </LegendStyle>
  );
};

export { Legend };

const LegendStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: 16px;
  font-size: 13px;
  width: 100%;
  color: ${({ theme }) => theme.palette.text.secondary};

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;

    .swatch {
      width: 16px;
      height: 16px;
      display: inline-block;
      border: 1px solid ${({ theme }) => theme.palette.border};

      &.hard {
        background: ${({ theme }) => theme.palette.conflict.hard};
      }
      &.mild {
        background: ${({ theme }) => theme.palette.conflict.mild};
      }
      &.selected {
        background: transparent;
        border: 2px solid ${({ theme }) => theme.palette.selected.border};
      }
      &.none {
        background: ${({ theme }) => theme.palette.surface};
      }
    }
  }
`;
