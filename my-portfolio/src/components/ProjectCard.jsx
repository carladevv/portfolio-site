import {Link} from 'react-router';
import {ArrowUpRight,ArrowRight} from 'lucide-react';
import {useTheme} from '../ThemeContext';
import MediaGallery from './MediaGallery';
import {projectPath} from '../lib/navigation';
export function ProjectMeta({item,lang}) {
  const {theme}=useTheme(); const c=item.content[lang] || item.content.en;
  return <p className={`mt-2 text-[0.85em] ${theme.textSubtle}`}>{[item.startDate?.slice(0,4),c.role,c.client].filter(Boolean).join(' · ')}</p>;
}
export function TechStack({tech,t}) {
  const {theme}=useTheme(); if(!tech.length) return null;
  return <div className="mt-4"><h3 className={`mb-2 text-[0.9em] ${theme.accentText}`}>{t.techStack}</h3>
    <ul className="flex flex-wrap gap-2">{tech.map(value=><li key={value} className={`${theme.chip} ${theme.radiusMax} px-3 py-1 text-[0.85em]`}>{value}</li>)}</ul></div>;
}
export function ProjectLinks({links=[]}) {
  const {theme}=useTheme();
  const usable=links.filter(l=>/^https?:\/\//.test(l.href) && !l.href.includes('…'));
  if(!usable.length)return null;
  return <div className="flex flex-wrap gap-2 mt-4">{usable.map((link,i)=><a key={i} href={link.href} className={`${theme.primaryButton} ${theme.radiusSoft} inline-flex items-center gap-2 px-3 py-2 text-sm`}>{link.label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>;
}
export default function ProjectCard({item,lang,t,section='all',priority=false}) {
  const {theme}=useTheme(); const c=item.content[lang]||item.content.en; const path=projectPath(lang,item.slug);
  return <article className={`${theme.card} ${theme.radiusSoft} p-5 sm:p-6 shadow-sm min-w-0`}>
    <h2 className={`text-[1.3em] ${theme.fontHeading}`}><Link to={path} state={{fromSection:section}} className="project-title">{c.title}</Link></h2>
    <ProjectMeta item={item} lang={lang} /><p className="mt-3 leading-relaxed">{c.description}</p>
    <Link to={path} state={{fromSection:section}} aria-label={`${t.readMore}: ${c.title}`} className={`${theme.accentText} inline-flex items-center gap-2 mt-3 underline underline-offset-4`}>{t.readMore}<ArrowRight size={15} aria-hidden="true" /></Link>
    <TechStack tech={item.tech} t={t}/>
    {!!item.media.length && <div className="mt-5"><MediaGallery media={item.media} lang={lang} title={c.title} t={t} priority={priority} /></div>}
    <ProjectLinks links={c.links} />
  </article>;
}
