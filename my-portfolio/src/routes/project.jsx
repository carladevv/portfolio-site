import {Link,useLoaderData,useOutletContext,useLocation} from 'react-router';
import Markdown from 'react-markdown';
import {ArrowLeft} from 'lucide-react';
import {getProjects,requireLanguage} from '../lib/content.server';
import {categories,collectionPath,projectPath} from '../lib/navigation';
import {pageMeta} from '../lib/metadata';
import {useTheme} from '../ThemeContext';
import {ProjectMeta,TechStack,ProjectLinks} from '../components/ProjectCard';
import MediaGallery from '../components/MediaGallery';
import OptimizedImage from '../components/OptimizedImage';
export function loader({params}) {
  const lang=requireLanguage(params.lang);
  const project=getProjects().find(p=>p.slug===params.slug);
  if(!project)throw new Response('Not found',{status:404});
  return {project,lang,related:getProjects().filter(p=>project.related?.includes(p.slug)).map(p=>({slug:p.slug,title:p.content[lang].title}))};
}
export function meta({data}) {
  if(!data)return [];
  const c=data.project.content[data.lang];
  return pageMeta({title:c.title,description:c.description,lang:data.lang,pathname:projectPath(data.lang,data.project.slug),image:data.project.media[0]?.image.social});
}
export default function Project() {
  const {project,related}=useLoaderData(); const {lang,t}=useOutletContext(); const {theme}=useTheme();
  const {state}=useLocation(); const from=categories.includes(state?.fromSection)?state.fromSection:'all';
  const c=project.content[lang] || project.content.en;
  return <article className="mx-auto max-w-[1000px]" key={`${project.slug}-${lang}`}>
    <Link to={collectionPath(lang,from)} className={`${theme.accentText} inline-flex items-center gap-2 mb-6 underline underline-offset-4`}><ArrowLeft size={16}/>{t.backToProjects}</Link>
    <header className="mb-6"><h1 className={`text-3xl sm:text-4xl leading-tight ${theme.fontHeading}`}>{c.title}</h1>
      <ProjectMeta item={project} lang={lang}/><p className="mt-5 text-[1.15em] leading-relaxed max-w-3xl">{c.description}</p>
      <TechStack tech={project.tech} t={t}/><ProjectLinks links={c.links}/>
    </header>
    {!!project.media.length && <div className="mb-8"><MediaGallery key={project.slug} media={project.media} lang={lang} title={c.title} t={t} priority full/></div>}
    {project.status==='stub' && <p className={`mb-5 text-sm ${theme.textSubtle}`}>{t.caseStudyInProgress}</p>}
    <div className="project-prose max-w-3xl">
      {!project.body[lang] && <p>{t.translationFallback}</p>}
      <Markdown skipHtml components={{img:({src,alt})=><OptimizedImage image={project.inlineImages[src]} alt={alt} sizes="(min-width: 900px) 768px, 92vw" className="w-full h-auto my-6"/>,h1:({children})=><h2>{children}</h2>}}>{project.body[lang] || project.body.en}</Markdown>
    </div>
    {!!related.length && <aside className="mt-10 pt-6 border-t border-current/20"><h2 className="text-xl mb-3">{t.relatedProjects}</h2>
      {related.map(p=><Link key={p.slug} to={projectPath(lang,p.slug)} className={`${theme.accentText} block underline underline-offset-4 py-2`}>{p.title}</Link>)}
    </aside>}
  </article>;
}
