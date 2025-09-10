# Jekyll Migration & Redesign — Action Plan

## Phase 0 — Ground Rules
- Preview: use `bundle exec jekyll serve` (python http server won’t render Liquid).
- Authoring: Markdown + front matter; images/audio in `assets/`.
- Keep current URLs; add redirects only if needed.

## Phase 1 — Foundations (Markdown Rendering)
- Configure Jekyll: `_config.yml` with `kramdown` (GFM), collections.
- Layouts: `default`, `page`, `article` (Markdown content slots in; shared header/footer).
- Includes: `audio.html` to render per-page audio from front matter; shared `nav.html`.
- Minimal change to existing HTML pages; convert gradually.

## Phase 2 — Content Model & Structure
- Collections:
  - `articles` → `/articles/:slug/` for blog posts.
  - `projects` → `/projects/:slug/` (new) for ongoing work.
- Pages:
  - `_pages/kayrros.md`, `_pages/phd.md`, `_pages/dxo.md`, `_pages/projects.md`.
- Front matter: `title`, `description`, `background_image`, `audio`, `audio_*` flags.

## Phase 3 — Navigation & IA
- Centralize nav in `_data/nav.yml`; render via include.
- Blog index: list `site.articles` (date desc).
- Breadcrumbs on deep pages; clear “Current role” badge (DxO).

## Phase 4 — UI/Design (Modern + Elegant)
- Typography scale with `clamp()`, 70–75ch max width, generous spacing.
- Bento hero on home: three cards (Kayrros, PhD, DxO) + status badge.
- Section transitions: themed images (forest/satellite/camera) and optional ambient audio.
- Code highlighting theme; accessible focus states; light/dark via CSS vars.

## Phase 5 — SEO & Social
- Meta per page: `title`, `description`, canonical; `jekyll-seo-tag`.
- Open Graph/Twitter cards; default social image.
- `jekyll-sitemap`, `jekyll-feed`, `robots.txt`.
- Structured data (BlogPosting) on articles.

## Phase 6 — Migration & QA
- Convert 1–2 pages + one article to Markdown; check build.
- Accessibility pass (headings, contrast, focus, alt text).
- Performance: lazy images, size budgets for assets.

## Phase 7 — Enhancements
- Optional: Projects filters/tags, MDX-like shortcodes via includes, image gallery.
