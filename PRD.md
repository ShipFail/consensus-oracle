# Project PRD: Thoth — Cross‑Model Source of Truth

> A web app that asks multiple frontier LLMs the same question with deterministic decoding, measures how strongly they agree, and returns a **single golden answer plus a consensus score** so humans and agents can treat it as a practical source‑of‑truth signal.

---

## 1. Background & Motivation

### 1.1 Problem

When people want a reliable answer today, they usually:

- Ask friends, read blogs, and search the web — and get **conflicting answers**.
- Or ask **one** LLM (often ChatGPT) and **trust it blindly**.

In reality:

- Different information sources regularly **disagree**.
- LLMs sometimes **hallucinate**.
- There is **no canonical place** that says:
  > "Here is what the best models in the world all agree is the answer."

At the same time, frontier LLMs (Gemini, Claude, Llama, etc.)

- Are trained on **huge overlapping slices** of human text.
- Already act as **de facto oracles** for millions of users.

When we set decoding to be **deterministic** (`temperature = 0`, greedy / `top_k = 1`) and ask multiple models the same question — e.g.:

> "Tell me a joke."

They often **collapse to essentially the same classic chicken joke**.

This suggests that:

- There exists a **dominant, universal, statistically highest‑probability answer** to some questions across human training data.
- Deterministic decoding across models acts as a probe into this **shared prior**.

What’s missing today is a **single service** where you can:

- Ask a question once.
- Have **multiple top models** answer deterministically.
- See whether they **converge** or **conflict**.
- Get back a **golden answer + consensus score** when they converge.

That is what Thoth provides.

### 1.2 Opportunity

We can turn this idea into a concrete product:

- A **web app** where users ask questions and get:
  - A golden answer.
  - A consensus score and label.
  - Per‑model answers for transparency.
- An **API** where agents and tools can ask:
  > "Is there a stable, high‑confidence answer here that many strong models agree on?"

This serves as:

- A **source‑of‑truth layer** for agents and workflows.
- A **research tool** for studying model priors and disagreements.
- A **demo/teaching tool** for explaining how LLMs encode human knowledge.

---

## 2. Vision & Product Statement

> **Vision**: Give humans and agents a single place to ask for the **best available answer** today, grounded in cross‑model deterministic agreement.

> **Product Statement**: **Thoth** is a web app that asks multiple frontier LLMs the same question with deterministic decoding, measures how strongly they agree, and returns a **golden answer plus a consensus score**. When the best models all say the same thing, Thoth surfaces that as a strong source‑of‑truth signal; when they diverge, Thoth exposes the disagreement instead of pretending there is one answer.

---

## 3. Goals & Non‑Goals

### 3.1 Goals (MVP)

1. **Cross‑Model Deterministic Answering**  
   For any short question, show deterministic answers from multiple strong LLMs, all run with strict deterministic decoding.

2. **Consensus Measurement & Golden Answer**  
   Compute and display a **consensus score** (0–1 / 0–100%) and label, and when consensus is strong, select and return a **single golden answer**.

3. **Source‑of‑Truth UI**  
   Provide a clean **Ask Thoth** interface that:  
   - Shows the **golden answer** prominently.  
   - Explains the consensus score and label.  
   - Exposes per‑model answers for transparency.

4. **Basic Question History**  
   Show the last N questions and their golden answers/consensus scores; persist for signed‑in users.

5. **Strict Deterministic Settings**  
   Ensure all model calls use strict deterministic decoding (e.g., `temperature=0`, `top_k=1` or provider equivalent) so that re‑asking the same question yields stable results.

### 3.2 Stretch Goals (Post‑MVP)

1. **Public Leaderboard** of questions with highest and lowest consensus.
2. **Question Type Classification** (Fact / Opinion / Prediction / Value).
3. **Human Voting** to compare model consensus vs human consensus.
4. **Export / Research Mode** (CSV / JSON downloads).
5. **SDKs** (TypeScript, Python) for easy Thoth API integration.

### 3.3 Non‑Goals

- Being a **philosophical truth oracle** or solving epistemology.  
- Full‑blown **safety / alignment infrastructure**.  
- Large‑scale production traffic, multi‑region reliability, or enterprise SLOs in MVP.  
- Implementing complex analytics pipelines beyond simple logging and exports.

Thoth is a **practical source‑of‑truth signal**, not an absolute arbiter of reality.

---

## 4. Target Users & Personas

### 4.1 Primary Personas

1. **Agent / Infra Engineer (Alex)**  
   - Builds agents that act on LLM outputs.  
   - Wants a **cheap truth‑prior check** before high‑impact actions.  
   - Integrates Thoth’s API to gate actions on strong consensus.

2. **AI Researcher / Evaluator (Riley)**  
   - Studies hallucinations, robustness, and cross‑model behavior.  
   - Uses Thoth to find prompts with high vs low consensus.  
   - Exports Thoth data for offline analysis.

3. **Educator / Explainer (Sam)**  
   - Teaches people how LLMs work.  
   - Uses Thoth live in classrooms or talks.  
   - Needs a clear golden answer view + consensus explanation.

### 9. Technical Notes (Non‑binding)

Implementation is intentionally left open. A future engineer (or AI coding agent) is expected to choose the concrete stack, hosting, and integration patterns that best fit the environment, as long as the product behaviors and features in this PRD are preserved.

Non‑functional preferences (e.g., likely use of Next.js, Firebase, Vertex AI, Tailwind) may be documented separately, but are not part of the strict product requirements.

---
## 6. User Journey & Flows

### 6.1 High‑Level Journey (MVP)

1. **Landing**  
   User opens Thoth’s site and sees:
   - Tagline (source‑of‑truth positioning).  
   - Single prominent input: **"Ask Thoth"**.

2. **Question Entry**  
   User types a short question (e.g., "Who wrote 1984?") and submits.

3. **Processing State**  
   UI shows loading; optionally shows which models are being queried.

4. **Result Display**  
   - Thoth shows a **golden answer** (if consensus is strong) in a highlighted box.  
   - Shows consensus score and label.  
   - Shows each model’s answer below for transparency.

5. **Interpretation & Iteration**  
   User reads the explanation text about the label, maybe asks a follow‑up question, or changes topic.

6. **History**  
   Recent questions + golden answers appear in a history panel, with persistence for signed‑in users.

---

## 7. Core Features & Requirements

### 7.1 Feature: Multi‑Model Deterministic Answering

**Description**: For each user question, Thoth queries multiple LLMs under strict deterministic settings and returns their answers. Implementation details (providers, infra, specific models) are left open for future engineering.

### 7.2 Feature: Consensus Scoring & Labels

**Description**: Convert multiple answers into a consensus score and an interpretable label that reflects how tightly clustered the model answers are.

**Requirements (Conceptual)**:

- Thoth computes a **consensus score** for a set of answers.
- That score is mapped into three sigma-inspired bands:
   - **Strong consensus**: score is more than **3σ** above the disagreement baseline.
   - **Partial consensus**: score is between **2σ** and **3σ**.
   - **Disagreement**: score is below **2σ**.
- The UI and any integrations always receive both the numeric score and the label.

### 7.3 Feature: Golden Answer Selection

**Description**: When consensus is high, choose a single golden answer that Thoth surfaces as the primary output.

**Requirements**:

- If `consensusLabel = strong_consensus`:
  - Choose golden answer by heuristic (e.g., pick answer that minimizes total embedding distance to others or is shortest while preserving meaning).  
  - Optionally, use an LLM summarizer (one of the same models) to unify near‑identical answers into a clean canonical phrasing.  
- If `consensusLabel = partial_consensus`:
  - Optionally produce a synthesized golden answer with a clear note that consensus is partial.  
  - Always show per‑model answers beneath.
- If `consensusLabel = disagreement`:
  - Do **not** pick a golden answer.  
  - Set `goldenAnswer = null` and explain that Thoth is unsure; show divergent answers instead.

### 7.4 Feature: Question History (Guest + Auth)

**Description**: Show recent Thoth queries and, for signed‑in users, persist them.

**Requirements**:

- **Guest mode**: keep a small in‑memory / `localStorage` list of recent questions and results.  
- **Auth mode** (Firebase Auth, Google sign‑in):
  - Store each query in Firestore:  
    - `userId`, `question`, `goldenAnswer`, `consensusScore`, `consensusLabel`, list of model answers, timestamps.  
  - Fetch last N queries for display.  
- UI: simple list or table under the main panel, clickable to re‑open a prior result.

### 7.5 Feature: Clear Explanation UI

**Description**: Present Thoth’s results in a way that non‑experts can understand.

**Requirements**:

- Highlighted **golden answer box** at the top of the results (or an explicit message when there is no golden answer).
- Consensus meter (e.g., bar or radial) with numerical score.
- Short explanation under the meter based on label, for example:
  - Strong consensus → "Several strong models gave nearly identical answers."  
  - Partial consensus → "Models overlap but differ in details; use with caution."  
  - Disagreement → "Models gave noticeably different answers; there is no single stable answer here."
- Per‑model answer cards with model name, provider, and response.

### 7.6 Feature: Error Handling & Timeouts

**Description**: Keep the experience robust even when some providers fail.

**Requirements**:

- Per‑model timeout (e.g., 8–10 seconds) to prevent hanging queries.
- If some models fail:
  - Mark those models as errored in the response and UI.  
  - Compute consensus using only successful models (with a clear note that fewer models participated).  
- If all models fail:
  - Return a structured error and show a user‑friendly message with retry guidance.

---

## 8. Non‑Functional Requirements

### 8.1 Performance

- Target end‑to‑end latency **< 3 seconds** for typical questions with 3 models, assuming light models and regional Vertex deployment.  
- All model calls executed in parallel; no sequential fan‑out.

### 8.2 Reliability

- Handle partial provider outages gracefully (see §7.6).  
- Log failures and latencies for debugging and tuning.

### 8.3 Security & Privacy

- Use **Application Default Credentials (ADC)** for Vertex AI; no provider API keys in the client.  
- Store only minimal necessary user data in Firestore.  
- Do not expose questions or answers publicly without explicit design (MVP is per‑user only).

### 8.4 Scalability (MVP)

- Designed for **hackathon / early‑prototype** scale (hundreds of queries per day).  
- No complex autoscaling required; Firebase Hosting + simple backend is sufficient in the short term.

### 8.5 UX & Accessibility

- Mobile‑friendly layout; core interactions work on small screens.  
- Typography and spacing optimized for live demos on projectors.  
- Clear focus states and basic accessibility best practices.

---

## 9. Technical Architecture

### 9.1 Stack Overview

- **Framework**: Next.js (App Router)
- **Backend & Hosting**: Firebase (Hosting + optional Functions if needed)
- **Auth**: Firebase Auth (Google sign‑in)
- **Database**: Firestore (question & history logging)
- **LLM & Embeddings**: Vertex AI (Gemini, Claude, Llama, embeddings)
- **Styling**: Tailwind CSS

### 9.2 Key Components

- `app/page.tsx` — main **Ask Thoth** page (question input, results, history).  
- `app/api/thoth/route.ts` — server route that:  
  - Validates the question.  
  - Calls Vertex AI for multiple models in parallel with deterministic decoding.  
  - Computes consensus score + label and selects golden answer.  
  - Persists results for signed‑in users.  
  - Returns structured JSON to the frontend.

### 9.3 Example API Response

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
      "latencyMs": 530,
      "error": null
    },
    {
      "name": "claude-4-haiku",
      "provider": "anthropic",
      "answer": "The novel '1984' was written by George Orwell.",
      "latencyMs": 610,
      "error": null
    },
    {
      "name": "llama-4",
      "provider": "meta",
      "answer": "1984 was written by George Orwell.",
      "latencyMs": 700,
      "error": null
    }
  ],
  "createdAt": "2025-11-24T12:00:00Z"
}
```

---

## 10. Metrics & Success Criteria

### 10.1 Hackathon Success

- ✅ Live demo reliably shows Thoth returning golden answers and consensus scores for curated examples.  
- ✅ Clear differentiation between strong consensus (e.g., chicken joke, basic facts) and disagreement (e.g., "When will AGI arrive?").  
- ✅ Judges and users can explain Thoth back in one sentence.

### 10.2 Early Product Metrics

If continued beyond hackathon:

- Number of unique users / agents calling Thoth.  
- Questions per session.  
- Distribution of consensus scores across questions.  
- Most frequently revisited questions.

---

## 11. Risks & Open Questions

### 11.1 Risks

1. **API Cost & Rate Limits**  
   - Multiple model calls per query can be expensive.  
   - Mitigation: use light models (Flash Lite, Haiku), add caching and rate limits, and potentially gate heavy usage behind auth.

2. **Over‑trust in Consensus**  
   - Users may equate high consensus with absolute truth.  
   - Mitigation: consistently frame Thoth as a **source‑of‑truth signal**, include clear caveats in UI copy.

3. **Latency Variability**  
   - External providers may spike in latency.  
   - Mitigation: parallel calls, light models, timeouts, and good loading states.

4. **Model Drift**  
   - Vendors may update models and change priors.  
   - Mitigation: include model version info, accept that Thoth reflects the **current** best available oracle.

### 11.2 Open Questions

1. **How many models are enough?**  
   - Is 3 sufficient for a useful signal, or do we want more over time?

2. **How to choose golden answer selection heuristic?**  
   - Heuristic vs LLM‑based summarization vs user choice.

3. **Do we expose other users’ questions?**  
   - Public feed vs per‑user private history vs opt‑in sharing.

4. **Long‑term positioning**  
   - Remain focused on source‑of‑truth, or expand into broader eval / monitoring tooling?

---

## 12. MVP Cut (Strict)

To ship Thoth during a short hackathon, the strict MVP includes:

1. **Single Ask Thoth Page**  
   - Question input.  
   - Golden answer box.  
   - Consensus meter + label.  
   - Per‑model answers.  
   - Recent queries list (session + basic Firestore logging if user is signed in).

2. **Backend Endpoint `/api/thoth`**  
   - Calls 3 frontier models via Vertex AI with deterministic decoding in parallel.  
   - Computes consensus score, label, and golden answer (or none for disagreement).  
   - Returns structured JSON.

3. **Firebase Integration**  
   - Google sign‑in (optional but wired).  
   - Firestore schema for saving queries, golden answers, and consensus scores.

4. **Basic Error Handling & Copy**  
   - Clear messages on provider failures and low‑consensus cases.  
   - Simple, dark‑mode UI with Tailwind, suitable for live demos.

Everything else (leaderboards, tagging, exports, SDKs) is explicitly **out of scope for strict MVP**, but believable as follow‑up work.

---

## 13. Narrative for Hackathon Pitch

> "We built **Thoth**, a cross‑model source of truth. Instead of asking one LLM and hoping it’s right, you ask Thoth once. Under the hood, we query multiple frontier models — Gemini, Claude, Llama — with fully deterministic decoding so each gives its highest‑confidence answer. We compare their outputs, compute a consensus score, and when they strongly agree, we surface a single golden answer you can trust as today’s best truth‑candidate. When they disagree, Thoth doesn’t fake it; it shows you the disagreement instead. It’s not a philosophical oracle—but it’s the closest thing we have to a practical, API‑driven source of truth built from the models everyone already relies on."
