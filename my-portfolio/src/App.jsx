// src/App.jsx
import React, { useMemo, useState, useEffect } from "react";

import en from "./data/i18n.en.json";
import es from "./data/i18n.es.json";
import { loadProjectCardsFromSheets } from "./data/loadProjectCardsFromSheets";
import { loadBioCardsFromSheets } from "./data/loadBioCardsFromSheets";

import ProjectCard from "./components/projectCard";
import ToolbarFloating from "./components/ToolbarFloating";
import BioHeaderMobile from "./components/BioHeaderMobile";
import BioHeaderDesktop from "./components/BioHeaderDesktop";
import FooterBar from "./components/FooterBar";
import SectionTabs from "./components/SectionTabs";
import BioSection from "./components/BioSection";
import MediaLightbox from "./components/MediaLightbox";

import { ThemeProvider, useTheme } from "./ThemeContext";

//
// ───────────────────────────────────────────────────────────
//  Utility hooks & helpers
// ───────────────────────────────────────────────────────────
//

// Responsive detection
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

// Get localized card title
function getItemTitle(item, lang) {
  if (!item) return "";
  return (
    item.content?.[lang]?.title ||
    item.content?.en?.title ||
    item.title ||
    ""
  );
}

//
// ───────────────────────────────────────────────────────────
//  Main Portfolio Component
// ───────────────────────────────────────────────────────────
//

function Portfolio() {
  //
  // ─── Section definitions ────────────────────────────────
  //
  const SECTION_KEYS = [
    "graphics",
    "accessibility",
    "tooling",
    "archaeology",
    "science",
    "bio",
  ];

  // determines initial and future section state based on URL
  function getSectionFromLocation() {
    if (typeof window === "undefined") return "graphics";

    // Try hash first — #graphics
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (SECTION_KEYS.includes(hash)) return hash;

    // Try query param — ?section=science
    const params = new URLSearchParams(window.location.search);
    const param = params.get("section")?.toLowerCase();
    if (param && SECTION_KEYS.includes(param)) return param;

    return "graphics";
  }

  //
  // ─── App State ───────────────────────────────────────────
  //
  const [lang, setLang] = useState("en");
  const [fontSize, setFontSize] = useState("sm");
  const [section, setSection] = useState(() => getSectionFromLocation());

  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  // NEW: bio + reads from Sheets
  const [bioCards, setBioCards] = useState([]);
  const [recentReads, setRecentReads] = useState([]);

  const { theme, themeId, nextTheme, prevTheme } = useTheme();
  const t = { en, es }[lang];

  const textSize =
    fontSize === "sm" ? "text-sm" : fontSize === "lg" ? "text-lg" : "text-base";

  //
  // ───────────────────────────────────────────────────────────
  //  Load cards from Google Sheets on mount
  // ───────────────────────────────────────────────────────────
  //
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [projectCards, bioData] = await Promise.all([
          loadProjectCardsFromSheets(),
          loadBioCardsFromSheets(),
        ]);

        if (cancelled) return;

        setCards(projectCards || []);

        // Be tolerant about the shape: reads or recentReads
        const loadedBioCards = bioData?.bioCards || [];
        const loadedReads = bioData?.reads || bioData?.recentReads || [];

        setBioCards(loadedBioCards);
        setRecentReads(loadedReads);
      } catch (err) {
        console.error("Failed to load data from Sheets:", err);
      } finally {
        if (!cancelled) setCardsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  //
  // ───────────────────────────────────────────────────────────
  //  Section Switching + URL Sync
  // ───────────────────────────────────────────────────────────
  //

  // When user clicks a tab
  const handleSectionChange = (next) => {
    setSection(next);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.hash = `#${next}`;
      window.history.replaceState({}, "", url);
    }
  };

  // When the browser's Back button or a hash link is used
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onHash = () => {
      const next = getSectionFromLocation();
      setSection((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  //
  // ───────────────────────────────────────────────────────────
  //  Project card filtering and sorting
  // ───────────────────────────────────────────────────────────
  //

  const items = useMemo(() => {
    if (section === "bio") return [];

    return cards
      .filter((card) => {
        const visible = card.visibility !== "off";
        const inSection = card.tags?.includes(section);
        return visible && inSection;
      })
      .sort((a, b) => {
        // Sort by startDate (newest → oldest)
        const da = new Date(a.startDate || 0).getTime();
        const db = new Date(b.startDate || 0).getTime();
        return db - da;
      });
  }, [section, cards]);

  //
  // ───────────────────────────────────────────────────────────
  //  Media Lightbox
  // ───────────────────────────────────────────────────────────
  //

  const [lightbox, setLightbox] = useState({
    open: false,
    item: null,
    index: 0,
  });

  const openMedia = (item, index) =>
    setLightbox({ open: true, item, index });

  const closeMedia = () =>
    setLightbox({ open: false, item: null, index: 0 });

  //
  // ───────────────────────────────────────────────────────────
  //  Responsive Layout
  // ───────────────────────────────────────────────────────────
  //
  const isMobile = useIsMobile();
  const isWideForGrid = !useIsMobile(1200);

  //
  // ───────────────────────────────────────────────────────────
  //  Render UI
  // ───────────────────────────────────────────────────────────
  //
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
      {/* Background Grain */}
      <div
        className={`
          absolute inset-0 pointer-events-none opacity-15 bg-repeat z-0
          ${theme.bgTexture}
        `}
        aria-hidden="true"
      />

      {/* Foreground */}
      <div className="relative z-10">
        {/* Headers */}
        {!isMobile ? (
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
        ) : (
          <BioHeaderMobile
            t={t}
            lang={lang}
            setLang={setLang}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        )}

        {/* Section Tabs */}
        <SectionTabs
          t={t}
          size="lg"
          current={section}
          onChange={handleSectionChange}
        />

        {/* Main Content Area */}
        <main className="mx-auto max-w-[1300px] px-4 pt-6 pb-24">
          {section === "bio" ? (
            <BioSection
              t={t}
              lang={lang}
              bioCards={bioCards}
              recentReads={recentReads}
              isLoading={cardsLoading}
            />
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
                />
              ))}
            </div>
          )}
        </main>

        <FooterBar t={t} />
        
      </div>
    </div>
  );
}

//
// ───────────────────────────────────────────────────────────
//  Wrapped in ThemeProvider
// ───────────────────────────────────────────────────────────
//

export default function App() {
  return (
    <ThemeProvider>
      <Portfolio />
    </ThemeProvider>
  );
}
