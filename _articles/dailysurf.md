---
layout: article
title: The hard part of building DailySurf
description: AI made the app faster to build. It did not make finding the right product easier.
date: 2026-07-28
section: articles
category: Product
cover_image: /assets/images/dailysurf-guetteur-opportunity.webp
dailysurf_demo: true
reading_focus: true
---

<p class="dailysurf-beta-cta">
  <strong>DailySurf is currently in beta.</strong>
  If you would like to try it, you can
  <a href="https://www.dailysurf.fr/">join the beta through the form on dailysurf.fr</a>.
</p>

DailySurf began during a surfing trip to Bouznika, Morocco. I was there with [Surf Progress](https://surf-progress.com/), where I met Thibaut de Gueyer. Thibaut is a surf coach and the creator of Surf Progress, an online community built around clear, practical teaching for beginner and intermediate surfers. We got along quickly. We were both building things, and ideas came easily.

Five months later, back in Paris, I called him and asked: “What if we built a surfing app with AI in it?” His answer was immediate: let’s go.

By the following July, after many iterations, we opened the beta.

The question we are testing now is more precise than our original idea. Instead of asking surfers to inspect forecasts themselves, can DailySurf find the few sessions that fit their level, schedule, and starting point? We call this feature *Le Guetteur*, French for “the lookout.”

{% include dailysurf-guetteur-demo.html %}

We did not start there. The first beta had two simpler jobs: helping people explore places to surf and keeping a useful memory of their sessions.

<div class="article-screen-grid" role="group" aria-label="Two DailySurf beta screens">
  <figure>
    <img src="{{ '/assets/images/dailysurf-map-europe.webp' | relative_url }}" alt="A dark map of the Atlantic coast from northern Europe to Morocco, with surf spots and wave heights marked along the shoreline" width="900" height="1957" loading="lazy" />
    <figcaption>Explore: surf spots and current wave heights along the Atlantic coast.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/images/dailysurf-journal-july-2026.webp' | relative_url }}" alt="A DailySurf monthly journal showing four July surf sessions, a calendar, and a ten-week surfing streak" width="900" height="1957" loading="lazy" />
    <figcaption>Journal: sessions, rhythm, and a monthly recap.</figcaption>
  </figure>
</div>

<aside class="article-focus-statement" id="dailysurf-product-insight" data-reading-focus aria-label="What the DailySurf beta revealed">
  <p class="article-focus-label">What the beta revealed</p>
  <p class="article-focus-lead">A forecast is not a recommendation.</p>
  <p>
    During a period of poor surf conditions, usage dropped. The weather
    explained part of it, but the beta exposed a weakness too: DailySurf became
    useful only after someone already suspected that a session might be
    possible.
  </p>
</aside>

A surfer still had to compare spots, account for their level, check their calendar, estimate the drive, and find out whether equipment rental was available.

That is what led us to Le Guetteur. It scans several days of forecasts and builds three-hour daylight windows. It removes spots that do not fit the surfer or the practical constraints, then ranks what remains using swell, wind, tide, travel time, and level. Sometimes the useful answer is simply that there is no good window yet.

We are still testing this direction. We need to learn which signals matter, how personal the suggestions should be, and when an alert is helpful rather than noisy.

We started with a broad idea: a surfing app with AI. The beta gave us a more useful problem: helping someone notice the few sessions that genuinely fit their life and level. AI changed how quickly we could build. Finding that problem still came from talking to people and observing what happened.
