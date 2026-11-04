# Project State

## Completed

- Static home page, responsive exhibition navigation, project list/detail route, and photography lightbox are implemented.
- Content datasets contain 5 stored projects, with the website and autocheck as the 2 published entries and 3 older entries hidden pending verification, plus 36 photos.
- Shared collaboration documents were established in this task.
- Independent dual-exhibition demo visual/data foundation accepted (`5942dd6`): equal project/photo previews, JSON-backed content, subtle static grain, and four chapter background colors. Receipt: `tasks/done/2026-11-04-demo-visual.md`.
- Full-viewport wallpaper demo accepted (`6411c8f`), including fixed cover background, 0.55 scrim, load-based image rotation, fallback, and equal project/photo entrances. Receipt: `tasks/done/2026-11-04-wallpaper-demo.md`.
- Wallpaper photo interactions accepted (`3bcda42`), including category counts/empty states, native dialog, keyboard/focus/scroll handling, mobile layout, and corrected fallback links. Receipt: `tasks/done/2026-11-04-wallpaper-interaction.md`.
- Complete website project case study implemented directly at the user's request, including real UI screenshots, purpose/capabilities/implementation/design content, live Demo/source links, and a real cover featured on the wallpaper home page.
- The accepted wallpaper homepage and complete website case are live at `https://liusolo.top/` and `https://liusolo.top/project.html?id=personal-site` as of 2026-11-04. UI release `d8611ba` was pushed to both GitHub and the Aliyun deployment repository.
- Autocheck case implemented locally at `project.html?id=autocheck`, with a six-stage execution diagram, interface walkthrough, recovery decisions, GitHub/documentation links and three real frontend captures using synthetic data. Four WebP assets, including the cover, total about 120 KB.

## Current Work

The autocheck addition is implemented, locally verified and ready for release. The local homepage catalog lists the website followed by autocheck. The latest production release is the earlier website-only catalog at `d8611ba`.

The previous interaction card is deferred, with uncommitted changes in `demo.html`, `css/demo.css`, and `js/demo.js` and an incomplete receipt. Its functionality has been carried into the accepted wallpaper version. These older changes remain deferred.

Production uses the existing Aliyun host and post-receive hook. The pre-release backup is `/root/backup/personal-site-before-wallpaper-20261104-202500.tar.gz`, verified with `tar -tzf` and SHA-256. Both remote pushes succeeded and the hook deployed UI release `d8611ba`.

## Known Issues

- Older unpublished project detail pages retain their legacy placeholders pending content verification.
- nginx retains a legacy SPA fallback that returns homepage HTML for missing paths. Deployment validation must verify media content types as well as HTTP status.

## Verification

Autocheck local checks passed for inline JS syntax, JSON/asset/anchor references and diff whitespace. At 1440/768/390/320px, the new case has no horizontal overflow, headings use at most two lines, all 3 screenshots load and runtime error listeners report no errors. All four layouts were visually checked. Homepage checks passed at 1440/390/320px with 2 projects. Keyboard flow navigation, GitHub/source-document links and return navigation passed. The existing website case passed at 1440/390px with all 3 images loaded, and missing/unknown IDs (including `__proto__`) show the error state. Legacy project rendering also passed.

Production checks passed on 2026-11-04. All 84 checked pages/assets returned the expected HTTP status and MIME type, six core files matched local SHA-256, and HTTP redirected to HTTPS. Live browser checks passed for the homepage-to-case-to-home flow, 1 project/36 photos, city filtering to 3 photos, keyboard viewer navigation, Escape/focus restoration, and 1440px/390px layouts. Screenshots were visually checked at both widths. These results remain valid for the unchanged UI files.

From the repository root:

```bash
node -e "for (const p of ['data/projects.json','data/photos.json']) { const data=require('./'+p); if (!Array.isArray(data)) throw new Error(p+' must be an array'); console.log(p+': '+data.length+' records'); }"
python -m http.server 8080
```

Open `http://localhost:8080/` and `http://localhost:8080/project.html?id=personal-site` while the server is running.

## Next Step

Release the verified autocheck addition through the existing deployment workflow. Review the other projects, photography curation and older prototype changes as separate work.
