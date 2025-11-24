# 🪬 Thoth — Pitch

> _"Where all answers are written."_

---

## ⚡ One‑liner

**Thoth** asks multiple frontier LLMs the same question, treats each model's highest‑confidence answer as its vote, and when they agree, returns a **single golden truth answer plus a truth‑confidence score**, so humans and agents can treat it as a **golden truth signal** instead of trusting a single model.

> **Tagline / descriptor:** Many models in. One golden truth answer out.

---

## 🚀 YC‑style Elevator Pitch (30 seconds)

Today, when people want a truthful answer they can trust, they usually ask **one** LLM (often ChatGPT) and treat its answer as ground truth. But models hallucinate, vendors disagree, and the internet is full of conflicting sources—and you have no visibility into any of that.

**Thoth** fixes this by asking **multiple frontier models** (via Vertex AI) the **same question** with **greedy, deterministic settings**, comparing their answers, and returning a **truth‑confidence score**, a label (strong agreement, partial agreement, disagreement), and a **single golden truth answer** when agreement is high.

You get a web app and an API where humans and agents can query **how strongly the best models in the world agree**, and when they do, treat that answer as the **closest thing we have to a modern golden truth oracle**.

> Many models in. One written truth‑candidate out.

---

## 📚 Background Story

This project started from a small but striking observation:

Set multiple LLMs to deterministic decoding:

- `temperature = 0`
- `top_k = 1`

Then ask all of them:

> **“Tell me a joke.”**

Different vendors, architectures, and training runs all collapsed to essentially the **same joke**.

That suggested something deeper:

- There exists a **dominant, statistically highest‑probability answer** to certain questions across human training data.
- Deterministic decoding across models acts like a probe into that **shared prior**.

If that’s true for a joke, what about:

- Basic facts
- Common sense
- Safe conventions

Today, people are already treating **a single LLM** as an oracle. Thoth’s bet is simple:

> The most reliable information source we have right now is **many strong models in agreement under deterministic decoding**, not one model on its own.

**Thoth** is named after the Egyptian scribe of the gods — the one who **writes things down**. The project’s goal is similar: write down the **golden truth answer that many models agree on**, so you can see it, reason about it, and use it as a practical **golden truth signal**.

---

## 🧩 Problem

Right now, most users and systems:

- Call **one** LLM
- Get **one** answer
- Treat it as **the** answer

This causes issues:

- ❓ No sense of **how stable** that answer is across different models
- ⚔️ Different sources (search, docs, experts, models) **conflict** with each other
- 🎭 **Hallucinations** look indistinguishable from real facts
- 🧱 Each vendor is a **black‑box silo**
- 🔍 There’s no canonical place to ask: _"What do the best models **all** say?"_

Humans need a **single place** they can query for the **highest‑confidence golden truth answer** available right now, with a clear signal of when the world is stable vs. when it is conflicted.

---

## ✅ Solution

Instead of trusting a single model, **Thoth** gives you an instant **cross‑model source‑of‑truth check**.

### How Thoth works

1. A user or agent sends a **short question** to Thoth.
2. Thoth calls multiple LLMs (e.g. Gemini 3.0 Flash Lite, Claude 4 Haiku, Llama 4) via **Vertex AI** with **deterministic decoding**.
3. Thoth **compares their answers** and computes a **truth‑confidence score**.
4. Thoth maps that score into three bands:
   - **Strong agreement** — models strongly agree
   - **Partial agreement** — some agreement, some variation
   - **Disagreement** — models diverge
5. Thoth returns:
   - A **golden truth answer** when agreement is high
   - Each model’s raw answer for transparency
   - The truth‑confidence score + label
   - A simple JSON payload for downstream systems

You can plug this into agents, eval pipelines, or dashboards whenever you want to know:

> _"Is there a stable answer that the best models all converge on, or is this inherently shaky?"_

---

## 🎤 Hackathon Demo Flow (45–60 seconds)

On stage, the live demo is simple and visual:

1. Open the Thoth web UI.
2. Type: `Tell me a joke` → all models converge on the same classic joke → **Strong agreement**, Thoth shows that joke as the **golden truth answer**.
3. Type: `What is the capital of France?` → identical answers → **Strong agreement**, golden truth answer:
   > "Paris."
4. Type: `When will AGI arrive?` → models diverge in predictions → **Disagreement**, Thoth **refuses** to pick a golden truth answer and instead shows the disagreement and a warning.

In under a minute, judges see:

- That the product is real and live
- How multiple models can be collapsed into **one golden truth answer + truth‑confidence score**
- Why that’s useful as a **golden truth signal** for agents and humans

---

## 🌟 Why Thoth Is Interesting

### 1️⃣ Simple mental model

> **One question → many models → one golden truth answer + truth‑confidence score.**

Easy to explain to:

- Hackathon judges
- YC partners
- Researchers
- Engineers building agents

### 2️⃣ Built on top of existing LLMs

No need to train new models. Thoth:

- Plugs into existing **frontier LLMs** through **Vertex AI**
- Uses **deterministic decoding** as a **truth probe**
- Wraps it with a thin **truth‑confidence + golden truth answer engine** and UI

This makes it:

- Fast to prototype
- Cheap to run (lightweight models, parallel calls)
- Easy to extend later (more models, better metrics)

### 3️⃣ Immediately useful signals

- 🔍 **Truth‑prior check** – if many strong models agree deterministically, treat the answer as a strong golden truth‑candidate.
- 🧪 **Eval & research tool** – find questions where models strongly agree or diverge; study stability of model behavior.
- 🛡️ **Safety gate for agents** – require strong consensus before taking high‑impact actions; route low‑consensus cases to humans or alternative tools.

### 4️⃣ Great story and visuals

- The name **Thoth** anchors the myth: scribe of the gods / keeper of records.
- The UI centers around a **golden truth answer box** and a **truth‑confidence meter**, which is instantly understandable.
- The “chicken joke” story is a memorable hook for explaining why deterministic decoding across models reveals a **shared prior**.

---

## 🎯 One‑sentence YC‑style Summary

> **Thoth asks multiple frontier LLMs the same question with deterministic decoding, treats each model's highest‑confidence answer as its vote, and when they agree, returns a golden truth answer plus a truth‑confidence score so humans and agents can treat it as a practical golden truth signal instead of trusting a single model.**
