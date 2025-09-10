# Repository Guidelines

## Project Structure & Organization
- Root pages: `index.html`, `kayrros.html`, `phd.html`, `dxo.html`, `blog.html`.
- Articles (legacy): `articles/` (e.g., `articles/quit-phd.html`).
- Articles (Markdown, Jekyll): source in `_articles/` → built to `/articles/:name/`.
- Assets: `assets/css/main.css`, `assets/images/`, `assets/audio/`.
- Navigation: top nav exists on each page; update links consistently across pages and set `aria-current="page"` on the active link.

## Build, Test, and Local Development
- Serve locally from the repo root:
  - `python3 -m http.server 4000` → open `http://localhost:4000`.
- Jekyll build (to preview Markdown locally):
  - Install Ruby + Bundler; `gem install jekyll bundler` (once).
  - `bundle init && bundle add jekyll` (or use system Jekyll), then `bundle exec jekyll serve` and open the served URL.
- Quick link/asset scan (optional): `rg -n "(href|src)=\""`.
- Verify: load each page, click all nav links, images load, and styles from `assets/css/main.css` apply.

## Coding Style & Naming
- Indentation: 2 spaces for HTML/CSS; no tabs.
- Attributes: double quotes; lowercase tag, class, and id names.
- Filenames: lowercase-kebab-case; pages end with `.html` in root or `articles/`.
- Styles: prefer `assets/css/main.css`; limit page-specific `<style>` blocks to small overrides.
- Images: place under `assets/images/`; use descriptive names; always include meaningful `alt` text.

## Testing Guidelines
- Browser checks: desktop and mobile widths; confirm layout, spacing, and readability.
- Accessibility: verify heading order, link contrast, and `aria-current` on active nav.
- Validation (optional): HTML/CSS via IDE or online validators.
- Markdown articles: confirm each new `_articles/*.md` renders and appears in `/blog.html`.

## Commit & Pull Request Guidelines
- Commits: concise, imperative summaries; include scope when useful (e.g., `blog: add quitting-phd article`, `styles: adjust hero spacing`).
- PRs: description of changes, list affected pages, before/after screenshots, linked issues, and notes on local testing.

## Security & Content Tips
- Static site only—do not add secrets or tracking scripts.
- Use relative links; optimize images (target ≤200KB when possible).
- Ensure consistent nav across pages after additions/renames.

## Authoring with Markdown (Articles & Pages)
- Articles: create `_articles/my-title.md` with front matter:
  ```yaml
  ---
  title: My Title
  date: 2025-03-20
  category: Research
  audio: assets/audio/my-narration.mp3   # optional
  audio_autoplay: false                  # optional
  ---
  ```
  Write Markdown below; images live in `assets/images/`.
- Blog index: `/blog.html` auto-lists `site.articles` (sorted by date).
- Standalone pages: add a `.md` at root with `---\nlayout: default\n title: Page Title\n---` and Markdown content; use subfolders to mirror URLs.

## Jekyll Workflow Notes
- Static preview via `python3 -m http.server` will not render Liquid; use `bundle exec jekyll serve` to preview Markdown and templates.
- Jekyll directories: `_layouts/`, `_includes/`, `_drafts/`, `_articles/`. Planned: `_projects/` and `_pages/` for top-level Markdown pages.
- Navigation is centralized in `_includes/nav.html` and will be data-driven later.
- Prefer lowercase-kebab-case and avoid spaces/accents in asset filenames for reliability.
- See `ACTION_PLAN.md` for the migration roadmap and upcoming SEO/UI work.
