# Silver AI edit replays

This folder is ready to be consumed by a static website. It contains five real
Silver AI edit stories:

- Three independent directions from the same coastal-cliff photograph.
- One two-turn selective-color edit of a Lisboa tram.
- One "Surprise me" architectural interpretation, followed by a softer poetic
  revision centered on progressive shadows.

`manifest.json` is the canonical ordered data source. It includes the prompts,
public-facing reasoning summaries, editing tools used, intermediate image paths,
and exact final assistant text.

## Asset layout

```text
manifest.json
evidence/
  metadata-stripped selection previews for local edits
images/
  coastal-cliff/
    original.webp
    dramatic-mountain-print/
    worn-coastal-postcard/
    luminous-mountain-mist/
  lisboa-tram/
    original.webp
    red-tram-accent/
  monumental-architecture/
    original.webp
    monumental-inscription/
```

The intermediate frames are the actual previews returned after meaningful edit
steps. Saved final exports are represented separately as `final.webp`.
For local edits, the optional `evidence.mask_image` points to the real selection
preview returned by the editing tool. The website computes the global luminance
histogram directly from each displayed frame so its scope remains consistent
across every step.

## Public-safety and image preparation

- Every image is a metadata-stripped sRGB WebP derivative.
- Camera, device, location, and private filesystem metadata are not present.
- Originals and final images have a maximum side of 1600 px.
- Intermediate previews have a maximum side of 1024 px.
- Raw session logs, internal prompts, tool schemas, private IDs, and private
  paths are intentionally excluded.
- Selection previews contain only the photograph and visible mask. Internal
  object identifiers, coordinates, and monitoring values are excluded.
- `reasoning_summary` contains concise visible rationale reconstructed from
  public commentary and factual tool outcomes. It is not private
  chain-of-thought.

The three coastal-cliff edits all began from the same verified starting preview.
They are alternatives, not stages of one cumulative edit.
