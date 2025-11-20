import React, { useMemo, useState, useEffect } from "react";
import en from "./data/i18n.en.json";
import es from "./data/i18n.es.json";
import projectsData from "./data/projects.json";
import labData from "./data/lab.json";

import { activeTheme } from "./themes";
import ProjectCard from "./components/projectCard";

const theme = activeTheme;

// ---- hooks ----

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

// ---- i18n ----

const copy = { en, es };
const projects = projectsData;
const lab = labData;

// ---- UI components ----

function ToolbarFloating({ t, lang, setLang, fontSize, setFontSize }) {
  return (
    <div
      className={`fixed right-3 top-3 z-50 flex items-center gap-4 px-3 py-2 backdrop-blur ${theme.toolbar} ${theme.radiusSoft}`}
    >
      {/* Language */}
      <label
        className={`flex items-center gap-2 text-xs ${theme.textMuted}`}
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
    </div>
  );
}

/**
 * Mobile header: text-only (no picture) + inline toolbar
 */
function BioHeaderMobile({ t, lang, setLang, fontSize, setFontSize }) {
  return (
    <div className={`w-full ${theme.headerStrip}`}>
      {/* toolbar – normal, not floating */}
      <div className="flex items-center justify-end gap-4 px-3 pt-3">
        <label
          className={`flex items-center gap-2 text-xs ${theme.textMuted}`}
        >
          <span className="opacity-70">{t.language}</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className={`${theme.toolbarSelect} ${theme.radiusSoft} px-2 py-1`}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </label>
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
        <p className={`mt-2 text-sm ${theme.headerTextMuted}`}>
          {t.tagline}
        </p>
      </div>
    </div>
  );
}

/**
 * Desktop header: text-only
 */
function BioHeaderDesktop({ t }) {
  return (
    <div className={`w-full ${theme.headerStrip}`}>
      <div className="px-4 py-6">
        <h1
          className={`text-3xl font-semibold ${
            theme.fontHeading || ""
          } ${theme.headerTextMain}`}
        >
          {t.name}
        </h1>
        <p className={`mt-2 text-base ${theme.headerTextMuted}`}>
          {t.tagline}
        </p>
      </div>
    </div>
  );
}

function SectionTabs({ t, current, onChange, size = "md" }) {
  const tabs = [
    { key: "projects", label: t.projects },
    { key: "lab", label: t.lab },
    { key: "bio", label: t.bioTab },
  ];

  const pad = size === "lg" ? "py-3 text-base" : "py-2 text-sm";
  const width =
    size === "lg" ? "min-w-[14ch]" : "min-w-[12ch]"; // equal width
  const gap = size === "lg" ? "gap-5" : "gap-4";

  return (
    <div className="mx-auto my-6 max-w-[1200px] px-4 md:my-8">
      <div className={`flex ${gap} justify-center`}>
        {tabs.map((btn) => (
          <button
            key={btn.key}
            onClick={() => onChange(btn.key)}
            className={
              `${theme.radiusMax} px-6 ${pad} ${width} text-center transition shadow-sm border ` +
              (current === btn.key
                ? theme.tabActive
                : theme.tabInactive)
            }
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MediaLightbox({ open, onClose, media, title, index }) {
  if (!open) return null;
  const m = media[index];
  const isVideo = m?.type === "youtube";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme.lightboxBackdrop}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} media viewer`}
    >
      <button
        onClick={onClose}
        className={`absolute right-4 top-4 ${theme.radiusSoft} border border-black/40 bg-black/70 px-3 py-1 text-sm text-white hover:bg-black/80`}
        aria-label="Close"
      >
        ✕
      </button>

      <div className="max-w-[90vw]">
        <div className="aspect-video w-[min(90vw,1100px)]">
          {isVideo ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${m.youtubeId}`}
              title={m.caption || m.alt || title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <img
              src={m?.src}
              alt={m?.alt}
              className="h-full w-full object-contain"
            />
          )}
        </div>
        {(m?.caption || m?.alt) && (
          <p
            className={`mt-2 text-center text-xs ${theme.textMuted}`}
          >
            {m?.caption || m?.alt}
          </p>
        )}
      </div>
    </div>
  );
}

export default function PortfolioDemo() {
  const [lang, setLang] = useState("en");
  const [fontSize, setFontSize] = useState("base");
  const [section, setSection] = useState("projects");
  const t = copy[lang];

  const textSize =
    fontSize === "sm"
      ? "text-sm"
      : fontSize === "lg"
      ? "text-lg"
      : "text-base";

  const items = useMemo(
    () =>
      section === "projects"
        ? projects
        : section === "lab"
        ? lab
        : [],
    [section]
  );

  const [lightbox, setLightbox] = useState({
    open: false,
    item: null,
    index: 0,
  });
  const openMedia = (item, index) =>
    setLightbox({ open: true, item, index });
  const closeMedia = () =>
    setLightbox({ open: false, item: null, index: 0 });

  const isMobile = useIsMobile();
  const isWideForGrid = !useIsMobile(1200); // >= 1200px → 2 columns of 600

  return (
    <div
      className={`min-h-screen ${theme.pageBg} ${theme.fontBody} ${theme.textMain} ${textSize}`}
    >
      {/* Desktop: floating toolbar + desktop bio band */}
      {!isMobile && (
        <>
          <ToolbarFloating
            t={t}
            lang={lang}
            setLang={setLang}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
          <BioHeaderDesktop t={t} />
        </>
      )}

      {/* Mobile: combined header */}
      {isMobile && (
        <BioHeaderMobile
          t={t}
          lang={lang}
          setLang={setLang}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      )}

      {/* Tabs */}
      <SectionTabs
        size="lg"
        t={t}
        current={section}
        onChange={setSection}
      />

      {/* Main content */}
      <main className="mx-auto max-w-[1200px] px-4 pt-6 pb-24">
        {section === "bio" ? (
          <article className={`max-w-none ${theme.textMain}`}>
            <h2 className={`mb-2 text-2xl ${theme.heading}`}>
              {t.bioTab}
            </h2>
            <p>
              Long-form professional story goes here—how 3D/2D art led
              to tools and web dev, the problems you like to solve, and
              what you’re exploring next.
            </p>
          </article>
        ) : (
          // grid: 2 × 600px columns when there's room, otherwise 1 column stretched
          <div
            className="grid gap-6 justify-center"
            style={{
              gridTemplateColumns: isWideForGrid
                ? "repeat(2, minmax(0, 600px))"
                : "minmax(0, 1fr)",
            }}
          >
            {items.map((p) => (
              <ProjectCard
                key={p.id}
                item={p}
                t={t}
                onOpenMedia={openMedia}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
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

      <MediaLightbox
        open={lightbox.open}
        onClose={closeMedia}
        media={lightbox.item?.media || []}
        title={lightbox.item?.title || ""}
        index={lightbox.index}
      />
    </div>
  );
}
