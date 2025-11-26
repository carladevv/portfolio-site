// src/components/MediaLightbox.jsx
import React from "react";
import { useTheme } from "../ThemeContext";

function MediaLightbox({ open, onClose, media, title, index }) {
  const { theme } = useTheme();
  if (!open) return null;

  const m = media[index];
  const isVideo = m?.type === "youtube";

  if (!m) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme.lightboxBackdrop}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} media viewer`}
    >
      <button
        onClick={onClose}
        className={`
          absolute right-4 top-4
          ${theme.radiusSoft}
          border border-white/40
          bg-black/70
          px-3 py-1
          text-sm text-white
          hover:bg-black/80
        `}
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
              src={m.src}
              alt={m.alt || title}
              className="h-full w-full object-contain"
            />
          )}
        </div>

        {(m.caption || m.alt) && (
          <p className={`mt-2 text-center text-xs ${theme.textMuted}`}>
            {m.caption || m.alt}
          </p>
        )}
      </div>
    </div>
  );
}

export default MediaLightbox;
