# Repository Guide

## Scope

This repository is a framework-free static personal portfolio site. Keep changes small and preserve the existing museum-style visual language.

## Structure

- `index.html`: home page sections and script/style loading order.
- `project.html`: project detail view driven by `data/projects.json`.
- `css/`: reset, design tokens, shared layout, then page/feature styles.
- `js/`: browser-global modules; load dependency scripts before their consumers.
- `data/`: site content consumed with `fetch`; keep JSON valid.
- `photos/`: committed optimized images and thumbnails.
- `scripts/build-photos.py`: regenerates photo assets from `D:\lr\out` and requires Pillow.

## Working Rules

- Use relative URLs so the site works on any static host.
- Preserve Chinese copy and UTF-8 encoding.
- Escape data rendered with `innerHTML`; use `textContent` when possible.
- Do not run `build-photos.py` unless source photos are intentionally being regenerated: it overwrites `data/photos.json` and photo outputs.
- Do not introduce a bundler or framework without an explicit requirement.

## Verification

Run the JSON validation command in `docs/PROJECT_STATE.md`. For browser changes, start `python -m http.server 8080` at the repository root and inspect both `index.html` and `project.html?id=todo-calendar`.
