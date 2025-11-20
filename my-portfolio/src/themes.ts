// themes.ts

export type ThemeId =
    | "emeraldDark"
    | "natgeoClassic"
    | "baroqueRose"
    | "renaissanceStone";

export interface Theme {
    id: ThemeId;
    label: string;

    // Base layout + typography
    pageBg: string;        // background for <body> / root
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
    // ---------------- EMERALD DARK (original) ----------------
    emeraldDark: {
        id: "emeraldDark",
        label: "Emerald Dark",

        pageBg: "bg-zinc-950",
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

    // ---------------- VIOLET GLASS ----------------

    baroqueRose: {
        id: "baroqueRose",
        label: "Baroque Rose",

        // Deep plum background, light text
        pageBg: "bg-[#261627]",
        fontBody: "font-baroqueBody",
        fontHeading: "font-baroqueHeading",


        // Text system
        textMain: "text-[#EBDFDC]",          // Pearl Bush
        textMuted: "text-[#EBDFDC]/80",
        textSubtle: "text-[#EBDFDC]/60",
        heading: "text-white",
        accentText: "text-[#926868]",        // Copper Rose
        accentSoftText: "text-[#3c384d]",    // Gun Powder

        // Header-specific text (background here is darker than body)
        headerTextMain: "text-[#EBDFDC]",
        headerTextMuted: "text-[#EBDFDC]/75",

        // Rounding
        radiusNone: "rounded-none",
        radiusSoft: "rounded-2xl",
        radiusMax: "rounded-3xl",

        // Major surfaces
        headerStrip: "border-b border-[#4e3742] bg-[#3c384d]",
        card: "border border-[#4e3742] bg-[#3c384d]/95",
        footerBar: "border-t border-[#4e3742] bg-[#261627]/95",

        // Toolbar
        toolbar:
            "border border-[#4e3742] bg-[#3c384d]/90 text-[#EBDFDC]/85",
        toolbarSelect:
            "border border-[#4e3742] bg-[#261627] text-[#EBDFDC]",
        toolbarPill: "border border-[#4e3742]",
        toolbarPillActive: "bg-[#926868] text-[#EBDFDC]",
        toolbarPillInactive:
            "bg-[#3c384d] text-[#EBDFDC]/80 hover:bg-[#4e3742]",

        // Chips
        chip:
            "border border-[#926868] bg-[#926868]/20 text-[#EBDFDC]",

        // Buttons
        primaryButton:
            "border border-[#926868] bg-[#926868] text-[#EBDFDC] hover:bg-[#b27f80]",
        footerButton:
            "border border-[#3c384d] bg-[#3c384d]/60 text-[#EBDFDC]/90 hover:bg-[#3c384d]",

        // Tabs
        tabActive:
            "border-[#EBDFDC] text-[#EBDFDC] bg-[#4e3742]",
        tabInactive:
            "border-[#4e3742] text-[#EBDFDC]/80 bg-transparent hover:bg-[#3c384d]",

        // Overlays
        lightboxBackdrop: "bg-black/80",
    },

    renaissanceStone: {
        id: "renaissanceStone",
        label: "Renaissance Stone",

        // Background + base font
        pageBg: "bg-[#E6DCCB]",   // light stone
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


    // ---------------- NAT GEO STYLE ----------------
    natgeoClassic: {
        id: "natgeoClassic",
        label: "National Geographic",

        pageBg: "bg-neutral-100",
        fontBody: "font-ngBody",
        fontHeading: "font-ngHeading",


        textMain: "text-neutral-900",
        textMuted: "text-neutral-600",
        textSubtle: "text-neutral-500",
        heading: "text-black",
        accentText: "text-orange-800",
        accentSoftText: "text-orange-700",
        headerTextMain: "text-white",
        headerTextMuted: "text-neutral-300",


        radiusNone: "rounded-none",
        radiusSoft: "rounded-md",
        radiusMax: "rounded-xl",

        headerStrip: "border-b border-neutral-300 bg-neutral-800 text-white",
        card: "border border-neutral-300 bg-white",
        footerBar: "border-t border-neutral-300 bg-neutral-800 text-white",

        toolbar:
            "border border-neutral-400 bg-neutral-200 text-neutral-900",
        toolbarSelect:
            "border border-neutral-400 bg-white text-neutral-900",
        toolbarPill: "border border-neutral-500",
        toolbarPillActive: "bg-orange-700 text-white",
        toolbarPillInactive:
            "bg-neutral-200 text-neutral-700 hover:bg-neutral-300",

        chip:
            "border border-orange-700 bg-orange-50 text-orange-900 font-medium",

        primaryButton:
            "border border-orange-800 bg-orange-700 text-white hover:bg-orange-600",
        footerButton:
            "border border-orange-600 bg-orange-700/20 text-orange-200 hover:bg-orange-700/40",

        tabActive:
            "border-orange-700 text-white bg-orange-700",
        tabInactive:
            "border-neutral-400 text-neutral-700 bg-white hover:bg-neutral-100",

        lightboxBackdrop: "bg-black/90",
    }
}


// Change this to switch theme globally for now
export const ACTIVE_THEME_ID: ThemeId = "natgeoClassic";
export const activeTheme: Theme = themes[ACTIVE_THEME_ID];
