export const categories = ['all','graphics','accessibility','tooling','archaeology','science'];
export function sectionFromLocation({pathname='',search='',hash=''}) {
  if(pathname.includes('/projects/')) return '';
  if(pathname.endsWith('/collaborations') || pathname.endsWith('/collaborations/')) return 'collaborations';
  const value=hash.slice(1) || new URLSearchParams(search).get('section');
  return categories.includes(value) ? value : 'all';
}
export function filterProjects(projects, section='all') {
  const priority={high:0,mid:1,low:2};
  return projects.filter(p=>p.visibility==='on' && (section==='all'||p.tags.includes(section)))
    .sort((a,b)=>Number(b.featured===true)-Number(a.featured===true) || (section==='all' ? (a.allOrder??Number.MAX_SAFE_INTEGER)-(b.allOrder??Number.MAX_SAFE_INTEGER) : 0) || (priority[a.priority]??2)-(priority[b.priority]??2) || (Date.parse(b.startDate)||0)-(Date.parse(a.startDate)||0) || a.slug.localeCompare(b.slug));
}
export const projectPath=(lang,slug)=>`/${lang}/projects/${slug}/`;
export const collectionPath=(lang,section='all')=>`/${lang}/${section==='all'?'':`?section=${section}`}`;
