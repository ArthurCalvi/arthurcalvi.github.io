# Portfolio Website (Jekyll)

This is my personal website hosted on GitHub Pages. Content is written in Markdown and rendered by Jekyll into a static site.

## Structure

```
├── index.html                 # Landing page (to be redesigned with bento hero)
├── blog.html                  # Blog index (auto-lists articles)
├── kayrros/index.md           # Listing page (Kayrros section)
├── phd/index.md               # Listing page (PhD section)
├── dxo/index.md               # Listing page (DxO section)
├── projects/index.md          # Listing page (Projects collection)
├── _articles/                 # Markdown articles (with front matter)
├── _projects/                 # Markdown projects (optional)
├── _layouts/, _includes/      # Templates and shared snippets
└── assets/                    # CSS, images, audio
```

## Local Preview

- Static server (HTML only): `python3 -m http.server 4000` (does not render Jekyll)
- Full preview (Markdown + templates):
  - `gem install jekyll bundler` (once)
  - `bundle init && bundle add jekyll`
  - `bundle exec jekyll serve`

## Add a New Page or Article

- Article (appears on Blog and a Section list):
  - Create `_articles/my-title.md` with front matter:
    ```yaml
    ---
    layout: article
    title: My Title
    date: 2025-03-20
    section: phd        # one of: phd, kayrros, dxo
    category: Research  # optional
    cover_image: assets/images/cover.png   # optional
    audio: assets/audio/my-audio.mp3       # optional
    ---
    ```
  - Write Markdown below. Images live under `assets/images/`.

- Project (listed under /projects/):
  - Create `_projects/my-project.md` with `layout: page`, `title`, `date`, optional `tags` and `cover_image`.

## Notes

- Keep `kayrros.html`, `phd.html`, and `/articles/quit-phd.html` URLs working; these are rendered via Markdown with preserved permalinks.
- Use descriptive alt text; avoid spaces/accents in new asset filenames when possible.

## License

MIT
