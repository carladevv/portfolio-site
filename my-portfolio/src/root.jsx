import { Links, Meta, Scripts, ScrollRestoration, useLocation, isRouteErrorResponse, useRouteError } from 'react-router';
import App from './App';
import './index.css';
export function Layout({children}) {
  const {pathname}=useLocation();
  return <html lang={pathname.startsWith('/es')?'es':'en'}><head>
    <meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" /><Meta /><Links />
  </head><body>{children}<ScrollRestoration /><Scripts /></body></html>;
}
export default App;
export function ErrorBoundary() {
  const error=useRouteError();
  const notFound=isRouteErrorResponse(error) && error.status===404;
  const {pathname}=useLocation();
  const es=pathname.startsWith('/es');
  return <main className="min-h-screen bg-neutral-950 text-neutral-100 p-10">
    <h1 className="text-2xl">{notFound?(es?'Página no encontrada':'Page not found'):(es?'No se pudo cargar la página':'Unable to load this page')}</h1>
    <a href={`/${es?'es':'en'}/`} className="inline-block mt-6 underline">{es?'Volver a los proyectos':'Back to projects'}</a>
  </main>;
}
