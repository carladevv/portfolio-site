// src/components/LanguageSelector.jsx
import React from "react";
import { useTheme } from "../ThemeContext";

export default function LanguageSelector({ t, lang, setLang, size = "xs" }) {
  const { theme } = useTheme();
  const textSize = size === "sm" ? "text-sm" : "text-xs";

  return (
    <div
      className={`flex items-center gap-2 ${textSize} ${theme.textMuted}`}
    >
      <span className="opacity-70">{t.language}</span>

      <div className={`flex ${theme.toolbarPill} ${theme.radiusMax}`}>
        {["en", "es"].map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={
              "px-2 py-1 text-xs " +
              (lang === code
                ? theme.toolbarPillActive
                : theme.toolbarPillInactive)
            }
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
