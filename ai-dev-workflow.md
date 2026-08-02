---
layout: article
title: AI-native development with Linear
date: 2026-07-23
section: articles
description: How I use Linear, explicit issues, deterministic checks, and independent reviews to turn AI coding into a controlled feedback loop.
permalink: /ai-dev-workflow/
linear_workflow: true
---

AI needs organisation. Intelligence becomes useful work only when a system gives it direction, makes problems visible, and feeds failures back into the work.

This is not a new idea. [Toyota’s production system](https://global.toyota/en/company/vision-and-philosophy/production-system/) pairs *jidoka*, stopping work when an abnormality appears, with *andon*, making the problem visible. Software teams already use a similar pattern through issues, tests, pull requests, and CI.

What changed is the supply of execution. Capable coding agents are now broadly available and inexpensive enough to use repeatedly. Most teams are not yet organised to use them well.

Drawing on public work from [OpenAI’s Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) and [Anthropic’s guidance on agent evaluations](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), I built this workflow for my team at DxO. I now help other teams adapt the same principles to their own tools and constraints. It is still evolving.

## Linear as the control plane

People and agents need one shared place where work can be found and understood. I use Linear because it is opinionated, pleasant for people, and easy to connect to agent workflows. It holds the issue, its dependencies, its current state, and the evidence expected before it is done.

The code remains in GitHub. Checks remain in the repository and CI. Linear connects them without trying to replace them.

The states are deliberately ordinary: Intake, Discovery, Todo, In Progress, In Review, and Done. An issue can become Blocked at any point.

{% include linear-workflow.html %}

## Make the issue executable

An idea is not ready to delegate. During discovery, a person and an agent inspect the code, compare technologies, understand the architecture, and decide what outcome matters.

The issue then records the goal, acceptance criteria, constraints, dependencies, and expected evidence. Todo has a precise meaning: an agent can begin from the issue and its linked sources without depending on a private conversation.

Agents can be rerun and constrained, but their instructions and feedback need to be explicit.

## Let the system review the work

The agent can now implement the change. At scale, however, In Review cannot simply become a queue in which a person rereads every generated line.

Before opening a pull request, the agent runs a local `pr-preflight` that combines:

- deterministic checks such as linting, builds, tests, repository rules, and LOC ratchets;
- independent AI reviews for security, architecture, documentation, and interface risks.

Failures and review findings return to the implementing agent. It revises the code and runs the gates again.

This is not a one-shot process, and the gates are not perfect. They improve as the team turns failures into checks. People still choose what to build, make the important trade-offs, and accept the outcome.

The point is not to trust the AI. It is to build a system whose gates you understand and whose evidence you can inspect.
