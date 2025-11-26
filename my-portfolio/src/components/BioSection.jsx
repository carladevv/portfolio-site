// src/components/BioSection.jsx
import React from "react";
import { useTheme } from "../ThemeContext";

// icon for the "Recent reads" header – from /public, loads instantly
const RECENT_READS_ICON = {
  src: "/images/bio/recent_reads.png",
  alt: "Recent reads icon",
};

function BioCardView({ card }) {
  const { theme } = useTheme();

  return (
    <article
      className={`grid w-full grid-cols-[auto,1fr] gap-x-3 gap-y-1 p-4 shadow-sm backdrop-blur bg-opacity-90`}
    >
      {/* ICON */}
      {card.imageSrc && (
        <div className="self-center">
          <div
            className={`h-[24px] w-[24px] overflow-hidden ${theme.radiusSoft}`}
          >
            <img
              src={card.imageSrc}
              alt={card.imageAlt || card.title}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* TITLE (row 1, col 2) */}
      <h3
        className={`text-lg font-light ${theme.fontHeading} flex items-center`}
      >
        {card.title}
      </h3>

      {/* TIMEFRAME – own row, spans full width */}
      {card.timeframe && (
        <div className="col-span-2">
          <span className={`text-xs ${theme.textSubtle}`}>
            {card.timeframe}
          </span>
        </div>
      )}

      {/* PARAGRAPHS – span both columns */}
      <div className={`col-span-2 mt-1 space-y-2 font-thin ${theme.textMain}`}>
        {card.paragraphs?.map((p, i) => (
          <p key={i} className="m-0">
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}

function StarRating({ value }) {
  const filled = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span aria-label={`${filled} out of 5 stars`}>
      {"★".repeat(filled)}
      {"☆".repeat(5 - filled)}
    </span>
  );
}

function RecentReadsBox({ t, reads, isLoading }) {
  const { theme } = useTheme();
  const hasReads = reads && reads.length > 0;

  return (
    <section
      className={`${theme.card} ${theme.radiusSoft} p-4 md:p-5 border border-black/10`}
    >
      <header className="mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`h-[30px] w-[30px] overflow-hidden ${theme.radiusSoft}`}
          >
            <img
              src={RECENT_READS_ICON.src}
              alt={RECENT_READS_ICON.alt}
              className="h-full w-full object-contain"
            />
          </div>
          <h3 className={`text-lg font-light ${theme.fontHeading}`}>
            {t.recentReadsTitle}
          </h3>
        </div>
        <p className={`mt-1 ${theme.textSubtle}`}>{t.recentReadsSubtitle}</p>
      </header>

      {/* Loading / empty / data states */}
      {!hasReads && isLoading && (
        <p className={theme.textSubtle}>Loading reads...</p>
      )}

      {hasReads && (
        <ul className="divide-y divide-black/10">
          {reads.map((book) => (
            <li key={book.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h4 className={`text-sm font-medium ${theme.fontHeading}`}>
                      {book.title}
                    </h4>
                    <p className={theme.textSubtle}>
                      <StarRating value={book.rating} />{" "}
                      <span className="mx-1">·</span>
                      <span>{book.author}</span>
                      {book.year && <span> — {book.year}</span>}
                    </p>
                  </div>
                </div>

                <p className={`mt-1 ${theme.textSubtle}`}>
                  {book.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// helper to pick language content with sensible fallback
function pickLangContent(map, lang) {
  if (!map) return null;
  if (map[lang]) return map[lang];
  if (map["en"]) return map["en"];
  const first = Object.values(map)[0];
  return first || null;
}

export default function BioSection({
  t,
  lang,
  bioCards,
  recentReads,
  isLoading,
}) {
  const { theme } = useTheme();

  // Map Sheet rows → render-ready bio cards
  const bioToRender = (bioCards || [])
    .map((card) => {
      const content = pickLangContent(card.content, lang) || {};
      const paragraphs = [];

      if (Array.isArray(content.paragraphs) && content.paragraphs.length > 0) {
        paragraphs.push(...content.paragraphs);
      } else {
        ["p1", "p2", "p3"].forEach((key) => {
          if (content[key]) paragraphs.push(content[key]);
        });
      }

      return {
        id: card.id,
        order: card.order,
        timeframe: card.timeframe,
        imageSrc: card.imageSrc,
        title: content.title || "",
        imageAlt: content.imageAlt || "",
        paragraphs,
      };
    })
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

  // Map Sheet rows → render-ready reads
  const readsToRender = (recentReads || [])
    .map((book) => {
      const content = pickLangContent(book.content, lang) || {};
      return {
        id: book.id,
        order: book.order,
        author: book.author,
        year: book.year,
        rating: book.rating,
        title: content.title || "",
        description: content.description || "",
      };
    })
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

  const hasBio = bioToRender.length > 0;

  return (
    // let the global card font-size slider affect this whole section
    <section className="relative w-full text-[length:var(--card-font-size)]">
      {/* DESKTOP: recent reads on the right */}
      <div className="hidden lg:block absolute top-0 right-0">
        <div className="mr-6 w-[460px]">
          <RecentReadsBox
            t={t}
            reads={readsToRender}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Intro + bio header (always visible, independent of Sheets) */}
      <header className="mb-4 lg:pr-[500px]">
        <h2 className={`mb-1 text-2xl font-light ${theme.fontHeading}`}>
          {t.bioTab}
        </h2>
        <p className={`max-w-2xl ${theme.textSubtle}`}>{t.bioIntro}</p>
      </header>

      {/* Bio cards / loading state */}
      <div className="mt-6 space-y-4 lg:pr-[500px]">
        {!hasBio && isLoading && (
          <p className={theme.textSubtle}>Loading journey...</p>
        )}

        {hasBio &&
          bioToRender.map((card) => (
            <BioCardView key={card.id} card={card} />
          ))}
      </div>

      {/* MOBILE/TABLET: recent reads after bio */}
      <div className="mt-6 lg:hidden">
        <RecentReadsBox
          t={t}
          reads={readsToRender}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
