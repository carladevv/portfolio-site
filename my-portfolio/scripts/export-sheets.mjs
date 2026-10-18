import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Papa from 'papaparse';

const root = fileURLToPath(new URL('../', import.meta.url));
const sheet = '1A8Uy5IHVBIrk7dsfYhtuRxTRy7lZxgskdLOGbPc2iHE';
const sources = {
  cards: '1342167327', content: '1339198058', links: '487248610',
  media: '653713178', mediaI18n: '1167060745', bioCards: '1531451796',
  bioContent: '780255143', reads: '1929979646', readsContent: '1394219289',
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const timestamp = new Date().toISOString();
const target = path.join(root, '.migration', timestamp.replace(/[:.]/g, '-'));
await mkdir(target, { recursive: true });
const tables = {};
const manifest = { exportedAt: timestamp, complete: false, tables: {}, errors: [] };

// Every attempt has its own directory: a failed export never replaces a good snapshot.
for (const [name, gid] of Object.entries(sources)) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheet}/export?format=csv&gid=${gid}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const csv = await response.text();
    if (/^\s*(<!doctype|<html)/i.test(csv)) throw new Error('Received HTML instead of CSV');
    await writeFile(path.join(target, `${name}.csv`), csv);
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: 'greedy' });
    if (parsed.errors.length) throw new Error(JSON.stringify(parsed.errors));
    if (!parsed.meta.fields?.length) throw new Error('Missing CSV header');
    tables[name] = parsed.data;
    manifest.tables[name] = { gid, rows: parsed.data.length, columns: parsed.meta.fields, sha256: hash(csv) };
    console.log(`${name}: ${parsed.data.length} rows`);
  } catch (error) {
    manifest.errors.push({ table: name, error: error.message });
    console.error(`${name}: ${error.message}`);
  }
}

async function inventory(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) result.push(...await inventory(path.join(directory, entry.name), relative));
    else {
      const bytes = await readFile(path.join(directory, entry.name));
      result.push({ path: relative, bytes: bytes.length, sha256: hash(bytes) });
    }
  }
  return result;
}
const assets = await inventory(path.join(root, 'public'));
const assetPaths = new Set(assets.map(a => a.path));
const references = [];
for (const [table, rows] of Object.entries(tables)) {
  rows.forEach((row, index) => {
    for (const field of ['src', 'thumb', 'imageSrc']) {
      if (!row[field]?.trim()) continue;
      const source = row[field].trim();
      const remote = /^https?:\/\//i.test(source);
      const localPath = `/${source.replace(/^\//, '')}`;
      references.push({ table, row: index + 2, field, source,
        status: remote ? 'remote' : assetPaths.has(localPath) ? 'local' : 'missing',
        ...(remote ? {} : { path: localPath }) });
    }
  });
}
const old = JSON.parse(await readFile(path.join(root, 'src/data/cards.json'), 'utf8'));
const oldCards = Array.isArray(old) ? old : old.cards ?? old.projects ?? [];
const currentIds = new Set((tables.cards ?? []).map(r => r.id));
const legacyIds = new Set(oldCards.map(r => r.id));
const reconciliation = {
  assets,
  references,
  spreadsheetOnlyIds: [...currentIds].filter(id => !legacyIds.has(id)),
  legacyOnlyIds: [...legacyIds].filter(id => !currentIds.has(id)),
  legacyComparison: oldCards.filter(r => currentIds.has(r.id)).map(card => ({
    id: card.id,
    differences: ['en', 'es'].flatMap(lang => {
      const live = tables.content?.find(r => r.cardId === card.id && r.lang === lang);
      return ['title', 'description', 'role', 'client'].filter(field =>
        (live?.[field] ?? '') !== (card.content?.[lang]?.[field] ?? '')
      ).map(field => `${lang}.${field}`);
    }),
  })),
  duplicateAssets: Object.values(Object.groupBy(assets, a => a.sha256))
    .filter(group => group.length > 1).map(group => group.map(a => a.path)),
};
manifest.complete = manifest.errors.length === 0 && Object.keys(tables).length === 9;
await writeFile(path.join(target, 'tables.json'), JSON.stringify(tables, null, 2) + '\n');
await writeFile(path.join(target, 'reconciliation.json'), JSON.stringify(reconciliation, null, 2) + '\n');
await writeFile(path.join(target, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
if (manifest.complete) await writeFile(path.join(root, '.migration/latest.json'), JSON.stringify({ directory: path.basename(target) }) + '\n');
console.log(`Snapshot: ${path.relative(root, target)}`);
console.log(`Assets: ${assets.length}; references: ${references.length}; missing: ${references.filter(r => r.status === 'missing').length}; remote: ${references.filter(r => r.status === 'remote').length}`);
if (!manifest.complete) process.exitCode = 1;
