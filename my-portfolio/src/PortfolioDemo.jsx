import React, { useMemo, useState, useEffect } from "react";
import en from "./data/i18n.en.json";
import es from "./data/i18n.es.json";
import projectsData from "./data/projects.json";
import labData from "./data/lab.json";

import { activeTheme } from "./themes";
import ProjectCard from "./components/ProjectCard";

// ❤️ extracted components
import LanguageSelector from "./components/LanguageSelector";
import ToolbarFloating from "./components/ToolbarFloating";
import BioHeaderMobile from "./components/BioHeaderMobile";
import BioHeaderDesktop from "./components/BioHeaderDesktop";
import FooterBar from "./components/FooterBar";

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

// ---- internal components ----

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

// ---- MAIN COMPONENT ----

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
  const isWideForGrid = !useIsMobile(1200);

  return (
    <div
      className={`min-h-screen ${theme.pageBg} ${theme.fontBody} ${theme.textMain} ${textSize}`}
    >
      {/* Desktop header + floating toolbar */}
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

      {/* Mobile header */}
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
      <FooterBar t={t} />

      {/* Media Viewer */}
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
