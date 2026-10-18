import projects from '../generated/projects.json';
export function getProjects(){return projects;}
export function requireLanguage(value='en') {
  if(!['en','es'].includes(value))throw new Response('Not found',{status:404});
  return value;
}
