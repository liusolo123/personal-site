# Product Specification

## Purpose

A Chinese-language personal portfolio presenting mathematics, software projects, and photography with a curated-gallery aesthetic.

## User-Facing Pages

- `index.html` contains hero, profile, project, and photo-gallery sections.
- `project.html?id=<project-id>` shows a selected project from `data/projects.json`; missing or unknown IDs show an error state.

## Required Behavior

- Project cards and project-detail content load from `data/projects.json`.
- The gallery loads `data/photos.json`, filters the supported categories, hides the `朋友` category, and opens full images in a lightbox.
- Navigation supports section highlighting, responsive menu controls, overlay click, Escape, and resize handling.
- The site must work when served by an ordinary static HTTP server.

## Content Operations

- Edit projects in `data/projects.json`.
- Edit photo titles/categories in `data/photos.json` after asset generation.
- Regenerating photo assets requires `D:\lr\out` and Pillow; do not regenerate for unrelated changes.
