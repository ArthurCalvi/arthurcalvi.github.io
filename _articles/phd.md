---
layout: article
title: Detecting Tree Phenology from Space
description: A research note on using Sentinel-2 time series and harmonic analysis to distinguish seasonal forest behavior at national scale.
date: 2025-01-01
section: phd
category: Research
cover_image: /assets/images/harmonics-decomposition-web.jpg
audio: /assets/audio/Écoute-Harmonique-des-Forêts-Françaises-par-Satellite-2.mp3
audio_caption: Podcast version of this article (NotebookLM)
audio_autoplay: false
math: true
---

Forests play a critical role in our planet's health, absorbing carbon dioxide, sheltering wildlife, and supporting biodiversity. Yet, to manage forests effectively—especially in the face of climate change—we first need to understand them deeply. One key challenge? Accurately distinguishing deciduous trees, which shed leaves seasonally, from evergreen trees, which keep their foliage year-round. From the ground, this is straightforward; but how do we scale up to monitor entire countries from space?

In my research, I explored a method that uses Sentinel‑2 satellite imagery and harmonic analysis—a technique borrowed from sound processing—to classify French forests on a national scale.

## Trees Have a Rhythm: Introducing Harmonic Analysis

Just as music can be broken down into simple notes and rhythms, the seasonal growth patterns of trees can also be decomposed into basic sinusoidal cycles. Sentinel‑2 satellites capture images of the Earth's surface every few days, providing data over time that can be analyzed to detect these seasonal cycles. Harmonic analysis allows us to transform this data into a mathematical "song" of the forest.

Specifically, each pixel's vegetation signal (captured as NDVI, NBR, EVI, and CRSWIR indices) can be modeled as:

$$
f_h(t) = \sum_{i=1}^{h} [A_{i} \cos(2\pi i t) + B_{i} \sin(2\pi i t)] + C
$$

Here:

- $t$ is normalized time across a year,
- $A_{i}$ and $B_{i}$ define the seasonal rhythm (amplitude and phase),
- $C$ is the average vegetation level throughout the year.

By analyzing these harmonic components, we can extract two essential characteristics:

- **Amplitude ($M_{i}$):** How strongly vegetation varies within a year, typically larger for deciduous trees.
- **Phase ($\phi_{i}$):** When the vegetation peaks, which helps differentiate species based on their growth timing.

Think of the first harmonic as the primary melody—a clear annual leaf‑on, leaf‑off cycle in deciduous trees—and the second harmonic as subtle variations, refining our understanding of more nuanced seasonal behaviors.

<figure class="article-figure">
  <img src="/assets/images/harmonics-decomposition-web.jpg" alt="Harmonic decomposition of NDVI time series for a deciduous tree" />
  <figcaption>Figure 1: Harmonic decomposition of NDVI time series for a deciduous tree. Two harmonic components and an offset combine to reconstruct the observed vegetation pattern.</figcaption>
  
</figure>

## Turning Satellite Data into Forest Maps

My approach involved processing Sentinel‑2 images into consistent monthly mosaics across France, covering year 2023. Using harmonic analysis, each pixel was transformed into a set of features reflecting its unique seasonal pattern. These features then fed into a machine learning algorithm (Random Forest) trained on extensive ground and aerial survey data.

Key steps included:

- **Optimizing harmonic components:** Two harmonics balanced capturing accurate seasonality without overfitting noisy signals.
- **Robust feature selection:** Identified the most informative indices (NBR, NDVI, EVI, CRSWIR) and harmonic features (primarily first harmonic) to ensure efficient and accurate classification.
- **Efficient computation:** Parallelized processing on high‑performance computing infrastructure, allowing nationwide analysis within an hour.

<figure class="article-figure">
  <img src="/assets/images/classification-map-web.jpg" alt="Forest classification map of France showing deciduous and evergreen classes" />
  <figcaption>Figure 2: Forest classification map of France, showing deciduous (orange) and evergreen (blue) forests. Insets highlight detailed views of Les Landes and Corsica.</figcaption>
</figure>

## What the Forest Map Tells Us

The resulting map distinguishes France's deciduous and evergreen forests and makes their broad seasonal patterns visible at national scale. This remained an unpublished research result, so I keep the account here focused on the method and what the map revealed rather than presenting it as a peer-reviewed benchmark.

Some key insights emerged:

- Deciduous forests dominate in northern and central France, clearly reflecting seasonal leaf cycles.
- Evergreen forests, like the expansive pine plantations of Les Landes, show consistent year‑round foliage patterns.
- Mediterranean and mountainous areas posed greater classification challenges due to complex seasonal behaviors and varied terrain.

Visual comparison with existing products, such as the Copernicus Dominant Leaf Type and BD Forêt v2 datasets, revealed useful regional differences to investigate. Mixed forests and mountainous regions were especially interesting because harmonic analysis is sensitive to subtle seasonal behaviour.

## The Bigger Picture: Why This Matters

Understanding forest phenology from space could support practical questions in forestry management, climate modelling, and biodiversity conservation. This experiment suggests that harmonic features are worth testing beyond France, but broader validation would be needed before treating the method as a general monitoring approach.

Potential future applications include:

- Detecting early signs of climate‑induced stress or shifts in tree phenology.
- Monitoring recovery and resilience after forest fires or droughts.
- Identifying invasive species or shifts in dominant tree types due to climate change.

## Looking Ahead

The next step would be to validate the model across more years, regions, and reference datasets. Complementary data such as LiDAR or radar could then be tested for structural changes or subtle phenological shifts, before considering more frequent operational updates.

## Conclusion

By "listening" to the seasonal rhythms of trees using harmonic analysis, we gain another way to study forest dynamics from space. The work showed me how a compact mathematical representation can turn long satellite time series into a map people can inspect and question.
