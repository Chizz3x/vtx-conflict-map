import { VTX_BANDS, DEFAULT_HARD_MHZ, DEFAULT_MILD_MHZ, CellId } from "./vtx";

export const SELECTION_STORAGE_KEY = "vtx-multi-select";
export const NAMES_STORAGE_KEY = "vtx-pilot-names";
export const HARD_STORAGE_KEY = "vtx-hard-mhz";
export const MILD_STORAGE_KEY = "vtx-mild-mhz";

export const loadSavedSelection = (): CellId[] => {
  try {
    const raw = window.localStorage.getItem(SELECTION_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const result: CellId[] = [];
    for (const item of parsed) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof (item as { band?: unknown }).band !== "string" ||
        typeof (item as { channel?: unknown }).channel !== "number"
      ) {
        continue;
      }
      const band = VTX_BANDS.findIndex((b) => b.name === item.band);
      const channel = item.channel as number;
      if (band < 0 || channel < 0 || channel >= VTX_BANDS[band].freqs.length) continue;
      result.push({ band, channel });
    }
    return result;
  } catch {
    return [];
  }
};

export const saveSelection = (cells: CellId[]) => {
  try {
    const data = cells.map((cell) => ({
      band: VTX_BANDS[cell.band].name,
      channel: cell.channel,
    }));
    window.localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
};

export const clearSavedSelection = () => {
  try {
    window.localStorage.removeItem(SELECTION_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
};

export const loadSavedNames = (): Record<string, string> => {
  try {
    const raw = window.localStorage.getItem(NAMES_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const result: Record<string, string> = {};
    for (const [code, name] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof name === "string" && name) result[code] = name;
    }
    return result;
  } catch {
    return {};
  }
};

export const saveNames = (names: Record<string, string>) => {
  try {
    window.localStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(names));
  } catch {
    // ignore storage errors
  }
};

export const clearSavedNames = () => {
  try {
    window.localStorage.removeItem(NAMES_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
};

const loadThreshold = (key: string, fallback: number): number => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const val = Number(raw);
    return Number.isFinite(val) ? val : fallback;
  } catch {
    return fallback;
  }
};

export const loadThresholds = (): { hard: number; mild: number } => {
  const hard = Math.max(0, loadThreshold(HARD_STORAGE_KEY, DEFAULT_HARD_MHZ));
  const mild = Math.max(hard + 1, loadThreshold(MILD_STORAGE_KEY, DEFAULT_MILD_MHZ));
  return { hard, mild };
};

export const saveThreshold = (key: string, value: number) => {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // ignore storage errors
  }
};
