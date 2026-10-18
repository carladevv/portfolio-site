# Editing the portfolio

The site builds from local JSON, Markdown, and image originals. Regular edits need neither Google Sheets nor the migration archive.

## Edit a project

Each `content/projects/<slug>/` folder contains `project.json`, `en.md`, and `es.md`. Keep the slug stable after sharing its URL; configure a host redirect if it changes.

`project.json` controls the card and page header:

```json
{
  "id": "example-project",
  "slug": "example-project",
  "visibility": "on",
  "priority": "mid",
  "tags": ["tooling"],
  "tech": ["JavaScript"],
  "media": [],
  "content": {
    "en": {
      "title": "Example project",
      "description": "Short card summary.",
      "role": "My specific contribution",
      "client": "",
      "links": []
    },
    "es": {
      "title": "Proyecto de ejemplo",
      "description": "Resumen breve para la tarjeta.",
      "role": "Mi contribución específica",
      "client": "",
      "links": []
    }
  }
}
```

- Categories: `graphics`, `accessibility`, `tooling`, `archaeology`, `science`. Use one or more; All projects is automatic.
- Priority: `high`, `mid`, `low`. Within a priority, newer `startDate` values come first, then slug. Optional dates use `YYYY-MM-DD`; omit unknown dates.
- `featured: true` places the main project ahead of ordinary priority/date ordering. COVA BONICA VIRTUAL TOUR is the featured project; its existing URL stays stable despite the title change.
- Optional `allOrder` sets ordering after featured projects in All projects only, before priority/date. Navarra uses `allOrder: 2` to follow Cova Bonica; category ordering is unchanged.
- `visibility: "off"` excludes a project from generated pages/data/sitemap and selected assets. This does not make source files private in a public Git repository; keep confidential material outside it.
- Optional `status: "stub"` displays the case-study-in-progress note. Remove when ready.
- Optional `related: ["another-slug"]` links related published projects.
- Localized `links` entries use `{"label":"Source","href":"https://..."}`. Unresolved source placeholders are retained in metadata but hidden from public actions.
- Empty technologies and missing optional context are omitted. Include only confirmed facts.

Write both Markdown descriptions. Use `##` headings below the generated title, paragraphs, `*italics*`, `**bold**`, lists, links, and fenced code. Raw HTML is disabled. Existing bodies initially match source descriptions; expand them independently of card summaries.

## Add images

1. Save a full-quality original under `assets/originals/`, preferably in a named project subfolder. Imported checksum filenames can remain unchanged.
2. Add an ordered entry to `project.json`, with paths relative to `my-portfolio/` and forward slashes:

```json
{
  "type": "image",
  "asset": "assets/originals/example-project/interface.png",
  "i18n": {
    "en": {"alt": "Describe the useful visible information", "caption": "Optional context."},
    "es": {"alt": "Describe la información visual relevante", "caption": "Contexto opcional."}
  }
}
```

3. Build or restart dev. Sharp creates responsive AVIF/WebP/fallback variants, dimensions, and content hashes. Do not edit `static/media/` or `src/generated/`.

The first media item leads the card/page and supplies the social preview. Images are not upscaled, so retain a sufficiently detailed original. GIF demonstrations get a still poster and manual animated WebP playback. Existing small cat decorations remain pixel art and respect reduced motion.

For inline Markdown, use a simple original path without spaces:

```md
![A useful description](assets/originals/example-project/interface.png)
```

Use this syntax rather than remote URLs, raw HTML, or reference-style image definitions; the build discovers these paths for optimization.

YouTube entries use `type: "youtube"`, an 11-character `youtubeId`, a local `asset` poster, and the same `i18n` object. Supply a local poster when adding a video. External playback loads only on activation.

## Edit collaborations

`content/collaborations.json` contains the bilingual introduction and entries with unique `id`, `tech`, optional `url`, and localized `title`/`description`/optional `status`. Array order controls display order; GRQ–SERP comes first. A supplied `url` renders a website button, while a missing URL renders a disabled “Coming soon” button. Unknown stacks stay `[]`. The intro reuses LinkedIn from `content/site.json`.

CALADONA/TUY await stack, features, name, and link details. Navarra has five final-scene gallery images and four experimental character images inline in its Markdown; keep the woman-and-dog wide shot first and the full Zalatambor castle view last. The castle reconstruction is the team's work, with Carla contributing asset optimization for the web. Remaining Navarra details include dates, credits, and optimization-script examples. GLB Checker still awaits images and technical examples. Do not substitute invented material.

## Validate and publish

From `my-portfolio/`:

```sh
npm run build
npm test
npm run check:build
npm run test:browser
npm run preview
```

Build validates content and prepares images first. Browser checks use installed Microsoft Edge and start preview automatically when needed. Review both languages, mobile layouts, images, and links at `http://127.0.0.1:4173`.

The dev server reads generated content: restart after JSON/Markdown/original edits. Component edits use normal hot reload.

Confirm the production origin in `content/site.json`, then publish **all of `build/client/`**. Serve nested directory indexes, route `.data` files, and generated media. Return real 404 responses rather than universally rewriting to the homepage. Cache hashed `/media/` and `/assets/` immutably and revalidate HTML/data. `_headers` is supplied for hosts supporting it; configure equivalents elsewhere.

Netlify configuration lives in the root `netlify.toml`: base `my-portfolio`, command `npm run build`, publish `build/client`, Node 22. Finish all local commits before pushing them together to trigger one deployment. On Netlify test direct opening and refreshing English/Spanish project URLs, an unknown slug, old category hashes, and social previews. Local preview does not establish production behavior.

Commit content, originals, scripts, and the lockfile. Generated `static/`, `src/generated/`, and `build/` are ignored/reproducible. Back up ignored `.migration/` separately; do not publish it.

## Source recovery tools

These commands are for recovery/import, not normal editing:

```sh
npm run content:export
npm run content:import
npm run assets:collect
npm run content:verify-import
npm run content:validate
```

Export/collection need network access. Export creates a timestamped snapshot; incomplete exports never become the latest complete one. Import skips existing project folders to protect editorial edits. Collection uses `.migration/asset-map.json` as a checksum-verified cache with atomic writes; rerun to resume.

`content:verify-import` checks exact source text, translations, links, captions, order, archive parity, and CSV checksums. Intentional editorial rewriting subsequently differs from the source; use normal schema/build validation for ongoing edits. Newly authored projects outside the snapshot are excluded from comparison.

The completed import passes without `--allow-remote-assets`; that flag is for initial migration recovery only. Seven current warnings identify three original placeholder links and four missing localized media descriptions; see [MIGRATION.md](MIGRATION.md).
