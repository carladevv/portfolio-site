import site from '../../content/site.json';
export function pageMeta({title,description,lang='en',pathname='/',image,noindex=false}) {
  const url=new URL(pathname,site.url).href;
  return [
    {title:`${title} · Carladevv`}, {name:'description',content:description},
    {tagName:'link',rel:'canonical',href:url}, {property:'og:type',content:'website'},
    {property:'og:title',content:title}, {property:'og:description',content:description},
    {property:'og:url',content:url}, {property:'og:locale',content:lang==='es'?'es_ES':'en_GB'},
    {name:'twitter:card',content:image?'summary_large_image':'summary'},
    ...(image?[{property:'og:image',content:new URL(image,site.url).href}]:[]),
    ...(noindex?[{name:'robots',content:'noindex'}]:['en','es'].map(language=>({tagName:'link',rel:'alternate',hrefLang:language,href:new URL(pathname.replace(/^\/(en|es)(?=\/|$)/,`/${language}`),site.url).href}))),
  ];
}
