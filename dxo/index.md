---
layout: page
title: DxO Labs
permalink: /dxo/
---

AI consulting and product work at DxO Labs — LLM training, RAG systems, and audio tooling. Articles and notes are listed below.

<div class="blog-articles">
{% assign items = site.articles | where: 'section', 'dxo' | sort: 'date' | reverse %}
{% for post in items %}
  <div class="article-preview">
    {% if post.cover_image %}
      <div class="article-figure" style="margin:0 0 1rem 0;">
        <img src="{{ post.cover_image | relative_url }}" alt="Cover for {{ post.title }}" />
      </div>
    {% endif %}
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <div class="article-meta">
      {% if post.date %}<span class="date">{{ post.date | date: '%B %-d, %Y' }}</span>{% endif %}
      {% if post.category %}<span class="category">{{ post.category }}</span>{% endif %}
    </div>
    <p>{{ post.excerpt | strip_html | truncate: 240 }}</p>
    <a class="read-more" href="{{ post.url | relative_url }}">Read More →</a>
  </div>
{% endfor %}
</div>

