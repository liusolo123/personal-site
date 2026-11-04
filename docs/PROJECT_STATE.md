# Project State

## Completed

- Static home page, responsive exhibition navigation, project list/detail route, and photography lightbox are implemented.
- Content datasets currently contain 4 projects and 36 photos (38 friend-category photos removed from the repo, backed up outside it).
- Shared collaboration documents were established in this task.
- Independent dual-exhibition demo visual/data foundation accepted (`5942dd6`): equal project/photo previews, JSON-backed content, subtle static grain, and four chapter background colors. Receipt: `tasks/done/2026-11-04-demo-visual.md`.
- Full-viewport wallpaper demo accepted (`6411c8f`), including fixed cover background, 0.55 scrim, load-based image rotation, fallback, and equal project/photo entrances. Receipt: `tasks/done/2026-11-04-wallpaper-demo.md`.
- Wallpaper photo interactions accepted (`3bcda42`), including category counts/empty states, native dialog, keyboard/focus/scroll handling, mobile layout, and corrected fallback links. Receipt: `tasks/done/2026-11-04-wallpaper-interaction.md`.

## Current Work

Wallpaper demo background and photo interactions have passed planner review. Current preview is `http://127.0.0.1:4174/demo-wallpaper.html?review=3bcda42` when the local server is running. The user requested discussion of the next plan before any new task card is created. Discussion priorities are project covers/detail content, photography selection/metadata, and visual finalization before production integration.

The previous interaction card is deferred, with uncommitted changes in `demo.html`, `css/demo.css`, and `js/demo.js` and an incomplete receipt. Its functionality has been carried into the accepted wallpaper version. These older changes still need a separate disposition before production integration.

GitHub launch (docs/GIT_PUSH.md) is complete: clean single-commit history on `main`, pushed to `liusolo123/personal-site` via SSH, GitHub Pages was enabled. Strategy has since changed — the site's primary host returns to the Aliyun server (liusolo.top, domain already ICP-registered and pointing there); GitHub repo becomes version control/backup plus deploy trigger. Full plan documented in `docs/DEPLOY_WORKFLOW.md` (bare repo + post-receive hook, old-site tar backup then replace, Pages to be disabled). Plan only — no server-side operations executed yet.

## Known Issues

- Project detail pages contain an intentional placeholder instead of per-project long-form content.
- The portrait area is a placeholder.
- README and page footer reference GitHub Pages; the static implementation itself is host-agnostic.

## Verification

Wallpaper background checks remain valid from the prior card. Interaction review passed with repeated JS/diff checks, 36-photo category/empty/single-item cases, arrow wrap, Enter/Space/Tab/Escape, focus and scroll restoration, 390px viewer fit, corrected fallback targets, reduced-motion and representative project entry. Source and screenshot evidence is in the archived receipts.

From the repository root:

```bash
node -e "for (const p of ['data/projects.json','data/photos.json']) { const data=require('./'+p); if (!Array.isArray(data)) throw new Error(p+' must be an array'); console.log(p+': '+data.length+' records'); }"
python -m http.server 8080
```

Open `http://localhost:8080/` and `http://localhost:8080/project.html?id=todo-calendar` while the server is running.

## Next Step

Discuss the next priority with the user. Recommended first step is to replace project cover stand-ins with authentic visuals and complete project-detail content. Create execution cards only after that discussion is confirmed. Photography curation and production integration follow as separately confirmed work.
