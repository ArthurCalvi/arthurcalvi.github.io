---
layout: article
title: One Chart, Everywhere
description: A small UI discipline with a software engineering twin — one good primitive used identically reads calmer than three near-identical variants.
date: 2026-05-02
section: feed
category: AI systems
ai_assisted: true
public_safety: reviewed draft
---

A small product I tinker with had three screens that each needed to show a
trend over time, and the codebase had quietly grown three slightly different
ways of drawing that line. The fix in this week's pass was small in code and
large in feel: extract one primitive — a thin line, two dots for the min and
max, light labels for value and date — and use it identically across all
three screens.

The user does not learn three charts. They learn one. The screens read calmer
because they are visually consonant, even when the underlying data is
different.

This is mostly a software engineering rule wearing design clothes. When you
have one good primitive, resist inventing a second one for variety. Variety
is what makes an interface feel busy. Considered repetition is what makes it
feel intentional.

The same idea applies in code, in dashboards, in AI tool surfaces: one
well-shaped thing reused in five places is almost always calmer than five
almost-identical ones.
