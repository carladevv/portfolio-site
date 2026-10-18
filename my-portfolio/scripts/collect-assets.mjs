import { readFile, writeFile, mkdir, readdir, rename, statfs, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const latest = JSON.parse(await readFile(path.join(root, '.migration/latest.json'), 'utf8'));
const tables = JSON.parse(await readFile(path.join(root, '.migration', latest.directory, 'tables.json'), 'utf8'));
const published = new Set(tables.cards.filter(c => c.visibility !== 'off').map(c => c.id));
const sourceUses = new Map();
function add(source, isPublic) {
  if (source) sourceUses.set(source, Boolean(sourceUses.get(source) || isPublic));
}
for (const row of tables.media) {
  add(row.src, published.has(row.cardId));
  add(row.thumb, published.has(row.cardId));
  if (row.youtubeId && !row.thumb) add(`https://img.youtube.com/vi/${row.youtubeId}/hqdefault.jpg`, published.has(row.cardId));
}
for (const row of tables.bioCards) add(row.imageSrc, false);
// Keep a copy of every existing public asset, even files not referenced by the current sheet.
async function walk(directory, prefix = '') {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const key = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) await walk(path.join(directory,entry.name),key);
    else add(key, key === '/pfp.png' || key.startsWith('/background/') || key.startsWith('/cat/') || key === '/favicon.ico');
  }
}
await walk(path.join(root, 'public'));
let mapping = {};
try { mapping = JSON.parse(await readFile(path.join(root, '.migration/asset-map.json'), 'utf8')); } catch { /* First run. */ }
const failures = [];
const digestOf = bytes => createHash('sha256').update(bytes).digest('hex');
async function saveMapping() {
  const target = path.join(root, '.migration/asset-map.json');
  await writeFile(`${target}.tmp`, JSON.stringify(mapping, null, 2) + '\n');
  await rename(`${target}.tmp`, target);
}
for (const [source, isPublic] of sourceUses) {
  try {
    if (mapping[source]) {
      const existing = await readFile(path.join(root,mapping[source].file));
      if (digestOf(existing) === mapping[source].sha256) {
        console.log(`Cached ${source}`); continue;
      }
      delete mapping[source];
    }
    let bytes;
    let localFile;
    if (/^https?:/.test(source)) {
      const response = await fetch(source, {signal:AbortSignal.timeout(30000)});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.headers.get('content-type')?.startsWith('image/')) throw new Error('Not an image response');
      bytes = Buffer.from(await response.arrayBuffer());
    } else {
      const local = path.resolve(root,'public',source.replace(/^\//,''));
      if (!local.startsWith(path.join(root,'public') + path.sep)) throw new Error('Invalid local asset path');
      bytes = await readFile(local);
      localFile = path.relative(root, local).replaceAll('\\', '/');
    }
    const digest = digestOf(bytes);
    const ext = path.extname(new URL(source, 'https://local.invalid').pathname).toLowerCase();
    // Existing local originals are already preserved. Do not make redundant copies.
    const file = localFile || `${isPublic ? 'assets/originals' : '.migration/assets'}/${digest}${ext}`;
    if (!localFile) {
      const disk = await statfs(root);
      if (disk.bavail * disk.bsize < bytes.length + 16 * 1024 * 1024) {
        const error = new Error('Insufficient disk space; keeping 16 MB free for safe recovery. Free space and rerun.');
        error.code = 'ENOSPC'; throw error;
      }
      const destination = path.join(root, file);
      await mkdir(path.dirname(destination), {recursive:true});
      try {
        await writeFile(`${destination}.tmp`, bytes);
        await rename(`${destination}.tmp`, destination);
      } catch(error) { await unlink(`${destination}.tmp`).catch(() => {}); throw error; }
    }
    mapping[source] = {file, bytes:bytes.length, sha256:digest, public:isPublic};
    await saveMapping();
    console.log(`Saved ${source} (${bytes.length} bytes)`);
  } catch(error) {
    failures.push({source,error:error.message}); console.error(`${source}: ${error.message}`);
    if (error.code === 'ENOSPC') break;
  }
}
await writeFile(path.join(root,'.migration/asset-failures.json'),JSON.stringify(failures,null,2)+'\n');
if (failures.length) throw new Error(`${failures.length} assets unavailable; inspect .migration/asset-failures.json`);
// Write only public asset references into editable content. The source map stays private.
for (const dir of await readdir(path.join(root,'content/projects'))) {
  const file = path.join(root,'content/projects',dir,'project.json');
  const project = JSON.parse(await readFile(file,'utf8'));
  for (const media of project.media) {
    const source = media.type === 'youtube' ? media.thumb || `https://img.youtube.com/vi/${media.youtubeId}/hqdefault.jpg` : media.src;
    if (mapping[source]) {
      media.asset = mapping[source].file;
      delete media.src; delete media.thumb;
    }
  }
  await writeFile(file,JSON.stringify(project,null,2)+'\n');
}
const siteAssets = Object.fromEntries(['/pfp.png','/background/bgpattern.png','/background/bgpattern_2.png',
  '/cat/catwalk_right.gif','/cat/catwalk_left.gif','/cat/catsit_right.gif','/cat/catsit_left.gif','/favicon.ico']
  .map(source => [source,mapping[source].file]));
await writeFile(path.join(root,'content/site-assets.json'),JSON.stringify(siteAssets,null,2)+'\n');
console.log(`Saved ${Object.keys(mapping).length} unique source references. All referenced media is now local.`);
