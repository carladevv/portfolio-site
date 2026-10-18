# Portfolio implementation plan

Status: local implementation and production build complete. Migration, generated-page checks, and desktop/mobile browser checks pass. Netlify build settings are configured; production behavior remains to be verified after deployment.

The application is in `my-portfolio/`. See [CONTENT-WORKFLOW.md](my-portfolio/docs/CONTENT-WORKFLOW.md) for editing instructions and [MIGRATION.md](my-portfolio/docs/MIGRATION.md) for source reconciliation.

## 1. Purpose and professional context

The portfolio owns its content and images, gives each main project a shareable full page, and distinguishes substantial projects from smaller collaborations. It serves employers, potential freelance collaborators, and colleagues.

- Carla is a long-term contractor. Keep the professional introduction focused on her work, without job-seeking or general availability wording.
- Invite small contributions compatible with ongoing work only in Collaborations, especially in heritage, science, archaeology, and activism.
- Preserve existing LinkedIn, GitHub, and YouTube links in both headers. Reuse LinkedIn for the invitation; no new contact system is needed.
- Professional history and the CV remain outside the portfolio. There is no CV tab or PDF download.
- The current robotics platform is unpublished and remains outside the site. Do not name it, show screenshots, or add a public case study.
- Existing projects were made in small teams. Describe Carla's contribution and credit collaborators accurately. Some imported descriptions say “solo project”; preserve the source until Carla resolves those specific discrepancies rather than guessing replacements.
- Updates happen every few months. Editing files and rebuilding is the intended workflow; no database, running content API, or browser editor is needed.

## 2. What to feature

Choose main projects by the significance of Carla's contribution, relevance, and evidence available. Personal, freelance, startup, and company work can all qualify when the material can be shared publicly. Employment arrangement is context, not an exclusion rule.

| Placement | Purpose |
| --- | --- |
| Main projects | Substantial work with a problem, contribution, decisions, and outcomes worth explaining. |
| Collaborations | Focused contributions useful to mention without a full case study. Duration alone does not decide placement. |
| Existing LinkedIn link | External professional background and CV context. |

Use a concise overview first and technical depth below. Explain individual responsibility within the team; do not invent results or metrics. **COVA BONICA VIRTUAL TOUR is the main featured project and appears first**, using `featured: true` before priority, date, and the stable slug tie-breaker. Its bilingual description draws on the supplied scientific conference article, crediting the research team and distinguishing web development from the wider digitization work. Its existing `archaeological-virtual-tour` URL stays stable.

Write project descriptions directly for visitors: state what the application does rather than framing details as claims from a paper. Mention the article/poster in the conference section only. Cova Bonica loads quickly on mobile; do not describe mobile performance as a limitation or an area needing improvement.

## 3. Local architecture

React 19, Vite 7, Tailwind CSS, and React Router framework integration generate static HTML. No application server is required in production. Markdown provides rich descriptions with raw HTML disabled.

```text
my-portfolio/
  content/
    site.json                  # Canonical origin and existing LinkedIn
    site-assets.json           # Selected profile/background/decorative originals
    collaborations.json        # Bilingual intro and collaboration entries
    projects/<slug>/
      project.json             # Metadata, card summary, media, links
      en.md                    # English full description
      es.md                    # Spanish full description
  assets/originals/             # Downloaded and newly supplied originals
  public/                      # Retained local originals; NOT Vite's public directory
  static/media/                # Generated responsive images; ignored
  src/generated/               # Generated content/image manifests; ignored
  .migration/                  # Private snapshots/archive; ignored; back up separately
  build/client/                # Complete static deployment output
```

Metadata includes stable IDs/slugs, visibility, categories, technologies, priority, optional date, localized title/summary/role/client/links, and ordered media with localized alt text/captions. Related slugs connect Navarra and GLB Checker. GLB Checker's `status: "stub"` displays the case-study-in-progress note; Navarra has a full description and supplied images.

Card summaries and Markdown bodies are separate. Existing full descriptions initially preserve the supplied text verbatim and can now be expanded independently. Both languages are required. Hidden projects and retired Journey/reading-list content are excluded from public imports, routes, metadata, and bundles.

## 4. Source migration

All nine tabs are preserved in snapshot `2026-10-18T20-20-23-053Z`: 16 projects, 32 translations, 24 links, 53 media entries, 102 media translations, 6 Journey entries with 12 translations, and 6 reading-list entries with 12 translations.

The public main collection contains 11 projects, including Navarra and GLB Checker. CAD rendering pipeline, Three.js shaders, and Blender Scripts and Tools are retired; NPCstar is retired until Carla creates a project to showcase it. GRQ's website is represented in Collaborations instead. Their project files are retained with `visibility: "off"`, excluding them from cards, generated project pages, and the sitemap. The two originally hidden projects remain privately archived. All 82 original migration references are collected; local originals are reused and downloads deduplicated by checksum.

Normal builds/page loads use no Google Sheets content or remotely hosted project images. Export/import tools remain for recovery, with CSV parsing confined to development dependencies. `src/data/cards.json` remains a legacy reconciliation source only.

The initial import was verified against the source descriptions, translations, links, media ordering, and archive. Cova Bonica now has an editorially revised title and descriptions based on the supplied DOCX; exact source comparison is expected to report those intentional differences. The importer skips existing folders to protect edits. Snapshots and hidden content are ignored by Git: keep a separate backup.

## 5. Image and media loading

- Sharp generates AVIF/WebP with JPEG or PNG fallbacks, preserving transparency/orientation. Widths are 160, 320, 640, 960, 1440, and 1920 where useful, without upscaling. Profile/background variants have smaller caps.
- Content hashes version generated paths. Processing is cached between builds; hashed files support immutable caching.
- Shared `picture` rendering supplies `srcset`, `sizes`, dimensions, asynchronous decoding, translated alt text, and lazy loading. The primary project image loads eagerly with high priority.
- Galleries use small thumbnails and an accessible enlargement dialog. Inline Markdown images use the same pipeline.
- Animated demonstrations use still posters and explicit WebP playback controls. Tiny pixel-art decorations retain their style and disappear with reduced-motion preferences.
- YouTube posters are local; external playback starts only on activation. Full video self-hosting is outside this implementation. Existing Google Fonts remain external.
- Only selected generated assets deploy; originals and migration archives are excluded.

The 49 prepared assets total 32,523,608 original bytes. Representative 640px WebP variants (or smaller originals/decorations) total 2,141,195 bytes, about 93.4% less. This compares asset files, not page transfers or performance scores. Browser checks verify AVIF selection, mobile widths, dimensions, and decoding. A comparable old-site browser performance baseline was not captured.

## 6. Project URLs and navigation

- Project paths are `/en/projects/<slug>/` and `/es/projects/<slug>/`. The unprefixed root is an English entry point; `/en/` is its canonical collection URL.
- Titles and Read more are ordinary links, independent of external actions and gallery controls.
- Pages contain title, summary, role/context, confirmed technologies, media, Markdown, related projects where supplied, and return navigation preserving the originating category during in-app navigation.
- Static HTML includes title/description/canonical/language-alternate/social metadata. Local fallback-format images supply social previews where available.
- The build generates 22 project pages across both languages and a sitemap with 26 canonical collection/collaboration/project URLs.
- Old query/hash category links remain supported; Journey links open the default collection with the introduction and LinkedIn.
- Filters apply after hydration because static HTML cannot depend on an incoming hash/query. Without JavaScript, collections show All projects; full project descriptions remain readable.
- Local preview verifies direct requests/reloads and real HTTP 404 responses. Production host checks remain required.

All projects is the initial deduplicated view. Graphics, Accessibility, Tooling, Archaeology, and Science remain. Mobile/tablet categories use a compact dropdown defaulting to All projects, with Collaborations as a separate tab. Desktop categories stay visible. The current default pink theme is the only exposed theme: no theme selector. Alternative theme definitions remain dormant for possible future work. English/Spanish, text-size controls, and existing social destinations are preserved. Footer cats retain their original proportions at 32px tall.

## 7. Collaborations

Horizontal cards stack on mobile and show title, short description, optional status, confirmed technology chips, and a website button. Unknown stacks remain empty and are omitted publicly. Missing website URLs display a disabled localized “Coming soon” button. Detail pages are not needed. Order: GRQ–SERP, CALADONA, Proyecto TUY.

English introduction, with equivalent Spanish copy:

> Alongside my ongoing work, I welcome small collaborations in heritage, science, archaeology, and activism. If you have a project that could benefit from my skills, get in touch—I'd be happy to explore a contribution that fits around my existing commitments.

“Get in touch” reuses `https://www.linkedin.com/in/nadina-carla-cardillo-garreta`. The invitation does not imply full-time availability or unpaid work.

### Grup de Recerca del Quaternari (GRQ–SERP)

Place this longstanding collaboration with the University of Barcelona's research group first. Describe Carla's web-development contribution to sharing the group's archaeological research, including its website. Stack: React. Website: https://grq.cat/. The former standalone GRQ website project is unpublished.

### CALADONA

> I updated the content of this Barcelona women's center's existing 360° virtual tour and added functionality to extend the experience.

Website: https://visitavirtual.caladona.org/. Confirm public spelling, tour technology, and features added. Do not imply authorship of the original tour.

### Proyecto TUY

> I contributed to the visual design of Proyecto TUY, a website sharing information about trans rights in Uruguay. The project is currently under construction.

Status: In development. Confirm stack and any public link; do not imply ownership of the entire design or implementation.

## 8. Navarra main project

Title: **Virtual reconstruction of three historical sites in Navarra**. Slug: `navarra-historical-sites`. Categories: Archaeology, Graphics, Tooling.

> I wrote custom scripts to optimize the team's 3D scenes for the web and contributed static figures and props through a workflow combining historical references, AI generation, and manual modeling and retouching.

Link to the supplied project website: https://navarra.arsoft-cloud.es/. The final-scene gallery starts with the four supplied WhatsApp images, with the unnumbered wide shot of the woman and dog first as the cover and social preview. The full Castillo de Zalatambor view supplied as `descarga (8).png` goes last; credit its reconstruction to the team and Carla's contribution to that scene specifically as asset optimization for web use. Preserve the originals in `assets/originals/navarra/` and generate responsive variants through the existing pipeline.

Lead the case study with scene-optimization scripts and the final static-figure process: gather historical references, combine selected details into AI-generated painting-style images, generate 3D models from those images using Tripo AI, then retouch manually. Props combine that process with manual modeling. Credit the surrounding scenes to the team.

Write the opening sections and gallery captions as a self-contained account of the work, without anticipating alternative approaches through phrases such as “final figures” or “rather than for animation.” Then introduce an earlier animated-character approach. The `Personaje01`/`Personaje02` textured and wireframe images appear inline in that section. These characters were generated from statue references, cleaned up and retextured manually, and animated. The client dropped animation for time constraints, and the statue-based style was too cartoon-like for the desired realism. Clearly identify these characters as unused.

Navarra's stack uses the existing labels: Blender, Python, Blender Python API, Adobe Photoshop, and Tripo AI. Terrain experimentation is excluded from this case study; Carla plans to showcase that technique in a separate project. Do not create that project until its content is supplied. Omit the GLB Checker narrative section and related-tool link from the Navarra page; the checker retains its own independent project.

GLB Checker remains independent subsequent work, distinct from the scripts used during Navarra. Briefly contextualize the project with the three sites supplied by Carla: Castillo de Zalatambor (Castillo Mayor) and the judería de Elgacena in Estella-Lizarra, and the Recinto Amurallado de Rada. Mention the interactive 3D visit, images, and stories without reproducing detailed site histories. Dates, team/client credits, and concrete optimization-script details remain to be supplied. The website's landing page was inspected successfully in the browser.

## 9. Independent GLB Checker project

Title: **GLB Checker**. Slug: `glb-checker`. Category: Tooling.

> A tool that diagnoses issues in GLB files and produces an actionable report. I built it after Proyecto Navarra to help teams identify and address asset problems before handing models over for integration.

Its bilingual case study keeps the timeline explicit: optimization scripts were used during Navarra; the checker was developed afterward. It has an independent card/page and a link back to Navarra.

Add actual supported checks, report examples, stack, date, screenshots/demo/source links, diagnostic limits, and substantiated results. Do not claim automatic repair, exhaustive detection, or use by the Navarra team during the project. It remains a text-only stub pending these details.

## 10. Ordered implementation stages

| Order | Stage | Status |
| --- | --- | --- |
| 1 | Source export, inventory, reconciliation | Complete |
| 2 | Local JSON/Markdown model and repeatable import | Complete |
| 3 | Saved originals and responsive media pipeline | Complete |
| 4 | Switch from Sheets to local content | Complete |
| 5 | Static bilingual full project pages | Complete locally; host verification pending |
| 6 | All projects and Collaborations | Complete |
| 7 | Navarra case study and independent GLB Checker stub | Navarra includes final images and unused experiments; GLB Checker awaits details |
| 8 | Integration, documentation, release preparation | Local checks complete; production release pending |

### Stage 1 — Recoverable sources

- [x] Inspect sources, assets, translations, and social links.
- [x] Export all nine tabs, preserve checksums, and inventory references.
- [x] Reconcile live data with legacy JSON; document discrepancies.

### Stage 2 — Local content

- [x] Import bilingual projects; archive hidden/retired content.
- [x] Separate card metadata from full Markdown.
- [x] Validate fields, slugs, categories, languages, and media.
- [x] Verify source parity and repeat-import safety.

### Stage 3 — Images

- [x] Collect all mapped assets and preserve source-to-local mapping.
- [x] Generate responsive formats, dimensions, manifests, and cacheable paths.
- [x] Implement shared loading for cards, pages, galleries, Markdown, and site imagery.
- [x] Add local posters, manual playback, and reduced-motion behavior.
- [x] Verify files and representative browser image selection; exclude originals/archives from deployment.

### Stage 4 — Local application data

- [x] Remove runtime Sheets loaders and spreadsheet loading/error states.
- [x] Preserve source content, translations, categories, themes, and header links.
- [x] Use consistently cased `ProjectCard.jsx` imports.
- [x] Confine CSV parsing to tooling; check deployed files for Sheets/remote-image references and hidden records.

### Stage 5 — Shareable pages

- [x] Generate bilingual project routes, Markdown, and metadata.
- [x] Link titles/Read more; preserve independent gallery/external controls.
- [x] Implement return navigation, legacy filters, static 404, sitemap, and language switching.
- [x] Verify direct local requests/reloads and full descriptions without JavaScript.
- [ ] Confirm production domain and host behavior for nested paths, route data, caching, and real 404 responses.

### Stage 6 — Collections

- [x] Make All projects the deduplicated default.
- [x] Replace visible Journey with bilingual Collaborations.
- [x] Add CALADONA/TUY, omit unknown stacks, and link the scoped invitation to existing LinkedIn.
- [x] Add distinct accents, selected state, visible focus, and responsive navigation.

### Stage 7 — New projects

- [x] Add independently linkable Navarra and GLB Checker pages in both languages.
- [x] Connect them while keeping the chronology explicit.
- [x] Show supplied Navarra images with clear final/experimental context; keep GLB Checker text-only until images are supplied.
- [x] Keep the unpublished robotics platform out of public content.

### Stage 8 — Verification and release

- [x] Pass production build, source verification, four focused tests, and generated-output checks.
- [x] Pass browser flows covering desktop/mobile navigation, both languages, the default theme, media interactions, reduced motion, responsive images, and project HTML without JavaScript.
- [x] Inspect representative screenshots and document editing.
- [x] Record editorial limitations and distinguish asset-size measurements from page performance.
- [ ] Resolve remaining source attribution discrepancies, placeholder links, and missing descriptions with Carla.
- [x] Configure Netlify to build from `my-portfolio/` and publish `build/client/` using Node 22.
- [ ] Verify the production origin matches `content/site.json`.
- [ ] Publish the reviewed build and verify direct URLs, refreshes, legacy links, headers, social previews, and unknown-page status on that host.

## 11. Remaining editorial/release items

The Cova Bonica case study names CRAC's XVIII Technical Meeting on Conservation-Restoration (CaixaForum Barcelona, 19–20 November 2026) and describes the contribution as a short article and poster. Its English/Spanish copy intentionally uses past tense.

- Expand imported full descriptions into detailed case studies as desired; the initial bodies preserve supplied text.
- Supply remaining Navarra script examples/credits and GLB images/details; confirm collaboration names/stacks/features.
- Review source “solo project” labels against small-team context and add accurate credits.
- Replace Sentence Stepper's Spanish LinkedIn placeholder and Blender tools links in both languages. Invalid actions are omitted publicly.
- Supply localized alt text/captions for two YouTube entries: Archaeological Virtual Tour and ARCHIVARIUM, both languages.
- Keep Cova Bonica first and Navarra second in All projects in both languages. Navarra's `allOrder: 2` affects only the combined collection; category ordering remains unchanged. Unknown dates/stacks stay omitted.
- Back up `.migration/` separately.
- Verify the Netlify deployment and production domain after the single release push.
