// src/components/LanguageSelector.jsx
import React from "react";
import { activeTheme } from "../themes";

const theme = activeTheme;

export default function LanguageSelector({ t, lang, setLang, size = "xs" }) {
  const textSize = size === "sm" ? "text-sm" : "text-xs";

  return (
    <label
      className={`flex items-center gap-2 ${textSize} ${theme.textMuted}`}
    >
      <span className="opacity-70">{t.language}</span>
      <select
        aria-label={t.language}
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className={`${theme.toolbarSelect} ${theme.radiusSoft} px-2 py-1`}
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </label>
  );
}
