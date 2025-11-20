// src/components/FooterBar.jsx
import React from "react";
import { activeTheme } from "../themes";

const theme = activeTheme;

export default function FooterBar({ t }) {
  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 backdrop-blur ${theme.footerBar}`}
    >
      <div className="mx-auto flex max-w-10xl items-center justify-between px-4 py-2 text-xs">
        <span className={`place-self-start ${theme.textMuted}`}>
          © {new Date().getFullYear()} • {t.name}
        </span>
        <a
          href="https://github.com/youruser/your-portfolio"
          className={`place-self-end px-2 py-1 ${theme.footerButton} ${theme.radiusSoft}`}
        >
          {t.footerNote}
        </a>
      </div>
    </footer>
  );
}
