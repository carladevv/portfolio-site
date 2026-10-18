import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const site=JSON.parse(await readFile(new URL('content/site.json',root),'utf8'));
const projects=JSON.parse(await readFile(new URL('src/generated/projects.json',root),'utf8'));
const paths=['/en/','/es/',...['en','es'].flatMap(lang=>[`/${lang}/collaborations/`,...projects.map(p=>`/${lang}/projects/${p.slug}/`)])];
const xmlEscape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
await writeFile(new URL('build/client/sitemap.xml',root),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>`<url><loc>${xmlEscape(new URL(p,site.url).href)}</loc></url>`).join('')+'</urlset>\n');
await writeFile(new URL('build/client/robots.txt',root),`User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
// A real static 404 response must not hydrate using an unrelated page's loader data.
await writeFile(new URL('build/client/404.html',root),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found · Carladevv</title><style>body{margin:0;padding:10vh 7vw;background:#0a0a0a;color:#ddd;font:18px/1.6 system-ui}a{color:#c7849c}</style></head><body><h1>Page not found / Página no encontrada</h1><p><a href="/en/">Back to projects</a> · <a href="/es/">Volver a los proyectos</a></p></body></html>');
// Header hints used by hosts that support a _headers file; other hosts need equivalent configuration.
await writeFile(new URL('build/client/_headers',root),'/media/*\n  Cache-Control: public, max-age=31536000, immutable\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/*.data\n  Cache-Control: no-cache\n/*.html\n  Cache-Control: no-cache\n');
console.log(`Finalized ${paths.length} canonical URLs, sitemap, robots.txt, and static 404 page.`);
