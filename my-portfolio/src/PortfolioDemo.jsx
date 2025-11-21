// src/PortfolioDemo.jsx
import React, { useMemo, useState, useEffect } from "react";
import en from "./data/i18n.en.json";
import es from "./data/i18n.es.json";
import cardsData from "./data/cards.json";

import ProjectCard from "./components/projectCard";

// extracted components
import ToolbarFloating from "./components/ToolbarFloating";
import BioHeaderMobile from "./components/BioHeaderMobile";
import BioHeaderDesktop from "./components/BioHeaderDesktop";
import FooterBar from "./components/FooterBar";
import SectionTabs from "./components/SectionTabs";

import { ThemeProvider, useTheme } from "./ThemeContext";

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

// ---- i18n / data ----
const copy = { en, es };
const cards = cardsData;

// ---- internal components ----

function MediaLightbox({ open, onClose, media, title, index }) {
  if (!open) return null;
   const { theme } = useTheme();
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

function PortfolioInner() {
  const [lang, setLang] = useState("en");
  const [fontSize, setFontSize] = useState("sm");
  const [section, setSection] = useState("graphics");

  const { theme, themeId, nextTheme, prevTheme } = useTheme();

  const t = { en, es }[lang];
  const cards = cardsData;

  const textSize =
    fontSize === "sm"
      ? "text-sm"
      : fontSize === "lg"
      ? "text-lg"
      : "text-base";

  const items = useMemo(() => {
    if (section === "bio") return [];
    return cards.filter((card) => card.tags?.includes(section));
  }, [section, cards]);

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
      className={`
        relative min-h-screen
        ${theme.pageBg}
        ${theme.fontBody}
        ${theme.textMain}
        ${textSize}
      `}
    >
      {/* Grain Texture (THIS IS THE ONE THAT WAS LOST) */}
      <div
        className={`
          absolute inset-0
          pointer-events-none
          opacity-15
          bg-repeat
          z-0
          ${theme.bgTexture}
        `}
        aria-hidden="true"
      />

      {/* All content ABOVE grain */}
      <div className="relative z-10">
        {!isMobile && (
          <>
            <ToolbarFloating
              t={t}
              lang={lang}
              setLang={setLang}
              fontSize={fontSize}
              setFontSize={setFontSize}
              themeId={themeId}
              onNextTheme={nextTheme}
              onPrevTheme={prevTheme}
            />
            <BioHeaderDesktop t={t} />
          </>
        )}

        {isMobile && (
          <BioHeaderMobile
            t={t}
            lang={lang}
            setLang={setLang}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        )}

        <SectionTabs
          t={t}
          size="lg"
          current={section}
          onChange={setSection}
        />

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
    lang={lang}        // 👈 add this
    onOpenMedia={openMedia}
  />
))}

            </div>
          )}
        </main>

        <FooterBar t={t} />

        <MediaLightbox
          open={lightbox.open}
          onClose={closeMedia}
          media={lightbox.item?.media || []}
          title={lightbox.item?.title || ""}
          index={lightbox.index}
        />
      </div>
    </div>
  );
}


export default function PortfolioDemo() {
  return (
    <ThemeProvider>
      <PortfolioInner />
    </ThemeProvider>
  );
}

