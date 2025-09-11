---
layout: page
title: DxO Labs
permalink: /dxo/
section_page: true
section: dxo
description: LLM apps and GenAI transformation at DxO Labs — training, RAG systems, dubbing and localization tooling, and production integration.
---

<div class="article-list">
{% assign items = site.articles | where: 'section', 'dxo' | sort: 'date' | reverse %}
{% for post in items limit: 6 %}
  <div class="article-item">
    <div class="title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></div>
    <div class="meta">
      {% if post.date %}{{ post.date | date: '%B %-d, %Y' }}{% endif %}
      {% if post.category %} · {{ post.category }}{% endif %}
    </div>
    <div class="excerpt">{{ post.excerpt | strip_html | truncate: 200 }}</div>
  </div>
{% endfor %}
</div>
