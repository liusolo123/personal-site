# Product Specification

## Purpose

A Chinese-language personal portfolio centered on two equally important collections: project work and photography, presented with a curated-gallery aesthetic. Mathematics is part of the owner's background and project content.

## Design Priorities

- Project work and photography are the site's two primary subjects and have equal prominence.
- The homepage must make both collections easy to discover; neither is a secondary feature of the other.
- Personal background supports the work rather than taking priority over either collection.

## UI Demo Direction

- Build independent preview pages using the existing static stack. The current background iteration uses `demo-wallpaper.html` for review.
- Use the agreed dual-exhibition composition: equal project and photography entrances on desktop, equal headings/actions, substantial previews for both, followed by featured projects, photography, and supporting personal information. Mobile visitors can discover both entrances immediately.
- The current background reference is [dmego/home.github.io](https://github.com/dmego/home.github.io), as requested on 2026-11-04. Use a recognizable full-viewport photographic wallpaper, centered `cover` sizing, a dark overlay initially at 0.55, and light foreground content. Keep project work and photography equally prominent over this background.
- Prepare the reference-based preview as an independent `demo-wallpaper.html`. The accepted background brief and receipt are in `tasks/done/2026-11-04-wallpaper-demo.md`. The previous grain/chapter-color preview is an earlier iteration available for comparison.
- Match the reference's load-based wallpaper selection and gentle foreground entrance. Adapt the fixed background into a separate low stacking layer so the portfolio sections retain natural scrolling. Existing project titles/descriptions and photography continue to come from the current JSON datasets. Typographic covers are acceptable pending authentic project screenshots.
- Motion is limited to short entrance/hover/viewer feedback, with usable static/reduced-motion states. Keep keyboard access, readable contrast, responsive layout, and current project-detail links.

## User-Facing Pages

- `index.html` contains hero, profile, project, and photo-gallery sections.
- `project.html?id=<project-id>` shows a selected project from `data/projects.json`; missing or unknown IDs show an error state.
- `project.html?id=personal-site&view=case` presents the complete case study of this website, with authentic desktop/mobile screenshots, project purpose, current capabilities, implementation choices, ongoing status, Demo and source links. The website is the featured project in the wallpaper Demo.

## Required Behavior

- Project cards and project-detail content load from `data/projects.json`.
- Main-home and wallpaper-Demo catalogs include projects unless `published` is explicitly false. Optional `cover` supplies a real project screenshot and `detailUrl` supplies the case-study destination, with the existing ID-based route as the default.
- The gallery loads `data/photos.json`, filters the supported categories, hides the `朋友` category, and opens full images in a lightbox.
- Navigation supports section highlighting, responsive menu controls, overlay click, Escape, and resize handling.
- The site must work when served by an ordinary static HTTP server.

## Content Operations

- Edit projects in `data/projects.json`.
- The website is the user-confirmed representative project. The three older entries retain their data and have `published: false` while their current accuracy is reviewed.
- Website case-study content is in the `website-case-template` inside `project.html`, styled by `css/project-case.css`. Real UI captures are stored as WebP in `assets/projects/personal-site/` and should be refreshed when the displayed interface materially changes.
- Edit photo titles/categories in `data/photos.json` after asset generation.
- Regenerating photo assets requires `D:\lr\out` and Pillow; do not regenerate for unrelated changes.
