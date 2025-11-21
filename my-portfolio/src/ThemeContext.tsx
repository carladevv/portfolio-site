// src/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  themes,
  ACTIVE_THEME_ID,
  THEME_ORDER,
  type Theme,
  type ThemeId,
} from "./themes";

type ThemeContextValue = {
  themeId: ThemeId;
  theme: Theme;
  setThemeId: (id: ThemeId) => void;
  nextTheme: () => void;
  prevTheme: () => void;
  themeOrder: ThemeId[];
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeId, setThemeId] = useState<ThemeId>(ACTIVE_THEME_ID);

  const themeOrder = THEME_ORDER;

  const nextTheme = useCallback(() => {
    setThemeId((current) => {
      const idx = themeOrder.indexOf(current);
      const nextIdx = (idx + 1) % themeOrder.length;
      return themeOrder[nextIdx];
    });
  }, [themeOrder]);

  const prevTheme = useCallback(() => {
    setThemeId((current) => {
      const idx = themeOrder.indexOf(current);
      const prevIdx = (idx - 1 + themeOrder.length) % themeOrder.length;
      return themeOrder[prevIdx];
    });
  }, [themeOrder]);

  const value = useMemo(
    () => ({
      themeId,
      theme: themes[themeId],
      setThemeId,
      nextTheme,
      prevTheme,
      themeOrder,
    }),
    [themeId, nextTheme, prevTheme, themeOrder]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
