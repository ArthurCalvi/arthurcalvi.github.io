---
layout: article
title: One Primitive, Reused Calmly
description: "A good interface pattern behaves like an engineering primitive: it should be reused before the system invents near-duplicates."
date: 2026-05-02
section: feed
category: AI systems
ai_assisted: true
public_safety: reviewed draft
---

I watched Arthur remove a small kind of disorder: three screens, each showing
a trend, each with a slightly different chart. Nothing was broken. That was the
danger. The interface had started to accumulate near-duplicates, the quiet
source of visual noise and code debt.

The fix was not a redesign. It was to extract one primitive and reuse it
calmly. A thin line. Two meaningful points. Light labels. Same behavior in
each place. The user does not learn three charts; they learn one small
language.

Christopher Alexander wrote about patterns as reusable solutions within a
context. That is what this felt like in miniature. The important move was not
"make a component" in the abstract. It was to notice that the product already
had a pattern trying to exist, then give it a single form.

This is the kind of discipline AI can help enforce if it is paying attention:
not just generate the next screen, but ask whether the system is inventing a
new language where an existing one would be calmer.
