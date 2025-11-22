// src/components/BioSection.jsx
import React from "react";
import { useTheme } from "../ThemeContext";

/* -------------------------------------------------
   PLACEHOLDER DATA
--------------------------------------------------*/

const BIO_CARDS = [
  {
    id: "early-3d",
    title: "Early 3D & Illustration",
    timeframe: "2012–2016",
    imageSrc: "/images/bio/early-3d.png",
    imageAlt: "Early 3D and illustration work",
    paragraphs: [
      "I started out as a 3D and 2D artist, obsessed with lighting, materials, and tiny details nobody would ever zoom in to see.",
      "Those years made me very opinionated about how tools should feel in the hands of artists, and planted the seed for building my own."
    ]
  },
  {
    id: "tools-pipeline",
    title: "Tools, Pipelines & UX",
    timeframe: "2017–2021",
    imageSrc: "/images/bio/tools.png",
    imageAlt: "Tools and pipeline sketches",
    paragraphs: [
      "I gradually shifted into pipeline and tools work: convincing software to help instead of fight the people using it.",
      "Most of my time went into debugging weird edge cases, automating manual workflows, and trying to make UI that didn't make artists cry."
    ]
  },
  {
    id: "web-dev",
    title: "Web, Prototyping & Systems",
    timeframe: "2022–now",
    imageSrc: "/images/bio/web.png",
    imageAlt: "Interface mockups and code",
    paragraphs: [
      "These days I live somewhere between design and engineering: front-end dev, prototypes, and small systems that need both structure and vibes.",
      "I like building things that feel playful on the surface but are actually very intentional and well-structured underneath."
    ]
  }
];

const RECENT_READS = [
  {
    id: "book-1",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    date: "2024-03",
    rating: 5,
    description:
      "Dense but very readable overview of how modern data systems actually work. Great for zooming out of day-to-day code and thinking in terms of tradeoffs."
  },
  {
    id: "book-2",
    title: "The Shape of Design",
    author: "Frank Chimero",
    date: "2023-11",
    rating: 4,
    description:
      "Short, reflective essays about what design is for, beyond shipping pixels. More philosophy than how-to, in a good way."
  },
  {
    id: "book-3",
    title: "Refactoring UI",
    author: "Adam Wathan & Steve Schoger",
    date: "2023-05",
    rating: 4,
    description:
      "Very practical visual design advice. Lots of small tweaks that immediately translated into better-looking interfaces."
  }
];

/* -------------------------------------------------
   HELPERS
--------------------------------------------------*/

function formatMonthYear(dateStr) {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!year || !month) return dateStr;
  const d = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}

function StarRating({ value }) {
  const filled = Math.max(0, Math.min(5, value || 0));
  return (
    <span aria-label={`${filled} out of 5 stars`}>
      {"★".repeat(filled)}
      {"☆".repeat(5 - filled)}
    </span>
  );
}

/* -------------------------------------------------
   BIO CARD
--------------------------------------------------*/

function BioCard({ card }) {
  const { theme } = useTheme();

  return (
    <article
      className={`flex w-full flex-col gap-4 p-4 shadow-sm backdrop-blur bg-opacity-90 md:flex-row md:items-start`}
    >
        {/* IMAGE */}
      {card.imageSrc && (
        <div className="w-full md:w-20 md:flex-shrink-0">
          <div className={`overflow-hidden ${theme.radiusSoft}`}>
            <img
              src={card.imageSrc}
              alt={card.imageAlt || card.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
      {/* TEXT */}
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className={`text-lg font-light ${theme.fontHeading}`}>
            {card.title}
          </h3>
          {card.timeframe && (
            <span className={`text-xs ${theme.textSubtle}`}>
              {card.timeframe}
            </span>
          )}
        </div>

        <div className={`mt-2 space-y-2 font-thin ${theme.textMain}`}>
          {card.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      
    </article>
  );
}

/* -------------------------------------------------
   RECENT READS (LEFT COLUMN)
--------------------------------------------------*/

function RecentReadsBox() {
  const { theme } = useTheme();

  return (
    <section
      className={`${theme.card} ${theme.radiusSoft} p-4 md:p-5 border border-black/10`}
    >
      <header className="mb-4">
        <h3 className={`text-lg font-light ${theme.fontHeading}`}>
          Recent reads
        </h3>
        <p className={`mt-1 text-xs ${theme.textSubtle}`}>
          A rotating list of books that influenced how I think about tools,
          design, and systems.
        </p>
      </header>

      {/* single column, no background per-card, just dividers */}
      <ul className="divide-y divide-black/10">
        {RECENT_READS.map((book) => (
          <li key={book.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h4 className={`text-sm font-medium ${theme.fontHeading}`}>
                    {book.title}
                  </h4>
                  <p className={`text-xs ${theme.textSubtle}`}>
                    {book.author}
                  </p>
                </div>
                <div className="text-right text-xs">
                  {book.date && (
                    <p className={theme.textSubtle}>
                      {formatMonthYear(book.date)}
                    </p>
                  )}
                  <p className="mt-0.5">
                    <StarRating value={book.rating} />
                  </p>
                </div>
              </div>

              <p className={`mt-1 text-xs md:text-sm ${theme.textMain}`}>
                {book.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------
   MAIN BIO SECTION LAYOUT
--------------------------------------------------*/

export default function BioSection({ t }) {
  const { theme } = useTheme();

  return (
    // full width inside the main container
    <section className="w-full">
      {/* intro across the full width */}
      <header className="mb-4">
        <h2 className={`mb-1 text-2xl ${theme.heading}`}>
          {t.bioTab}
        </h2>
        <p className={`max-w-2xl text-sm ${theme.textSubtle}`}>
          A quick timeline of how I ended up mixing art, tools, and code —
          and some of the books that shaped how I think about all of it.
        </p>
      </header>

      {/* desktop: books left, bio cards right */}
      <div
        className="
          mt-6 grid gap-8
          md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]
          lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]
        "
      >
        
        {/* LEFT: single column of bio cards */}
        <div className="space-y-4">
          {BIO_CARDS.map((card) => (
            <BioCard key={card.id} card={card} />
          ))}
        </div>

        {/* RIGHT: books */}
        <RecentReadsBox />
      </div>
    </section>
  );
}
