import { useEffect, useState } from "react";
import {
  VTX_BANDS,
  CellId,
  TabKey,
  Conflict,
  DEFAULT_HARD_MHZ,
  DEFAULT_MILD_MHZ,
  conflictWithOtherSelections,
  conflictWithSelections,
  freqOf,
  isCellSelected,
  suggestChannels,
} from "./vtx";
import {
  HARD_STORAGE_KEY,
  MILD_STORAGE_KEY,
  clearSavedSelection,
  loadSavedSelection,
  saveSelection,
  saveThreshold,
} from "./storage";
import {
  readUrlParams,
  parseBool,
  parseSelection,
  parseTab,
  parseThresholds,
  serializeBool,
  serializeSelection,
  serializeTab,
  serializeThresholds,
  useUrlState,
} from "./urlState";
import { copyToClipboard } from "@utils/copy-to-clipboard";
import { useDispatch } from "@redux/hooks";
import { openModal } from "@redux/slices/modals";

export const useVtxPlanner = () => {
  const [tab, setTab] = useUrlState<TabKey>("tab", parseTab, serializeTab);
  const [selectedCells, setSelectedCells] = useUrlState<CellId[]>(
    "sel",
    parseSelection,
    serializeSelection,
  );
  const [multiSelect, setMultiSelect] = useUrlState<boolean>("multi", parseBool, serializeBool);
  const [thresholds, setThresholds] = useUrlState<{ hard: number; mild: number }>(
    "thr",
    parseThresholds,
    serializeThresholds,
  );

  const hardMhz = thresholds.hard;
  const mildMhz = thresholds.mild;

  const toggleCell = (cell: CellId) => {
    setSelectedCells((prev) => {
      const exists = prev.some((s) => s.band === cell.band && s.channel === cell.channel);
      if (exists) {
        return prev.filter((s) => !(s.band === cell.band && s.channel === cell.channel));
      }
      return multiSelect ? [...prev, cell] : [cell];
    });
  };

  useEffect(() => {
    if (multiSelect) saveSelection(selectedCells);
  }, [multiSelect, selectedCells]);

  // Entry via a shared URL with multi already active: state comes from the URL
  // (useUrlState reads it on mount). Only when the URL carries multi but no
  // selection do we fill the gap from saved memory.
  useEffect(() => {
    if (multiSelect && selectedCells.length === 0) {
      const memory = loadSavedSelection();
      if (memory.length > 0) setSelectedCells(memory);
    }
    // mount-only
  }, []);

  const handleMultiSelectChange = (checked: boolean) => {
    setMultiSelect(checked);
    if (checked) {
      // In-page toggle: restore the saved multi workspace first; only fall
      // back to the URL when there is no saved memory (e.g. a bare share link).
      const memory = loadSavedSelection();
      if (memory.length > 0) {
        setSelectedCells(memory);
      } else {
        setSelectedCells(parseSelection(readUrlParams().get("sel")));
      }
    } else {
      setSelectedCells([]);
    }
  };

  const handleClear = () => {
    setSelectedCells([]);
    clearSavedSelection();
  };

  useEffect(() => {
    saveThreshold(HARD_STORAGE_KEY, thresholds.hard);
    saveThreshold(MILD_STORAGE_KEY, thresholds.mild);
  }, [thresholds]);

  const handleHardChange = (val: number) => {
    setThresholds((prev) => {
      const hard = Math.max(0, Math.min(val, prev.mild - 1));
      return { hard, mild: prev.mild };
    });
  };

  const handleMildChange = (val: number) => {
    setThresholds((prev) => {
      const mild = Math.max(prev.hard + 1, Math.min(val, 100));
      return { hard: prev.hard, mild };
    });
  };

  const handleResetThresholds = () => {
    setThresholds({ hard: DEFAULT_HARD_MHZ, mild: DEFAULT_MILD_MHZ });
  };

  const [pilotCount, setPilotCount] = useState(4);
  const handleSuggest = () => {
    const n = Math.max(1, Math.min(12, pilotCount));
    const result = suggestChannels(n, mildMhz);
    if (result) {
      setSelectedCells(result);
      setMultiSelect(true);
    }
  };

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    copyToClipboard(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const dispatch = useDispatch();
  const handleShowQr = () => {
    dispatch(openModal({ ModalQr: { url: window.location.href } }));
  };

  const counts = { hard: 0, mild: 0 };
  for (let b = 0; b < VTX_BANDS.length; b += 1) {
    for (let c = 0; c < VTX_BANDS[b].freqs.length; c += 1) {
      if (isCellSelected(selectedCells, { band: b, channel: c })) continue;
      const level = conflictWithSelections(selectedCells, hardMhz, mildMhz, b, c);
      if (level === "hard") counts.hard += 1;
      else if (level === "mild") counts.mild += 1;
    }
  }

  const conflictingSelectedCount = selectedCells.filter(
    (cell) => conflictWithOtherSelections(selectedCells, hardMhz, mildMhz, cell.band, cell.channel) !== "none",
  ).length;

  const selectedLabels = selectedCells.map(
    (cell) => `${VTX_BANDS[cell.band].name}${cell.channel + 1} (${freqOf(cell)} MHz)`,
  );

  return {
    tab,
    setTab,
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
  };
};

export type VtxPlanner = ReturnType<typeof useVtxPlanner>;
