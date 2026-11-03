# Project State

## Completed

- Static home page, responsive exhibition navigation, project list/detail route, and photography lightbox are implemented.
- Content datasets currently contain 4 projects and 37 photos (38 friend-category photos removed from the repo, backed up outside it).
- Shared collaboration documents were established in this task.

## Current Work

UI proposal is being revised around the confirmed purpose: project work and photography have equal prominence. Homepage layout, palette, and motion remain under discussion; no website implementation changes have been made for this redesign.

GitHub launch (docs/GIT_PUSH.md) is complete: clean single-commit history on `main`, pushed to `liusolo123/personal-site` via SSH, GitHub Pages was enabled. Strategy has since changed — the site's primary host returns to the Aliyun server (liusolo.top, domain already ICP-registered and pointing there); GitHub repo becomes version control/backup plus deploy trigger. Full plan documented in `docs/DEPLOY_WORKFLOW.md` (bare repo + post-receive hook, old-site tar backup then replace, Pages to be disabled). Plan only — no server-side operations executed yet.

## Known Issues

- Project detail pages contain an intentional placeholder instead of per-project long-form content.
- The portrait area is a placeholder.
- README and page footer reference GitHub Pages; the static implementation itself is host-agnostic.

## Verification

From the repository root:

```bash
node -e "for (const p of ['data/projects.json','data/photos.json']) { const data=require('./'+p); if (!Array.isArray(data)) throw new Error(p+' must be an array'); console.log(p+': '+data.length+' records'); }"
python -m http.server 8080
```

Open `http://localhost:8080/` and `http://localhost:8080/project.html?id=todo-calendar` while the server is running.

## Next Step

Define the acceptance criteria for the next website feature card, then update this document with its scope and executed verification after implementation.
