import React, { useMemo, useState } from "react";
import { useTheme } from "../ThemeContext";
import { Image as ImageIcon, PlayCircle } from "lucide-react";



/* -------------------------------------------------
   TYPES
--------------------------------------------------*/

export interface MediaI18nEntry {
  alt?: string;
  caption?: string;
}

export interface MediaItem {
  type?: "image" | "youtube";
  src?: string;
  alt?: string;
  caption?: string;
  youtubeId?: string;
  thumb?: string;
  i18n?: Record<string, MediaI18nEntry>;
}

export interface ProjectLink {
  href: string;
  label: string;
}

export type ProjectPriority = "high" | "mid" | "low";

export interface ProjectContent {
  title: string;
  description: string;
  links?: ProjectLink[];
  link?: string;

  // from content sheet
  role?: string;
  client?: string;
}

export interface ProjectItem {
  id: string | number;
  tags: string[];
  tech: string[];
  media: MediaItem[];
  startDate?: string; // "YYYY-MM-DD"
  priority?: ProjectPriority;
  content: Record<string, ProjectContent>;
}

export interface ProjectCardProps {
  item: ProjectItem;
  lang: string; // "en" | "es" ...
  t: {
    techStack: string;
    moreMedia: string;
    viewLink: string;
  };
}

/* -------------------------------------------------
   CHIP
--------------------------------------------------*/

function Chip({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[0.85em] ${theme.chip} ${theme.radiusMax}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------
   HELPERS
--------------------------------------------------*/

function formatPriority(priority?: ProjectPriority) {
  if (!priority) return null;
  if (priority === "high") return "High priority";
  if (priority === "mid") return "Medium priority";
  if (priority === "low") return "Low priority";
  return null;
}

function getYearFromDate(date?: string) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.getFullYear();
}

// Build the "YEAR - ROLE CLIENT" line
function buildMetaLine(
  year?: number | null,
  roleRaw?: string | null,
  clientRaw?: string | null
): string {
  const yearStr = year != null ? String(year) : "";
  const role = roleRaw?.trim() || "";
  const client = clientRaw?.trim() || "";

  if (!yearStr && !role && !client) return "";

  let base = "";
  if (yearStr && role) {
    base = `${yearStr} - ${role}`;
  } else if (yearStr) {
    base = yearStr;
  } else if (role) {
    base = role;
  }

  if (client) {
    if (base) return `${base} ${client}`;
    return client;
  }

  return base;
}

/* -------------------------------------------------
   PROJECT CARD COMPONENT
--------------------------------------------------*/

export default function ProjectCard({ item, lang, t }: ProjectCardProps) {
  const { theme } = useTheme();


  // Pick content for current lang (fallback to en / first)
  const contentForLang =
    item.content?.[lang] ??
    item.content?.en ??
    Object.values(item.content || {})[0];

  const title = contentForLang?.title ?? "";
  const description = contentForLang?.description ?? "";
  const links = contentForLang?.links;
  const singleLink = contentForLang?.link;

  const priorityLabel = formatPriority(item.priority);
  const year = getYearFromDate(item.startDate);

  const role = contentForLang?.role ?? null;
  const client = contentForLang?.client ?? null;
  const metaLine = buildMetaLine(year, role, client);

  // ---- MEDIA & CAPTION HANDLING ----

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


  // Merge i18n alt/caption into each media item for the current language
  const media = useMemo(() => {
    const fallbackLang = item.content.en ? "en" : Object.keys(item.content || {})[0];
    const langKey = item.content[lang] ? lang : fallbackLang;

    return (item.media || []).map((m) => {
      const i18nEntry = m.i18n?.[langKey] || m.i18n?.[fallbackLang] || {};
      return {
        ...m,
        alt: i18nEntry.alt || m.alt,
        caption: i18nEntry.caption || m.caption,
      };
    });
  }, [item.media, item.content, lang]);

  const hero = media[activeIndex];
  const isHeroVideo = hero?.type === "youtube";

  return (
    <article
      className={`${theme.card} ${theme.radiusSoft} flex w-full flex-col gap-4 p-4 shadow-sm backdrop-blur bg-opacity-90`}
    >
      {/* TEXT BLOCK */}
      <div>
        <h3 className={`text-[1.2em] font-light ${theme.fontHeading}`}>{title}</h3>

        {(priorityLabel || metaLine) && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.85em]">
            {metaLine && (
              <span className={theme.textSubtle}>{metaLine}</span>
            )}
            {/* If you want priority too, uncomment:
            {priorityLabel && (
              <span className={theme.textSubtle}>· {priorityLabel}</span>
            )}
            */}
          </div>
        )}

        <p className={`mt-2 font-thin ${theme.textMain}`}>{description}</p>

        {/* TECH */}
        <div className="mt-4">
          <h4 className={`mb-2 text-[1em] font-medium ${theme.accentText}`}>
            {t.techStack}
          </h4>

          <div className="flex flex-wrap gap-2">
            {item.tech.map((tech: string) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        </div>
      </div>

      {/* HERO IMAGE OR PLACEHOLDER */}
{media.length > 0 ? (
  <div className="relative overflow-hidden group">
    <div className={`aspect-video w-full overflow-hidden ${theme.radiusSoft}`}>
      {isHeroVideo && hero.youtubeId ? (
        isPlaying ? (
          // ▶ ACTUAL YOUTUBE PLAYER
          <iframe
            src={`https://www.youtube.com/embed/${hero.youtubeId}?autoplay=1`}
            title={hero.alt || hero.caption || title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          // ▶ THUMBNAIL + CLICK TO PLAY
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="relative h-full w-full"
            aria-label={`Play video: ${title}`}
          >
            <img
              src={
                hero.thumb ||
                (hero.youtubeId
                  ? `https://img.youtube.com/vi/${hero.youtubeId}/hqdefault.jpg`
                  : "")
              }
              alt={hero.alt || hero.caption || "Video"}
              className="h-full w-full object-cover"
            />
            <span className="pointer-events-none absolute inset-0 grid place-items-center text-white/95">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60">
                ▶
              </span>
            </span>
          </button>
        )
      ) : (
        // ▶ Normal image hero
        <img
          src={hero.src}
          alt={hero.alt || hero.caption || "Image"}
          className="h-full w-full object-cover"
        />
      )}
    </div>

    {/* CAPTION */}
    {hero.caption && (
      <div className="absolute inset-x-0 bottom-0 w-full bg-black/80 px-2 py-1 text-[0.85em] text-white">
        {hero.caption}
      </div>
    )}
  </div>
) : (
  /* PLACEHOLDER */
  <div
    className={`
      aspect-video w-full ${theme.radiusSoft}
      flex flex-col items-center justify-center
      border-2 border-dashed border-gray-400/40
      text-gray-400
    `}
  >
    <ImageIcon className="w-10 h-10 mb-2 text-gray-400" />
    <span className="text-[0.9em]">Coming soon!</span>
  </div>
)}



      {/* THUMBNAILS (CLICK TO SWAP HERO, NO LIGHTBOX) */}
      {media.length > 1 && (
        <div className="mt-0">
          {/* <h5
            className={`mb-2 text-xs uppercase tracking-wide ${theme.textSubtle}`}
          >
            {t.moreMedia}
          </h5> */}

          <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
            {media.map((m: MediaItem, idx: number) => {
              const isVideo = m.type === "youtube";

              const thumbSrc = isVideo
                ? m.thumb ||
                (m.youtubeId
                  ? `https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg`
                  : "")
                : m.src;

              const isActive = idx === activeIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {setActiveIndex(idx);setIsPlaying(m.type === "youtube" && !!m.youtubeId);}}
                  aria-label={`Show media ${idx + 1} for ${title}`}
                  aria-pressed={isActive}
                  className={`
    relative block overflow-hidden ${theme.radiusSoft}
    border-2
    ${isActive ? theme.accentBorder : "border-black/30 hover:border-black/50"}
  `}
                >
                  <div className="aspect-video w-full">
                    <img
                      src={thumbSrc}
                      alt={m.alt || m.caption || (isVideo ? "Video" : "Image")}
                      className={`h-full w-full object-cover transition-opacity ${isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
                        }`}
                    />

                  </div>

                  {isVideo && (
                    <span className="pointer-events-none absolute inset-0 grid place-items-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center">
                         <PlayCircle className="w-8 h-8 text-white/60 drop-shadow" />
                      </span>
                    </span>
                  )}
                </button>


              );
            })}
          </div>
        </div>
      )}

      {/* LINKS ROW BELOW MEDIA */}
      {(links?.length || singleLink) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {links?.map((lnk: ProjectLink, i: number) => (
            <a
              key={i}
              href={lnk.href}
              className={`${theme.primaryButton} ${theme.radiusSoft} px-3 py-1 text-sm`}
            >
              {lnk.label}
            </a>
          ))}

          {!links?.length && singleLink && (
            <a
              href={singleLink}
              className={`${theme.primaryButton} ${theme.radiusSoft} px-3 py-1 text-sm`}
            >
              {t.viewLink}
            </a>
          )}
        </div>
      )}

    </article>
  );
}
