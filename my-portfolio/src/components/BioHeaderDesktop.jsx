// src/components/BioHeaderDesktop.jsx
import React from "react";
import { activeTheme } from "../themes";

const theme = activeTheme;

export default function BioHeaderDesktop({ t }) {
  return (
    <div className={`w-full ${theme.headerStrip}`}>
      <div className="px-4 py-6">
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
      </div>
    </div>
  );
}
