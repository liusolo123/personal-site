# Architecture

## Runtime Model

The site has no build system, package manifest, or server-side runtime. Browsers load HTML, CSS, and plain JavaScript directly. JSON data is fetched at runtime, so opening HTML with `file://` is not supported reliably; use an HTTP server.

## Page Flow

`index.html` loads CSS in this order: reset, variables, shared layout, then feature styles. Its scripts load `nav.js`, `card-tilt.js`, `lightbox.js`, `gallery.js`, then `main.js`.

`main.js` loads and renders project cards. `gallery.js` owns gallery data, filters, grid rendering, and lightbox handoff. `nav.js` owns navigation behavior. `project.html` has its own inline detail renderer and reads the same projects dataset.

## Data and Assets

- `data/projects.json`: array of project objects with `id`, `title`, `description`, and `tags`.
- `data/photos.json`: array of photo metadata with paths to `photos/thumbnails/` and `photos/full/`.
- `scripts/build-photos.py`: writes those photo outputs from the configured source directory.

## Constraints

Browser globals are intentional in the existing codebase. Keep script ordering valid and avoid adding dependencies unless an implementation requirement makes them necessary.
