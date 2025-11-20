import React from "react";
import { activeTheme } from "../themes";

const theme = activeTheme;

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

export interface ProjectItem {
  id: string | number;
  title: string;
  description: string;
  tech: string[];
  media: MediaItem[];
  links?: ProjectLink[];
  link?: string;
}

export interface ProjectCardProps {
  item: ProjectItem;
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
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs ${theme.chip} ${theme.radiusMax}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------
   PROJECT CARD COMPONENT
--------------------------------------------------*/

export default function ProjectCard({
  item,
  t,
  onOpenMedia,
}: ProjectCardProps) {
  const hero = item.media?.[0];
  const isHeroVideo = hero?.type === "youtube";

  return (
    <article
      className={`${theme.card} ${theme.radiusSoft} flex w-full flex-col gap-4 p-4 shadow-sm backdrop-blur`}
    >
      {/* TEXT BLOCK */}
      <div>
        <h3 className={`text-xl font-light ${theme.fontHeading}`}>
          {item.title}
        </h3>

        <p className={`mt-2 font-thin ${theme.textMain}`}>
          {item.description}
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
        {(item.links?.length || item.link) && (
          <div className="pointer-events-auto absolute bottom-2 left-2 flex max-w-[90%] flex-wrap gap-2">
            {item.links?.map((lnk: ProjectLink, i: number) => (
              <a
                key={i}
                href={lnk.href}
                className={`${theme.primaryButton} ${theme.radiusSoft} px-3 py-1 text-sm`}
              >
                {lnk.label}
              </a>
            ))}

            {!item.links?.length && item.link && (
              <a
                href={item.link}
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
      <div className="mt-1">
        <h5 className={`mb-2 text-xs uppercase tracking-wide ${theme.textSubtle}`}>
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
                aria-label={`Open media ${idx + 1} for ${item.title}`}
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
    </article>
  );
}
