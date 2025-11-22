// src/data/loadCardsFromSheets.ts
import Papa from "papaparse";

// Types should match your ProjectItem / MediaItem in ProjectCard
export type ProjectPriority = "high" | "mid" | "low";

export interface MediaI18nEntry {
  alt?: string;
  caption?: string;
}

export interface MediaItem {
  type?: "image" | "youtube";
  src?: string;
  youtubeId?: string;
  thumb?: string;
  i18n?: Record<string, MediaI18nEntry>;
}

export interface ProjectLink {
  href: string;
  label: string;
}

export interface ProjectContent {
  title: string;
  description: string;
  links?: ProjectLink[];
}

export interface ProjectItem {
  id: string;
  tags: string[];
  tech: string[];
  startDate?: string;
  priority?: ProjectPriority;
  visibility?: "on" | "off";
  media: MediaItem[];
  content: Record<string, ProjectContent>;
}

// ---- Google Sheets config ----

const SHEET_ID =
  "1A8Uy5IHVBIrk7dsfYhtuRxTRy7lZxgskdLOGbPc2iHE"; // from the URL

const makeCsvUrl = (gid: string) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;

// Replace these with your actual gid values:
const CARDS_GID = "1342167327";
const CONTENT_GID = "1339198058";
const LINKS_GID = "487248610";
const MEDIA_GID = "653713178";
const MEDIA_I18N_GID = "1167060745";

const URLS = {
  cards: makeCsvUrl(CARDS_GID),
  content: makeCsvUrl(CONTENT_GID),
  links: makeCsvUrl(LINKS_GID),
  media: makeCsvUrl(MEDIA_GID),
  mediaI18n: makeCsvUrl(MEDIA_I18N_GID),
};

// ---- Helpers ----

function parseCsv(url: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      // Explicit `any` fixes TS 7006 and avoids the ParseResult typing issue
      complete: (results: any) => resolve(results.data as any[]),
      error: (err: any) => reject(err),
    });
  });
}

function splitList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

// Optional sort helper config
const PRIORITY_ORDER: Record<string, number> = {
  high: 0,
  mid: 1,
  low: 2,
};

// ---- Main loader ----

export async function loadCardsFromSheets(): Promise<ProjectItem[]> {
  const [cardsRows, contentRows, linksRows, mediaRows, mediaI18nRows] =
    await Promise.all([
      parseCsv(URLS.cards),
      parseCsv(URLS.content),
      parseCsv(URLS.links),
      parseCsv(URLS.media),
      parseCsv(URLS.mediaI18n),
    ]);

  const cardsMap = new Map<string, ProjectItem>();

  // 1) Base card rows
  for (const row of cardsRows) {
    const id = row.id?.toString().trim();
    if (!id) continue;

    cardsMap.set(id, {
      id,
      tags: splitList(row.tags),
      startDate: row.startDate || undefined,
      priority: (row.priority || undefined) as ProjectPriority | undefined,
      visibility: (row.visibility?.toLowerCase() || "on") as "on" | "off",
      tech: splitList(row.tech),
      media: [],
      content: {},
    });
  }

  // 2) Content by (cardId, lang)
  for (const row of contentRows) {
    const id = row.cardId?.toString().trim();
    const lang = row.lang?.toString().trim();
    if (!id || !lang) continue;

    const card = cardsMap.get(id);
    if (!card) continue;

    card.content[lang] = {
      title: row.title || "",
      description: row.description || "",
      links: [],
    };
  }

  // 3) Links by (cardId, lang, order)
  const linksGrouped: Record<string, any[]> = {};
  for (const row of linksRows) {
    const id = row.cardId?.toString().trim();
    const lang = row.lang?.toString().trim();
    if (!id || !lang) continue;

    const key = `${id}__${lang}`;
    if (!linksGrouped[key]) linksGrouped[key] = [];
    linksGrouped[key].push(row);
  }

  Object.entries(linksGrouped).forEach(([key, rows]) => {
    const [id, lang] = key.split("__");
    const card = cardsMap.get(id);
    if (!card) return;

    const content =
      card.content[lang] ||
      (card.content[lang] = {
        title: "",
        description: "",
        links: [],
      });

    const sorted = [...rows].sort(
      (a, b) => Number(a.order || 0) - Number(b.order || 0)
    );

    content.links = sorted.map((r) => ({
      href: r.href,
      label: r.label,
    }));
  });

  // 4) Media rows
  const mediaByCard: Record<string, MediaItem[]> = {};
  for (const row of mediaRows) {
    const id = row.cardId?.toString().trim();
    if (!id) continue;

    if (!mediaByCard[id]) mediaByCard[id] = [];

    const index = Number(row.index ?? mediaByCard[id].length);
    const item: MediaItem = {
      type: (row.type || "image") as "image" | "youtube",
      src: row.src || "",
      youtubeId: row.youtubeId || "",
      thumb: row.thumb || "",
      i18n: {},
    };

    mediaByCard[id][index] = item;
  }

  // 5) Media i18n rows
  for (const row of mediaI18nRows) {
    const id = row.cardId?.toString().trim();
    const lang = row.lang?.toString().trim();
    if (!id || !lang) continue;

    const index = Number(row.index ?? 0);
    const mediaList = mediaByCard[id];
    if (!mediaList || !mediaList[index]) continue;

    const item = mediaList[index];
    if (!item.i18n) item.i18n = {};
    item.i18n[lang] = {
      alt: row.alt || "",
      caption: row.caption || "",
    };
  }

  // Attach media to cards
  for (const [id, mediaArray] of Object.entries(mediaByCard)) {
    const card = cardsMap.get(id);
    if (!card) continue;
    card.media = mediaArray;
  }

  // Convert to array
  const cards = Array.from(cardsMap.values());
  return cards;
}
