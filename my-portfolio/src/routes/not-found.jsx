import {Link,useOutletContext} from 'react-router';
export const meta=()=>[{title:'Page not found · Carladevv'},{name:'robots',content:'noindex'}];
export default function NotFound(){const {lang,t}=useOutletContext();return <section><h1 className="text-3xl mb-5">{t.notFound}</h1><Link to={`/${lang}/`} className="underline">{t.backToProjects}</Link></section>;}
