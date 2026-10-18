import {useOutletContext} from 'react-router';
import collaborations from '../../content/collaborations.json';
import site from '../../content/site.json';
import {useTheme} from '../ThemeContext';
import {requireLanguage} from '../lib/content.server';
import {pageMeta} from '../lib/metadata';
export function loader({params}) {return {lang:requireLanguage(params.lang)};}
export function meta({data}) {return data?pageMeta({title:data.lang==='es'?'Colaboraciones':'Collaborations',description:data.lang==='es'?'Colaboraciones en patrimonio, ciencia, arqueología y activismo.':'Contributions to projects in heritage, science, archaeology and activism.',lang:data.lang,pathname:`/${data.lang}/collaborations/`}):[];}
export default function Collaborations() {
  const {lang,t}=useOutletContext(); const {theme}=useTheme(); const copy=collaborations.intro[lang];
  return <section className="mx-auto max-w-[1000px]">
    <header className="mb-8 max-w-3xl"><h1 className={`text-3xl ${theme.fontHeading}`}>{t.sections.collaborations}</h1>
      <p className="mt-4 leading-relaxed">{copy.before}<a className="underline underline-offset-4 collaboration-link" href={site.linkedin}>{copy.link}</a>{copy.after}</p>
    </header>
    <div className="space-y-4">{collaborations.items.map(item=>{
      const c=item.content[lang];
      return <article key={item.id} className={`collaboration-card ${theme.card} ${theme.radiusSoft} p-5 sm:p-6 grid sm:grid-cols-[220px_1fr] gap-4`}>
        <div><h2 className={`text-xl ${theme.fontHeading}`}>{c.title}</h2>{c.status && <p className={`mt-2 text-sm ${theme.textSubtle}`}>{c.status}</p>}</div>
        <div><p className="leading-relaxed">{c.description}</p>{item.tech.length>0 && <ul aria-label={t.techStack} className="mt-3 flex flex-wrap gap-2">{item.tech.map(tech=><li key={tech} className={`${theme.chip} ${theme.radiusMax} px-3 py-1 text-sm`}>{tech}</li>)}</ul>}
          <div className="mt-4">{item.url
            ? <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.visitWebsite}: ${c.title}`} className={`inline-flex items-center gap-2 border px-3 py-2 text-sm ${theme.primaryButton} ${theme.radiusMax}`}>{t.visitWebsite}<span aria-hidden="true">↗</span></a>
            : <button type="button" disabled className={`inline-flex border px-3 py-2 text-sm opacity-60 cursor-not-allowed ${theme.primaryButton} ${theme.radiusMax}`}>{t.comingSoon}</button>}
          </div>
        </div>
      </article>;
    })}</div>
  </section>;
}
