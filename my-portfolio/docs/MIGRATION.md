# Content migration report

Source snapshot: 2026-10-18T20:20:23.053Z. Raw CSVs, parsed rows, checksums, and reconciliation are in the ignored `.migration/2026-10-18T20-20-23-053Z/` directory. Back up this directory separately; it is not deployed or committed.

## Imported records

- cards: 16 rows
- content: 32 rows
- links: 24 rows
- media: 53 rows
- mediaI18n: 102 rows
- bioCards: 6 rows
- bioContent: 12 rows
- reads: 6 rows
- readsContent: 12 rows

14 published projects imported; 2 hidden projects preserved in the private migration archive. All Journey and reading-list records are archived.

## Content to review

- p3/es: unresolved link https://www.linkedin.com/…
- p6/en: unresolved link #blender-tools
- p6/es: unresolved link #blender-tools

Some spreadsheet entries explicitly say “solo project,” while the portfolio brief describes small-team work. Existing attribution is preserved during import; review those labels before changing ownership claims. No missing role/team details have been invented.

## Asset inventory

The export references 56 explicit image paths/URLs: 22 local references and 34 remote references. All 22 local references resolve. YouTube posters are additional assets collected from the existing video IDs. The original public directory contains 45 files (25,694,133 bytes); no byte-identical duplicates were found in that baseline.

The full reference list and comparison against the legacy JSON are in the snapshot's `reconciliation.json`. Matching by ID alone identifies 13 spreadsheet-only IDs and 3 legacy-only IDs; some old IDs may identify projects under different IDs in the sheet, so these counts are not an assertion of unique project differences. The existing legacy file is retained. All three shared IDs have localized text/attribution differences; the live export remains the import source.

The original import preserves the spreadsheet's descriptions, links, captions, and ordering. The legacy JSON is a comparison source, not an automatic replacement. Rerunning the importer skips existing project folders to preserve editorial changes. COVA BONICA VIRTUAL TOUR now has a revised bilingual title, summary, and full description based on the supplied `GomezMorgadoLaura_XVIIIReunioTecnica_CorregitV2.docx`; exact source comparison is expected to flag those intentional editorial differences. The source snapshot remains unchanged.

## Completed local implementation

All 82 references in `.migration/asset-map.json`, including YouTube posters and archived assets, have been collected and checksum-verified. Project metadata now uses local originals; validation reports 16 projects (14 imported plus Navarra and GLB Checker, including retired entries), 47 media entries, and zero remote image/poster references.

The image pipeline prepares 54 site/project assets, with responsive AVIF/WebP and JPEG/PNG fallbacks. Original bytes total 41,077,306; representative 640px WebP files (or smaller originals/decorations) total 2,296,315. This is an asset-size comparison, not measured page traffic. Original files and hidden/retired content are excluded from the deployment output.

Seven editorial warnings remain: the three placeholder links above and missing English/Spanish alt text/captions for the final YouTube entry of Archaeological Virtual Tour and ARCHIVARIUM. Placeholder actions are omitted publicly; media without descriptions uses a title-based fallback pending proper alt text.

Initial import source parity was verified before editorial changes. Production build, generated-page checks, four focused tests, and four browser flows cover the current site. The curated collection publishes 11 projects with English/Spanish HTML and metadata; five imported projects are retired, with GRQ represented in collaborations. Netlify build settings are committed in the root `netlify.toml`; production behavior must be checked after deployment. See `CONTENT-WORKFLOW.md` for editing and release instructions.
