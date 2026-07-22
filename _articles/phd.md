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

Deciduous and evergreen trees have different seasonal signals. On the ground they are easy to tell apart; at national scale, satellite time series provide a way to measure the difference.

In this unpublished research project, I tested whether Sentinel-2 imagery and harmonic analysis could be used to classify French forests at national scale.

## Harmonic analysis

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

## From time series to a forest map

My approach involved processing Sentinel‑2 images into consistent monthly mosaics across France, covering year 2023. Using harmonic analysis, each pixel was transformed into a set of features reflecting its unique seasonal pattern. These features then fed into a machine learning algorithm (Random Forest) trained on extensive ground and aerial survey data.

Key steps included:

- **Harmonic components:** I tested one and two harmonic components. Two retained more of the seasonal structure without adding too much sensitivity to noise.
- **Feature selection:** I compared NBR, NDVI, EVI, and CRSWIR with several harmonic features, then kept the features that contributed most in the training experiments.
- **Efficient computation:** Parallelized processing on high‑performance computing infrastructure, allowing nationwide analysis within an hour.

<figure class="article-figure">
  <img src="/assets/images/classification-map-web.jpg" alt="Forest classification map of France showing deciduous and evergreen classes" />
  <figcaption>Figure 2: Forest classification map of France, showing deciduous (orange) and evergreen (blue) forests. Insets highlight detailed views of Les Landes and Corsica.</figcaption>
</figure>

## Reading the map

The resulting map distinguishes France's deciduous and evergreen forests and makes their broad seasonal patterns visible at national scale. This remained an unpublished research result, so I keep the account here focused on the method and what the map revealed rather than presenting it as a peer-reviewed benchmark.

Some key insights emerged:

- Deciduous forests dominate in northern and central France, clearly reflecting seasonal leaf cycles.
- Evergreen forests, like the expansive pine plantations of Les Landes, show consistent year‑round foliage patterns.
- Mediterranean and mountainous areas posed greater classification challenges due to complex seasonal behaviors and varied terrain.

Visual comparison with existing products, such as the Copernicus Dominant Leaf Type and BD Forêt v2 datasets, revealed useful regional differences to investigate. Mixed forests and mountainous regions were especially interesting because harmonic analysis is sensitive to subtle seasonal behaviour.

## Possible uses

Understanding forest phenology from space could support practical questions in forestry management, climate modelling, and biodiversity conservation. This experiment suggests that harmonic features are worth testing beyond France, but broader validation would be needed before treating the method as a general monitoring approach.

Potential future applications include:

- Detecting early signs of climate‑induced stress or shifts in tree phenology.
- Monitoring recovery and resilience after forest fires or droughts.
- Identifying invasive species or shifts in dominant tree types due to climate change.

## Further work

The next step would be to validate the model across more years, regions, and reference datasets. Complementary data such as LiDAR or radar could then be tested for structural changes or subtle phenological shifts, before considering more frequent operational updates.

## Conclusion

By "listening" to the seasonal rhythms of trees using harmonic analysis, we gain another way to study forest dynamics from space. The work showed me how a compact mathematical representation can turn long satellite time series into a map people can inspect and question.
