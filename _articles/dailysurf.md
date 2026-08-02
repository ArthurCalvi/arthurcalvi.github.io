---
layout: article
title: The hard part of building DailySurf
description: AI made the app faster to build. It did not make finding the right product easier.
date: 2026-07-28
section: articles
category: Product
cover_image: /assets/images/dailysurf-guetteur-opportunity.webp
dailysurf_demo: true
---

<p class="dailysurf-beta-cta">
  <strong>DailySurf is currently in beta.</strong>
  If you would like to try it, you can
  <a href="https://www.dailysurf.fr/">join the beta through the form on dailysurf.fr</a>.
</p>

DailySurf began with a surfing trip to Bouznika, Morocco. I was there with [Surf Progress](https://surf-progress.com/), where I met Thibaut de Gueyer. Thibaut is a surf coach and the creator of Surf Progress, a large online community built around clear, practical teaching for beginner and intermediate surfers. We got along quickly. We were both building things, and ideas came easily.

The project started five months later, after I had returned to Paris. In November, I called Thibaut and asked: “What if we built a surfing app with AI in it?” His answer was immediate: let’s go.

By the following July, after many iterations, we opened the beta.

The question we are testing now is simple. Instead of asking surfers to inspect forecasts themselves, can DailySurf find the few sessions that fit their level, schedule, and starting point? We call this feature *Le Guetteur*, French for “the lookout.”

{% include dailysurf-guetteur-demo.html %}

We did not start there. The beta began with two simpler jobs: helping people explore places to surf and keeping a useful memory of their sessions.

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

AI helped us build and revise the app quickly. Ideas that would once have required more time and people became easier to test. But that speed can be misleading. Building software is not the same as building a product people need.

The difficult part remained familiar. We had to talk to surfers, watch how they used the beta, and study usage. We had to understand which parts were useful and, more importantly, which problem we were actually trying to solve.

This became clear during a period of poor surf conditions. Usage dropped. The obvious explanation was that there was simply no good surf. But it also exposed a weakness in the product: the app was most useful when people already suspected that a session might be possible and took the time to check.

That left much of the work with the surfer. They still had to inspect forecasts, compare spots, consider their level, check their calendar, and sometimes find out whether equipment rental was available. The app could present information, but it did not yet do that search for them.

That is what led us to Le Guetteur. Behind the simple surface, it scans several days of forecasts and builds three-hour daylight windows. It removes spots that do not fit the surfer or the practical constraints, then ranks what remains using swell, wind, tide, travel time, and level. Sometimes the useful answer is simply that there is no good window yet.

We are still testing this direction. We need to learn which signals matter, how personal the suggestions should be, and when an alert is helpful rather than noisy.

We started with a broad idea: a surfing app with AI. The beta gave us a more precise problem: helping someone notice the few sessions that genuinely fit their life and level. AI changed how quickly we could build. Finding that problem still came from talking to people and observing what happened.
