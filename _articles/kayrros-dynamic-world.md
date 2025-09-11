---
layout: article
title: Dynamic World, Revisited — Lightweight, Temporally Consistent Land Cover at Kayrros
date: 2022-09-01
section: kayrros
category: Remote Sensing
cover_image: assets/images/montage.png
---

In 2022, I joined Kayrros to explore whether we could reproduce—and, for some production needs, improve on—Google’s Dynamic World land‑cover pipeline. The goal was not to beat Dynamic World outright, but to build a lightweight, temporally consistent model that behaved well across geographies, sensors, and seasons.

_Internship at Kayrros, supervised by Aurélien De Truchis (2022)._

## Why Dynamic World (and why revisit it)?

Dynamic World provides a near real‑time, 10‑m land‑cover product across nine classes (Water, Trees, Grass, Crops, Shrub & Scrub, Flooded Vegetation, Built‑up Area, Bare Ground, Snow & Ice). It is remarkably useful, but we observed two recurring challenges in some deployments:

- Temporal consistency across dates and seasons (flicker, sensitivity to atmospherics)
- Robustness across biomes when training/operating at scale with multiple sensors

Our focus was to build a minimal model that stays stable over time while remaining fast and simple to operate in production.

## Method at a glance

- Data curation + temporal augmentation: feed multiple dates that share a refined label so the model learns invariances to seasonal/atmospheric effects.
- Satellite‑agnostic inputs: Sentinel‑2 and Landsat families plus derived indices (e.g., NDVI, NDMI) and SRTM30 elevation for context.
- Lightweight U‑Net variant: three downsampling stages with targeted enhancements (attention/APSP as needed) for speed/accuracy balance.

{% include figure.html \
  src="assets/images/montage.png" \
  alt="Temporal augmentation across dates with varying atmospherics and corresponding training confidences" \
  caption="Temporal augmentation: multiple observations of the same area (top) paired with training confidences (bottom) help the model learn invariance to atmospherics and phenology." \
  variant="on-plate float-shadow" %}

## Seeing the model work

Below are examples comparing raw Sentinel‑2 imagery and the model’s land‑cover output around Mount Kenya.

{% include figure.html \
  src="assets/images/img-cmp-kenya-zoom-sat.png" \
  alt="Zoomed Sentinel‑2 crop near Mount Kenya" \
  caption="Zoom view — left: Sentinel‑2 crop (raw). See also the paired classified view below." \
  variant="on-plate rounded-lg" %}

{% include figure.html \
  src="assets/images/img-cmp-kenya-zoom-model.png" \
  alt="Zoomed model classification near Mount Kenya" \
  caption="Zoom view — right: model classification (Crops, Trees/Shrubs, etc.)." \
  variant="on-plate rounded-lg" %}

{% include figure.html \
  src="assets/images/legend.png" \
  alt="Land‑cover legend for the classification outputs" \
  caption="Legend — nine Dynamic World classes as used in this project." %}

## Results across biomes

We tested across 14 major ecoregions (temperate to tropical). Final metrics:

- Overall accuracy: 46.9%
- Mean IoU: 31.8%
- MCC: 75.1%

While slightly below Google Dynamic World on benchmark scores, the model delivered two practical advantages important in operations:

1) Improved temporal consistency across dates and seasons; 2) Portability across sensors and regions with a compact runtime.

## From land cover to change signals

The model is particularly effective for dynamic indicators: deforestation alerts, agricultural expansion, and other environmental monitoring signals.

{% include figure.html \
  src="assets/images/lulc_changes.png" \
  alt="Example of forest loss detection with dating of change" \
  caption="Example: temporal analysis reveals forest loss (red) and dates of change, derived from stable land‑cover predictions." \
  variant="on-plate float-shadow" %}

## Takeaways

- Temporal augmentation and a restrained architecture go a long way for stability.
- Sensor‑agnostic preprocessing and select indices add useful context without heavy engineering.
- A lightweight, consistent baseline can unlock reliable monitoring at scale—even if headline benchmark numbers trail large, general models.

_Acknowledgment: developed during my 2022 internship at Kayrros under the supervision of **Aurélien De Truchis**._

