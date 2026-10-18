import { readFile, readdir } from 'node:fs/promises';
import type { Config } from '@react-router/dev/config';
export default {
  appDirectory:'src', ssr:false, routeDiscovery:{mode:'initial'},
  async prerender() {
    const paths=['/'];
    const projects=[];
    for(const directory of await readdir('content/projects')) {
      const p=JSON.parse(await readFile(`content/projects/${directory}/project.json`,'utf8'));
      if(p.visibility==='on') projects.push(p.slug);
    }
    // React Router's static .data requests normalize away trailing slashes.
    for(const lang of ['en','es']) paths.push(`/${lang}`,`/${lang}/collaborations`,...projects.map(slug=>`/${lang}/projects/${slug}`));
    return paths;
  },
} satisfies Config;
