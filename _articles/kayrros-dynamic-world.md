---
layout: article
title: Dynamic World, revisited
description: A short archive note on lightweight land-cover modeling, temporal consistency, and remote-sensing systems work at Kayrros.
date: 2022-09-01
section: kayrros
category: Remote Sensing
cover_image: /assets/images/montage-web.jpg
---

In 2022, I joined Kayrros to explore a compact alternative to Google’s Dynamic World land-cover pipeline for specific production constraints. The goal was not to outperform Dynamic World, but to test whether a smaller model could produce more consistent predictions across dates, sensors, and regions.

_Internship at Kayrros, supervised by Aurélien De Truchis (2022)._

## Why Dynamic World (and why revisit it)?

Dynamic World provides a near real-time, 10-m land-cover product across nine classes (Water, Trees, Grass, Crops, Shrub & Scrub, Flooded Vegetation, Built-up Area, Bare Ground, Snow & Ice). In some of our test cases, we observed two recurring problems:

- Temporal consistency across dates and seasons (flicker, sensitivity to atmospherics)
- Robustness across biomes when training/operating at scale with multiple sensors

Our focus was to build a minimal model that stays stable over time while remaining fast and simple to operate in production.

## Method at a glance

- Data curation + temporal augmentation: feed multiple dates that share a refined label so the model learns invariances to seasonal/atmospheric effects.
- Satellite‑agnostic inputs: Sentinel‑2 and Landsat families plus derived indices (e.g., NDVI, NDMI) and SRTM30 elevation for context.
- Lightweight U‑Net variant: three downsampling stages with targeted enhancements (attention/APSP as needed) for speed/accuracy balance.

{% include figure.html src='/assets/images/montage-web.jpg' alt='Temporal augmentation across dates with varying atmospherics and corresponding training confidences' caption='Temporal augmentation: multiple observations of the same area (top) paired with training confidences (bottom) help the model learn invariance to atmospherics and phenology.' variant='on-plate float-shadow' %}

## Seeing the model work

Below are examples comparing raw Sentinel‑2 imagery and the model’s land‑cover output around Mount Kenya.

{% include figure.html src='/assets/images/kenya-zoom-satellite.jpg' alt='Zoomed Sentinel‑2 crop near Mount Kenya' caption='Zoom view — left: Sentinel‑2 crop (raw). See also the paired classified view below.' variant='on-plate rounded-lg' %}

{% include figure.html src='/assets/images/kenya-zoom-classification.jpg' alt='Zoomed model classification near Mount Kenya' caption='Zoom view — right: model classification (Crops, Trees/Shrubs, etc.).' variant='on-plate rounded-lg' %}

{% include figure.html src='/assets/images/legend.png' alt='Land‑cover legend for the classification outputs' caption='Legend — nine Dynamic World classes as used in this project.' %}

## Results across biomes

We tested across 14 major ecoregions (temperate to tropical). Final metrics:

- Overall accuracy: 46.9%
- Mean IoU: 31.8%
- MCC: 75.1%

The benchmark scores were slightly below Google Dynamic World. In our test cases, the smaller model also showed less variation between dates and was simpler to run across different sensors and regions. These were operational observations, not a claim that the model was better overall.

## From land cover to change signals

We also tested whether more stable predictions across dates could make it easier to derive change indicators, such as forest loss or agricultural expansion.

{% include figure.html src='/assets/images/land-cover-change.jpg' alt='Example of forest loss detection with dating of change' caption='Example: temporal analysis reveals forest loss (red) and dates of change, derived from stable land‑cover predictions.' variant='on-plate float-shadow' %}

## Takeaways

- Temporal augmentation reduced some date-to-date variation in our experiments.
- Shared preprocessing made it possible to test the same model with several satellite sensors.
- The smaller model traded benchmark accuracy for simpler operation. Whether that trade-off is useful depends on the application.

_Acknowledgment: developed during my 2022 internship at Kayrros under the supervision of **Aurélien De Truchis**._
