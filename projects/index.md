---
layout: page
title: Projects
permalink: /projects/
section_page: true
section: projects
description: Ongoing and past projects that go deeper than a single post.
---

<div class="article-list">
{% assign items = site.projects | sort: 'date' | reverse %}
{% for proj in items %}
  <div class="article-item">
    <div class="title"><a href="{{ proj.url | relative_url }}">{{ proj.title }}</a></div>
    <div class="meta">
      {% if proj.date %}{{ proj.date | date: '%B %-d, %Y' }}{% endif %}
      {% if proj.tags %} · {{ proj.tags | join: ', ' }}{% endif %}
    </div>
    <div class="excerpt">{{ proj.excerpt | strip_html | truncate: 200 }}</div>
  </div>
{% endfor %}
</div>
