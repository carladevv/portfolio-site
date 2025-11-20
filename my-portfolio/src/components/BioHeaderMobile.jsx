// src/components/BioHeaderMobile.jsx
import React from "react";
import { activeTheme } from "../themes";
import LanguageSelector from "./LanguageSelector";

const theme = activeTheme;

export default function BioHeaderMobile({
  t,
  lang,
  setLang,
  fontSize,
  setFontSize,
}) {
  return (
    <div className={`w-full ${theme.headerStrip}`}>
      {/* toolbar – normal, not floating */}
      <div className="flex items-center justify-end gap-4 px-3 pt-3">
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
      </div>

      {/* Text-only header */}
      <div className="px-4 pb-5 pt-4">
        <h1
          className={`text-3xl font-semibold ${
            theme.fontHeading || ""
          } ${theme.headerTextMain}`}
        >
          {t.name}
        </h1>
        <p className={`mt-2 text-sm uppercase ${theme.headerTextMuted}`}>
          {t.tagline}
        </p>
      </div>
    </div>
  );
}
