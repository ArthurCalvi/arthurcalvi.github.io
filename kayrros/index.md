---
layout: page
title: Kayrros
permalink: /kayrros/
section_page: true
section: kayrros
description: Work and notes from my time at Kayrros — satellite analytics, change detection, and product‑driven remote sensing.
---

<div class="article-list">
{% assign items = site.articles | where: 'section', 'kayrros' | sort: 'date' | reverse %}
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
