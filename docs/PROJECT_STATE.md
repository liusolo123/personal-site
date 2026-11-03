# Project State

## Completed

- Static home page, responsive exhibition navigation, project list/detail route, and photography lightbox are implemented.
- Content datasets currently contain 4 projects and 36 photos (38 friend-category photos removed from the repo, backed up outside it).
- Shared collaboration documents were established in this task.
- Independent dual-exhibition demo visual/data foundation accepted (`5942dd6`): equal project/photo previews, JSON-backed content, subtle static grain, and four chapter background colors. Receipt: `tasks/done/2026-11-04-demo-visual.md`.

## Current Work

The local demo at `http://127.0.0.1:4174/demo.html` is in interaction/responsive completion under `tasks/2026-11-04-demo-interaction.md`. The approved visual foundation has passed planner review. Production home page is not being replaced; no deployment is part of this work.

GitHub launch (docs/GIT_PUSH.md) is complete: clean single-commit history on `main`, pushed to `liusolo123/personal-site` via SSH, GitHub Pages was enabled. Strategy has since changed — the site's primary host returns to the Aliyun server (liusolo.top, domain already ICP-registered and pointing there); GitHub repo becomes version control/backup plus deploy trigger. Full plan documented in `docs/DEPLOY_WORKFLOW.md` (bare repo + post-receive hook, old-site tar backup then replace, Pages to be disabled). Plan only — no server-side operations executed yet.

## Known Issues

- Project detail pages contain an intentional placeholder instead of per-project long-form content.
- The portrait area is a placeholder.
- README and page footer reference GitHub Pages; the static implementation itself is host-agnostic.

## Verification

Demo visual evidence: JS syntax and diff checks passed; planner rechecked HTTP 200, 1440px equal previews (`563×375.33px`), four background colors/grain opacity 0.04, valid project links, and 390px no overflow. Interaction and broader responsive checks are pending the second card.

From the repository root:

```bash
node -e "for (const p of ['data/projects.json','data/photos.json']) { const data=require('./'+p); if (!Array.isArray(data)) throw new Error(p+' must be an array'); console.log(p+': '+data.length+' records'); }"
python -m http.server 8080
```

Open `http://localhost:8080/` and `http://localhost:8080/project.html?id=todo-calendar` while the server is running.

## Next Step

Execute/review the demo interaction card and archive it after acceptance. Production deployment remains a separate pending task.
