---
layout: article
title: Dynamic World, revisited
description: What I learned by training a land-cover model for stability across dates, seasons, and biomes.
date: 2022-09-01
section: kayrros
category: Remote Sensing
cover_image: /assets/images/dynamic-world-stability.webp
image_comparison: true
---

A land-cover map can look correct on one date and still be useless for measuring change. If a field moves from crops to grass because the next image was taken after harvest, or under a different haze, a downstream system may record an event that never happened.

During my 2022 internship at Kayrros, I revisited the nine-class problem used by Dynamic World with a narrower question: which training and architecture choices make a sequence of land-cover maps stable enough to support change analysis? This was an internal research and production project, not a claim to outperform Dynamic World as a global product.

{% include figure.html src='/assets/images/dynamic-world-stability.webp' alt='Five satellite views of the same agricultural landscape above two rows of land-cover maps; V7 remains broadly consistent while V1 changes substantially between dates' caption='The central trade-off. V1 retained more spatial detail but changed with season and atmosphere. V7 was coarser and more stable—a useful property when the next step is change detection.' %}

_Internship at Kayrros, supervised by Aurélien De Truchis._

## Teach the model what should remain stable

Dynamic World's training data began with one label for one satellite observation. I turned each of those static examples into a small time series by retrieving other Sentinel-2 images from the 90 days before and after the annotation date.

The label stayed the same, but its confidence did not. For each date, I built a soft confidence map from Sentinel-2's scene classification layer and four spectral indices: NDVI, NDMI, NDWI, and NDBI. Cloudy pixels and class-index combinations that looked implausible received less weight. Dates closer to the original annotation were sampled more often.

This did not tell the model that every nearby image was equally true. It asked the model to retain the land-cover signal while becoming less sensitive to clouds, colour, moisture, and seasonal vegetation changes.

{% include figure.html src='/assets/images/dynamic-world-temporal-augmentation.webp' alt='A tree-and-shrub label map above five dated satellite observations, each paired with a grayscale confidence mask that fades under clouds or inconsistent vegetation' caption='One annotation, five nearby observations. The confidence maps at the bottom downweight cloudy or spectrally inconsistent pixels instead of treating every date as equally reliable.' %}

The model used six optical bands shared by Sentinel-2 and Landsat—red, green, blue, near-infrared, and two short-wave infrared bands—along with spectral indices and terrain derived from SRTM30. The reported experiments used Sentinel-2; adaptation to Landsat remained unfinished.

## Change one part at a time

The baseline was a shallow U-Net with three levels of downsampling. I tested nine versions under the same training setup. Some replaced the usual skip connections with dedicated paths for RGB texture, spectral indices, and elevation. Others added attention, MultiRes blocks, or Atrous Spatial Pyramid Pooling (ASPP) to give the model more spatial context.

The maps also had to remain readable at pixel level. The aligned view below shows one area near Mount Kenya: the satellite composite and the V7 prediction occupy exactly the same frame, so field boundaries and errors can be inspected directly.

{% include image-comparison.html id='kenya-segmentation-control' before_src='/assets/images/kenya-satellite-comparison.webp' before_alt='Sentinel-2 satellite composite of fields, forest, and settlements near Mount Kenya' after_src='/assets/images/kenya-segmentation-comparison.webp' after_alt='Nine-class V7 land-cover segmentation of the same Mount Kenya scene' legend_src='/assets/images/legend.png' legend_alt='Land-cover legend for water, trees, grass, flooded vegetation, crops, shrub and scrub, built area, bare ground, and snow and ice' caption='Mount Kenya, 2021. This is a qualitative model example, not a benchmark comparison with Dynamic World.' %}

Evaluation used 1,300 areas of 5 by 5 km, labelled by consensus between three experts and spread across 14 biomes. I looked at overall accuracy, mean intersection over union, Matthews correlation, class and biome balance, and a separate stability test across dates.

The versions did not improve along one clean axis. The ASPP model, V8, had the best aggregate accuracy, IoU, and MCC in the report, but it was less balanced across biomes and sometimes produced checkerboard-like artefacts. The MultiRes model, V7, gave the best stability and balance, while producing coarser maps.

That trade-off was the main result for me. If the output feeds a time series, the sharpest single-date map is not necessarily the most useful one. Detail, aggregate accuracy, balance, and temporal stability need to be measured separately.

## From classifications to change signals

For the operational experiments, I filtered poor observations, aggregated class probabilities across dates, and compared the resulting maps through time. A qualitative test in Amazonia converted repeated land-cover predictions into a map of the first observed change date.

{% include figure.html src='/assets/images/dynamic-world-change-detection.webp' alt='Latest land-cover classification beside a satellite image where pink and red regions mark the first observed change date between June and September 2021' caption='A qualitative Amazonia test. Repeated classifications were converted into a dated change map; the report observed patches as small as three or four Sentinel-2 pixels.' %}

Some observed patches covered only three or four Sentinel-2 pixels, roughly 300–400 m². I would not present that as a validated detection limit. The result remained sensitive to weather, and it had not yet been compared properly with a specialised alert system such as GLAD.

The project did reach production use in two biomass-related studies, but several research questions remained open: Landsat transfer, weak labels around small objects and borders, and independent validation of the change detector.

The lasting lesson was simpler. When a model sits inside a monitoring system, evaluation must follow the system's purpose. For change detection, consistency across time is part of accuracy, not an optional extra.
