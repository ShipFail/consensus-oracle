---
title: "Thoth — Cross-Model Source of Truth"
author: "Huan Li"
date: 2025-11-21
tags:
  - deterministic
  - oracle
  - source-of-truth
---

> Working title: **Thoth**  
> Tagline: **Many models in. One written answer out.**  
> Positioning: **Cross‑model source of truth for humans and agents.**

---

## 1. Origin Story & Motivation

### 1.1. The Chicken Joke & the Missing Oracle

The project started from a small but striking observation about **deterministic decoding** in LLMs.

Set multiple LLMs to:

- `temperature = 0`
- `top_k = 1`

Then ask all of them:

> **"Tell me a joke."**

Different vendors, architectures, and training runs **collapse to essentially the same joke**:

> *"Why did the chicken cross the road? To get to the other side."*

This suggests two things:

1. There exists a **dominant, universal, statistically highest‑probability answer** to certain questions across human training data.
2. Deterministic decoding across models acts like a probe into that **shared prior**.

Now contrast that with how humans search for truth today:

- We ask friends, read blogs, scroll social feeds.
- We search Google and get **10 slightly different answers**.
- We ask one LLM (usually ChatGPT) and **trust it blindly**.
- When different sources conflict, there is **no canonical place** to get a single, high‑confidence answer.

There is **no modern “oracle”** that says: *"Here is what the best models in the world all agree is the answer."*

**Thoth** is that oracle.

### 1.2. From Joke to Golden Truth

The central insight behind Thoth:

> If multiple independently‑trained frontier LLMs, under deterministic decoding, converge on the **same answer**, that answer is the best available **golden truth candidate** we have today.

It is not philosophically perfect truth, but in practice:

- These models are trained on **most of the written internet**.
- They encode **aggregated human knowledge and behavior**.
- With greedy decoding, they surface the **single highest‑confidence answer** they can.

If we:

1. Take the **best models** from different vendors, and
2. Force them to answer deterministically, and
3. Only trust answers where they **strongly agree**,

…then we have a practical, high‑confidence **source‑of‑truth signal** that’s **better than any individual source**.

Thoth’s promise:

> **When Thoth speaks, it’s because the best models all said the same thing.**

---

## 2. Concept Overview

### 2.1. One‑Line Idea

> **Thoth asks multiple frontier LLMs the same question with deterministic decoding, measures how strongly they agree, and returns a single golden answer plus a consensus score so humans and agents can treat it as a source‑of‑truth signal.**

### 2.2. What Thoth Is

Thoth is:

- A **source‑of‑truth service** that sits in front of multiple LLMs.
- A **web app** for people who want to check:
  - "What do the best models agree on here?"
- An **API** for agents and apps that need a **truth‑prior**:
  - Only act when consensus is high.
  - Escalate to humans when consensus is low.

Thoth is **not**:

- A philosophical oracle of absolute reality.
- A guarantee that consensus always means correctness.
- A replacement for careful reasoning or domain expertise.

But given how humans already behave today—trusting a single LLM as truth—Thoth is a **strict upgrade**:

- One trusted LLM → **many top models in agreement**.
- One unverified answer → **golden answer + consensus score**.

---

## 3. Product Vision

### 3.1. Core User Story

"Sometimes I just want the **most reliable answer** I can get right now. I’m okay with the world being uncertain, but I want to know:

- When is the answer **clear and stable**?
- When is it **conflicted or controversial**?

Today I have to:

- Read many sources, or
- Trust one model blindly.

I want a place that acts as my **oracle**: one place to ask, and get back the **golden truth answer** plus how confident I should be."

Thoth is that place.

### 3.2. Thoth in One Diagram

1. **Input**: Short question from a human or agent.
2. **Model Fan‑Out**: Thoth queries multiple frontier models (e.g., Gemini 3.0 Flash Lite, Claude 4 Haiku, Llama 4) via Vertex AI with deterministic decoding.
3. **Agreement Engine**: Thoth compares the answers using exact match + embeddings, computes a consensus score.
4. **Golden Answer Selection**:
   - If consensus is high, Thoth selects a single representative answer and treats it as the **golden answer**.
   - If consensus is low, Thoth may return multiple divergent answers and a warning.
5. **Output**: JSON payload + UI view containing:
   - Golden answer
   - Consensus score `[0, 1]`
   - Label: **Strong consensus / Partial consensus / Disagreement**
   - Per‑model answers for transparency

---

## 4. Technical Design (Aligned with Thoth’s Philosophy)

### 4.1. Stack & Infrastructure

We follow the agreed stack:

- **Frontend & Backend**: Next.js (App Router)
- **Auth & Persistence**: Firebase (Auth, Firestore, Hosting)
- **LLM Gateway**: Vertex AI (Google Cloud, Application Default Credentials)
- **Styling**: Tailwind CSS

Principles:

- Keep everything inside **Next.js** to minimize context switching.
- Use **Firebase** wherever possible for auth, storage, and hosting.
- Use **Vertex AI** to access multiple LLM providers (Gemini, Claude, Llama) through **one gateway**, no direct vendor keys in the app.

### 4.2. Deterministic Decoding as a Truth Probe

Thoth’s core assumption:

> Greedy decoding (`temperature = 0`) reveals each model’s **highest‑confidence answer**.

For each model call we:

- Set `temperature = 0`.
- Set `top_k = 1` or the closest equivalent parameter per provider.
- Disable any stochastic sampling options.

We use the **latest and lightest** production‑ready models available via Vertex AI to keep latency and cost low while maintaining quality, e.g.:

- **Gemini 3.0 Flash Lite**
- **Claude 4 Haiku**
- **Llama 4** (appropriate size via Model Garden)

All calls are executed **in parallel** (e.g. `Promise.all`) so that Thoth feels as fast as a single model call.

### 4.3. Consensus & Golden Answer Computation

1. **Normalization**
   - Lowercase, strip punctuation, normalize whitespace.

2. **Exact Match Check**
   - If all normalized answers are identical → `consensusScore = 1.0`.

3. **Semantic Similarity**
   - Use a Vertex AI embedding model to embed each answer.
   - Compute pairwise cosine similarities between all answer vectors.
   - Average the pairwise similarities → `consensusScore ∈ [0, 1]`.

4. **Label Mapping**
   - `≥ 0.90` → **Strong consensus** (golden truth candidate)
   - `0.70–0.89` → **Partial consensus** (usable with caution)
   - `< 0.70` → **Disagreement** (no single golden answer)

5. **Golden Answer Selection**
   - When consensus is strong, pick the **shortest, cleanest** answer as the golden answer (e.g., via simple heuristics or an LLM‑based selector).
   - When consensus is partial, optionally let an LLM summarize the cluster into a **single synthesized golden answer** while exposing raw answers.
   - When disagreement dominates, **do not pick a golden answer**; instead, surface the disagreement and encourage human judgment.

This keeps Thoth honest: it only speaks with authority when the models actually agree.

### 4.4. API Contract (MVP)

`POST /api/thoth`

Request:

```json
{
  "question": "Who wrote 1984?"
}
```

Response (example):

```json
{
  "question": "Who wrote 1984?",
  "goldenAnswer": "1984 was written by George Orwell.",
  "consensusScore": 0.98,
  "consensusLabel": "strong_consensus",
  "models": [
    {
      "name": "gemini-3.0-flash-lite",
      "provider": "google",
      "answer": "1984 was written by George Orwell.",
      "latencyMs": 530
    },
    {
      "name": "claude-4-haiku",
      "provider": "anthropic",
      "answer": "The novel '1984' was written by George Orwell.",
      "latencyMs": 610
    },
    {
      "name": "llama-4",
      "provider": "meta",
      "answer": "1984 was written by George Orwell.",
      "latencyMs": 700
    }
  ]
}
```

Agents can then:

- Treat `goldenAnswer` as the default action plan when `consensusLabel` is strong.
- Request human review or alternate tools when consensus is partial or disagreement.

---

## 5. Experience & Storytelling

### 5.1. Web App

The Thoth web UI will:

- Let users type a **short question**.
- Show **Thoth’s golden answer** at the top.
- Display:
  - Consensus score + label.
  - Per‑model answers for transparency.
- Highlight when:
  - "Thoth speaks" (strong consensus).
  - "Thoth is uncertain" (partial / disagreement).

This reinforces the idea that Thoth is an **oracle that only speaks confidently when the models do.**

### 5.2. Demo Flow

1. Ask: `Tell me a joke` → all models converge → Thoth returns the classic chicken joke as the **golden answer** with very high consensus.
2. Ask: `What is the capital of France?` → perfect agreement → golden answer with near‑perfect consensus.
3. Ask: `When will AGI arrive?` → answers diverge → Thoth refuses to pick a golden answer, instead shows disagreement and warns that there is no stable truth here.

In under a minute, people see:

- Thoth as a living **source‑of‑truth API**.
- How "golden answers" emerge from deterministic cross‑model agreement.
- When Thoth is willing to speak—and when it steps back.

---

## 6. Philosophy: Thoth as Today’s Best Oracle

### 6.1. Why LLMs Are Our Best Information Source

Whether we like it or not, LLMs are already:

- Trained on more text than any human can read.
- Used by millions of people daily as a primary knowledge tool.
- Embedded into search engines, copilots, agents, and workflows.

Most people **already treat them as oracles**, but:

- They usually use only **one** model.
- They do not control decoding.
- They have **no visibility** into cross‑model agreement.

Thoth makes this behavior safer and more transparent by:

- Forcing deterministic decoding (highest‑confidence answers).
- Requiring agreement across **multiple top models**.
- Exposing a numeric consensus score and raw answers.

### 6.2. Consensus vs Truth

We stay humble:

- High consensus ≠ guaranteed truth.
- Low consensus ≠ guaranteed falsehood.

What Thoth gives is the **best practical truth signal** available today:

- Better than a single model.
- Better than skimming a few random links.
- Measurable, explainable, and inspectable.

The guiding mental model:

> **Thoth is not the god of truth; Thoth is the scribe who faithfully records what many powerful models say when asked deterministically.**

---

## 7. Scope for First MVP

**MVP Features**

- Next.js app with a single **Ask Thoth** page.
- Firebase Auth (optional sign‑in) + Firestore logging of questions and answers.
- Vertex AI integration to call:
  - Gemini 3.0 Flash Lite
  - Claude 4 Haiku
  - Llama 4
- Deterministic decoding + parallel fan‑out.
- Basic consensus scoring (exact match + embeddings).
- Golden answer selection with score + label.

**Stretch**

- Public REST API key for authenticated users.
- History view with previous Thoth answers.
- Research mode: export questions + answers + consensus.
- Advanced consensus metrics.

---

## 8. Recap

- People need a place to ask for the **most reliable answer** available right now.
- There is no single human or website that can do this.
- But we do have multiple **frontier LLMs** trained on most human text.
- Under greedy decoding, each of them gives its own **highest‑confidence answer**.
- When those answers **all agree**, that is our best candidate for a **golden truth answer**.

**Thoth** is the product that:

- Asks multiple frontier LLMs the same question with deterministic decoding.
- Measures how strongly they agree.
- Returns a **golden answer and a consensus score**.

Many models in. One written answer out. Thoth as the closest thing we have to an oracle today.