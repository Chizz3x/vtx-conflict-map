import React from "react";
import styled from "styled-components";
import type { VtxPlanner } from "../useVtxPlanner";
import { AdvancedPanel } from "../components/AdvancedPanel";
import { MatrixTable } from "../components/MatrixTable";
import { Legend } from "../components/Legend";

type Props = {
  planner: VtxPlanner;
};

const MatrixTab = ({ planner }: Props) => {
  const {
    selectedCells,
    multiSelect,
    hardMhz,
    mildMhz,
    toggleCell,
    handleMultiSelectChange,
    handleClear,
    handleHardChange,
    handleMildChange,
    handleResetThresholds,
    pilotCount,
    setPilotCount,
    handleSuggest,
    showAdvanced,
    setShowAdvanced,
    handleCopyLink,
    handleShowQr,
    copied,
    counts,
    conflictingSelectedCount,
    selectedLabels,
  } = planner;

  return (
    <MatrixTabStyle>
      <p>
        Click any channel. Every other channel will highlight{" "}
        <strong>red</strong> (hard conflict, under {hardMhz} MHz),{" "}
        <strong>yellow</strong> (mild conflict, {hardMhz}-{mildMhz} MHz), or stay plain (all
        good). Adjust the thresholds below to tune what counts as a conflict.
      </p>

      <div className="controls">
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={multiSelect}
            onChange={(e) => handleMultiSelectChange(e.target.checked)}
          />
          Multi-select
        </label>
        <button
          type="button"
          className="accordion-toggle"
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced}
        >
          <span className={showAdvanced ? "chevron open" : "chevron"} />
          Advanced
        </button>
      </div>

      {showAdvanced && (
        <AdvancedPanel
          hardMhz={hardMhz}
          mildMhz={mildMhz}
          onHardChange={handleHardChange}
          onMildChange={handleMildChange}
          onResetThresholds={handleResetThresholds}
          pilotCount={pilotCount}
          onPilotCountChange={setPilotCount}
          onSuggest={handleSuggest}
          onClear={handleClear}
          onCopy={handleCopyLink}
          onShowQr={handleShowQr}
          copied={copied}
        />
      )}

      <div className="status">
        <span>
          Selected: <strong>{selectedCells.length === 0 ? "-" : selectedLabels.join(", ")}</strong>
        </span>
        {selectedCells.length > 0 && (
          <span>
            {" "}
            - hard: {counts.hard}, mild: {counts.mild}
          </span>
        )}
        {multiSelect && conflictingSelectedCount > 0 && (
          <span>
            {" "}
            - {conflictingSelectedCount} selected conflict with each other
          </span>
        )}
      </div>

      <MatrixTable
        selectedCells={selectedCells}
        multiSelect={multiSelect}
        hardMhz={hardMhz}
        mildMhz={mildMhz}
        onToggleCell={toggleCell}
      />

      <Legend hardMhz={hardMhz} mildMhz={mildMhz} />
    </MatrixTabStyle>
  );
};

export { MatrixTab };

const MatrixTabStyle = styled.div`
  display: contents;

  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
    margin: 8px 0 12px;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.secondary};

    label {
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing.xs};
      cursor: pointer;
    }
  }

  .checkbox {
    accent-color: ${({ theme }) => theme.palette.primary};
    cursor: pointer;
  }

  .accordion-toggle {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
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

  .status {
    margin: 0 0 12px;
    font-size: 15px;
    color: ${({ theme }) => theme.palette.text.secondary};

    strong {
      color: ${({ theme }) => theme.palette.text.primary};
    }
  }
`;
