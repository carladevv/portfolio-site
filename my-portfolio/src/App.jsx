import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { ThemeProvider, useTheme } from './ThemeContext';
import en from './data/i18n.en.json';
import es from './data/i18n.es.json';
import siteImages from './generated/site-images.json';
import ToolbarFloating from './components/ToolbarFloating';
import BioHeaderDesktop from './components/BioHeaderDesktop';
import BioHeaderMobile from './components/BioHeaderMobile';
import FooterBar from './components/FooterBar';
import SectionTabs from './components/SectionTabs';
import { sectionFromLocation } from './lib/navigation';

function PortfolioShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = location.pathname.split('/')[1] === 'es' ? 'es' : 'en';
  const t = lang === 'es' ? es : en;
  const [fontSize,setFontSize] = useState('sm');
  const {theme,themeId} = useTheme();
  // Static HTML cannot see a visitor's query string or legacy hash. Apply
  // filters after hydration so the first browser render matches that HTML.
  const [hydrated,setHydrated] = useState(false);
  useEffect(()=>setHydrated(true),[]);
  const section = sectionFromLocation(hydrated ? location : {pathname:location.pathname});
  const setLang = next => {
    const suffix = location.pathname.replace(/^\/(en|es)(?=\/|$)/,'').replace(/^\/$/,'');
    navigate(`/${next}${suffix || '/'}${location.search}${location.hash}`);
  };
  const texture = siteImages['/background/bgpattern_2.png'];
  return (
    <div data-theme={themeId} className={`relative min-h-screen ${theme.pageBg} ${theme.textMain} ${theme.fontBody}`}
      style={{'--card-font-size':fontSize==='lg'?'1.125rem':fontSize==='base'?'1rem':'0.875rem'}}>
      <a className="skip-link" href="#main-content">{t.skipToContent}</a>
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-repeat" style={{backgroundImage:`url(${texture.sources.webp.at(-1).src})`}} aria-hidden="true" />
      <div className="relative">
        <div className="hidden md:block">
          <ToolbarFloating t={t} lang={lang} setLang={setLang} fontSize={fontSize} setFontSize={setFontSize} />
          <BioHeaderDesktop t={t} />
        </div>
        <div className="md:hidden"><BioHeaderMobile t={t} lang={lang} setLang={setLang} fontSize={fontSize} setFontSize={setFontSize} /></div>
        <SectionTabs t={t} lang={lang} current={section} />
        <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1300px] px-4 pt-6 pb-28 outline-none" style={{fontSize:'var(--card-font-size)'}}>
          <Outlet context={{lang,t,section}} />
        </main>
        <FooterBar t={t} />
      </div>
    </div>
  );
}
export default function App() {return <ThemeProvider><PortfolioShell /></ThemeProvider>;}
