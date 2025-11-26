// src/data/loadBioFromSheets.ts
import Papa from "papaparse";

/**
 * This loader is completely independent from the projects loader.
 * It expects four sheets in ONE Google Spreadsheet:
 *
 *  - bio_cards       (id, order, timeframe, imageSrc)
 *  - bio_content     (bioId, lang, title, imageAlt, p1, p2, p3)
 *  - reads           (id, order, author, year, rating)
 *  - reads_content   (readId, lang, title, description)
 *
 * These match the Excel I gave you.
 */

// ------------------ Types ------------------

export interface BioCardContent {
  title: string;
  imageAlt?: string;
  paragraphs?: string[];
  p1?: string;
  p2?: string;
  p3?: string;
}

export interface BioCardItem {
  id: string;
  order?: number;
  timeframe?: string;
  imageSrc?: string;
  content: Record<string, BioCardContent>; // lang → content
}

export interface RecentReadContent {
  title: string;
  description: string;
}

export interface RecentReadItem {
  id: string;
  order?: number;
  author?: string;
  year?: string;
  rating?: number;
  content: Record<string, RecentReadContent>; // lang → content
}

export interface BioAndReadsData {
  bioCards: BioCardItem[];
  reads: RecentReadItem[];
}

// ------------------ Google Sheets helpers ------------------

/**
 * Use the same SHEET_ID you use in loadCardsFromSheets.
 * Example URL piece: https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit#gid=...
 */
const SHEET_ID = "1A8Uy5IHVBIrk7dsfYhtuRxTRy7lZxgskdLOGbPc2iHE";

// Replace these with the real gid values of each tab
const BIO_CARDS_GID = "1531451796";
const BIO_CONTENT_GID = "780255143";
const READS_GID = "1929979646";
const READS_CONTENT_GID = "1394219289";

function makeCsvUrl(gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
}

async function fetchCsv(url: string): Promise<any[]> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${url} (${res.status})`);
  }
  const text = await res.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (parsed.errors && parsed.errors.length > 0) {
    console.warn("Papa parse errors for", url, parsed.errors);
  }

  return (parsed.data as any[]) || [];
}

// ------------------ Main loader ------------------

export async function loadBioCardsFromSheets(): Promise<BioAndReadsData> {
  const [bioCardsRows, bioContentRows, readsRows, readsContentRows] =
    await Promise.all([
      fetchCsv(makeCsvUrl(BIO_CARDS_GID)),
      fetchCsv(makeCsvUrl(BIO_CONTENT_GID)),
      fetchCsv(makeCsvUrl(READS_GID)),
      fetchCsv(makeCsvUrl(READS_CONTENT_GID)),
    ]);

  // ---------- Bio cards ----------

  const bioMap = new Map<string, BioCardItem>();

  for (const row of bioCardsRows) {
    const id = row.id?.toString().trim();
    if (!id) continue;

    bioMap.set(id, {
      id,
      order: row.order ? Number(row.order) : undefined,
      timeframe: row.timeframe || "",
      imageSrc: row.imageSrc || "",
      content: {},
    });
  }

  for (const row of bioContentRows) {
    const id = row.bioId?.toString().trim();
    const lang = row.lang?.toString().trim();
    if (!id || !lang) continue;

    const card = bioMap.get(id);
    if (!card) continue;

    const paragraphs: string[] = [];
    if (row.p1) paragraphs.push(row.p1);
    if (row.p2) paragraphs.push(row.p2);
    if (row.p3) paragraphs.push(row.p3);

    card.content[lang] = {
      title: row.title || "",
      imageAlt: row.imageAlt || "",
      paragraphs,
      p1: row.p1 || "",
      p2: row.p2 || "",
      p3: row.p3 || "",
    };
  }

  const bioCards = Array.from(bioMap.values()).sort(
    (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)
  );

  // ---------- Reads ----------

  const readsMap = new Map<string, RecentReadItem>();

  for (const row of readsRows) {
    const id = row.id?.toString().trim();
    if (!id) continue;

    readsMap.set(id, {
      id,
      order: row.order ? Number(row.order) : undefined,
      author: row.author || "",
      year: row.year?.toString() || "",
      rating: row.rating ? Number(row.rating) : undefined,
      content: {},
    });
  }

  for (const row of readsContentRows) {
    const id = row.readId?.toString().trim();
    const lang = row.lang?.toString().trim();
    if (!id || !lang) continue;

    const item = readsMap.get(id);
    if (!item) continue;

    item.content[lang] = {
      title: row.title || "",
      description: row.description || "",
    };
  }

  const reads = Array.from(readsMap.values()).sort(
    (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)
  );

  return { bioCards, reads };
}
