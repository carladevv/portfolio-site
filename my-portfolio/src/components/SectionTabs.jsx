import { Link } from 'react-router';
import { LayoutGrid, Box, PersonStanding, Amphora, Wrench, Microscope, Handshake, Menu } from 'lucide-react';
import {useTheme} from '../ThemeContext';
import {collectionPath} from '../lib/navigation';
const sections=[['all',LayoutGrid],['graphics',Box],['accessibility',PersonStanding],['tooling',Wrench],['archaeology',Amphora],['science',Microscope]];
export default function SectionTabs({t,lang,current}) {
  const {theme}=useTheme();
  return <nav aria-label={t.navigation} className="mx-auto max-w-[1300px] px-4 mt-6 lg:mt-10">
    <div className="flex flex-wrap items-center gap-2 lg:gap-3">
      <details className="relative lg:hidden" onKeyDown={event=>{
        if(event.key==='Escape') {event.currentTarget.open=false;event.currentTarget.querySelector('summary').focus();}
      }}>
        <summary className={`flex cursor-pointer list-none items-center gap-2 border px-3 py-2 text-xs uppercase [&::-webkit-details-marker]:hidden ${theme.radiusMax} ${theme.tabInactive}`}>
          <Menu size={18} aria-hidden="true" />{t.sections[sections.some(([key])=>key===current)?current:'all']}
        </summary>
        <div className={`absolute left-0 mt-2 w-56 z-30 p-2 flex flex-col gap-2 border shadow-md ${theme.toolbar} ${theme.radiusSoft}`}>
          {sections.map(([key,Icon])=><Link key={key} to={collectionPath(lang,key)} preventScrollReset aria-current={current===key?'page':undefined}
            onClick={event=>{event.currentTarget.closest('details').open=false;}}
            className={`${theme.radiusMax} ${current===key?theme.tabActive:theme.tabInactive} flex items-center gap-2 border px-3 py-2 text-xs uppercase`}>
            <Icon size={16} aria-hidden="true" />{t.sections[key]}</Link>)}
        </div>
      </details>
      <div className="hidden lg:flex flex-wrap items-center gap-3">
      {sections.map(([key,Icon])=><Link key={key} to={collectionPath(lang,key)} preventScrollReset aria-current={current===key?'page':undefined}
        className={`${theme.radiusMax} ${theme.fontHeading} ${current===key?theme.tabActive:theme.tabInactive} flex items-center gap-2 border px-3 py-2 text-xs sm:text-sm uppercase`}>
        <Icon size={16} aria-hidden="true" />{t.sections[key]}</Link>)}
      </div>
      <Link to={`/${lang}/collaborations/`} aria-current={current==='collaborations'?'page':undefined}
        className={`collaboration-tab ${theme.radiusMax} ${theme.fontHeading} flex items-center gap-2 border px-3 py-2 text-xs sm:text-sm uppercase sm:ml-auto`}>
        <Handshake size={16} aria-hidden="true" />{t.sections.collaborations}</Link>
    </div>
  </nav>;
}
