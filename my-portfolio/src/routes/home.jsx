import {useLoaderData,useOutletContext} from 'react-router';
import {getProjects,requireLanguage} from '../lib/content.server';
import {filterProjects} from '../lib/navigation';
import {pageMeta} from '../lib/metadata';
import ProjectCard from '../components/ProjectCard';
export function loader({params}) {
  return {lang:requireLanguage(params.lang),projects:getProjects().map(({body,inlineImages,...project})=>project)};
}
export function shouldRevalidate({currentUrl,nextUrl,defaultShouldRevalidate}) {return currentUrl.pathname===nextUrl.pathname?false:defaultShouldRevalidate;}
export function meta({data}) {
  if(!data)return [];
  return pageMeta({title:data.lang==='es'?'Proyectos':'Projects',description:data.lang==='es'?'Desarrollo web y herramientas para juegos, ciencia y educación.':'Web development and tools for games, science and education.',lang:data.lang,pathname:`/${data.lang}/`});
}
export default function Home() {
  const {projects}=useLoaderData(); const {lang,t,section}=useOutletContext();
  const items=filterProjects(projects,section);
  return <section aria-labelledby="projects-heading">
    <div className="flex items-baseline gap-3 mb-6"><h1 id="projects-heading" className="text-2xl">{t.sections[section]}</h1><span className="text-sm opacity-70">{items.length}</span></div>
    <div className="grid min-[1200px]:grid-cols-2 gap-6 items-start">
      {items.map((p,i)=><ProjectCard key={p.id} item={p} lang={lang} t={t} section={section} priority={i===0} />)}
    </div>
    {!items.length && <p>{t.emptyProjects}</p>}
  </section>;
}
