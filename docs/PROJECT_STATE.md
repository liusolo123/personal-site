# Project State

## Completed

- Static home page, responsive exhibition navigation, project list/detail route, and photography lightbox are implemented.
- Content datasets currently contain 4 projects and 36 photos (38 friend-category photos removed from the repo, backed up outside it).
- Shared collaboration documents were established in this task.
- Independent dual-exhibition demo visual/data foundation accepted (`5942dd6`): equal project/photo previews, JSON-backed content, subtle static grain, and four chapter background colors. Receipt: `tasks/done/2026-11-04-demo-visual.md`.
- Full-viewport wallpaper demo accepted (`6411c8f`), including fixed cover background, 0.55 scrim, load-based image rotation, fallback, and equal project/photo entrances. Receipt: `tasks/done/2026-11-04-wallpaper-demo.md`.

## Current Work

Wallpaper demo is ready for user visual review at `http://127.0.0.1:4174/demo-wallpaper.html` when the local server is running. The proposed next task is `tasks/2026-11-04-wallpaper-interaction.md`, awaiting the user's execution decision. The previous interaction card is deferred, with uncommitted changes in `demo.html`, `css/demo.css`, and `js/demo.js` and an incomplete receipt. Those files provide implementation reference for the new card.

GitHub launch (docs/GIT_PUSH.md) is complete: clean single-commit history on `main`, pushed to `liusolo123/personal-site` via SSH, GitHub Pages was enabled. Strategy has since changed — the site's primary host returns to the Aliyun server (liusolo.top, domain already ICP-registered and pointing there); GitHub repo becomes version control/backup plus deploy trigger. Full plan documented in `docs/DEPLOY_WORKFLOW.md` (bare repo + post-receive hook, old-site tar backup then replace, Pages to be disabled). Plan only — no server-side operations executed yet.

## Known Issues

- Project detail pages contain an intentional placeholder instead of per-project long-form content.
- The portrait area is a placeholder.
- README and page footer reference GitHub Pages; the static implementation itself is host-agnostic.
- Wallpaper demo's no-JS photography fallback targets `index.html#photography`; the existing home section is `#gallery`. Correction is included in the next interaction card.

## Verification

Wallpaper verification passed. Planner reviewed source and desktop/mobile screenshots, repeated JS syntax/diff checks, equal preview/no-overflow measurements at 1440/390px, 0.55 scrim, image cycle 0→1→2→0, failed-image fallback, fixed background during scrolling, representative project entry, and reduced-motion with zero animations. Full evidence is in the archived receipt.

From the repository root:

```bash
node -e "for (const p of ['data/projects.json','data/photos.json']) { const data=require('./'+p); if (!Array.isArray(data)) throw new Error(p+' must be an array'); console.log(p+': '+data.length+' records'); }"
python -m http.server 8080
```

Open `http://localhost:8080/` and `http://localhost:8080/project.html?id=todo-calendar` while the server is running.

## Next Step

User reviews wallpaper appearance, then decides whether to execute `tasks/2026-11-04-wallpaper-interaction.md` for fallback-link correction and photo interactions. Production integration/deployment is a later decision.
