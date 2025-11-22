// src/components/SectionTabs.jsx
import React, { useState } from "react";
import {
  Box,
  PersonStanding,
  Amphora,
  Wrench,
  Microscope,
  Sparkles,
  Menu,
} from "lucide-react";
import { useTheme } from "../ThemeContext";

// The i18n keys stay the same — we now pull values from the `t` prop
const RAW_SECTIONS = [
  { key: "graphics", icon: Box, i18nKey: "sections.graphics" },
  { key: "accessibility", icon: PersonStanding, i18nKey: "sections.accessibility" },
  { key: "tooling", icon: Wrench, i18nKey: "sections.tooling" },
  { key: "archaeology", icon: Amphora, i18nKey: "sections.archaeology" },
  { key: "science", icon: Microscope, i18nKey: "sections.science" },
  { key: "bio", icon: Sparkles, i18nKey: "sections.bio" }
];

export default function SectionTabs({ t, current, onChange, size = "md" }) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  // Use the passed t-object for translations
  const SECTIONS = RAW_SECTIONS.map((s) => ({
    ...s,
    label: t?.sections?.[s.key] ?? s.key
  }));

  const pad = size === "lg" ? "py-3 text-base" : "py-2 text-sm";
  const width = size === "lg" ? "min-w-[14ch]" : "min-w-[12ch]";
  const gap = size === "lg" ? "gap-6" : "gap-4";

  const currentSection = SECTIONS.find((s) => s.key === current);

  return (
    <div
      className="
        mx-auto max-w-[1200px] px-4
        mt-4 mb-0            /* mobile: smaller top, zero bottom */
        lg:mt-12 lg:mb-6     /* desktop: big top, normal bottom */
      "
    >
      <div
        className={`
          flex items-center 
          justify-start lg:justify-center
          ${gap}
        `}
      >
        {/* ───────────────────────── */}
        {/* MOBILE / TABLET HAMBURGER */}
        {/* ───────────────────────── */}
        <div className="relative lg:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            className={`
              flex items-center gap-2 px-3 py-2 ${theme.radiusMax}
              border shadow-sm uppercase text-sm
              ${theme.tabInactive}
            `}
          >
            <Menu size={22} className={theme.textMuted} />
            <span>{currentSection?.label}</span>
          </button>

          {open && (
            <div
              className={`
                absolute left-0 mt-2 w-48 z-20 p-2
                flex flex-col gap-2 border shadow-md backdrop-blur
                ${theme.toolbar} ${theme.radiusSoft}
              `}
            >
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const active = current === s.key;

                return (
                  <button
                    key={s.key}
                    onClick={() => {
                      onChange(s.key);
                      setOpen(false);
                    }}
                    className={`
                      flex items-center gap-2 px-3 py-2 text-left uppercase text-sm
                      ${theme.radiusMax} border shadow-sm
                      ${active ? theme.tabActive : theme.tabInactive}
                    `}
                  >
                    <Icon
                      size={18}
                      className={active ? theme.accentText : theme.textMuted}
                    />
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ─────────────────────── */}
        {/* DESKTOP STATIC TABS     */}
        {/* ─────────────────────── */}
        <div className="hidden lg:flex items-center justify-center gap-4">
          {/* Desktop hamburger — only a graphic */}
          <div className="px-3 py-2">
            <Menu
              size={22}
              className={`${theme.textMuted} pointer-events-none select-none`}
            />
          </div>

          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = current === s.key;
            return (
              <button
                key={s.key}
                onClick={() => onChange(s.key)}
                className={`
                  ${theme.radiusMax} px-6 ${pad} ${width}
                  ${theme.fontHeading} text-center transition shadow-sm border
                  flex items-center justify-center gap-2 uppercase
                  ${active ? theme.tabActive : theme.tabInactive}
                `}
              >
                <Icon
                  size={18}
                  className={active ? theme.accentText : theme.textMuted}
                />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
