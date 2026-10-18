import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const projects=JSON.parse(await readFile(path.join(root,'src/generated/projects.json'),'utf8'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
for(const lang of ['en','es']) {
  for(const p of projects){
    const file=path.join(root,'build/client',lang,'projects',p.slug,'index.html');
    const html=await readFile(file,'utf8');
    const initial=html.split('<script')[0];
    assert.ok(initial.includes(esc(p.content[lang].title)),`${lang}/${p.slug}: title in initial HTML`);
    assert.ok(html.includes('<h1'),`${p.slug}: semantic project heading`);
    assert.ok(html.includes(`/${lang}/projects/${p.slug}/`),`${p.slug}: canonical URL`);
    assert.ok(html.includes('property="og:title"'),`${p.slug}: social metadata`);
    assert.ok(html.includes(`lang="${lang}"`));
    await access(path.join(root,'build/client',lang,'projects',`${p.slug}.data`));
    if(p.slug==='glb-checker')assert.ok(html.includes('<strong>'), 'Markdown emphasis rendered');
  }
  const home=await readFile(path.join(root,'build/client',lang,'index.html'),'utf8');
  for(const p of projects)assert.ok(home.includes(`/${lang}/projects/${p.slug}/`),`${lang}: card link to ${p.slug}`);
  const collabs=await readFile(path.join(root,'build/client',lang,'collaborations/index.html'),'utf8');
  assert.ok(collabs.includes('CALADONA')&&collabs.includes('Proyecto TUY'));
}
async function inspect(directory) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())await inspect(file);
    else if(/\.(html|js|json|data|xml|css)$/.test(entry.name)) {
      const body=await readFile(file,'utf8');
      for(const forbidden of ['docs.google.com/spreadsheets','i.postimg.cc','img.youtube.com','expressive-ai-chatbot','ai-island','/images/ech-','/images/aii-','cad-realtime-rendering','threejs-shaders','blender-scripts-tools','serp-grq-research-group','npcstar'])assert.ok(!body.includes(forbidden),`${file}: leaked old source or hidden project ${forbidden}`);
    }
  }
}
await inspect(path.join(root,'build/client'));
const sitemap=await readFile(path.join(root,'build/client/sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,projects.length*2+4);
console.log(`PASS: ${projects.length*2} project HTML/data pages, collection links, collaborations, sitemap, and public-output exclusion checks.`);
