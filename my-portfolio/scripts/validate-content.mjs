import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const allowRemote = process.argv.includes('--allow-remote-assets');
const categories = new Set(['graphics','accessibility','tooling','archaeology','science']);
const ids = new Set();
const errors = [];
const warnings = [];
let mediaCount = 0;
let remoteCount = 0;
const text = value => typeof value === 'string' && value.trim().length > 0;
const fail = (slug, message) => errors.push(`${slug}: ${message}`);

for (const directory of await readdir(path.join(root,'content/projects'), {withFileTypes:true})) {
  if (!directory.isDirectory()) continue;
  const slug = directory.name;
  let project;
  try { project = JSON.parse(await readFile(path.join(root,'content/projects',slug,'project.json'),'utf8')); }
  catch(error) { fail(slug,error.message); continue; }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || project.slug !== slug) fail(slug,'Invalid or mismatched slug');
  if (!text(project.id) || ids.has(project.id)) fail(slug,'Missing or duplicate project ID');
  ids.add(project.id);
  if (!['on','off'].includes(project.visibility)) fail(slug,'visibility must be on or off');
  if (!Array.isArray(project.tags) || !project.tags.length || project.tags.some(t=>!categories.has(t))) fail(slug,'Unknown or missing category');
  if (!Array.isArray(project.tech) || project.tech.some(t=>!text(t))) fail(slug,'tech must be an array of nonempty strings');
  if (project.priority && !['high','mid','low'].includes(project.priority)) fail(slug,'Unknown priority');
  if (project.featured !== undefined && typeof project.featured !== 'boolean') fail(slug,'featured must be a boolean');
  if (project.allOrder !== undefined && (!Number.isSafeInteger(project.allOrder) || project.allOrder < 1)) fail(slug,'allOrder must be a positive integer');
  if (project.startDate && (!/^\d{4}-\d{2}-\d{2}$/.test(project.startDate) || Number.isNaN(Date.parse(project.startDate)))) fail(slug,'Invalid date');
  for (const lang of ['en','es']) {
    const content = project.content?.[lang];
    if (!content || !text(content.title) || !text(content.description)) { fail(slug,`Missing ${lang} title or summary`); continue; }
    try {
      const body = await readFile(path.join(root,'content/projects',slug,`${lang}.md`),'utf8');
      if (!text(body)) fail(slug,`${lang} full description is empty`);
    } catch { fail(slug,`Missing ${lang}.md`); }
    if (!Array.isArray(content.links)) fail(slug,`${lang}.links must be an array`);
    else for(const link of content.links) {
      if (!text(link.label) || !text(link.href) || !/^(https?:\/\/|\/|#)/.test(link.href)) fail(slug,`${lang}: invalid link`);
      else if (link.href.startsWith('#') || link.href.includes('…')) warnings.push(`${slug}/${lang}: placeholder link ${link.href}`);
    }
  }
  if (!Array.isArray(project.media)) { fail(slug,'media must be an array'); continue; }
  for (const [index,media] of project.media.entries()) {
    mediaCount++;
    if (!['image','youtube'].includes(media.type)) fail(slug,`media ${index}: unknown type`);
    if (media.type === 'youtube' && !/^[\w-]{11}$/.test(media.youtubeId ?? '')) fail(slug,`media ${index}: invalid YouTube ID`);
    if (media.asset) {
      const file = path.resolve(root,media.asset);
      if (!file.startsWith(root) || !/^(assets\/originals\/|public\/)/.test(media.asset) || media.asset.includes('..')) fail(slug,`media ${index}: asset must be a local original`);
      else try { await access(file); } catch { fail(slug,`media ${index}: missing asset ${media.asset}`); }
    } else {
      const source = media.src || media.thumb;
      if (/^https?:\/\//.test(source || '') || (media.type === 'youtube' && !source)) {
        remoteCount++;
        if (!allowRemote) fail(slug,`media ${index}: remote image/poster has not been migrated`);
      } else if (source?.startsWith('/images/')) {
        try { await access(path.join(root,'public',source)); } catch { fail(slug,`media ${index}: missing local source`); }
      } else fail(slug,`media ${index}: missing asset`);
    }
    for(const lang of ['en','es']) {
      const description = media.i18n?.[lang];
      if (!description || (!text(description.alt) && !text(description.caption))) warnings.push(`${slug}/media ${index}/${lang}: supply descriptive alt text`);
    }
  }
}
warnings.forEach(w => console.warn(`WARNING ${w}`));
errors.forEach(e => console.error(`ERROR ${e}`));
console.log(`${ids.size} projects, ${mediaCount} media entries, ${remoteCount} remote image/poster references; ${errors.length} errors, ${warnings.length} editorial warnings.`);
if (errors.length) process.exitCode=1;
