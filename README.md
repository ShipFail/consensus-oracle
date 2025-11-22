# 🧠 LLM Consensus Oracle

> *"Many models. One answer. How strong is the world’s prior?"*

<div align="center">
<img src="./docs/consensus-oracle-logo.webp" alt="AI Consensus Oracle Logo" width=256 height=256/>
</div>

## ✨ One‑liner

**LLM Consensus Oracle** is a web app + API that asks multiple frontier LLMs the same question with **deterministic decoding** and measures how strongly they **agree**, exposing hidden *shared priors* in our collective training data.

---

## 🚀 Elevator Pitch

Modern LLMs are trained on an unimaginably large slice of human text. Sometimes, when you ask something simple like **"Tell me a joke"**, very different models converge on **the same answer**.

That’s not an accident — it’s a **dominant, universal, statistically highest‑probability answer** emerging across models.

**LLM Consensus Oracle** turns this into a product:

* 🔁 Ask a short question once
* 🤖 Query multiple LLMs (Gemini, GPT, Claude, etc.) with **deterministic settings**
* 📊 Compute how similar their answers are
* 🧭 Use the agreement score as a proxy for **cross‑model consensus**

It’s not a truth machine. It’s a **truth estimator**.

---

## 🧩 Motivation

### The Problem

Today we mostly:

* Ask **one** model
* Get **one** answer
* Treat that as **ground truth**

But in reality:

* 🔄 Sampling adds randomness
* 🧱 Vendors behave differently
* 🎭 Models hallucinate
* ⚖️ There’s no visibility into whether an answer is a weird edge case or a strong shared prior

### The Idea

Instead of asking *"What does one model say?"*, we ask:

> **"What do multiple strong models say when you remove randomness—and how strongly do they agree?"**

High agreement ≈ a strong shared prior in human data.
Low agreement ≈ ambiguity, controversy, or hallucination risk.

---

## ✅ What It Does

1. Takes a **short natural-language question** from the user
2. Calls multiple LLM providers with **deterministic decoding**:

   * `temperature = 0`
   * `top_p = 1.0`
   * `top_k = 1` (or closest equivalent)
3. Collects each model’s answer
4. Computes an **agreement score** (exact match + embedding similarity)
5. Returns:

   * Each model’s answer
   * A **consensus score** in `[0, 1]`
   * A label: **Strong / Partial / Disagreement**

This gives you a quick sense of **where models converge or diverge**.

---

## 🏗️ Architecture Snapshot

**Frontend**

* **Next.js** (App Router) for both frontend and API routes
* **Tailwind CSS** for rapid, consistent UI styling
* Question input + results panel with:

  * model answers
  * consensus meter

**Backend & Infrastructure**

* **Firebase** for hosting, backend services, and optional persistence
* **Vertex AI** (via Google Cloud) to access multiple LLM providers (Gemini, etc.) through a unified interface
* `/api/ask` endpoint:

  * validates the question
  * calls multiple LLM APIs via Vertex AI with deterministic settings
  * computes pairwise similarity between answers
  * returns structured JSON to the frontend

**Consensus Engine (MVP)**

1. Normalize answers (lowercase, trim, strip punctuation)
2. If all strings are equal → `consensusScore = 1.0`
3. Otherwise:

   * compute embeddings for each answer (using Vertex AI embeddings)
   * average pairwise cosine similarity → `consensusScore`
4. Map score to label:

   * `>= 0.90` → **Strong consensus**
   * `0.70–0.89` → **Partial consensus**
   * `< 0.70` → **Disagreement**

---

## ⚡ Quickstart

> Exact commands may evolve as the codebase matures.

### Prerequisites

* Node.js & npm
* Google Cloud Platform project with Vertex AI API enabled
* Firebase project (optional for local dev, required for deployment)
* `gcloud` CLI installed and authenticated

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ShipFail/consensus-oracle.git
   cd consensus-oracle
   npm install
   ```

2. **Configure Google Cloud Credentials**

   Ensure you have Application Default Credentials (ADC) set up so the app can access Vertex AI:

   ```bash
   gcloud auth application-default login
   ```

3. **Environment Variables**

   Create `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Configure your Google Cloud project details:

   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

Then open:

```text
http://localhost:3000
```

Ask something like:

* `Tell me a joke`
* `What is the capital of France?`
* `Who wrote 1984?`

…and watch the consensus meter.

---

## 👀 Example

**Question**

> `Tell me a joke`

**Hypothetical answers**

* GPT‑4.x: Why did the chicken cross the road? To get to the other side.
* Gemini 2.0: Why did the chicken cross the road? To get to the other side.
* Claude 3.5 Sonnet: Why did the scarecrow win an award? Because he was outstanding in his field.

**Consensus**

* Two identical, one very similar dad joke
* High embedding similarity → **Strong consensus**

This is exactly the kind of emergent behavior the app is designed to reveal.

---

## 🚫 What This Project Is *Not*

* ❌ A philosophical truth oracle
* ❌ A replacement for human judgment
* ❌ A tool for resolving politics, ethics, or values

It **is**:

* ✅ A probe into **shared priors** across models
* ✅ A quick **hallucination / weirdness check**
* ✅ A fun way to demo and study LLM behavior

---

## 🗺️ Roadmap (Ideas)

* Better similarity metrics (NLI, task‑aware scoring)
* Auto‑tagging questions (facts vs opinions vs predictions)
* Human voting: compare human vs model consensus
* Dashboards: top agreements / disagreements
* Simple JSON API for agents and other apps

---

## 🤝 Contributing

PRs, issues, and ideas are very welcome.

* File bugs or confusing behavior
* Propose better consensus metrics
* Add support for more providers
* Improve docs and examples

Basic flow:

```bash
git clone https://github.com/ShipFail/consensus-oracle.git
cd consensus-oracle
npm install
npm run dev
```

---

## 📜 License

MIT. See [`LICENSE`](./LICENSE).

---

## 🧭 Final Thought

When you strip away randomness and ask **many models the same question**, you start to see the **shape of our shared training data**.

**LLM Consensus Oracle** is a small tool for exploring that shape — and maybe, just a little, for estimating what we collectively treat as “obviously true.”
