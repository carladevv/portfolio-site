// src/components/BioSection.jsx
import React from "react";
import { useTheme } from "../ThemeContext";

/* -------------------------------------------------
   PLACEHOLDER DATA
--------------------------------------------------*/

const BIO_CARDS = [
  {
    id: "bio_1",
    title: "Early life",
    timeframe: "1994-2002",
    imageSrc: "/images/bio/bio_1.png",
    imageAlt: "Early 3D and illustration work",
    paragraphs: [
      "I have fond memories of my childhood in Uruguay, playing early educational computer games with my father and visiting the library with my mother, where choose-your-own-adventure books were by far my favourite.",
      "My preference in this regard has not changed much as I have continued to enjoy choice-based games and visual novels consistently throughout the years.",

    ]
  },
  {
    id: "bio_2",
    title: "The World Wide Web",
    timeframe: "2002-2012",
    imageSrc: "/images/bio/bio_2.png",
    imageAlt: "Tools and pipeline sketches",
    paragraphs: [
      "We got internet at home around the time I started high school in Spain. I was immediately drawn to the idea of virtual spaces and making friends from all around the world, so I became very active online.",
      "The internet gave me access to a vast wealth of specialized learning resources. I spent countless hours following tutorials on the topics of drawing, websites and game development."
    ]
  },
  {
    id: "bio_3",
    title: "Art School",
    timeframe: "2012-2020",
    imageSrc: "/images/bio/bio_3.png",
    imageAlt: "Interface mockups and code",
    paragraphs: [
      "I studied Fine Arts at the University of Seville after graduating High School, but I struggled severely due to health complications that arose during this time.",
      "I discovered an unexpected deep love of traditional clay sculpture at university, and I wrote my thesis on the benefits of a background in traditional sculpting for a career in digital sculpting.",
      "The work was highly praised by my professors due to its unexpected technical complexity and I was able to graduate with honors on my chosen specialization of Art & Technology.",

    ]
  },
  {
    id: "bio_4",
    title: "Coding School",
    timeframe: "2020-2022",
    imageSrc: "/images/bio/bio_4.png",
    imageAlt: "Interface mockups and code",
    paragraphs: [
      "I moved from my previous work as an freelance Blender instructor to fulltime work as a 3D generalist at a local 3D printing company after graduating university.",
      "As I kept learning more about 3D graphics I became fascinated by the possibility of using custom scripts inside programs such as Blender or Maya and sought to learn more.",
      "Eventually I decided to sign up for a 2-year associate's degree in Web Development at my local community college. I was very lucky to have amazing teachers that did not tire of my endless questions.",
    ]
  },
  {
    id: "bio_5",
    title: "Technical Art",
    timeframe: "2022-2024",
    imageSrc: "/images/bio/bio_5.png",
    imageAlt: "Interface mockups and code",
    paragraphs: [
      "Very unexpectedly, I landed my first game development job at a company dedicated to creating educational video games and immersive cultural experiences.",
      "Though I was hired as a 3D artist, my role became increasingly more technical, and I loved the opportunity that it provided to delve deeper into the math behind the art.",
      "While this role was immensely rewarding, I decided to return to freelancing when the company shifted its focus away from the education and culture sectors."
    ]
  },
  {
    id: "bio_6",
    title: "3D Graphics & Mathematics",
    timeframe: "2024-2026",
    imageSrc: "/images/bio/bio_6.png",
    imageAlt: "Interface mockups and code",
    paragraphs: [
      "I took a short break to pursue the first semester of a Mathematics degree while continuing to develop my own personal projects, most of which you can find featured on this site.",
      "I am very lucky to have now started working with Laura Gómez Morgado and the Quaternari Research Group at University of Barcelona on a few upcoming 3D web experiences that we can't wait to share!",

    ]
  }

];

const RECENT_READS = [
  {
    id: "book-1",
    title: "Force: Dynamic Life Drawing for Animators",
    author: "★★★★★ Mike Mattesi - 2006",
    date: "2006",
    rating: 5,
    description:
      "The one book that made the weight and rhythm of the human body 'click' for me. I keep coming back to it."
  },
  {
    id: "book-2",
    title: "Morpho: Fat and Skin Folds",
    author: "★★★★★ Michel Lauricella - 2019",
    date: "2019",
    rating: 5,
    description:
      "A much needed and deeply insightful collection of drawings of an often overlooked topic within anatomical study."
  },
  {
    id: "book-3",
    title: "Making Deep Games: Designing Games with Meaning and Purpose",
    author: "★★★☆☆ Doris C. Rusch - 2017",
    date: "2023-05",
    rating: 3,
    description:
      "An interesting exploration of games as a vehicle for personal self-discovery. "
  },
  {
    id: "book-4",
    title: "Atrocity Fabrication and Its Consequences: How Fake News Shapes World Order",
    author: "★★★★★ A.B. Abrams - 2023",
    date: "2023-05",
    rating: 5,
    description:
      "A thorough breakdown of the propaganda tactics employed by the media to fabricate consent for war."
  },
  {
    id: "book-5",
    title: "Groups and Symmetry",
    author: "★★★★☆ M.A. Armstrong - 1988",
    date: "2023-05",
    rating: 5,
    description:
      "An overview of the topic of group theory through bite-sized chapters and plenty of exercises. I am using it as a supplement to my university textbooks, as it assumes previous knowledge."
  },
  {
    id: "book-6",
    title: "3D Math Primer for Graphics and Game Development",
    author: "★★★★★ Fletcher Dunn and Ian Parberry - 2002",
    date: "2023-05",
    rating: 5,
    description:
      "So far a very approachable introduction to the study of the mathematics behind the geometry of a 3D world. "
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
  <div className="flex-shrink-0">
    <div className={`h-[30px] w-[30px] overflow-hidden ${theme.radiusSoft}`}>
      <img
        src={card.imageSrc}
        alt={card.imageAlt || card.title}
        className="h-full w-full object-contain"
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
          ---
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
                {/* <div className="text-right text-xs">
                  {book.date && (
                    <p className={theme.textSubtle}>
                      {formatMonthYear(book.date)}
                    </p>
                  )}
                  <p className="mt-0.5">
                    <StarRating value={book.rating} />
                  </p>
                </div> */}
              </div>

              <p className={`mt-1 text-xs md:text-sm ${theme.textSubtle}`}>
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
    <section className="relative w-full">
      {/* DESKTOP: books on the right (not sticky) */}
      <div className="hidden lg:block absolute top-0 right-0">
        <div className="mr-6 w-[460px]">
          <RecentReadsBox />
        </div>
      </div>

      {/* Intro – reserve space for books on the right */}
      <header className="mb-4 lg:pr-[500px]">
        <h2 className={`mb-1 text-2xl ${theme.heading}`}>
          {t.bioTab}
        </h2>
        <p className={`max-w-2xl text-sm ${theme.textSubtle}`}>
          A quick timeline of how I ended up mixing art, math and technology —
          and some of the books that shaped how I think about all of it.
        </p>
      </header>

      {/* Bio cards – same width as before, just reserving room on the right */}
      <div className="mt-6 space-y-4 lg:pr-[500px]">
        {BIO_CARDS.map((card) => (
          <BioCard key={card.id} card={card} />
        ))}
      </div>

      {/* MOBILE/TABLET: books after the bio section */}
      <div className="mt-6 lg:hidden">
        <RecentReadsBox />
      </div>
    </section>
  );
}




