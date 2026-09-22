import React from "react";
import styled from "styled-components";

type Props = {
  hardMhz: number;
  mildMhz: number;
  onHardChange: (value: number) => void;
  onMildChange: (value: number) => void;
  onResetThresholds: () => void;
  pilotCount: number;
  onPilotCountChange: (value: number) => void;
  onSuggest: () => void;
  onClear: () => void;
  onCopy: () => void;
  onShowQr: () => void;
  copied: boolean;
};

const AdvancedPanel = ({
  hardMhz,
  mildMhz,
  onHardChange,
  onMildChange,
  onResetThresholds,
  pilotCount,
  onPilotCountChange,
  onSuggest,
  onClear,
  onCopy,
  onShowQr,
  copied,
}: Props) => {
  return (
    <AdvancedPanelStyle>
      <div className="thresholds">
        <div className='sliders'>
          <div className="threshold-field">
            <label className="threshold-label" htmlFor="hard-threshold">
              Hard conflict: {hardMhz} MHz
            </label>
            <input
              id="hard-threshold"
              className="slider"
              type="range"
              min={0}
              max={Math.max(0, mildMhz - 1)}
              value={hardMhz}
              onChange={(e) => onHardChange(Number(e.target.value))}
            />
          </div>
          <div className="threshold-field">
            <label className="threshold-label" htmlFor="mild-threshold">
              Mild conflict: {mildMhz} MHz
            </label>
            <input
              id="mild-threshold"
              className="slider"
              type="range"
              min={hardMhz + 1}
              max={100}
              value={mildMhz}
              onChange={(e) => onMildChange(Number(e.target.value))}
            />
          </div>
        </div>
        <button type="button" className="action-button" onClick={onResetThresholds} title="Reset thresholds to defaults">
          Reset thresholds
        </button>
      </div>

      <div className="suggest-row">
        <label htmlFor="pilot-count">Pilots</label>
        <input
          id="pilot-count"
          className="number-input"
          type="number"
          min={1}
          max={12}
          value={pilotCount}
          onChange={(e) => onPilotCountChange(Number(e.target.value))}
        />
        <button type="button" className="action-button" onClick={onSuggest}>
          Suggest plan
        </button>
      </div>

      <div className="advanced-actions">
        <button type="button" className="action-button" onClick={onClear}>
          Clear
        </button>
        <button type="button" className="action-button" onClick={onCopy}>
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button type="button" className="action-button" onClick={onShowQr}>
          Get QR
        </button>
      </div>
    </AdvancedPanelStyle>
  );
};

export { AdvancedPanel };

const AdvancedPanelStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 560px;
  margin: 0 auto 12px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.palette.surface};

  .thresholds {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  .threshold-field {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
  }

  .threshold-label {
    font-size: 13px;
  }

  .slider {
    accent-color: ${({ theme }) => theme.palette.primary};
    cursor: pointer;
    width: 180px;
  }

  .suggest-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  .number-input {
    width: 56px;
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: 14px;
    border: 1px solid ${({ theme }) => theme.palette.border};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.palette.surface};
    color: ${({ theme }) => theme.palette.text.primary};
  }

  .action-button {
    align-self: center;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: 13px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.palette.border};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.palette.surface};
    color: ${({ theme }) => theme.palette.text.secondary};

    &:hover {
      border-color: ${({ theme }) => theme.palette.primary};
      color: ${({ theme }) => theme.palette.primary};
    }
  }

  .advanced-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;
