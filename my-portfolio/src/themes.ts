// themes.ts

export type ThemeId =
    | "emeraldDark"
    | "renaissanceStone"
    | "technoRose";

export interface Theme {
    id: ThemeId;
    label: string;

    // Base layout + typography
    pageBg: string;        // background for <body> / root
    bgTexture: string;
    fontBody: string;
    fontHeading: string;

    // Global text tokens
    textMain: string;      // normal reading text
    textMuted: string;     // secondary labels
    textSubtle: string;    // low-emphasis text
    heading: string;       // headings (h1-h3)
    accentText: string;    // for small accent titles (e.g. "Tech stack")
    accentSoftText: string;
    headerTextMain: string;  // main text inside header strip
    headerTextMuted: string; // lower-contrast text inside header strip


    // Global radius tokens
    radiusNone: string;    // "no rounding"
    radiusSoft: string;    // medium rounding
    radiusMax: string;     // very rounded (matches old style)

    // Major surfaces (colors only, no radius)
    headerStrip: string;
    card: string;
    footerBar: string;

    // Toolbar (language + font size)
    toolbar: string;
    toolbarSelect: string;
    toolbarPill: string;
    toolbarPillActive: string;
    toolbarPillInactive: string;

    // Chips / accents
    chip: string;

    // Buttons
    primaryButton: string;
    footerButton: string;

    // Tabs
    tabActive: string;
    tabInactive: string;

    // Overlays
    lightboxBackdrop: string;
}

export const themes: Record<ThemeId, Theme> = {
    emeraldDark: {
        id: "emeraldDark",
        label: "Emerald Dark",

        pageBg: "bg-zinc-950",
        bgTexture: "bg-[url('/background/bgpattern_2.png')]", // NEW


        fontBody: "font-sans",
        fontHeading: "font-sans",

        textMain: "text-zinc-200",
        textMuted: "text-zinc-400",
        textSubtle: "text-zinc-500",
        heading: "text-zinc-100",
        accentText: "text-emerald-300/90",
        accentSoftText: "text-emerald-200",
        headerTextMain: "text-zinc-100",
        headerTextMuted: "text-zinc-400",


        radiusNone: "rounded-none",
        radiusSoft: "rounded-xl",
        radiusMax: "rounded-2xl",

        headerStrip: "border-b border-zinc-800 bg-zinc-900/80",
        card: "border border-zinc-800 bg-zinc-900/70",
        footerBar: "border-t border-zinc-800 bg-zinc-900/90",

        toolbar: "border border-zinc-700 bg-zinc-900/80",
        toolbarSelect: "border border-zinc-700 bg-zinc-800 text-zinc-100",
        toolbarPill: "border border-zinc-700",
        toolbarPillActive: "bg-emerald-600/30 text-emerald-100",
        toolbarPillInactive:
            "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",

        chip:
            "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",

        primaryButton:
            "border border-emerald-700 bg-emerald-600/90 text-white/95 backdrop-blur hover:bg-emerald-600",
        footerButton:
            "border border-emerald-800 bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50",

        tabActive:
            "border-emerald-500/60 text-emerald-200 bg-transparent",
        tabInactive:
            "border-zinc-700 text-zinc-300 bg-transparent hover:bg-zinc-800/40",

        lightboxBackdrop: "bg-black/80",
    },
    renaissanceStone: {
        id: "renaissanceStone",
        label: "Renaissance Stone",

        // Background + base font
        pageBg: "bg-[#E6DCCB]",   // light stone
        bgTexture: "bg-[url('/background/bgpattern_2.png')]", // NEW


        fontBody: "font-renBody",
        fontHeading: "font-renHeading",

        // Global text
        textMain: "text-[#31312C]",           // very dark charcoal
        textMuted: "text-[#555550]",          // softer gray
        textSubtle: "text-[#555550]/70",
        heading: "text-[#31312C]",
        accentText: "text-[#AC8B6C]",         // warm stone accent
        accentSoftText: "text-[#555550]",

        // Header strip text (background is dark)
        headerTextMain: "text-[#E6DCCB]",
        headerTextMuted: "text-[#E6DCCB]/80",

        // Radii
        radiusNone: "rounded-none",
        radiusSoft: "rounded-2xl",
        radiusMax: "rounded-3xl",

        // Surfaces
        headerStrip: "border-b border-[#555550]/40 bg-[#31312C]",
        card: "border border-[#AC8B6C]/40 bg-[#F4EEE4]",
        footerBar: "border-t border-[#555550]/40 bg-[#31312C]",

        // Toolbar
        toolbar:
            "border border-[#AC8B6C]/60 bg-[#F4EEE4]/80 text-[#31312C]",
        toolbarSelect:
            "border border-[#AC8B6C]/70 bg-[#E6DCCB] text-[#31312C]",
        toolbarPill: "border border-[#AC8B6C]/70",
        toolbarPillActive: "bg-[#AC8B6C] text-[#E6DCCB]",
        toolbarPillInactive:
            "bg-[#F4EEE4] text-[#31312C] hover:bg-[#E6DCCB]",

        // Chips
        chip:
            "border border-[#AC8B6C] bg-[#AC8B6C]/20 text-[#31312C]",

        // Buttons
        primaryButton:
            "border border-[#AC8B6C] bg-[#AC8B6C] text-[#E6DCCB] hover:bg-[#c49973]",
        footerButton:
            "border border-[#555550]/50 bg-[#555550]/60 text-[#E6DCCB]/95 hover:bg-[#555550]",

        // Tabs
        tabActive:
            "border-[#31312C] text-[#31312C] bg-[#E6DCCB]",
        tabInactive:
            "border-[#AC8B6C]/60 text-[#555550] bg-[#F4EEE4] hover:bg-[#E6DCCB]",

        // Overlay
        lightboxBackdrop: "bg-black/80",
    },
    technoRose: {
        id: "technoRose",
        label: "Techno Rose",

        pageBg: "bg-neutral-950",
        bgTexture: "bg-[url('/background/bgpattern_2.png')]", // NEW

        fontBody: "font-renroseBody",
        fontHeading: "font-renroseHeading  tracking-[0.2em]  uppercase",

        textMain: "text-neutral-100",
        textMuted: "text-neutral-400",
        textSubtle: "text-neutral-500",
        heading: "text-neutral-50",

        // High-contrast antique violet / rose
        accentText: "text-[#c7849c]",
        accentSoftText: "text-[#9c5f7b]",

        headerTextMain: "text-neutral-50",
        headerTextMuted: "text-neutral-400",

        radiusNone: "rounded-none",
        radiusSoft: "rounded-none",
        radiusMax: "rounded-none",

        headerStrip: "border-b border-neutral-800 bg-black text-neutral-50",
        card: "border border-neutral-800 bg-neutral-950",
        footerBar: "border-t border-neutral-800 bg-black text-neutral-400",

        toolbar:
            "border border-neutral-700 bg-neutral-950 text-neutral-100",

        toolbarSelect:
            "border border-neutral-600 bg-black text-neutral-50",

        toolbarPill: "border border-neutral-600",

        toolbarPillActive:
            "bg-[#743a55] text-neutral-100",
        toolbarPillInactive:
            "bg-neutral-900 text-neutral-400 hover:bg-neutral-800",

        chip:
            "border border-[#743a55] bg-[#462738]/40 text-[#c7849c] font-medium",

        primaryButton:
            "border border-[#743a55] bg-[#743a55] text-neutral-100 hover:bg-[#9c5f7b] hover:border-[#9c5f7b]",

        footerButton:
            "border border-[#743a55] bg-[#462738]/40 text-[#c7849c] hover:bg-[#462738]/70",

        tabActive:
            "border-[#743a55] text-[#c7849c] bg-neutral-950",
        tabInactive:
            "border-neutral-700 text-neutral-400 bg-black hover:bg-neutral-900",

        lightboxBackdrop: "bg-black/95",
    }


}


// Change this to switch theme globally for now
// Order in which themes will cycle with the arrows
export const THEME_ORDER: ThemeId[] = [
    "emeraldDark",
    "renaissanceStone",
    "technoRose",
];

// Default theme when the app loads
export const ACTIVE_THEME_ID: ThemeId = "technoRose";

