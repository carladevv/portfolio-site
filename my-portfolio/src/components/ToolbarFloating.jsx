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
}) {

  const { theme } = useTheme();  
  
  return (
    <div
      className={`fixed right-3 top-3 z-50 flex items-center gap-4 px-3 py-2 backdrop-blur ${theme.toolbar} ${theme.radiusSoft}`}
    >
      <LanguageSelector t={t} lang={lang} setLang={setLang} />
      <div role="group" aria-label={t.fontSize}
        className={`flex items-center gap-2 text-xs ${theme.textMuted}`}
      >
        <span className="opacity-70">{t.fontSize}</span>
        <div className={`flex ${theme.toolbarPill} ${theme.radiusMax}`}>
          {["sm", "base", "lg"].map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={fontSize === s}
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
      </div>
    </div>
  );
}
