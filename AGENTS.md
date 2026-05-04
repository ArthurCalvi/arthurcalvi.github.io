# Repository Guidelines

## Project Structure & Organization
- Root pages: `index.html`, `feed.html`, `blog.html`, plus legacy redirect/section pages such as `work.html`, `kayrros.html`, `phd.html`, and `dxo.html`.
- Public notebook: `_reflections/` renders to `/feed/:name/`.
- Long-form articles: `_articles/` renders to `/articles/:name/`.
- Legacy article: `articles/quit-phd.html`.
- Assets: `assets/css/main.css`, `assets/images/`, `assets/audio/`.
- Navigation is centralized in `_includes/nav.html`; update links there and set `aria-current="page"` on the active section.

## Build, Test, and Local Development
- Full Jekyll preview: `bundle install && bundle exec jekyll serve`.
- On this Mac, prefer Homebrew Ruby: `PATH="/opt/homebrew/opt/ruby/bin:$PATH" bundle exec jekyll serve`.
- Static HTML preview only: `python3 -m http.server 4000`.
- GitHub Pages deploys through `.github/workflows/pages.yml` with Ruby 3.2.
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
- Public notebook posts must be public-safe: no DxO NDA-sensitive details, private issue IDs, internal meeting details, repo paths, logs, or names that do not belong in public.
- Feed posts can be drafted by Arthur's AI assistant from daily work, but they must read as Arthur-reviewed public notes from the collaboration, not as raw logs or generic ghostwriting.
- A strong feed post may use the assistant's point of view: what it observed in Arthur's working system, what seems strong or fragile, what operating habit could improve, and what concept names the pattern.
- Preferred feed themes: systems, philosophy, technical practice, engineering judgment, and product craft. Use references to philosophers, engineers, designers, or systems thinkers only when they clarify the mechanism. Abstract private context into public lessons instead of narrating internal work directly.
- Keep the feed to one reflection per date unless Arthur explicitly asks for more; merge or replace competing ideas from the same day.

## Authoring with Markdown
- Reflections: create `_reflections/yyyy-mm-dd-title.md` with front matter:
  ```yaml
  ---
  layout: article
  title: My Title
  description: One precise sentence under the title.
  date: 2026-04-30
  section: feed
  category: AI systems
  ai_assisted: true
  public_safety: reviewed draft
  ---
  ```
- Articles: create `_articles/my-title.md` with front matter:
  ```yaml
  ---
  title: My Title
  description: One precise sentence under the title.
  date: 2026-04-30
  section: research
  category: Research       # optional
  cover_image: /assets/images/cover.png
  audio: /assets/audio/my-narration.mp3  # optional
  audio_autoplay: false                  # optional
  math: false                            # optional
  ---
  ```
  Write Markdown below; images live in `assets/images/`.
- Blog index: `/blog.html` auto-lists `site.articles` (sorted by date).
- Standalone pages: add a `.md` at root with `---\nlayout: default\n title: Page Title\n---` and Markdown content; use subfolders to mirror URLs.

## Jekyll Workflow Notes
- Static preview via `python3 -m http.server` will not render Liquid; use `bundle exec jekyll serve` to preview Markdown and templates.
- Jekyll directories: `_layouts/`, `_includes/`, `_drafts/`, `_articles/`, `_reflections/`.
- Navigation is centralized in `_includes/nav.html`.
- Prefer lowercase-kebab-case and avoid spaces/accents in asset filenames for reliability.
- See `status.md` for the current status, roadmap, and TODOs.

### Build Notes (2025‑09‑12)
- If Liquid appears on the published site (for example, an "assign" tag shows literally), ensure the page has a valid YAML front‑matter fence (`---` at top) so GitHub Pages processes it with Jekyll.
- When documenting Liquid examples (like the `include` tag) in Markdown docs, avoid literal Liquid delimiters. Prefer descriptive text or fenced code blocks with the delimiters replaced by plain words.
