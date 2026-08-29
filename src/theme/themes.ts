import type { AppTheme, ThemeMode } from "./types";

const base = {
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  radius: {
    sm: "4px",
    md: "8px",
    full: "9999px",
  },
};

export const lightTheme: AppTheme = {
  ...base,
  mode: "light",
  palette: {
    background: "#f5f5f5",
    surface: "#ffffff",
    text: { primary: "#1a1a1a", secondary: "#5c5c5c" },
    border: "#d0d0d0",
    primary: "#1565c0",
    selected: {
      background: "#90caf9",
      border: "#1565c0",
      text: "#0d3c6e",
    },
    conflict: {
      hard: "#e53935",
      hardText: "#ffffff",
      mild: "#fdd835",
      mildText: "#3d3100",
    },
  },
};

export const darkTheme: AppTheme = {
  ...base,
  mode: "dark",
  palette: {
    background: "#121212",
    surface: "#1e1e1e",
    text: { primary: "#e0e0e0", secondary: "#a0a0a0" },
    border: "#3a3a3a",
    primary: "#90caf9",
    selected: {
      background: "#1e3a5f",
      border: "#90caf9",
      text: "#dbeafe",
    },
    conflict: {
      hard: "#d32f2f",
      hardText: "#ffffff",
      mild: "#e6c200",
      mildText: "#1a1a1a",
    },
  },
};

export const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
