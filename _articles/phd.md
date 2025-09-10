---
layout: article
title: PhD Research
permalink: /phd.html
date: 2025-01-01
section: phd
category: Research
cover_image: assets/images/harmonics_decomposition.png
audio: assets/audio/Écoute-Harmonique-des-Forêts-Françaises-par-Satellite-2.mp3
audio_caption: Podcast version of this article (NotebookLM)
audio_autoplay: false
math: true
---

Forests play a critical role in our planet's health, absorbing carbon dioxide, sheltering wildlife, and supporting biodiversity. Yet, to manage forests effectively—especially in the face of climate change—we first need to understand them deeply. One key challenge? Accurately distinguishing deciduous trees, which shed leaves seasonally, from evergreen trees, which keep their foliage year-round. From the ground, this is straightforward; but how do we scale up to monitor entire countries from space?

In my research, I've developed an approach that leverages Sentinel‑2 satellite imagery and harmonic analysis—a technique borrowed from signal processing—to classify French forests at national scale.

## Trees Have a Rhythm: Introducing Harmonic Analysis

Just as music can be broken down into notes and rhythms, the seasonal growth patterns of trees can be decomposed into sinusoidal cycles. Sentinel‑2 captures images every few days, providing time series that reveal these cycles. Harmonic analysis lets us model each pixel's vegetation signal as:

$$
f_h(t) = \sum_{i=1}^{h} [A_{i} \cos(2\pi i t) + B_{i} \sin(2\pi i t)] + C
$$

Where $t$ is normalized time across a year, $A_i$ and $B_i$ describe seasonal rhythm (amplitude and phase), and $C$ is the average vegetation level.

Two essential characteristics emerge:

- **Amplitude ($M_i$):** magnitude of seasonal variation (typically larger for deciduous trees).
- **Phase ($\phi_i$):** timing of vegetation peaks (helps differentiate species by growth timing).

![Harmonic decomposition](assets/images/harmonics_decomposition.png)

## Turning Satellite Data into Forest Maps

We processed Sentinel‑2 images into monthly mosaics across France (2023). Harmonic features from vegetation indices (NDVI, NBR, EVI, CRSWIR) fed a Random Forest classifier trained on survey data.

Key steps:

- Two harmonics balance fidelity and robustness.
- Feature selection emphasizes first‑harmonic features and key indices.
- Parallelized processing enables nationwide analysis within an hour.

![Forest classification map](assets/images/classification map.png)

## Why This Matters

This provides a reliable, scalable method for monitoring forests, supporting management, climate modeling, and biodiversity work. Future improvements may integrate LiDAR/radar and near‑real‑time updates.
