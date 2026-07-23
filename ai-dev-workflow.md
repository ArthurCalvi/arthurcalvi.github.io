---
layout: article
title: AI-native development with Linear
date: 2026-07-23
section: home
description: How I use Linear to coordinate human decisions, AI agents, and delivery gates—and help other R&D teams adapt the workflow.
permalink: /ai-dev-workflow/
linear_workflow: true
---

AI can write code quickly. The harder problem is keeping that work connected to the real product, the current decisions, and the evidence required to ship it.

Inspired by how engineering teams at OpenAI and Anthropic work with coding agents, I set up this workflow in my own team. It lets one person direct several AI workstreams without giving up responsibility for the result. The human sets the outcome, priorities, and architecture. Each agent receives a bounded issue, reads the relevant sources, makes a change, verifies it, and returns evidence.

I am now advising other R&D teams as they adapt the same principles to their own tools and constraints.

Linear acts as the shared control plane. It records what matters now, who owns it, what it depends on, and what will count as done. The code and pull requests remain in GitHub. Builds and delivery evidence remain in CI. Documentation stays in the systems where it is maintained. Linear connects these sources into one plan; it does not try to replace them.

{% include linear-workflow.html %}

## Work becomes ready before it is delegated

A raw idea first needs to become a clear piece of work. During discovery, a person or an agent gathers the live context and writes down the goal, scope, constraints, acceptance criteria, and expected evidence.

Only then is the issue ready for implementation. In this model, Todo is a quality gate rather than a parking lot. An agent should be able to start from the issue and its linked sources without relying on a private conversation that the rest of the team cannot see.

This also makes parallel work simpler. Separate agents can work on independent issues while dependencies and decisions remain visible to everyone.

## Evidence replaces constant supervision

The aim is to avoid making the human follow every step or reconstruct the entire implementation at the end. The workflow relies on a short, repeated evidence loop:

1. Read the issue, dependencies, and live sources.
2. Plan a bounded change, implement it, and add the required tests.
3. Run repository checks and targeted AI reviews locally.
4. Fix failures and repeat until the local evidence is complete.
5. Open the pull request and run the repository and CI gates again.
6. Review the result, the trade-offs, and any decision that still needs human judgment.

The local preflight is one part of this loop. Deterministic checks cover properties such as lint, build, tests, and repository rules. AI reviews look for risks that are harder to express as a command: architecture drift, inconsistent documentation, security problems, or interface issues. A deterministic failure can block the work; a design trade-off remains a human decision.

## The human remains the architect

AI agents can execute and advise, but the human still owns the product outcome and the overall design of the system. Cross-cutting decisions are discussed by the team and written back into the shared plan. Agents coordinate through issues, dependencies, pull requests, and evidence rather than through hidden conversations.

I am still testing and adapting this model with my team. The point is not autonomy for its own sake. It is to shorten feedback loops while keeping responsibility, decisions, and proof visible.
