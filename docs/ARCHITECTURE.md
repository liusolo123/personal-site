# Architecture

## Runtime Model

The site has no build system, package manifest, or server-side runtime. Browsers load HTML, CSS, and plain JavaScript directly. JSON data is fetched at runtime, so opening HTML with `file://` is not supported reliably; use an HTTP server.

## Page Flow

`index.html` uses the accepted wallpaper design and loads `css/reset.css`, `css/demo-wallpaper.css`, and the deferred `js/demo-wallpaper.js`. The shared wallpaper script owns background selection, project rendering, photo filters, the native dialog viewer, and entrance reveals. `demo-wallpaper.html` remains a preview using the same assets.

`project.html` has its own inline detail renderer and reads the same projects dataset. Website-case navigation returns to the production homepage. Legacy project pages retain their shared layout and navigation assets.

## Data and Assets

- `data/projects.json`: array of project objects with `id`, `title`, `description`, and `tags`. Optional `published: false` hides an entry from the main-home and wallpaper-Demo catalogs. Optional `cover` and `detailUrl` provide authentic cover media and a case destination.
- `project.html` mounts its `website-case-template` for the `personal-site` project. Case styling is scoped through `body.site-case` in `css/project-case.css`.
- `data/photos.json`: array of photo metadata with paths to `photos/thumbnails/` and `photos/full/`.
- `scripts/build-photos.py`: writes those photo outputs from the configured source directory.

## Constraints

Browser globals are intentional in the existing codebase. Keep script ordering valid and avoid adding dependencies unless an implementation requirement makes them necessary.
