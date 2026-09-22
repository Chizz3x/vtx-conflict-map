import { useCallback, useState } from "react";
import { CellId, TabKey, cellToCode, codeToCell } from "./vtx";
import { loadThresholds } from "./storage";

export const readUrlParams = (): URLSearchParams => new URLSearchParams(window.location.search);

export const writeUrlParams = (params: URLSearchParams) => {
  const qs = params.toString();
  const hash = window.location.hash;
  const url = window.location.pathname + (qs ? `?${qs}` : "") + hash;
  window.history.replaceState(null, "", url);
};

export function useUrlState<T>(
  key: string,
  parse: (raw: string | null) => T,
  serialize: (value: T) => string | null,
): [T, (updater: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => parse(readUrlParams().get(key)));
  const set = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
        const params = readUrlParams();
        const serialized = serialize(next);
        if (serialized === null || serialized === "") params.delete(key);
        else params.set(key, serialized);
        writeUrlParams(params);
        return next;
      });
    },
    [key, serialize],
  );
  return [value, set];
}

export const parseSelection = (raw: string | null): CellId[] => {
  if (!raw) return [];
  return raw
    .split(".")
    .map(codeToCell)
    .filter((c): c is CellId => c !== null);
};

export const serializeSelection = (cells: CellId[]): string | null =>
  cells.length > 0 ? cells.map(cellToCode).join(".") : null;

export const parseNames = (raw: string | null): Record<string, string> => {
  if (!raw) return {};
  const names: Record<string, string> = {};
  for (const segment of raw.split(".")) {
    const eq = segment.indexOf("=");
    if (eq <= 0) continue;
    const code = segment.slice(0, eq);
    let name: string;
    try {
      name = decodeURIComponent(segment.slice(eq + 1));
    } catch {
      continue;
    }
    if (name) names[code] = name;
  }
  return names;
};

export const serializeNames = (names: Record<string, string>): string | null => {
  const parts = Object.keys(names)
    .filter((code) => names[code])
    .map((code) => `${code}=${encodeURIComponent(names[code]).replace(/\./g, "%2E")}`);
  return parts.length > 0 ? parts.join(".") : null;
};

export const parseBool = (raw: string | null): boolean => raw === "1" || raw === "true";

export const serializeBool = (value: boolean): string | null => (value ? "1" : null);

export const parseTab = (raw: string | null): TabKey => (raw === "bands" ? "bands" : "matrix");

export const serializeTab = (value: TabKey): string | null => (value === "matrix" ? null : value);

export const parseThresholds = (raw: string | null): { hard: number; mild: number } => {
  const match = raw === null ? null : /^(\d+)-(\d+)$/.exec(raw);
  if (match) {
    const hard = Number(match[1]);
    const mild = Number(match[2]);
    if (Number.isFinite(hard) && Number.isFinite(mild) && hard >= 0 && mild > hard) {
      return { hard, mild };
    }
  }
  return loadThresholds();
};

export const serializeThresholds = (value: { hard: number; mild: number }): string =>
  `${value.hard}-${value.mild}`;
