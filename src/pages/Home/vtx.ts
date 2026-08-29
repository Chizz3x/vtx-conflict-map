export type VtxBand = {
  name: string;
  freqs: number[]; // 8 channels, MHz
};

export type CellId = { band: number; channel: number };

export type Conflict = "hard" | "mild" | "none";

export type TabKey = "matrix" | "bands";

export type MatrixCell = number | "" | null;

export const VTX_BANDS: VtxBand[] = [
  { name: "A", freqs: [5865, 5845, 5825, 5805, 5785, 5765, 5745, 5725] },
  { name: "B", freqs: [5733, 5752, 5771, 5790, 5809, 5828, 5847, 5866] },
  { name: "E", freqs: [5705, 5685, 5665, 5645, 5885, 5905, 5925, 5945] },
  { name: "F", freqs: [5740, 5760, 5780, 5800, 5820, 5840, 5860, 5880] },
  { name: "R", freqs: [5658, 5695, 5732, 5769, 5806, 5843, 5880, 5917] },
  { name: "L", freqs: [5333, 5373, 5413, 5453, 5493, 5533, 5573, 5613] },
  { name: "H", freqs: [5954, 5991, 6028, 6065, 6102, 6139, 6176, 6213] },
  { name: "P", freqs: [5653, 5693, 5733, 5773, 5813, 5853, 5893, 5933] },
  { name: "U", freqs: [5325, 5348, 5366, 5384, 5402, 5420, 5438, 5456] },
  { name: "O", freqs: [5474, 5492, 5510, 5528, 5546, 5564, 5582, 5600] },
  { name: "X", freqs: [4990, 5020, 5050, 5080, 5110, 5140, 5170, 5200] },
];

export const DEFAULT_HARD_MHZ = 20;
export const DEFAULT_MILD_MHZ = 40;

export const BAND_MATRIX_ORDER = ["X", "U", "L", "O", "E", "P", "R", "A", "B", "F", "H"];

export const classifyGap = (gap: number, hardMhz: number, mildMhz: number): Conflict => {
  if (gap <= hardMhz) return "hard";
  if (gap <= mildMhz) return "mild";
  return "none";
};

export const conflictBetween = (freqA: number, freqB: number, hardMhz: number, mildMhz: number): Conflict =>
  classifyGap(Math.abs(freqA - freqB), hardMhz, mildMhz);

export const freqOf = (cell: CellId): number => VTX_BANDS[cell.band].freqs[cell.channel];

export const gapBetween = (a: CellId, b: CellId): number =>
  Math.abs(freqOf(a) - freqOf(b));

export const cellToCode = (cell: CellId): string =>
  `${VTX_BANDS[cell.band].name}${cell.channel + 1}`;

export const codeToCell = (code: string): CellId | null => {
  const match = /^([A-Za-z]+)(\d+)$/.exec(code);
  if (!match) return null;
  const band = VTX_BANDS.findIndex((b) => b.name === match[1].toUpperCase());
  const channel = Number(match[2]) - 1;
  if (band < 0 || channel < 0 || channel >= VTX_BANDS[band].freqs.length) return null;
  return { band, channel };
};

export const isCellSelected = (cells: CellId[], cell: CellId): boolean =>
  cells.some((s) => s.band === cell.band && s.channel === cell.channel);

export const conflictWithSelections = (
  selectedCells: CellId[],
  hardMhz: number,
  mildMhz: number,
  b: number,
  c: number,
): Conflict => {
  const freq = VTX_BANDS[b].freqs[c];
  let level: Conflict = "none";
  for (const sel of selectedCells) {
    const lvl = conflictBetween(freqOf(sel), freq, hardMhz, mildMhz);
    if (lvl === "hard") return "hard";
    if (lvl === "mild") level = "mild";
  }
  return level;
};

export const conflictWithOtherSelections = (
  selectedCells: CellId[],
  hardMhz: number,
  mildMhz: number,
  b: number,
  c: number,
): Conflict => {
  const freq = VTX_BANDS[b].freqs[c];
  let level: Conflict = "none";
  for (const sel of selectedCells) {
    if (sel.band === b && sel.channel === c) continue;
    const lvl = conflictBetween(freqOf(sel), freq, hardMhz, mildMhz);
    if (lvl === "hard") return "hard";
    if (lvl === "mild") level = "mild";
  }
  return level;
};

const freqsByName: Record<string, number[]> = Object.fromEntries(
  VTX_BANDS.map((band) => [band.name, band.freqs]),
);

const minGapBetweenBands = (freqsA: number[], freqsB: number[]): number => {
  let best = Infinity;
  for (const freqA of freqsA) {
    for (const freqB of freqsB) {
      best = Math.min(best, Math.abs(freqA - freqB));
    }
  }
  return best;
};

export const bandMatrix: MatrixCell[][] = BAND_MATRIX_ORDER.map((rowName, r) =>
  BAND_MATRIX_ORDER.map((colName, c) => {
    if (r === c) return null;
    if (c < r) return "";
    return minGapBetweenBands(freqsByName[rowName], freqsByName[colName]);
  }),
);

const allChannels = (): CellId[] => {
  const cells: CellId[] = [];
  for (let b = 0; b < VTX_BANDS.length; b += 1) {
    for (let c = 0; c < VTX_BANDS[b].freqs.length; c += 1) {
      cells.push({ band: b, channel: c });
    }
  }
  return cells;
};

const minPairGap = (cells: CellId[]): number => {
  let best = Infinity;
  for (let i = 0; i < cells.length; i += 1) {
    for (let j = i + 1; j < cells.length; j += 1) {
      best = Math.min(best, gapBetween(cells[i], cells[j]));
    }
  }
  return best;
};

/**
 * Random-greedy search for a set of `n` channels where every pair is
 * "all good" (gap > mildMhz). Among valid sets, keeps the one with the
 * largest minimum pairwise gap (best spread), so the plan is robust.
 */
export const suggestChannels = (n: number, mildMhz: number, attempts = 300): CellId[] | null => {
  if (n <= 0) return [];
  const pool = allChannels();
  let best: CellId[] | null = null;
  let bestScore = -1;
  for (let t = 0; t < attempts; t += 1) {
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const picked: CellId[] = [];
    for (const cell of shuffled) {
      if (picked.length >= n) break;
      if (picked.every((p) => gapBetween(p, cell) > mildMhz)) picked.push(cell);
    }
    if (picked.length === n) {
      const score = minPairGap(picked);
      if (score > bestScore) {
        bestScore = score;
        best = picked;
      }
    }
  }
  return best;
};
