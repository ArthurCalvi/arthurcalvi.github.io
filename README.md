# Arthur Calvi

Personal website and public notebook, hosted on GitHub Pages and rendered by Jekyll.

## Structure

```
├── index.html                 # Home
├── work.html                  # Anonymized case studies and engineering practice
├── about.html                 # Working principles and background
├── blog.html                  # Research, essays, and links to shorter notes
├── resume.html                # Compact, print-friendly résumé
├── feed.html                  # Arthur-reviewed AI collaborator field notes
├── _reflections/              # Short public-safe field notes
├── _articles/                 # Long-form Markdown articles
├── _layouts/, _includes/      # Templates and shared snippets
└── assets/                    # CSS, images, audio
```

## Local Preview

- Full Jekyll preview: `bundle install && bundle exec jekyll serve`
- Static HTML preview only: `python3 -m http.server 4000`

The static preview does not render Liquid or Markdown collections; use Jekyll for real checks.

On this Mac, prefer Homebrew Ruby instead of macOS system Ruby:

```bash
PATH="/opt/homebrew/opt/ruby/bin:$PATH" bundle install
PATH="/opt/homebrew/opt/ruby/bin:$PATH" bundle exec jekyll serve
```

## Add a Reflection

Create `_reflections/YYYY-MM-DD-slug.md`:

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

Reflections should be public-safe: no confidential roadmap, customer details, internal names, private meeting residue, or NDA-sensitive implementation detail.

Reflection voice: the feed can be drafted by Arthur's AI assistant from daily work, but it is Arthur-reviewed before publishing. Prefer systems, philosophy, and technical or engineering lessons; abstract away private context instead of narrating internal work directly.

## Add a Long-Form Article

Create `_articles/my-title.md`:

```yaml
---
layout: article
title: My Title
description: One precise sentence under the title.
date: 2026-04-30
section: research
category: Research
cover_image: /assets/images/cover.png
audio: /assets/audio/narration.mp3
audio_autoplay: false
math: false
---
```

Images live under `assets/images/`; audio files live under `assets/audio/`.

## Deployment

The GitHub Actions workflow in `.github/workflows/pages.yml` builds Jekyll with Ruby 3.2 and deploys `_site` to GitHub Pages.

## Notes

- Keep legacy URLs working: `kayrros.html`, `phd.html`, `dxo.html`, `/articles/quit-phd.html`.
- Avoid spaces or accents in new asset filenames.
- Prefer optimized display derivatives for large research images; target roughly 200 KB per image where legibility allows.
- Use descriptive alt text.
- Keep the site static unless a real interaction justifies more complexity.

## License

MIT
