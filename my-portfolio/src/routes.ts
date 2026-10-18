import { index, route, prefix } from '@react-router/dev/routes';
export default [
  index('routes/home.jsx', {id:'home-default'}),
  ...prefix(':lang', [
    index('routes/home.jsx', {id:'home-localized'}),
    route('projects/:slug', 'routes/project.jsx'),
    route('collaborations', 'routes/collaborations.jsx'),
  ]),
  route('*','routes/not-found.jsx'),
];
