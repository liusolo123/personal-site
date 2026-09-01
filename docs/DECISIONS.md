# Decisions

## Static-First Delivery

The site remains framework-free HTML, CSS, and JavaScript. This keeps deployment compatible with ordinary static hosts and avoids an unnecessary build step.

## JSON as Content Source

Projects and photo metadata are stored in committed JSON files and fetched by the browser. Both the project listing and detail page use `data/projects.json` as the source of truth.

## Curated Visual System

The dark brown, muted gold, and paper palette is defined in `css/variables.css`. New UI work should reuse these tokens and retain the gallery/exhibition language.

## Image Pipeline

Optimized images and thumbnails are committed under `photos/`. The photo script is an explicit maintenance operation because it replaces generated outputs.
