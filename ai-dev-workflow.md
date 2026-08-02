---
layout: article
title: AI-native development with Linear
date: 2026-07-23
section: home
description: How I use Linear to coordinate human decisions, AI agents, and delivery gates, and help other R&D teams adapt the workflow.
permalink: /ai-dev-workflow/
linear_workflow: true
---

AI can write code quickly. The harder part is keeping that work connected to the product, the current decisions, and the evidence needed to ship it.

Drawing on public accounts from engineering teams at OpenAI and Anthropic, I set up this workflow in my own team. A person defines the outcome, priorities, and architecture. An agent receives a bounded issue, reads the relevant sources, makes a change, and returns evidence. This makes it possible to run several workstreams while keeping responsibility for the result clear.

I now advise other R&amp;D teams at DxO as they adapt the same principles to their own tools and constraints.

Linear is the shared place where the work is coordinated. It records the current work, its owner, its dependencies, and what will count as done. Code and pull requests stay in GitHub. Builds and delivery evidence stay in CI. Linear connects these sources without trying to replace them.

{% include linear-workflow.html %}

## Make the work clear before delegating it

A raw idea first needs to become a clear piece of work. During discovery, a person or an agent gathers the live context and writes down the goal, scope, constraints, acceptance criteria, and expected evidence.

Only then is the issue ready for implementation. In this model, Todo is a quality gate rather than a parking lot. An agent should be able to start from the issue and its linked sources without relying on a private conversation that the rest of the team cannot see.

This makes parallel work simpler. Separate agents can work on independent issues while dependencies and decisions remain visible.

## A short evidence loop

The human should not need to follow every step or reconstruct the implementation at the end. The workflow uses a local quality gate called `pr-preflight`. It combines deterministic checks, such as linting, builds, tests, and repository rules, with independent AI reviews. Those reviews can examine security, architecture, documentation, and interface risks. One example is a Codex security review.

The loop is short:

1. Read the issue, dependencies, and live sources.
2. Plan a bounded change, implement it, and add the required tests.
3. Run `pr-preflight` locally.
4. Return any findings to the coding agent, revise the change, and rerun the gate.
5. Open the pull request and run the repository and CI gates again.
6. Review the result, the trade-offs, and any decision that still needs human judgment.

Findings return to the main coding agent, which revises the change and reruns the gate until the pull request is ready or a trade-off needs human judgment.

## The human remains the architect

AI agents can execute and advise, but the human still owns the product outcome and the overall design of the system. Cross-cutting decisions are discussed by the team and written back into the shared plan. Agents coordinate through issues, dependencies, pull requests, and evidence rather than through hidden conversations.

I am still testing and adapting this model with my team. The point is not autonomy for its own sake. It is to shorten feedback loops while keeping responsibility, decisions, and evidence visible.
