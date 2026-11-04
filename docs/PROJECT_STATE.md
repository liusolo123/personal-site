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

The user approved the website project sample and authorized direct production deployment on 2026-11-04. The wallpaper design is being promoted to `index.html`, with the complete website case at `project.html?id=personal-site`. Other project entries remain unpublished pending verification, as explicitly confirmed by the user.

The previous interaction card is deferred, with uncommitted changes in `demo.html`, `css/demo.css`, and `js/demo.js` and an incomplete receipt. Its functionality has been carried into the accepted wallpaper version. These older changes remain deferred.

Production uses the existing Aliyun host at `https://liusolo.top/`. The SSH channel and post-receive deployment hook were verified on 2026-11-04. The current server revision is `2234f63`. A verified backup is stored at `/root/backup/personal-site-before-wallpaper-20261104-202500.tar.gz`. Local checks passed for scripts, asset paths, project visibility and homepage/case navigation; the release is ready to push to the existing GitHub/Aliyun remotes.

## Known Issues

- Older unpublished project detail pages retain their legacy placeholders pending content verification.
- nginx retains a legacy SPA fallback that returns homepage HTML for missing paths. Deployment validation must verify media content types as well as HTTP status.

## Verification

Current sample checks passed. JS syntax, JSON/asset references and diff checks passed. Actual wallpaper-home navigation opens the website case. At 1440/768/390/320px, scrollWidth equals viewport width, all case headings use at most two lines, and all 3 case screenshots load. Main home shows 1 project and unknown project IDs still show the error state. Real captures total about 373 KB across 4 WebP files. Prior wallpaper/gallery interaction evidence remains in the archived receipts.

From the repository root:

```bash
node -e "for (const p of ['data/projects.json','data/photos.json']) { const data=require('./'+p); if (!Array.isArray(data)) throw new Error(p+' must be an array'); console.log(p+': '+data.length+' records'); }"
python -m http.server 8080
```

Open `http://localhost:8080/` and `http://localhost:8080/project.html?id=personal-site` while the server is running.

## Next Step

Complete the authorized deployment, verify the live homepage, project case, gallery and assets, then record the deployed revision and backup. Verify the remaining real projects before expanding the catalog. Photography curation follows as separately confirmed work.
