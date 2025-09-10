---
layout: page
title: Projects
permalink: /projects/
---

Current and past projects. This section collects deeper dives that are not blog posts.

<div class="blog-articles">
{% assign items = site.projects | sort: 'date' | reverse %}
{% for proj in items %}
  <div class="article-preview">
    {% if proj.cover_image %}
      <div class="article-figure" style="margin:0 0 1rem 0;">
        <img src="{{ proj.cover_image | relative_url }}" alt="Cover for {{ proj.title }}" />
      </div>
    {% endif %}
    <h2><a href="{{ proj.url | relative_url }}">{{ proj.title }}</a></h2>
    <div class="article-meta">
      {% if proj.date %}<span class="date">{{ proj.date | date: '%B %-d, %Y' }}</span>{% endif %}
      {% if proj.tags %}<span class="category">{{ proj.tags | join: ', ' }}</span>{% endif %}
    </div>
    <p>{{ proj.excerpt | strip_html | truncate: 240 }}</p>
    <a class="read-more" href="{{ proj.url | relative_url }}">Read More →</a>
  </div>
{% endfor %}
</div>

