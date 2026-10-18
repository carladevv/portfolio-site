import { readFile, writeFile, mkdir, readdir, access, copyFile, stat, rename } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const readJson = async file => JSON.parse(await readFile(path.join(root,file),'utf8'));
await mkdir(path.join(root,'static/media'), {recursive:true});
await mkdir(path.join(root,'src/generated'), {recursive:true});
const projects = [];
for (const dir of await readdir(path.join(root,'content/projects'))) {
  const project = await readJson(`content/projects/${dir}/project.json`);
  if (project.visibility !== 'on') continue;
  project.body = {};
  for(const lang of ['en','es']) project.body[lang] = await readFile(path.join(root,'content/projects',dir,`${lang}.md`),'utf8');
  projects.push(project);
}
const siteSources = await readJson('content/site-assets.json');
const manifest = {};
const usedFiles = new Set();
const exists = async file => {try { await access(file); return true; } catch { return false; }};
const widths = [160,320,640,960,1440,1920];

async function processImage(source, kind = 'project') {
  if (manifest[source]) return manifest[source];
  const full = path.resolve(root, source);
  if (!full.startsWith(root) || source.includes('..') || !/^(public\/|assets\/originals\/)/.test(source)) throw Error(`Invalid original: ${source}`);
  const bytes = await readFile(full);
  const id = createHash('sha256').update(bytes).update(`responsive-v1-${kind}`).digest('hex').slice(0,20);
  const output = path.join(root,'static/media',id);
  await mkdir(output,{recursive:true});
  const cache = path.join(output,'manifest.json');
  if (await exists(cache)) {
    const entry = JSON.parse(await readFile(cache,'utf8'));
    if ((await Promise.all(entry.files.map(url => exists(path.join(root,'static',url))))).every(Boolean)) {
      entry.files.forEach(url => usedFiles.add(url)); manifest[source]=entry; return entry;
    }
  }
  const info = await sharp(bytes).metadata();
  const rotated = [5,6,7,8].includes(info.orientation);
  const width = rotated ? info.height : info.width;
  const height = rotated ? info.width : (info.pageHeight || info.height);
  const entry = {width,height,sources:{avif:[],webp:[],fallback:[]},files:[],originalBytes:bytes.length};
  const save = async (name, processor) => {
    const url = `/media/${id}/${name}`;
    if (!await exists(path.join(output,name))) {
      await processor.toFile(path.join(output,`${name}.tmp`));
      await rename(path.join(output,`${name}.tmp`),path.join(output,name));
    }
    entry.files.push(url); usedFiles.add(url); return url;
  };
  if(kind === 'decoration') {
    const name = info.pages > 1 ? 'animation.gif' : 'image.png';
    const url = `/media/${id}/${name}`;
    await writeFile(path.join(output,name),bytes);
    entry.src = url; entry.files.push(url); usedFiles.add(url);
  } else {
    const max = kind === 'profile' ? 256 : kind === 'background' ? Math.min(width,1200) : 1920;
    const sizes = [...new Set([...widths.filter(w=>w<width && w<=max),Math.min(width,max)])].sort((a,b)=>a-b);
    const fallback = info.hasAlpha ? 'png' : 'jpg';
    for(const w of sizes) {
      const resized = () => sharp(bytes,{page:0,pages:1}).rotate().resize({width:w,withoutEnlargement:true});
      entry.sources.webp.push({width:w,src:await save(`${w}.webp`,resized().webp({quality:82}))});
      entry.sources.avif.push({width:w,src:await save(`${w}.avif`,resized().avif({quality:55,effort:2}))});
      entry.sources.fallback.push({width:w,src:await save(`${w}.${fallback}`,fallback==='png' ? resized().png({compressionLevel:9}) : resized().jpeg({quality:88,chromaSubsampling:'4:4:4'}))});
    }
    entry.src = (entry.sources.fallback.find(v=>v.width>=960)||entry.sources.fallback.at(-1)).src;
    entry.preview = entry.sources.webp[0].src;
    entry.social = entry.sources.fallback.at(-1).src;
    if(info.pages > 1) entry.animation = await save('animation.webp',sharp(bytes,{animated:true}).resize({width:Math.min(width,960),withoutEnlargement:true}).webp({quality:80,effort:3}));
  }
  await writeFile(cache,JSON.stringify(entry,null,2));
  manifest[source] = entry;
  console.log(`Optimized ${source} (${width} × ${height})`);
  return entry;
}
for(const project of projects) {
  for(const media of project.media) {
    if(!media.asset) throw Error(`${project.slug}: media has not been collected`);
    media.image = await processImage(media.asset);
    delete media.asset;
  }
  // Inline Markdown uses the same original-file identifiers as project metadata.
  project.inlineImages = {};
  for(const body of Object.values(project.body)) {
    for(const match of body.matchAll(/!\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      project.inlineImages[match[1]] = await processImage(match[1]);
    }
  }
}
const siteImages = {};
for(const [key,source] of Object.entries(siteSources)) {
  if(key.endsWith('.ico')) {await copyFile(path.join(root,source),path.join(root,'static/favicon.ico'));continue;}
  siteImages[key] = await processImage(source,key.startsWith('/cat/')?'decoration':key.startsWith('/background/')?'background':'profile');
}
// Keep the generated public tree restricted to currently referenced assets (including cached variants).
// Never recursively delete a computed directory: remove only known leaf files inside static/media.
async function prune(dir) {
  const target = path.resolve(dir);
  if(!target.startsWith(path.join(root,'static/media')+path.sep) && target!==path.join(root,'static/media')) throw Error('Unsafe generated path');
  for(const e of await readdir(target,{withFileTypes:true})) {
    const file=path.join(target,e.name);
    if(e.isDirectory()) await prune(file);
    else if(e.name !== 'manifest.json' && !usedFiles.has('/'+path.relative(path.join(root,'static'),file).replaceAll('\\','/'))) {
      const {unlink} = await import('node:fs/promises'); await unlink(file);
    }
  }
}
await prune(path.join(root,'static/media'));
await writeFile(path.join(root,'src/generated/projects.json'),JSON.stringify(projects));
await writeFile(path.join(root,'src/generated/site-images.json'),JSON.stringify(siteImages));
await writeFile(path.join(root,'src/generated/image-manifest.json'),JSON.stringify(manifest));
let originalBytes=0, typicalBytes=0;
for(const entry of Object.values(manifest)) {
  originalBytes+=entry.originalBytes;
  const typical=entry.sources?.webp?.find(s=>s.width>=640)?.src || entry.src;
  typicalBytes+=(await stat(path.join(root,'static',typical))).size;
}
await writeFile(path.join(root,'src/generated/media-stats.json'),JSON.stringify({images:Object.keys(manifest).length,originalBytes,typicalBytes},null,2));
console.log(`Prepared ${projects.length} published projects and ${Object.keys(manifest).length} local assets. Representative 640px WebP total: ${typicalBytes} bytes; originals: ${originalBytes} bytes.`);
