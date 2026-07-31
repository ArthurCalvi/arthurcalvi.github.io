---
layout: default
title: Silver AI
date: 2026-07-27
section: articles
description: Silver AI is an upcoming DxO Labs research preview for Nik Silver Efex, an established reference for professional black-and-white photo editing.
permalink: /silver-ai/
silver_ai: true
cover_image: /assets/silver-ai/edit-replays-2026-07-27/images/coastal-cliff/dramatic-mountain-print/final.webp
---

<article
  class="silver-ai-page"
  data-silver-ai-page
  data-manifest-url="{{ '/assets/silver-ai/edit-replays-2026-07-27/manifest.json' | relative_url }}"
>
  <header class="silver-ai-hero">
    <div class="silver-ai-hero-copy">
      <p class="silver-ai-kicker">DxO Labs · Upcoming research preview</p>
      <h1>Silver AI</h1>
      <p class="silver-ai-deck">
        <a href="https://nikcollection.dxo.com/nik-silver-efex/" target="_blank" rel="noopener">Nik Silver Efex</a>
        is an established reference for professional black-and-white photo
        editing. A year ago, I formed a cross-functional team at DxO Labs
        around a simple question: can a photographer describe an intention
        while an agent turns it into a controlled, inspectable edit? Silver AI
        is our research preview. I lead the project from research to
        productization and contribute directly to agent design, evaluation,
        benchmarks, and integration, alongside many people across DxO. It will
        soon be available in Nik Silver Efex.
      </p>
      <ul class="silver-ai-project-tags" aria-label="Project details">
        <li>Started in 2025</li>
        <li>Cross-functional R&amp;D</li>
        <li>Research → product</li>
        <li>Codex app-server</li>
        <li>GPT-5.6 Luna</li>
        <li>Nik Silver Efex</li>
      </ul>
    </div>
    <figure class="silver-ai-hero-figure">
      <img
        src="{{ '/assets/silver-ai/edit-replays-2026-07-27/images/coastal-cliff/dramatic-mountain-print/final.webp' | relative_url }}"
        alt="A dramatic cool black-and-white coastal cliff print with a dark cloud ceiling and luminous sea mist."
        width="1200"
        height="1600"
      />
    </figure>
  </header>

  <section class="silver-ai-demo-section silver-ai-demo-section--portrait" aria-labelledby="silver-ai-suggestions-title">
    <div class="silver-ai-demo-heading">
      <div>
        <p class="silver-ai-location">Suggestions</p>
        <h2 id="silver-ai-suggestions-title">Seixal, Madeira — dawn</h2>
        <p>
          I took this at dawn, while the cliff was still dark and the first
          light was opening the mist. There is no single obvious edit, so the
          agent proposes three directions before touching the image.
        </p>
      </div>
    </div>

    <div
      class="silver-ai-story silver-ai-story--portrait"
      data-silver-replay
      data-kind="suggestions"
      data-example-ids="dramatic-mountain-print,worn-coastal-postcard,luminous-mountain-mist"
    >
      {% include silver-ai-replay.html %}

      <div class="silver-ai-fallback" data-replay-fallback>
        <figure class="silver-ai-fallback-original">
          <img
            src="{{ '/assets/silver-ai/edit-replays-2026-07-27/images/coastal-cliff/original.webp' | relative_url }}"
            alt="A color photograph of a steep coastal cliff beneath layered clouds and sea mist."
            width="1200"
            height="1600"
          />
          <figcaption>Original photograph</figcaption>
        </figure>

        <div class="silver-ai-fallback-directions">
          <article>
            <h3>Dramatic mountain print</h3>
            <p class="silver-ai-fallback-prompt">
              I chose: Dramatic mountain print — Make the cliff and cloud deck carry the frame: a high-contrast landscape preset, darker sky through Color Filter and local control, lifted mist, and a restrained cool selenium finish. The resemblance is to classic Zone System mountain printing, not a claim of authorship.
            </p>
            <figure>
              <img
                src="{{ '/assets/silver-ai/edit-replays-2026-07-27/images/coastal-cliff/dramatic-mountain-print/final.webp' | relative_url }}"
                alt="A dramatic cool black-and-white coastal cliff print with a dark cloud ceiling and luminous sea mist."
                width="1200"
                height="1600"
                loading="lazy"
              />
              <figcaption>Final photograph</figcaption>
            </figure>
            <p>
              The dramatic mountain print is in place: a darker cloud ceiling, a lifted veil of sea mist, and a cool selenium finish keep the cliff dominant without losing atmosphere. I kept the grain fine and restrained so the texture supports the print rather than competing with the clouds.
            </p>
          </article>

          <article>
            <h3>Worn coastal postcard</h3>
            <p class="silver-ai-fallback-prompt">
              I chose: Worn coastal postcard — Turn the scene into a slightly cheeky vintage seaside print with a warm tone, lighter water and haze, restrained grain, and a worn paper edge.
            </p>
            <figure>
              <img
                src="{{ '/assets/silver-ai/edit-replays-2026-07-27/images/coastal-cliff/worn-coastal-postcard/final.webp' | relative_url }}"
                alt="A warm yellowed coastal postcard print with luminous mist, restrained grain, and a worn edge."
                width="1200"
                height="1600"
                loading="lazy"
              />
              <figcaption>Final photograph</figcaption>
            </figure>
            <p>
              The coastal postcard look is in place: warm yellowed toning, a lighter sea and mist, softened grain, and a worn paper edge. The cliff remains the dark anchor, so the frame still has shape beneath the nostalgic finish.
            </p>
          </article>

          <article>
            <h3>Luminous mountain mist</h3>
            <p class="silver-ai-fallback-prompt">
              I chose: Luminous mountain mist — Keep the cliff detailed but let the glowing haze carry the photograph, using a softer landscape base, open midtones, held cloud highlights, and gentle local separation.
            </p>
            <figure>
              <img
                src="{{ '/assets/silver-ai/edit-replays-2026-07-27/images/coastal-cliff/luminous-mountain-mist/final.webp' | relative_url }}"
                alt="A soft luminous sepia coastal print with open haze, controlled cloud light, and a gently defined cliff."
                width="1200"
                height="1600"
                loading="lazy"
              />
              <figcaption>Final photograph</figcaption>
            </figure>
            <p>
              The luminous mountain mist pass is applied: a soft sepia base, open middle tones, held cloud light, and a gentle local definition pass on the cliff. The haze now carries the frame while the textured diagonal remains readable, with the extra preset grain kept out so the print stays airy.
            </p>
          </article>
        </div>
      </div>
    </div>
    <aside class="silver-ai-example-note">
      <p class="silver-ai-example-note-label">From intent to edit</p>
      <p>
        The photographer chooses a direction, not a list of settings.
        “Dramatic,” “worn,” and “luminous” are translated into Silver Efex
        operations—presets, tones, grain, and local adjustments. After each
        step, the histogram is computed from the displayed frame, making the
        movement between light and dark tones visible while the edit unfolds.
      </p>
    </aside>
  </section>

  <section class="silver-ai-demo-section silver-ai-demo-section--portrait" aria-labelledby="silver-ai-surprise-title">
    <div class="silver-ai-demo-heading">
      <div>
        <p class="silver-ai-location">Surprise me</p>
        <h2 id="silver-ai-surprise-title">La Madeleine, Paris</h2>
        <p>
          I photographed La Madeleine from below, where the columns create a
          slow sequence of shadows. I began with “Surprise me.” The first
          result was hard and monumental; I then asked for something softer
          and more poetic.
        </p>
      </div>
    </div>

    <div
      class="silver-ai-story silver-ai-story--portrait"
      data-silver-replay
      data-kind="surprise"
      data-example-ids="monumental-inscription"
    >
      {% include silver-ai-replay.html %}

      <div class="silver-ai-fallback" data-replay-fallback>
        <div class="silver-ai-fallback-pair">
          <figure>
            <img
              src="{{ '/assets/silver-ai/edit-replays-2026-07-27/images/monumental-architecture/original.webp' | relative_url }}"
              alt="A color photograph looking upward along classical stone columns, a carved pediment, and a Latin inscription."
              width="900"
              height="1200"
              loading="lazy"
            />
            <figcaption>Original photograph</figcaption>
          </figure>
          <figure>
            <img
              src="{{ '/assets/silver-ai/edit-replays-2026-07-27/images/monumental-architecture/monumental-inscription/final.webp' | relative_url }}"
              alt="A poetic warm-sepia architectural print with a lifted Latin inscription and long progressive column shadows."
              width="900"
              height="1200"
              loading="lazy"
            />
            <figcaption>Final photograph</figcaption>
          </figure>
        </div>
        <div class="silver-ai-fallback-conversation">
          <p><strong>Arthur</strong> Surprise me</p>
          <p><strong>Silver AI</strong> Monumental Inscription. I pushed the building toward a carved, high-contrast architectural print, added a restrained brown-sepia paper tone, and lifted the inscription with a directional local adjustment so the lettering joins the visual rhythm of the columns.</p>
          <p><strong>Arthur · Follow-up</strong> Could you give it a more poetic and soft look? This architecture is producing some very interesting progressive shadows.</p>
          <p><strong>Silver AI</strong> I softened the stone and relief into a gentler, more poetic print, easing back the hard structure while protecting the long shadow transitions. The architecture now feels less monumental and more atmospheric—the progressive shadows can carry the mood.</p>
        </div>
      </div>
    </div>
    <aside class="silver-ai-example-note">
      <p class="silver-ai-example-note-label">One simple fix we found</p>
      <p>
        Local adjustments originally asked one tool call to decide both where
        to edit and what to change. One simple fix was to split that into two
        calls: select the area, then apply the effect. The first call also makes
        the compatible next step explicit. It is a small contract change among
        many, but in one internal evaluation it reduced tool-sequencing errors
        from 14% to below 1%. That result covers this sequence only, not the
        reliability of Silver AI as a whole.
      </p>
    </aside>
  </section>

  <section class="silver-ai-demo-section silver-ai-demo-section--landscape" aria-labelledby="silver-ai-prompt-title">
    <div class="silver-ai-demo-heading">
      <div>
        <p class="silver-ai-location">Direct edit</p>
        <h2 id="silver-ai-prompt-title">Lisboa Tram</h2>
        <p>
          I took this as a red tram moved through Lisboa. The request was
          simple: make the city monochrome and keep the tram red. Then I asked
          for a less yellow vintage treatment.
        </p>
      </div>
    </div>

    <div
      class="silver-ai-story silver-ai-story--landscape"
      data-silver-replay
      data-kind="direct"
      data-example-ids="lisboa-red-tram"
    >
      {% include silver-ai-replay.html %}

      <div class="silver-ai-fallback" data-replay-fallback>
        <div class="silver-ai-fallback-pair">
          <figure>
            <img
              src="{{ '/assets/silver-ai/edit-replays-2026-07-27/images/lisboa-tram/original.webp' | relative_url }}"
              alt="A red Lisboa tram moving through a softly blurred city street."
              width="1600"
              height="1066"
              loading="lazy"
            />
            <figcaption>Original photograph</figcaption>
          </figure>
          <figure>
            <img
              src="{{ '/assets/silver-ai/edit-replays-2026-07-27/images/lisboa-tram/red-tram-accent/final.webp' | relative_url }}"
              alt="A Lisboa tram in vivid red against a softly sepia monochrome city street."
              width="1600"
              height="1066"
              loading="lazy"
            />
            <figcaption>Final photograph</figcaption>
          </figure>
        </div>
        <div class="silver-ai-fallback-conversation">
          <p><strong>Arthur</strong> I love this image taken in Lisboa! Could you use selective colorization to create a fun edit?</p>
          <p><strong>Silver AI</strong> The Lisboa tram is now the playful red accent, while the city stays monochrome. I kept the warm yellowed print and worn postcard edge, so it feels like a cheeky vintage souvenir.</p>
          <p><strong>Arthur · Follow-up</strong> Let's change preset for another one, still vintage but not that yellow.</p>
          <p><strong>Silver AI</strong> I switched to 027 Soft Sepia—a gentler brown vintage tone without the strong yellow cast. The tram's red is back as the selective-color accent, while the background stays softly monochrome.</p>
        </div>
      </div>
    </div>
    <aside class="silver-ai-example-note">
      <p class="silver-ai-example-note-label">Presets come first</p>
      <p>
        This sequence follows Silver Efex’s own logic. Presets are designed as
        starting points: applying one resets the previous adjustments so the
        photographer can explore a new direction from a clean base. The agent
        follows the same model. It applies Soft Sepia first, then rebuilds the
        local selective-colour treatment that keeps the tram red.
      </p>
    </aside>
  </section>

  <footer class="silver-ai-research-note">
    <p class="silver-ai-example-note-label">Research preview</p>
    <p>
      These examples show the visible loop: offer directions when intent is
      open, take a position when invited, and act directly when the request is
      precise. Making that loop reliable spans image analysis, agent and tool
      design, evaluation, benchmark creation, product integration, release
      systems, and feedback from real edits. This page shows only the visible
      interaction; parts of the perceptual and artistic-direction systems
      remain confidential.
    </p>
  </footer>
</article>
