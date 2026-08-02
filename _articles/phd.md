---
layout: article
title: Detecting tree phenology from space
description: Comparing hand-built seasonal features with satellite foundation embeddings for mapping deciduous and evergreen forests across France.
date: 2025-01-01
section: phd
category: Research
cover_image: /assets/images/phenology-satellite-embedding-map.webp
audio: /assets/audio/Écoute-Harmonique-des-Forêts-Françaises-par-Satellite-2.mp3
audio_caption: Podcast version of this article (NotebookLM)
audio_autoplay: false
math: true
---

Deciduous and evergreen forests do not reflect light in the same way through the year. During my PhD, I built a harmonic baseline that reduced irregular Sentinel-2 time series to a few seasonal numbers. I later revisited the same experiment to ask whether a representation learned from a much larger satellite archive could replace this feature engineering, while keeping the data splits and classifiers unchanged.

This is an unpublished research project. The results below come from a working manuscript, not a peer-reviewed paper.

The work brought together the SIERRA project-team at ENS, CNRS, and Inria, and the Laboratoire des Sciences du Climat et de l'Environnement at Université Paris-Saclay. The manuscript was prepared with Sarah Brood and Alexandre d'Aspremont.

[Read the working manuscript (PDF)]({{ '/assets/papers/alphaearth-phenology-working-manuscript.pdf' | relative_url }}) or [browse the code and reproducibility material](https://github.com/ArthurCalvi/S2-Tree-Phenology).

This study was one part of a broader PhD on detecting, segmenting, and classifying forest disturbances from satellite imagery. Phenology mattered because a disturbance system first has to distinguish abnormal forest change from normal seasonal variation.

The companion article, [Joining forest disturbance records with graph theory]({{ '/articles/joining-forest-disturbance-records/' | relative_url }}), describes how I combined incomplete event records before attempting to build that disturbance dataset.

{% include figure.html src='/assets/images/phenology-satellite-embedding-map.webp' alt='Three aligned views of southeast France: a true-colour satellite image, a multicolour AlphaEarth embedding, and an orange-and-blue deciduous-evergreen classification' caption='The same landscape seen as Sentinel-2 imagery, an AlphaEarth embedding, and a deciduous–evergreen classification. The preview is intentionally unmasked, so every pixel receives a class.' %}

## Two ways to describe a year

Sentinel-2 observes the same place every few days. After removing clouds, those observations form a curve: deciduous canopies green up in spring and lose their leaves in autumn, while evergreen canopies tend to vary less.

For the handcrafted baseline, I computed four vegetation indices—NDVI, EVI, NBR, and CRSWIR—then fitted two annual harmonic cycles to each one:

$$
z(t) = c + \sum_{k=1}^{2}\left[a_k \cos\left(\frac{2\pi kt}{T}\right) + b_k \sin\left(\frac{2\pi kt}{T}\right)\right] + \varepsilon(t)
$$

This turns a noisy year of observations into a compact description: average greenness, the strength and timing of the main seasonal cycle, a second cycle for finer variations, and the error left unexplained. Starting from 32 candidates, feature selection kept 14. I call this representation **HARM-14**.

The alternative started from AlphaEarth's 64-dimensional annual embeddings at 10 m resolution. These embeddings are computed upstream from a large satellite archive and combine spectral, temporal, and local spatial information. I selected 14 dimensions using the same procedure, producing **EMB-14**. The individual dimensions are harder to interpret, but the comparison is fair: 14 inputs on each side.

{% include figure.html src='/assets/images/phenology-harmonic-model.webp' alt='An annual NDVI curve reconstructed from satellite observations using an offset and two harmonic components' caption='The handcrafted baseline compresses an annual vegetation curve into an offset and two seasonal cycles. Their amplitude, phase, and residual error become inputs to a lightweight classifier.' %}

## A controlled comparison

The reference data contained 14.1 million labelled forest pixels across metropolitan France. I grouped them into 639 non-overlapping tiles, each 2.5 km wide, distributed across 11 ecological regions. Most labels came from BD Forêt polygons; a smaller set came from field observations and expert interpretation.

The split was spatial rather than random. All pixels from one tile stayed in the same fold, so neighbouring pixels could not leak into both training and validation. I then trained three ordinary classifiers—logistic regression, a linear SVM, and a random forest—with the same folds, class weights, and hyperparameters for both representations.

That control matters. This was not a larger model competing with a smaller one. The classifier stayed fixed; only its view of the satellite data changed.

Across the three classifiers, macro-F1 increased from **0.860 with harmonics to 0.897 with embeddings**, a gain of 3.7 points. With the random forest, it rose from 0.874 to 0.905. Adding the harmonic features back on top of the embeddings only moved the random forest to 0.908, which suggests that the learned representation already retained most of the useful seasonal information.

## Better scores, and calmer maps

The numerical gain was useful, but the maps were more revealing. Raw embedding predictions formed larger, more continuous forest stands. Compared with the harmonic model, edge density fell by 55% and patch density by 65%, without any spatial smoothing after classification.

The probabilities were also better calibrated. Expected calibration error fell from 0.059 to 0.033. In practice, this means the confidence attached to a prediction was closer to its observed reliability—important if a map will later be reviewed, thresholded, or combined with other evidence.

{% include figure.html src='/assets/images/phenology-map-comparison.webp' alt='Three forest sites shown as satellite imagery, embedding-based classifications, and harmonic-based classifications; embedding maps form larger continuous stands while harmonic maps contain more isolated pixel changes' caption='Both models produce raw 10 m predictions with no spatial post-processing. Across these three sites, the embedding maps preserve larger stands and contain fewer isolated pixel changes.' %}

The largest improvements appeared in heterogeneous western and mountain regions: the Pyrenees gained 10.8 macro-F1 points and Corsica 8.8. Mediterranean France improved by only 0.7 points. Better representations helped most where the landscape was varied, but not where the class definition itself became ambiguous.

## The harder problem was the reference data

Embeddings reduced the need to design seasonal features by hand, but they did not remove uncertainty from the labels. About 89% of the reference pixels came from BD Forêt polygons collected in different years; the rest came from geographically uneven field and expert sources. Mixed stands, older polygons, and ten-metre pixels that contain both canopy and understory all create disagreements that a classifier cannot resolve on its own.

The Mediterranean result made this especially clear. Broadleaf evergreens, pines, dry summers, and green understory can produce overlapping signals. At that point, a more complex model may help less than newer observations and a sharper definition of what counts as deciduous or evergreen.

This experiment changed where I would spend the next unit of effort. The learned embeddings were already strong enough for lightweight local training. The next improvement would probably come from better supervision and regional validation, not from adding another layer to the classifier.

The public repository contains the original harmonic pipeline and the later AlphaEarth comparison. The PDF and repository are research material, not a publication.
