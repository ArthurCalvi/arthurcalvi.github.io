---
layout: page
title: PhD
permalink: /phd/
section_page: true
section: phd
description: Research on forest disturbances and phenology using satellite imagery and machine learning. Notes from my PhD journey, results, and ideas connecting time‑series, signal processing, and ecology.
---

<div class="article-list">
{% assign items = site.articles | where: 'section', 'phd' | sort: 'date' | reverse %}
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
