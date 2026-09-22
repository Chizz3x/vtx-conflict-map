import { useEffect, useState } from "react";
import {
  VTX_BANDS,
  CellId,
  TabKey,
  Conflict,
  DEFAULT_HARD_MHZ,
  DEFAULT_MILD_MHZ,
  cellToCode,
  conflictWithOtherSelections,
  conflictWithSelections,
  freqOf,
  isCellSelected,
  suggestChannels,
} from "./vtx";
import {
  HARD_STORAGE_KEY,
  MILD_STORAGE_KEY,
  clearSavedNames,
  clearSavedSelection,
  loadSavedNames,
  loadSavedSelection,
  saveNames,
  saveSelection,
  saveThreshold,
} from "./storage";
import {
  readUrlParams,
  parseBool,
  parseNames,
  parseSelection,
  parseTab,
  parseThresholds,
  serializeBool,
  serializeNames,
  serializeSelection,
  serializeTab,
  serializeThresholds,
  useUrlState,
} from "./urlState";
import { copyToClipboard } from "@utils/copy-to-clipboard";
import { useDispatch } from "@redux/hooks";
import { openModal } from "@redux/slices/modals";

const nextPilotName = (names: Record<string, string>): string => {
  const used = new Set(Object.values(names).filter((n) => /^Pilot \d+$/.test(n)));
  let n = 1;
  while (used.has(`Pilot ${n}`)) n += 1;
  return `Pilot ${n}`;
};

/** Keeps names for cells that have one, auto-assigns for the rest, drops the rest. */
const ensureNames = (cells: CellId[], existing: Record<string, string>): Record<string, string> => {
  const next: Record<string, string> = {};
  cells.forEach((cell) => {
    const code = cellToCode(cell);
    next[code] = existing[code] ?? "";
  });
  Object.keys(next).forEach((code) => {
    if (!next[code]) next[code] = nextPilotName(next);
  });
  return next;
};

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
  const [names, setNames] = useUrlState<Record<string, string>>("nm", parseNames, serializeNames);
  const [noedit, setNoedit] = useUrlState<boolean>("noedit", parseBool, serializeBool);

  const hardMhz = thresholds.hard;
  const mildMhz = thresholds.mild;

  const toggleCell = (cell: CellId) => {
    if (noedit) return;
    const code = cellToCode(cell);
    if (isCellSelected(selectedCells, cell)) {
      setSelectedCells(
        selectedCells.filter((s) => !(s.band === cell.band && s.channel === cell.channel)),
      );
      setNames((prevNames) => {
        const rest = { ...prevNames };
        delete rest[code];
        return rest;
      });
    } else if (multiSelect) {
      const nextNames = { ...names };
      nextNames[code] = nextPilotName(nextNames);
      setSelectedCells([...selectedCells, cell]);
      setNames(nextNames);
    } else {
      setSelectedCells([cell]);
      setNames({});
    }
  };

  const handleRename = (code: string, name: string) => {
    setNames((prev) => ({ ...prev, [code]: name }));
  };

  useEffect(() => {
    if (noedit) return;
    if (multiSelect) saveSelection(selectedCells);
  }, [multiSelect, selectedCells, noedit]);

  useEffect(() => {
    // Names are a multi-select concept; in single-select mode they are cleared
    // and must not overwrite the saved multi workspace.
    if (noedit || !multiSelect) return;
    saveNames(names);
  }, [names, noedit, multiSelect]);

  // Entry via a shared URL with multi already active: state comes from the URL
  // (useUrlState reads it on mount). Only when the URL carries multi but no
  // selection do we fill the gap from saved memory.
  useEffect(() => {
    if (noedit) return;
    if (multiSelect && selectedCells.length === 0) {
      const memory = loadSavedSelection();
      if (memory.length > 0) {
        setSelectedCells(memory);
        setNames(loadSavedNames());
      }
    }
    // mount-only
  }, []);

  const handleMultiSelectChange = (checked: boolean) => {
    setMultiSelect(checked);
    if (checked) {
      // In-page toggle: restore the saved multi workspace first; only fall
      // back to the URL when there is no saved memory (e.g. a bare share link).
      const memory = loadSavedSelection();
      const cells =
        memory.length > 0 ? memory : parseSelection(readUrlParams().get("sel"));
      if (cells.length > 0) {
        // Cells carried in from single-select have no name yet; give them one
        // so the nm param and the roster stay in sync with sel.
        setSelectedCells(cells);
        setNames(ensureNames(cells, memory.length > 0 ? loadSavedNames() : names));
      }
    } else {
      setSelectedCells([]);
      setNames({});
    }
  };

  const handleClear = () => {
    setSelectedCells([]);
    setNames({});
    clearSavedSelection();
    clearSavedNames();
  };

  const handleEdit = () => {
    saveSelection(selectedCells);
    saveNames(names);
    setNoedit(false);
  };

  const handleNew = () => {
    setSelectedCells([]);
    setNames({});
    setMultiSelect(false);
    clearSavedSelection();
    clearSavedNames();
    setThresholds({ hard: DEFAULT_HARD_MHZ, mild: DEFAULT_MILD_MHZ });
    setNoedit(false);
  };

  useEffect(() => {
    if (noedit) return;
    saveThreshold(HARD_STORAGE_KEY, thresholds.hard);
    saveThreshold(MILD_STORAGE_KEY, thresholds.mild);
  }, [thresholds, noedit]);

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
      const fresh: Record<string, string> = {};
      result.forEach((cell, i) => {
        fresh[cellToCode(cell)] = `Pilot ${i + 1}`;
      });
      setNames(fresh);
      setMultiSelect(true);
    }
  };

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = () => {
    const params = readUrlParams();
    params.set("noedit", "1");
    const qs = params.toString();
    return `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  };

  const handleCopyLink = () => {
    copyToClipboard(shareUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const dispatch = useDispatch();
  const handleShowQr = () => {
    dispatch(openModal({ ModalQr: { url: shareUrl() } }));
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

  const pilots = [...selectedCells]
    .sort((a, b) => {
      const nameA = VTX_BANDS[a.band].name;
      const nameB = VTX_BANDS[b.band].name;
      if (nameA !== nameB) return nameA < nameB ? -1 : 1;
      return a.channel - b.channel;
    })
    .map((cell) => {
      const code = cellToCode(cell);
      return { code, freq: freqOf(cell), name: names[code] ?? "" };
    });

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
    names,
    noedit,
    handleRename,
    handleEdit,
    handleNew,
    expanded,
    setExpanded,
    pilots,
  };
};

export type VtxPlanner = ReturnType<typeof useVtxPlanner>;
