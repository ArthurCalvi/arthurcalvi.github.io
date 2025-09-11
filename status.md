# Site Status & Next Steps

This file tracks what’s done and what’s next for the site redesign + Jekyll migration.

## Done
- Jekyll foundations: `_config.yml` with `kramdown` (GFM), collections for `articles` and `projects`.
- Layouts: `default`, `page`, `article` with shared nav/footer and MathJax opt‑in.
- Includes: `nav.html`, `audio.html`, and `figure.html` (captioned image with variants).
- PhD article migrated to Markdown with math + audio, permalink preserved (`/phd.html`).
- Warm minimal design: off‑white palette, Apple‑inspired typography, accessible focus.
- Top nav: centered, frosted blur with sticky behavior.
- Section pages (Kayrros/PhD/DxO/Projects/Blog): gradient headers + clean article lists.
- Article pages: gradient section header; flat content (no card); section‑colored headings.
- Home: centered hero with personal intro; Latest Articles list; contact integrated in hero.
- Image sizing: fixed natural width for article images; utilities for transparent assets (`.on-plate`, `.float-shadow`, `.rounded-lg`).
- GitHub Pages build fix: restored front‑matter fence on `index.html`; corrected Liquid include syntax.

## In Progress / Review
- Convert remaining legacy HTML pages to Jekyll pages or articles; de‑duplicate routes.
- Fine‑tune spacing and measures (hero vs. welcome vs. latest) now that home is centered.

## Next (To Do)
- Comparison slider include: add a reusable `{% raw %}{% include comparison-slider.html %}{% endraw %}`
  - Front matter control (per article):
    ```yaml
    comparison:
      enable: true
      zoom_first: true          # default: true
      sat_image: assets/images/img-cmp-kenya-zoom-sat.png
      model_image: assets/images/img-cmp-kenya-zoom-model.png
      caption: "Mount Kenya — raw vs. classification"
    ```
  - Include renders the necessary script/style for `img-comparison-slider` and the chosen pair.
- Image lazy‑loading: add `loading="lazy"` to images in `figure.html` and lists.
- SEO: add `jekyll-seo-tag`, sitemap/feed, and default social image.
- Performance: audit image sizes; compress large assets; defer non‑critical scripts.
- Accessibility: add skip link, refine color contrast checks, ensure heading order on all pages.
- Projects collection: add example project pages using `layout: page`.

## Notes
- Local preview: use `bundle exec jekyll serve` to render Liquid; or `bundle exec jekyll build` and serve `_site/`.
- Authoring: images/audio in `assets/`; avoid spaces in filenames; use meaningful `alt` text.
