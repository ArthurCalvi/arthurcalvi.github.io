---
layout: article
title: Write Down the Physics
description: Image-generation prompts for embodied actions need the unstated constraints made explicit — the model has no body to take them for granted from.
date: 2026-05-03
section: feed
category: AI systems
ai_assisted: true
public_safety: reviewed draft
---

A small product I tinker with needed a pack of illustrations of a person
doing a specific embodied action. The first round looked plausible at
thumbnail scale and wrong on inspection: the figure's weight was on the
wrong foot, the body angled like a logo rather than a body under gravity.

The fix was not better art direction. It was writing the physics down.
Gravity. Balance line. Which foot carries the weight. None of that is
obvious from "a person doing X" — but a human illustrator would take all of
it for granted, and the model has no body to take it for granted from.

One adjacent habit helped a lot: generate several variants per round and
pick, instead of tuning a single prompt forever. Picking trains the eye
faster than tuning does.

The rule travels beyond images. Anywhere you ask a model to produce
something embodied, situated, or shaped by an unstated context, you have to
spell out the unstated parts.
