// src/components/ProjectCard.tsx
import React from "react";
import { useTheme } from "../ThemeContext";

/* -------------------------------------------------
   TYPES
--------------------------------------------------*/

export interface MediaItem {
  type?: "image" | "youtube";
  src?: string;
  alt?: string;
  caption?: string;
  youtubeId?: string;
  thumb?: string;
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
  link?: string; // in case you ever need a simple single link

  // ✅ New fields from the content sheet (per language)
  role?: string;
  client?: string;
}

export interface ProjectItem {
  id: string | number;
  tags: string[];
  tech: string[];
  media: MediaItem[];

  // new metadata
  startDate?: string; // "YYYY-MM-DD"
  priority?: ProjectPriority;

  // per-language content, e.g. { en: {...}, es: {...} }
  content: Record<string, ProjectContent>;
}

export interface ProjectCardProps {
  item: ProjectItem;
  lang: string; // "en" | "es" etc.
  t: {
    techStack: string;
    moreMedia: string;
    viewLink: string;
  };
  onOpenMedia: (item: ProjectItem, index: number) => void;
}

/* -------------------------------------------------
   CHIP
--------------------------------------------------*/
function Chip({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs ${theme.chip} ${theme.radiusMax}`}
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

export default function ProjectCard({
  item,
  lang,
  t,
  onOpenMedia,
}: ProjectCardProps) {
  const { theme } = useTheme();
  const hero = item.media?.[0];
  const isHeroVideo = hero?.type === "youtube";

  // pick the right language block, with sensible fallbacks
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

  // ✅ role + client from the same per-lang content we load from Sheets
  const role = contentForLang?.role ?? null;
  const client = contentForLang?.client ?? null;
  const metaLine = buildMetaLine(year, role, client);

  return (
    <article
      className={`${theme.card} ${theme.radiusSoft} flex w-full flex-col gap-4 p-4 shadow-sm backdrop-blur bg-opacity-90`}
    >
      {/* TEXT BLOCK */}
      <div>
        <h3 className={`text-xl font-light ${theme.fontHeading}`}>
          {title}
        </h3>

        {(priorityLabel || metaLine) && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            {metaLine && (
              <span className={theme.textSubtle}>{metaLine}</span>
            )}
            {/* If you ever want to display priority too, you can uncomment this:
            {priorityLabel && (
              <span className={theme.textSubtle}>· {priorityLabel}</span>
            )}
            */}
          </div>
        )}

        <p className={`mt-2 font-thin ${theme.textMain}`}>
          {description}
        </p>

        {/* TECH */}
        <div className="mt-4">
          <h4 className={`mb-2 text-sm font-medium ${theme.accentText}`}>
            {t.techStack}
          </h4>

          <div className="flex flex-wrap gap-2">
            {item.tech.map((tech: string) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        </div>
      </div>

      {/* HERO IMAGE / VIDEO */}
      <div className="relative overflow-hidden">
        <div
          className={`aspect-video w-full overflow-hidden ${theme.radiusSoft}`}
        >
          {isHeroVideo ? (
            <img
              src={
                hero?.thumb ||
                (hero?.youtubeId
                  ? `https://img.youtube.com/vi/${hero.youtubeId}/hqdefault.jpg`
                  : "")
              }
              alt={hero?.alt || hero?.caption || "Video"}
              className="h-full w-full cursor-pointer object-cover"
              onClick={() => onOpenMedia(item, 0)}
            />
          ) : (
            <img
              src={hero?.src}
              alt={hero?.alt}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* OVERLAY LINKS */}
        {(links?.length || singleLink) && (
          <div className="pointer-events-auto absolute bottom-2 left-2 flex max-w-[90%] flex-wrap gap-2">
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

        {/* PLAY BADGE FOR VIDEO */}
        {isHeroVideo && (
          <button
            onClick={() => onOpenMedia(item, 0)}
            aria-label="Play video"
            className="absolute inset-0 grid place-items-center text-white/95"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60">
              ▶
            </span>
          </button>
        )}
      </div>

      {/* THUMBNAILS */}
      {item.media.length > 1 && (
        <div className="mt-1">
          <h5
            className={`mb-2 text-xs uppercase tracking-wide ${theme.textSubtle}`}
          >
            {t.moreMedia}
          </h5>

          <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
            {item.media.map((m: MediaItem, idx: number) => {
              const isVideo = m.type === "youtube";

              const thumbSrc = isVideo
                ? m.thumb ||
                  (m.youtubeId
                    ? `https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg`
                    : "")
                : m.src;

              return (
                <button
                  key={idx}
                  className={`relative block overflow-hidden border border-black/20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.radiusSoft}`}
                  onClick={() => onOpenMedia(item, idx)}
                  aria-label={`Open media ${idx + 1} for ${title}`}
                >
                  <div className="aspect-video w-full">
                    <img
                      src={thumbSrc}
                      alt={m.alt || m.caption || (isVideo ? "Video" : "Image")}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {isVideo && (
                    <span className="pointer-events-none absolute inset-0 grid place-items-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
                        ▶
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
