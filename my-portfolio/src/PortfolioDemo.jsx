// src/PortfolioDemo.jsx
import React, { useMemo, useState, useEffect } from "react";
import en from "./data/i18n.en.json";
import es from "./data/i18n.es.json";
// ⬇️ use Google Sheets loader instead of local JSON
import { loadCardsFromSheets } from "./data/loadCardsFromSheets";

import ProjectCard from "./components/projectCard";

// extracted components
import ToolbarFloating from "./components/ToolbarFloating";
import BioHeaderMobile from "./components/BioHeaderMobile";
import BioHeaderDesktop from "./components/BioHeaderDesktop";
import FooterBar from "./components/FooterBar";
import SectionTabs from "./components/SectionTabs";
import BioSection from "./components/BioSection";

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

// ---- internal components ----

function MediaLightbox({ open, onClose, media, title, index }) {
  const { theme } = useTheme();
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
          <p className={`mt-2 text-center text-xs ${theme.textMuted}`}>
            {m?.caption || m?.alt}
          </p>
        )}
      </div>
    </div>
  );
}

// small helper to get the title for current lang from the card
function getItemTitle(item, lang) {
  if (!item) return "";
  return (
    item.content?.[lang]?.title ||
    item.content?.en?.title ||
    item.title || // fallback if you ever keep a flat title
    ""
  );
}

// ---- MAIN COMPONENT ----

function PortfolioInner() {
  const [lang, setLang] = useState("en");
  const [fontSize, setFontSize] = useState("sm");
  const [section, setSection] = useState("graphics");
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  const { theme, themeId, nextTheme, prevTheme } = useTheme();

  const t = { en, es }[lang];

  const textSize =
    fontSize === "sm"
      ? "text-sm"
      : fontSize === "lg"
        ? "text-lg"
        : "text-base";

  // load cards from Google Sheets once on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchCards() {
      try {
        const loaded = await loadCardsFromSheets();
        if (!cancelled) {
          setCards(loaded);
        }
      } catch (err) {
        console.error("Failed to load cards from Google Sheets:", err);
      } finally {
        if (!cancelled) {
          setCardsLoading(false);
        }
      }
    }

    fetchCards();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    if (section === "bio") return [];

    const PRIORITY_ORDER = {
      high: 0,
      mid: 1,
      low: 2,
    };

    return cards
      .filter((card) => {
        // hide cards with visibility === "off"
        const isVisible = card.visibility !== "off";
        const inSection = card.tags?.includes(section);
        return isVisible && inSection;
      })
      .sort((a, b) => {
        // sort by priority: high → mid → low
        // const pa = PRIORITY_ORDER[a.priority || "low"];
        // const pb = PRIORITY_ORDER[b.priority || "low"];
        // if (pa !== pb) return pa - pb;

        // then by startDate: newest first
        const da = new Date(a.startDate || 0).getTime();
        const db = new Date(b.startDate || 0).getTime();
        return db - da;
      });
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
      {/* Grain Texture */}
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
            <BioSection t={t} />
          ) : cardsLoading ? (
            <p className={theme.textSubtle}>Loading projects…</p>
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
                  lang={lang}
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
          title={getItemTitle(lightbox.item, lang)}
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
