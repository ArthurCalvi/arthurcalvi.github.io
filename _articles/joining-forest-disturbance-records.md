---
layout: article
title: Joining forest disturbance records with graph theory
description: An unpublished PhD framework for turning incomplete, overlapping records into candidate forest events in space and time.
date: 2024-05-24
section: phd
category: Research
disturbance_graph: true
---

Before I could train a model to detect forest disturbances, I needed a dataset
of events. There was no single dataset to use.

Different sources described different parts of the same reality. A continental
map located disturbed forest polygons but sometimes left the cause ambiguous.
Fire inventories had precise causes and dates. Forest-health observations
recorded pests and dieback at individual locations. Other rasters described
drought stress or likely clear-cuts. Their geometries, dates, labels, and levels
of confidence did not line up.

During my PhD, I built a framework to reconcile these records. The work was not
published or fully validated, but the
[code and methodology are public](https://github.com/ArthurCalvi/Disturbance-Attribution-Dataset-Joining).

{% include disturbance-graph.html %}

## A graph made the ambiguity explicit

The first step was ordinary data engineering. Each source was converted to the
same coordinate system and a common schema: geometry, start and end dates,
source, and one or more possible disturbance classes. I kept ambiguous labels
as lists instead of forcing an early decision. A polygon marked “storm or
biotic,” for example, still carried both possibilities into the next stage.

I then represented every reported event as a node in a graph. Two nodes could
be connected when they were sufficiently close in space and time. The weight
of the link decreased with distance and delay, increased with the reliability
of the sources, and was reduced when both records came from the same dataset.
In compact form:

> link weight = spatial proximity × temporal proximity × source reliability × same-source penalty

This was more useful than a conventional database join. There was rarely one
exact key shared by two sources. What existed instead was a degree of evidence
that two records might describe the same event.

The graph was processed in two passes. Louvain community detection first found
coarse groups of connected records, which I treated as disturbance complexes.
Within each community, HDBSCAN refined the groups using location, time, and
candidate cause. A penalty discouraged records with different causes from
joining the same cluster, without making that separation absolute. Strong
spatial and temporal evidence could still outweigh a disagreement in labels.

For each polygon in the reference map, the final cluster voted on the cause.
Votes were weighted by the reliability assigned to each source and normalized
into a probability for fire, storm, anthropogenic activity, biotic damage,
drought, or an unknown cause. An isolated and ambiguous record remained unknown. The system
did not manufacture certainty where the inputs provided none.

## What the framework produced

The output was a set of candidate events with a spatial group, a time window,
and an attributed cause distribution. I used it to locate possible disturbance
areas across France between 2017 and 2020 and to sample different event types
for a future annotation dataset.

The framework also exposed its own limits. The thresholds and community
resolution needed tuning. Recurring disturbances in the same polygon could be
linked indirectly through a shared neighbour. Most importantly, the proposed
events still required human validation against satellite time series. This was
infrastructure for building a dataset, not a substitute for ground truth.

That distinction is what I find most interesting in retrospect. The initial
research question sounded like a model problem: detect and classify forest
disturbances from satellite images. The first hard problem was organisational
and geometric. Before learning from examples, I had to decide what an example
was and how several imperfect observations could support it.

## The other half of the data problem

Disturbance records only describe abnormal change. A detector also needs to
understand what normal forest variation looks like. During the same PhD, I
built a harmonic baseline that summarized the seasonal behaviour of deciduous
and evergreen forests from irregular Sentinel-2 observations. I later revisited
that experiment with AlphaEarth embeddings while keeping the data splits and
classifiers fixed.

That work is described in
[Mapping deciduous and evergreen forests from space]({{ '/articles/phd/' | relative_url }}),
with the [code](https://github.com/ArthurCalvi/S2-Tree-Phenology) and
[working manuscript]({{ '/assets/papers/alphaearth-phenology-working-manuscript.pdf' | relative_url }})
available separately. Together, the two projects addressed opposite sides of
the same question: how to define normal seasonal behaviour, and how to assemble
credible examples of genuine change.
