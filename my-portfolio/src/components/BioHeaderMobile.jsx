// src/components/BioHeaderMobile.jsx
import { useTheme } from "../ThemeContext";
import LanguageSelector from "./LanguageSelector";
import { SiLinkedin, SiGithub, SiYoutube } from "react-icons/si";


export default function BioHeaderMobile({
  t,
  lang,
  setLang,
  fontSize,
  setFontSize,
}) {
  const { theme } = useTheme();

  return (
    <div className={`w-full ${theme.headerStrip}`}>

      {/* toolbar */}
      <div className="flex items-center justify-end gap-4 px-4 pt-3">
        <LanguageSelector t={t} lang={lang} setLang={setLang} />
        <label className={`flex items-center gap-2 text-xs ${theme.textMuted}`}>
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

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 px-4 pt-2">

        {/* Row 1 — full width title */}
        <h1
          className={`text-2xl font-thin col-span-2 ${
            theme.fontHeading || ""
          } ${theme.headerTextMain}`}
        >
          {t.name}
        </h1>

        {/* Left column: picture spanning 2 rows, glued to bottom */}
        <div className="row-span-2">
          <div
            className={`w-24 h-24 ${theme.accentBg}`}
          >
            <img
              src="/pfp.png"
              alt="Profile"
              className="w-24 h-24 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        {/* Row 2 right: tagline */}
        <p className={`text-xs uppercase self-center ${theme.headerTextMuted}`}>
          {t.tagline}
        </p>

        {/* Row 3 right: links */}
        <div className="flex flex-row flex-wrap gap-2 text-[0.7rem] mt-0">
          <a
            href="https://www.linkedin.com/in/nadina-carla-cardillo-garreta"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline ${theme.headerTextMuted} hover:${theme.headerTextMain} transition-colors flex items-center gap-1`}
          >
            <SiLinkedin size={14} />
            LinkedIn
          </a>

          <a
            href="https://github.com/carladevv"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline ${theme.headerTextMuted} hover:${theme.headerTextMain} transition-colors flex items-center gap-1`}
          >
            <SiGithub size={14} />
            GitHub
          </a>

          <a
            href="https://youtube.com/carladevv"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline ${theme.headerTextMuted} hover:${theme.headerTextMain} transition-colors flex items-center gap-1`}
          >
            <SiYoutube size={14} />
            Youtube
          </a>
        </div>

      </div>
    </div>
  );
}
