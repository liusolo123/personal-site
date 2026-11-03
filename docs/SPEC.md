# Product Specification

## Purpose

A Chinese-language personal portfolio centered on two equally important collections: project work and photography, presented with a curated-gallery aesthetic. Mathematics is part of the owner's background and project content.

## Design Priorities

- Project work and photography are the site's two primary subjects and have equal prominence.
- The homepage must make both collections easy to discover; neither is a secondary feature of the other.
- Personal background supports the work rather than taking priority over either collection.

## Approved UI Demo Direction

- Build an independent `demo.html` preview using the existing static stack. The current home page remains the production entry while the demo is reviewed.
- Use the agreed dual-exhibition composition: equal project and photography entrances on desktop, equal headings/actions, substantial previews for both, followed by featured projects, photography, and supporting personal information. Mobile visitors can discover both entrances immediately.
- Enrich backgrounds with two layers: a subtle static paper/gallery-wall grain and full-width exhibition color fields. Use mist white `#F2F3EF` for the introduction, pale gray-green `#E5EBE6` for projects, deep ink green `#192521` for photography, then mist white for personal information/footer. Use `#1C2925` for dark text and restrained brass `#C5B58D` accents.
- Grain is low contrast (approximately 2–4% opacity), non-interactive, and static. It must not muddy text or photographs. Separate sections through tone and spacing, not decorative gradients, thick frames, or particle effects.
- The demo adds only these two background layers. Project and photo images remain content rather than large decorative page backgrounds. Existing project titles/descriptions and photography come from the current JSON datasets; typographic project covers may stand in until authentic product screenshots are supplied, without pretending to be screenshots.
- Motion is limited to short entrance/hover/viewer feedback, with usable static/reduced-motion states. Keep keyboard access, readable contrast, responsive layout, and current project-detail links.

## User-Facing Pages

- `index.html` contains hero, profile, project, and photo-gallery sections.
- `project.html?id=<project-id>` shows a selected project from `data/projects.json`; missing or unknown IDs show an error state.

## Required Behavior

- Project cards and project-detail content load from `data/projects.json`.
- The gallery loads `data/photos.json`, filters the supported categories, hides the `朋友` category, and opens full images in a lightbox.
- Navigation supports section highlighting, responsive menu controls, overlay click, Escape, and resize handling.
- The site must work when served by an ordinary static HTTP server.

## Content Operations

- Edit projects in `data/projects.json`.
- Edit photo titles/categories in `data/photos.json` after asset generation.
- Regenerating photo assets requires `D:\lr\out` and Pillow; do not regenerate for unrelated changes.
