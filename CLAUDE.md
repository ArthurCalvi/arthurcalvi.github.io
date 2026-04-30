# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What This Is

Personal website and public notebook for Arthur Calvi.

The current stack is intentionally simple: Jekyll, Markdown, plain HTML/CSS, and GitHub Pages. Do not reintroduce Next.js, React, Tailwind, Vercel, analytics, or client-side build tooling unless Arthur explicitly asks for that migration.

## Build And Local Development

```bash
bundle install
bundle exec jekyll serve
```

On this Mac, prefer Homebrew Ruby:

```bash
PATH="/opt/homebrew/opt/ruby/bin:$PATH" bundle install
PATH="/opt/homebrew/opt/ruby/bin:$PATH" bundle exec jekyll serve
```

If local Ruby is broken, rely on the GitHub Pages workflow in `.github/workflows/pages.yml`; it builds with Ruby 3.2.

## Content Model

- `_reflections/`: short public-safe feed posts, usually AI-assisted from private working context.
- `_articles/`: long-form archived work and essays.
- Article and reflection front matter should include `description`: one precise sentence used as the subtitle under the title and as the listing excerpt.
- `index.html`: home page.
- `feed.html`: public notebook index.
- `blog.html`: archive for selected work and long-form writing.
- `assets/`: CSS, images, and audio.

## Public-Safety Rule

Before adding a feed post generated from private notes or automation, remove:

- Confidential roadmap or strategy details.
- Customer, employee, or meeting details that do not belong in public.
- DxO NDA-sensitive implementation details.
- Private repository paths, issue IDs, internal logs, and operational secrets.

Prefer abstracted lessons, public work identity, and durable operating principles.

## Feed Voice

Feed posts can be drafted by Arthur's AI assistant from daily work, but they must read as Arthur's reviewed outside voice rather than as a raw log. Prefer reflections about systems, philosophy, and technical or engineering practice. Abstract from private context into public lessons.

## Style

- Keep the site quiet, readable, and editorial.
- Prefer static HTML/CSS and Markdown over components.
- Use 2-space indentation.
- Keep new asset filenames lowercase-kebab-case and ASCII.
- Use descriptive alt text.
- Preserve legacy URLs when possible.
