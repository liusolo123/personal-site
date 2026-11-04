# Project State

## Completed

- Static home page, responsive exhibition navigation, project list/detail route, and photography lightbox are implemented.
- Content datasets contain 4 stored projects, with the website as the 1 published project and 3 older entries hidden pending verification, plus 36 photos.
- Shared collaboration documents were established in this task.
- Independent dual-exhibition demo visual/data foundation accepted (`5942dd6`): equal project/photo previews, JSON-backed content, subtle static grain, and four chapter background colors. Receipt: `tasks/done/2026-11-04-demo-visual.md`.
- Full-viewport wallpaper demo accepted (`6411c8f`), including fixed cover background, 0.55 scrim, load-based image rotation, fallback, and equal project/photo entrances. Receipt: `tasks/done/2026-11-04-wallpaper-demo.md`.
- Wallpaper photo interactions accepted (`3bcda42`), including category counts/empty states, native dialog, keyboard/focus/scroll handling, mobile layout, and corrected fallback links. Receipt: `tasks/done/2026-11-04-wallpaper-interaction.md`.
- Complete website project case study implemented directly at the user's request, including real UI screenshots, purpose/capabilities/implementation/design content, live Demo/source links, and a real cover featured on the wallpaper home page.

## Current Work

The website project sample is ready for user review at `http://127.0.0.1:4174/project.html?id=personal-site&view=case`, linked from `demo-wallpaper.html?view=site-case`. The user authorized direct implementation for this sample. Other project entries were hidden from current catalogs while retaining their data, pending user verification of their accuracy and visibility.

The previous interaction card is deferred, with uncommitted changes in `demo.html`, `css/demo.css`, and `js/demo.js` and an incomplete receipt. Its functionality has been carried into the accepted wallpaper version. These older changes still need a separate disposition before production integration.

GitHub launch (docs/GIT_PUSH.md) is complete: clean single-commit history on `main`, pushed to `liusolo123/personal-site` via SSH, GitHub Pages was enabled. Strategy has since changed — the site's primary host returns to the Aliyun server (liusolo.top, domain already ICP-registered and pointing there); GitHub repo becomes version control/backup plus deploy trigger. Full plan documented in `docs/DEPLOY_WORKFLOW.md` (bare repo + post-receive hook, old-site tar backup then replace, Pages to be disabled). Plan only — no server-side operations executed yet.

## Known Issues

- Older unpublished project detail pages retain their legacy placeholders pending content verification.
- The portrait area is a placeholder.
- README and page footer reference GitHub Pages; the static implementation itself is host-agnostic.

## Verification

Current sample checks passed. JS syntax, JSON/asset references and diff checks passed. Actual wallpaper-home navigation opens the website case. At 1440/768/390/320px, scrollWidth equals viewport width, all case headings use at most two lines, and all 3 case screenshots load. Main home shows 1 project and unknown project IDs still show the error state. Real captures total about 373 KB across 4 WebP files. Prior wallpaper/gallery interaction evidence remains in the archived receipts.

From the repository root:

```bash
node -e "for (const p of ['data/projects.json','data/photos.json']) { const data=require('./'+p); if (!Array.isArray(data)) throw new Error(p+' must be an array'); console.log(p+': '+data.length+' records'); }"
python -m http.server 8080
```

Open `http://localhost:8080/` and `http://localhost:8080/project.html?id=todo-calendar` while the server is running.

## Next Step

Review the website case copy, layout, screenshots and current project visibility with the user. Verify the remaining real projects before expanding the catalog. Photography curation and production integration follow as separately confirmed work.
