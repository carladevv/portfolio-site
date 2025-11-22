// src/components/ToolbarFloating.jsx
import React from "react";
import { useTheme } from "../ThemeContext";
import LanguageSelector from "./LanguageSelector";


export default function ToolbarFloating({
  t,
  lang,
  setLang,
  fontSize,
  setFontSize,
  themeId,
  onNextTheme,
  onPrevTheme,
}) {

  const { theme } = useTheme();  
  
  return (
    <div
      className={`fixed right-3 top-3 z-50 flex items-center gap-4 px-3 py-2 backdrop-blur ${theme.toolbar} ${theme.radiusSoft}`}
    >
      <LanguageSelector t={t} lang={lang} setLang={setLang} />
      <label
        className={`flex items-center gap-2 text-xs ${theme.textMuted}`}
      >
        <span className="opacity-70">{t.fontSize}</span>
        <div className={`flex ${theme.toolbarPill} ${theme.radiusMax}`}>
          {["sm", "base", "lg"].map((s) => (
            <button
              key={s}
              onClick={() => setFontSize(s)}
              className={
                "px-2 py-1 text-xs " +
                (fontSize === s
                  ? theme.toolbarPillActive
                  : theme.toolbarPillInactive)
              }
            >
              {s}
            </button>
          ))}
        </div>
      </label>
       {/* Theme selector */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrevTheme}
          className={`h-7 w-7 flex items-center justify-center border text-xs ${theme.toolbarPill} ${theme.radiusSoft}`}
          aria-label="Previous theme"
        >
          ←
        </button>
        <span className="px-2 text-[0.65rem] uppercase tracking-[0.2em]">
          {themeId}
        </span>
        <button
          type="button"
          onClick={onNextTheme}
          className={`h-7 w-7 flex items-center justify-center border text-xs ${theme.toolbarPill} ${theme.radiusSoft}`}
          aria-label="Next theme"
        >
          →
        </button>
      </div>
    </div>
  );
}
