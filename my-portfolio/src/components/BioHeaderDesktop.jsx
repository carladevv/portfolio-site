// src/components/BioHeaderDesktop.jsx
import React from "react";
import { useTheme } from "../ThemeContext";

// lucide icons
import { Linkedin, Github, Youtube } from "lucide-react";

export default function BioHeaderDesktop({ t }) {
  const { theme } = useTheme();

  return (
    <div className={`w-full ${theme.headerStrip}`}>
      <div className="px-2 pt-2 flex items-center gap-4">

        {/* Profile picture – fixed size, circular, pixelated */}
        <div
          className={`h-256 w-256 flex items-center justify-center overflow-hidden ${theme.accentBg} `}
        >
          <img
            src="/pfp.png"
            alt="Profile"
            className="w-32 h-32 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Text block */}
        <div className="flex flex-col justify-center">
          <h1
            className={`text-3xl font-thin ${
              theme.fontHeading || ""
            } ${theme.headerTextMain}`}
          >
            {t.name}
          </h1>

          <p className={`mt-2 text-base uppercase ${theme.headerTextMuted}`}>
            {t.tagline}
          </p>

          {/* Contact links */}
<div className="flex flex-row gap-3 mt-3 text-xs">
  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/nadina-carla-cardillo-garreta"
    target="_blank"
    rel="noopener noreferrer"
    className={`underline ${theme.headerTextMuted} hover:${theme.headerTextMain} transition-colors flex items-center gap-2`}
  >
    <Linkedin size={16} />
    linkedin.com/nadina-carla-cardillo
  </a>

  {/* GitHub */}
  <a
    href="https://github.com/carladevv"
    target="_blank"
    rel="noopener noreferrer"
    className={`underline ${theme.headerTextMuted} hover:${theme.headerTextMain} transition-colors flex items-center gap-2`}
  >
    <Github size={16} />
    github.com/carladevv
  </a>

  {/* YouTube */}
  <a
    href="https://youtube.com/carladevv"
    target="_blank"
    rel="noopener noreferrer"
    className={`underline ${theme.headerTextMuted} hover:${theme.headerTextMain} transition-colors flex items-center gap-2`}
  >
    <Youtube size={16} />
    youtube.com/carladevv
  </a>
</div>

        </div>

      </div>
    </div>
  );
}
