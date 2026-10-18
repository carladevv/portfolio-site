import {useState,useRef} from 'react';
import {Play,Pause,Expand,X} from 'lucide-react';
import {useTheme} from '../ThemeContext';
import OptimizedImage from './OptimizedImage';
export default function MediaGallery({media,lang,title,t,priority=false,full=false}) {
  const {theme}=useTheme(); const [index,setIndex]=useState(0); const [playing,setPlaying]=useState(false); const dialog=useRef(null);
  const selected=media[index]; if(!selected)return null;
  const localized=selected.i18n?.[lang]||selected.i18n?.en||{};
  const alt=localized.alt || localized.caption || `${title} — ${t.media} ${index+1}`;
  const video=selected.type==='youtube'; const sizes=full?'(min-width: 1024px) 1000px, 92vw':'(min-width: 1200px) 590px, 92vw';
  return <div><figure>
    <div className={`relative overflow-hidden bg-black/10 ${theme.radiusSoft}`}>
      {playing && video ? <iframe src={`https://www.youtube-nocookie.com/embed/${selected.youtubeId}?autoplay=1`} title={alt} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="aspect-video w-full" />
        : playing && selected.image.animation ? <img src={selected.image.animation} width={selected.image.width} height={selected.image.height} alt={alt} className="w-full aspect-video object-contain" />
        : <OptimizedImage image={selected.image} alt={alt} sizes={sizes} priority={priority && index===0} className="w-full aspect-video object-contain" />}
      {(video || selected.image.animation) && !playing && <button type="button" onClick={()=>setPlaying(true)} className="absolute inset-0 grid place-items-center" aria-label={`${t.play}: ${title}`}><span className="rounded-full bg-black/75 text-white p-4"><Play size={24} aria-hidden="true" /></span></button>}
      {!video && <button type="button" onClick={()=>dialog.current?.showModal()} className="absolute top-2 right-2 rounded bg-black/75 text-white p-2" aria-label={t.enlarge}><Expand size={18} /></button>}
    </div>
    {localized.caption && <figcaption className={`mt-2 text-[0.85em] leading-relaxed ${theme.textSubtle}`}>{localized.caption}</figcaption>}
    {playing && <button type="button" onClick={()=>setPlaying(false)} className={`${theme.accentText} inline-flex items-center gap-1 mt-2 text-sm underline`}><Pause size={14}/>{t.stop}</button>}
  </figure>
  {media.length>1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label={t.moreMedia}>
    {media.map((m,i)=><button key={i} type="button" onClick={()=>{setIndex(i);setPlaying(false);}} aria-label={`${t.showMedia} ${i+1}: ${title}`} aria-pressed={index===i} className={`shrink-0 w-20 sm:w-24 overflow-hidden border-2 ${theme.radiusSoft} ${index===i?theme.accentBorder:'border-transparent opacity-60 hover:opacity-100'}`}><OptimizedImage image={m.image} alt="" sizes="96px" className="aspect-video w-full object-cover" /></button>)}
  </div>}
  <dialog ref={dialog} aria-label={`${t.media}: ${title}`} className="media-dialog" onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}>
    <div className={`p-3 sm:p-5 ${theme.pageBg} ${theme.textMain} rounded-lg`}>
      <form method="dialog" className="flex justify-end mb-3"><button className="inline-flex items-center gap-2 p-2 border rounded"><X size={18}/>{t.close}</button></form>
      <OptimizedImage image={selected.image} alt={alt} sizes="94vw" className="max-h-[75vh] w-full object-contain" />
      {localized.caption && <p className="mt-2 text-sm">{localized.caption}</p>}
    </div>
  </dialog></div>;
}
