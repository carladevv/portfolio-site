import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const json = async file => JSON.parse(await readFile(path.join(root,file),'utf8'));
const latest = await json('.migration/latest.json');
const prefix = `.migration/${latest.directory}`;
const manifest = await json(`${prefix}/manifest.json`);
const tables = await json(`${prefix}/tables.json`);
assert.equal(manifest.complete,true,'Snapshot must be complete');
assert.equal(Object.keys(manifest.tables).length,9);
for (const [name,table] of Object.entries(manifest.tables)) {
  const raw = await readFile(path.join(root,prefix,`${name}.csv`));
  assert.equal(createHash('sha256').update(raw).digest('hex'),table.sha256,`${name}: snapshot checksum`);
  assert.equal(tables[name].length,table.rows,`${name}: row count`);
}
const allProjects = [];
for (const parent of ['content/projects','.migration/archived-projects']) {
  for (const directory of await readdir(path.join(root,parent))) {
    const p = await json(`${parent}/${directory}/project.json`);
    // Authored projects added after migration are validated by content:validate.
    const source = tables.cards.find(r=>r.id===p.id);
    if (!source) continue;
    allProjects.push(p);
    assert.equal(p.slug,directory,'Folder must match slug');
    assert.equal(parent.startsWith('.migration'),p.visibility==='off','Hidden project separation');
    assert.ok(source,`${p.id}: source record`);
    assert.equal(p.startDate,source.startDate);
    assert.equal(p.priority,source.priority);
    for (const field of ['tags','tech']) assert.deepEqual(p[field],source[field].split(',').map(s=>s.trim()).filter(Boolean));
    for (const lang of ['en','es']) {
      const original = tables.content.find(r=>r.cardId===p.id && r.lang===lang);
      assert.ok(original,`${p.id}/${lang}: source translation`);
      for(const field of ['title','description','role','client']) assert.equal(p.content[lang][field],original[field],`${p.id}/${lang}/${field}`);
      const markdown = await readFile(path.join(root,parent,directory,`${lang}.md`),'utf8');
      assert.equal(markdown,original.description+'\n',`${p.id}/${lang}: complete description preserved`);
      const links = tables.links.filter(r=>r.cardId===p.id && r.lang===lang).sort((a,b)=>Number(a.order)-Number(b.order));
      assert.deepEqual(p.content[lang].links,links.map(({href,label})=>({href,label})),`${p.id}/${lang}: link order/content`);
    }
    const media = tables.media.filter(r=>r.cardId===p.id).sort((a,b)=>Number(a.index)-Number(b.index));
    assert.equal(p.media.length,media.length,`${p.id}: media count`);
    for (const [i,original] of media.entries()) {
      const imported = p.media[i];
      assert.equal(imported.type,original.type || 'image');
      assert.equal(imported.youtubeId || '',original.youtubeId);
      if (!imported.asset) assert.equal(imported.src || '',original.src);
      for(const caption of tables.mediaI18n.filter(r=>r.cardId===p.id && Number(r.index)===Number(original.index))) {
        assert.deepEqual(imported.i18n[caption.lang],{alt:caption.alt,caption:caption.caption},`${p.id}/${i}: caption and alt`);
      }
    }
  }
}
assert.deepEqual(allProjects.map(p=>p.id).sort(),tables.cards.map(p=>p.id).sort(),'Every project preserved exactly once');
const archived = await json('.migration/retired-content.json');
for(const key of ['bioCards','bioContent','reads','readsContent']) assert.deepEqual(archived[key],tables[key],`${key}: archive parity`);
console.log(`PASS: 9 CSV checksums; ${allProjects.length} projects; both languages; ordered links/media/captions; hidden records; Journey and recent reads.`);
