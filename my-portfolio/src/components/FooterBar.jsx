// src/components/FooterBar.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Cat, Plus } from "lucide-react";
import { useTheme } from "../ThemeContext";

const BOX_SIZE = 32; // px (sprite width)
const TICK_MS = 80; // animation tick
const WALK_SPEED = 60; // px per second

function randomMs(minSeconds, maxSeconds) {
  const min = minSeconds * 1000;
  const max = maxSeconds * 1000;
  return Math.floor(min + Math.random() * (max - min));
}

// mode: "walking" | "sitting"
function CatLane({ enabled, resetKey, addCatKey }) {
  const containerRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const [cats, setCats] = useState(() => [
    {
      id: 0,
      x: 0,
      direction: 1,
      mode: "walking",
      phaseTimeLeft: randomMs(4, 10),
    },
  ]);

  const createCat = useCallback(
    (id) => {
      const maxX = Math.max(0, trackWidth - BOX_SIZE);
      const randomX = trackWidth ? Math.random() * maxX : 0;
      return {
        id,
        x: randomX,
        direction: Math.random() < 0.5 ? -1 : 1,
        mode: "walking",
        phaseTimeLeft: randomMs(4, 10),
      };
    },
    [trackWidth]
  );

  // Measure track width
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        setTrackWidth(containerRef.current.offsetWidth || 0);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Handle reset: when enabled + resetKey changes, go back to a single cat
  useEffect(() => {
    if (!enabled) {
      setCats([]);
      return;
    }
    setCats([
      {
        id: 0,
        x: 0,
        direction: 1,
        mode: "walking",
        phaseTimeLeft: randomMs(4, 10),
      },
    ]);
  }, [enabled, resetKey]);

 
 // Handle adding a cat (from parent) — only when addCatKey changes
useEffect(() => {
  if (!enabled) return;
  if (!trackWidth) return;
  if (addCatKey === 0) return; // ignore initial mount

  setCats((prev) => {
    const nextId =
      prev.length === 0 ? 0 : Math.max(...prev.map((c) => c.id)) + 1;
    return [...prev, createCat(nextId)];
  });
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [addCatKey]);


  // Animation loop for all cats
  useEffect(() => {
    if (!enabled || !trackWidth || cats.length === 0) return;

    const maxX = Math.max(0, trackWidth - BOX_SIZE);

    const id = setInterval(() => {
      setCats((prevCats) =>
        prevCats.map((cat) => {
          let { x, direction, mode, phaseTimeLeft } = cat;
          const dt = TICK_MS;

          if (mode === "walking") {
            const dx = direction * WALK_SPEED * (dt / 1000);
            let newX = x + dx;

            // Bounce at edges
            if (newX <= 0) {
              newX = 0;
              direction = 1;
            } else if (newX >= maxX) {
              newX = maxX;
              direction = -1;
            }

            x = newX;
          }

          phaseTimeLeft -= dt;

          if (phaseTimeLeft <= 0) {
            if (mode === "walking") {
              mode = "sitting";
              phaseTimeLeft = randomMs(2, 8);
            } else {
              mode = "walking";
              phaseTimeLeft = randomMs(4, 10);
            }
          }

          return { ...cat, x, direction, mode, phaseTimeLeft };
        })
      );
    }, TICK_MS);

    return () => clearInterval(id);
  }, [enabled, trackWidth, cats.length]);

  if (!enabled) {
    return (
      <div
        ref={containerRef}
        className="pointer-events-none absolute bottom-full left-0 right-0 flex h-8 items-center gap-2"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute bottom-full left-0 right-0 flex h-8 items-center gap-2"
    >
      <div className="relative h-8 w-full">
        {cats.map((cat) => {
          const { id, x, direction, mode } = cat;

          // Choose sprite
          let sprite = "/cat/catwalk_right.gif";
          if (mode === "walking") {
            sprite =
              direction === 1
                ? "/cat/catwalk_right.gif"
                : "/cat/catwalk_left.gif";
          } else {
            sprite =
              direction === 1
                ? "/cat/catsit_right.gif"
                : "/cat/catsit_left.gif";
          }

          return (
            <img
              key={id}
              src={sprite}
              alt="Toolbar cat"
              className="absolute top-0 h-8 select-none pointer-events-none"
              style={{
                // X movement + slight Y push down to remove the visible gap
                transform: `translateX(${x}px) translateY(-1px)`,
                transition: "transform 80ms linear",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function FooterBar({ t }) {
  const { theme } = useTheme();
  const [catOn, setCatOn] = useState(true);
  const [catResetKey, setCatResetKey] = useState(0);
  const [addCatKey, setAddCatKey] = useState(0);

  const tooltipText = catOn ? "Disable cat companion" : "Enable cat companion";
  const addTooltip = catOn
    ? "Add another cat"
    : "Turn on cats to add more";

  const handleToggleCats = () => {
    if (!catOn) {
      // Turning ON: reset to a single cat
      setCatOn(true);
      setCatResetKey((k) => k + 1);
    } else {
      // Turning OFF: hide all cats
      setCatOn(false);
    }
  };

  const handleAddCat = () => {
    if (!catOn) return;
    setAddCatKey((k) => k + 1);
  };

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 backdrop-blur ${theme.footerBar}`}
    >
      <div className="relative mx-auto flex max-w-10xl items-center justify-between px-4 py-2 text-xs">
        {/* --- CAT LANE OVERLAY (does NOT increase footer height) --- */}
        <CatLane enabled={catOn} resetKey={catResetKey} addCatKey={addCatKey} />

        {/* Row content: [ cat buttons ] [ footer content ] */}
        <div className="flex w-full items-center justify-between">
          {/* Left side: cat toggle + add button */}
          <div className="flex items-center gap-1">
            {/* CAT TOGGLE BUTTON */}
            <button
              type="button"
              onClick={handleToggleCats}
              className={`
                mr-1 inline-flex h-7 w-7 items-center justify-center
                transition
                ${catOn ? "opacity-100" : "opacity-50"}
              `}
              aria-pressed={catOn}
              aria-label={tooltipText}
              title={tooltipText}
            >
              <Cat className="h-7 w-7" />
            </button>

            {/* ADD CAT BUTTON */}
            <button
              type="button"
              onClick={handleAddCat}
              className={`
                inline-flex h-7 w-7 items-center justify-center
                transition
                ${catOn ? "opacity-80 hover:opacity-100" : "opacity-30 cursor-not-allowed"}
              `}
              aria-label={addTooltip}
              title={addTooltip}
              disabled={!catOn}
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>

          {/* Right side: GitHub / footer note */}
          <a
            href="https://github.com/youruser/your-portfolio"
            className={`place-self-end px-2 py-1 ${theme.footerButton} ${theme.radiusSoft}`}
          >
            {t.footerNote}
          </a>
        </div>
      </div>
    </footer>
  );
}
