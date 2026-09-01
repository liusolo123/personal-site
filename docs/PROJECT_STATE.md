# Project State

## Completed

- Static home page, responsive exhibition navigation, project list/detail route, and photography lightbox are implemented.
- Content datasets currently contain 4 projects and 37 photos (38 friend-category photos removed from the repo, backed up outside it).
- Shared collaboration documents were established in this task.

## Current Work

`docs/GIT_PUSH.md` execution is in progress: repo hygiene (gitignore/gitattributes), friend-photo cleanup, and orphan single-commit history rebuild are done — branch `main`, root commit `fc445b8`, no remote yet, nothing pushed. Next in the doc: SSH key setup (§6), then first push (§7) and GitHub Pages (§8).

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
