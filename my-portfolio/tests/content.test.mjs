import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {filterProjects,sectionFromLocation,collectionPath,projectPath,categories} from '../src/lib/navigation.js';
const projects=JSON.parse(await readFile(new URL('../src/generated/projects.json',import.meta.url),'utf8'));

test('All projects is the unique union of published categories, including the two independent new projects',()=>{
  const all=filterProjects(projects);
  const union=new Set(categories.slice(1).flatMap(category=>filterProjects(projects,category).map(p=>p.id)));
  assert.deepEqual(new Set(all.map(p=>p.id)),union);
  assert.equal(all.length,union.size);
  assert.ok(all.some(p=>p.slug==='glb-checker'));
  assert.ok(all.some(p=>p.slug==='navarra-historical-sites'));
  assert.ok(filterProjects(projects,'tooling').some(p=>p.slug==='glb-checker'));
  assert.ok(all.every(p=>p.id!=='p4' && p.id!=='p5'));
  assert.equal(all[0].id,'p16','Cova Bonica leads All projects');
  assert.equal(all[1].id,'navarra','Navarra follows Cova Bonica in All projects');
  assert.equal(filterProjects(projects,'archaeology')[0].id,'p16','Cova Bonica leads its categories');
});
test('Filtering excludes drafts and does not mutate the catalog',()=>{
  const before=JSON.stringify(projects);
  assert.equal(filterProjects([...projects,{...projects[0],id:'test-draft',visibility:'off'}]).length,projects.length);
  filterProjects(projects,'graphics'); assert.equal(JSON.stringify(projects),before);
});
test('Legacy category URLs remain meaningful and Journey returns to All projects',()=>{
  assert.equal(sectionFromLocation({hash:'#archaeology'}),'archaeology');
  assert.equal(sectionFromLocation({search:'?section=science'}),'science');
  assert.equal(sectionFromLocation({hash:'#bio'}),'all');
  assert.equal(sectionFromLocation({pathname:'/es/collaborations/'}),'collaborations');
  assert.equal(sectionFromLocation({pathname:'/en/projects/glb-checker/'}),'');
  assert.equal(collectionPath('es','tooling'),'/es/?section=tooling');
  assert.equal(projectPath('en','glb-checker'),'/en/projects/glb-checker/');
});
test('Every published image variant is local, exists, and has dimensions',async()=>{
  const images=JSON.parse(await readFile(new URL('../src/generated/image-manifest.json',import.meta.url),'utf8'));
  for(const image of Object.values(images)){
    assert.ok(image.width>0 && image.height>0);
    for(const file of image.files){assert.ok(file.startsWith('/media/')); await access(new URL(`../static${file}`,import.meta.url));}
    for(const entries of Object.values(image.sources)) {
      assert.ok(entries.every(e=>e.width<=image.width),'No upscaling');
      assert.equal(new Set(entries.map(e=>e.width)).size,entries.length);
    }
  }
});
