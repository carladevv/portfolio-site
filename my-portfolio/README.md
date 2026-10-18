# Carla's portfolio

Bilingual React portfolio generated as static HTML with React Router, Vite, and Tailwind. Content and optimized images are local; Google Sheets is not used by the application or normal builds.

## Run locally

Use Node 22.12+ (or a newer supported LTS) and npm. From this directory:

```sh
npm ci
npm run dev
```

Content validation and image preparation run before the dev server. Restart after editing JSON/Markdown or adding originals to refresh generated content.

## Edit content

- `content/projects/<slug>/project.json`: title, card summary, categories, role, links, media.
- `content/projects/<slug>/en.md` and `es.md`: full rich descriptions.
- `content/collaborations.json`: collaboration intro and cards.
- `assets/originals/`: source images; responsive variants are generated automatically.
- `content/site.json`: canonical production origin and existing LinkedIn destination.

See [the content workflow](docs/CONTENT-WORKFLOW.md) for schemas and examples, and [the implementation plan](../PORTFOLIO-PLAN.md) for stages and remaining editorial work.

## Build and verify

```sh
npm run build
npm test
npm run check:build
npm run test:browser
npm run preview
```

Browser checks use installed Microsoft Edge through Playwright and start their own preview server when needed. Preview serves the production output at `http://127.0.0.1:4173`.

Deploy **all of `build/client/`**, including nested HTML, route `.data` files, assets, sitemap, robots.txt, and 404.html. No production Node server is needed. Confirm the canonical origin before release. The host must serve directory indexes and return true 404 responses for unknown routes; do not blanket-rewrite requests to the homepage. `_headers` supplies cache directives for hosts supporting it; configure equivalents elsewhere.

Netlify builds from `my-portfolio/` using `npm run build` and publishes `build/client/`, as configured in the root `netlify.toml` with Node 22. Verify nested URLs, refreshes, 404s, social metadata, and caching on Netlify before marking release complete.

## Migration archive

All nine source tabs and referenced assets are preserved. Eleven main projects are published. CAD rendering, Three.js shaders, Blender Scripts and Tools, and NPCstar are retired; GRQ now appears first in Collaborations. Their local project files remain unpublished. NPCstar is retained for a future showcase project. The two originally hidden projects remain privately archived. [Migration details](docs/MIGRATION.md) record source discrepancies and editorial warnings.

`.migration/` contains ignored private snapshots and retired content; back it up separately. `public/` retains local originals but is deliberately **not** Vite's public directory. Only selected generated media in `static/` is copied into the build. Commit editable content and originals, not generated directories.

Existing Google Fonts remain external. YouTube playback loads only after activation; posters are local.
