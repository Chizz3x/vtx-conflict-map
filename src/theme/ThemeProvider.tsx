import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./themes";
import type { AppTheme, ThemeMode } from "./types";

interface IAppThemeContext {
  mode: ThemeMode;
  theme: AppTheme;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "app-theme-mode";

const getInitialMode = (): ThemeMode => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
};

const persistMode = (mode: ThemeMode) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore storage errors (e.g. private browsing)
  }
};

const AppThemeContext = createContext<IAppThemeContext | null>(null);

const AppThemeProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    persistMode(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      persistMode(next);
      return next;
    });
  }, []);

  const theme = useMemo<AppTheme>(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode],
  );

  const value = useMemo<IAppThemeContext>(
    () => ({ mode, theme, toggleTheme, setMode }),
    [mode, theme, toggleTheme, setMode],
  );

  return (
    <AppThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  );
};

const useAppTheme = (): IAppThemeContext => {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
};

export { AppThemeProvider, useAppTheme };
