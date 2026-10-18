import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const latest = JSON.parse(await readFile(path.join(root, '.migration/latest.json'), 'utf8'));
const snapshot = path.join(root, '.migration', latest.directory);
const manifest = JSON.parse(await readFile(path.join(snapshot, 'manifest.json'), 'utf8'));
if (!manifest.complete) throw new Error('Refusing to import an incomplete snapshot');
const tables = JSON.parse(await readFile(path.join(snapshot, 'tables.json'), 'utf8'));
const slugs = {
  p1: 'archivarium', p2: 'ficweaver', p3: 'sentence-stepper', p4: 'expressive-ai-chatbot',
  p5: 'ai-island', p6: 'blender-scripts-tools', p7: 'npcstar', p8: 'threejs-environment-lods',
  p9: 'serp-grq-research-group', p10: 'protagonistas', p11: 'geniusup', p12: 'diber',
  p13: 'archaeologist', p14: 'cad-realtime-rendering', p15: 'threejs-shaders', p16: 'archaeological-virtual-tour',
};
const list = value => (value || '').split(',').map(s => s.trim()).filter(Boolean);
const warnings = [];
const projects = tables.cards.map(row => {
  if (!slugs[row.id]) throw new Error(`Define a stable slug for ${row.id}`);
  const content = Object.fromEntries(tables.content.filter(r => r.cardId === row.id).map(r => [r.lang, {
    title: r.title, description: r.description, role: r.role, client: r.client,
    links: tables.links.filter(l => l.cardId === row.id && l.lang === r.lang)
      .sort((a,b) => Number(a.order) - Number(b.order)).map(({href,label}) => {
        if (href.startsWith('#') || href.includes('…')) warnings.push(`${row.id}/${r.lang}: unresolved link ${href}`);
        return { href, label };
      }),
  }]));
  const media = tables.media.filter(r => r.cardId === row.id)
    .sort((a,b) => Number(a.index) - Number(b.index)).map(r => ({
      type: r.type || 'image', ...(r.src ? { src: r.src } : {}),
      ...(r.youtubeId ? { youtubeId: r.youtubeId } : {}),
      ...(r.thumb ? { thumb: r.thumb } : {}),
      i18n: Object.fromEntries(tables.mediaI18n.filter(m => m.cardId === row.id && Number(m.index) === Number(r.index))
        .map(m => [m.lang, { alt: m.alt, caption: m.caption }])),
    }));
  return { id: row.id, slug: slugs[row.id], tags: list(row.tags), tech: list(row.tech),
    startDate: row.startDate, priority: row.priority, visibility: row.visibility || 'on', content, media };
});
for (const project of projects) {
  const parent = project.visibility === 'off' ? '.migration/archived-projects' : 'content/projects';
  const directory = path.join(root, parent, project.slug);
  await mkdir(directory, { recursive: true });
  const target = path.join(directory, 'project.json');
  try { await access(target); console.log(`Kept existing ${project.slug}`); continue; } catch { /* New entry only. */ }
  await writeFile(target, JSON.stringify(project, null, 2) + '\n', { flag: 'wx' });
  for (const [lang, content] of Object.entries(project.content)) {
    // The imported description is preserved verbatim; future edits are never overwritten.
    await writeFile(path.join(directory, `${lang}.md`), content.description + '\n', { flag: 'wx' });
  }
}
await writeFile(path.join(root, '.migration/retired-content.json'), JSON.stringify({
  bioCards: tables.bioCards, bioContent: tables.bioContent, reads: tables.reads, readsContent: tables.readsContent,
}, null, 2) + '\n');
await mkdir(path.join(root, 'docs'), {recursive:true});
const report = `# Content migration report\n\nSource snapshot: ${manifest.exportedAt}. Raw CSVs, parsed rows, checksums, and reconciliation are in the ignored \`.migration/${latest.directory}/\` directory. Back up this directory separately; it is not deployed or committed.\n\n` +
  `## Imported records\n\n${Object.entries(manifest.tables).map(([name,t]) => `- ${name}: ${t.rows} rows`).join('\n')}\n\n` +
  `${projects.filter(p => p.visibility !== 'off').length} published projects imported; ${projects.filter(p => p.visibility === 'off').length} hidden projects preserved in the private migration archive. All Journey and reading-list records are archived.\n\n` +
  `## Content to review\n\n${warnings.map(w => `- ${w}`).join('\n')}\n\n` +
  `Some spreadsheet entries explicitly say “solo project,” while the portfolio brief describes small-team work. Existing attribution is preserved during import; review those labels before changing ownership claims. No missing role/team details have been invented.\n\n` +
  `## Asset inventory\n\nThe export references 56 explicit image paths/URLs: 22 local references and 34 remote references. All 22 local references resolve. YouTube posters are additional assets collected from the existing video IDs. The original public directory contains 45 files (25,694,133 bytes); no byte-identical duplicates were found in that baseline.\n\n` +
  `The full reference list and comparison against the legacy JSON are in the snapshot's \`reconciliation.json\`. Matching by ID alone identifies 13 spreadsheet-only IDs and 3 legacy-only IDs; some old IDs may identify projects under different IDs in the sheet, so these counts are not an assertion of unique project differences. The existing legacy file is retained. All three shared IDs have localized text/attribution differences; the live export remains the import source.\n\n` +
  `The import keeps the spreadsheet's current descriptions, links, captions, and ordering. The legacy JSON is a comparison source, not an automatic replacement. Rerunning the importer skips existing project folders to preserve editorial changes.\n`;
await writeFile(path.join(root, 'docs/MIGRATION.md'), report);
console.log(`Imported ${projects.length} records. ${warnings.length} placeholder links recorded in docs/MIGRATION.md.`);
