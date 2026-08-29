export type ThemeMode = "light" | "dark";

export interface AppThemePalette {
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
  };
  border: string;
  primary: string;
  selected: {
    background: string;
    border: string;
    text: string;
  };
  conflict: {
    hard: string;
    hardText: string;
    mild: string;
    mildText: string;
  };
}

export interface AppTheme {
  mode: ThemeMode;
  palette: AppThemePalette;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  radius: {
    sm: string;
    md: string;
    full: string;
  };
}
