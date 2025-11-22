# Project PRD: LLM Consensus Oracle (Working Title)

> A web-based tool to visualize and quantify cross-model agreement between frontier LLMs, using deterministic decoding as a proxy for shared human priors.

---

## 1. Background & Motivation

### 1.1 Problem

Modern LLMs (GPT, Gemini, Claude, etc.) are trained on overlapping but not identical human corpora. They often behave differently for open-ended prompts, but sometimes converge on the *same* answer when decoding is deterministic. Examples like the "Tell me a joke" → "chicken joke" phenomenon suggest that:

* There exist **dominant, universal, statistically highest-probability answers** (“universal priors”).
* Cross-model agreement under deterministic settings can act as a **signal** for:

  * Strong shared human prior
  * High-likelihood factual answers
  * Cultural universals (e.g., canonical jokes, basic facts)

However, there is no simple tool that:

* Lets users **probe questions** and see how major LLMs agree or disagree.
* Quantifies **consensus vs disagreement** in a user-friendly way.
* Collects a corpus of **high-consensus vs low-consensus questions** for research.

### 1.2 Opportunity

We can build a lightweight web app that:

* Accepts **short questions** from users.
* Queries multiple LLMs under **deterministic settings**.
* Computes a **consensus score** based on answer similarity.
* Surfaces the results via a clear, visual, shareable UI.

This works as:

* A **hackathon project** (simple yet deep).
* A **research utility** for studying priors and hallucinations.
* A **teaching/demo tool** for explaining how LLMs encode human culture.

---

## 2. Vision & Product Statement

> **Vision**: Make the “collective prior” of modern LLMs visible and explorable.

> **Product Statement**: "LLM Consensus Oracle" is a web tool where users ask short questions and see how multiple top LLMs respond under deterministic settings, along with a consensus score that reflects cross-model agreement. High agreement highlights strong shared priors; disagreement reveals ambiguity, controversy, or model-specific behavior.

---

## 3. Goals & Non-Goals

### 3.1 Goals (MVP)

1. **Cross-model Answer Comparison**
   For any short question, show deterministic answers from 2–3 major LLMs.

2. **Consensus Measurement**
   Compute and display a numerical **consensus score** (0–100%) based on answer similarity.

3. **Simple, Shareable UI**
   Provide a clean interface that can be demoed live (e.g., at a hackathon) with minimal friction.

4. **Basic Question History**
   Show the last N questions and their consensus scores for the current session.

5. **Deterministic Settings Enforcement**
   Ensure all model calls use the strictest possible deterministic decoding (e.g., `temperature=0`, `top_k=1`, `top_p=1` or equivalent).

### 3.2 Stretch Goals (Post-MVP / Nice-to-Have)

1. **Public Leaderboard** for questions with highest and lowest consensus.
2. **User Accounts** and saved question sets.
3. **Human Voting** on which answer is best / most correct.
4. **Categorization** of questions: Facts vs Opinions vs Predictions vs Values.
5. **API Access** exposing consensus scores for external tools.

### 3.3 Non-Goals

* The product is **not a truth oracle**; it does not guarantee correctness.
* We are **not** solving alignment or safety research at production depth.
* We are **not** doing full-scale misinformation detection or moderation.
* We are **not** implementing large-scale analytics or big-data pipelines in the MVP.

---

## 4. Target Users & Personas

### 4.1 Primary Personas

1. **Curious Developer / Hacker (Alex)**

   * Wants to play with LLM behavior.
   * Enjoys asking questions and seeing differences between GPT, Gemini, Claude.
   * May use the tool during demos or talks.

2. **AI Researcher / Practitioner (Riley)**

   * Interested in measuring hallucinations and model variance.
   * Uses the tool to probe where models agree/disagree.
   * Might export data for later analysis.

3. **Educator / Explainer (Sam)**

   * Teaches students or colleagues about LLMs.
   * Uses the tool live in lectures to show how models respond.
   * Wants clear visualizations and simple language.

### 4.2 Secondary Personas

4. **Non-technical Curious User (Jamie)**

   * Wants to “ask the AI gods” about controversial or fun topics.
   * Needs a very simple UI and explanations.

5. **Hackathon Judge / Investor (Taylor)**

   * Wants to understand the value proposition quickly.
   * Evaluates if this can become a deeper product or research tool.

---

## 5. User Stories

### 5.1 MVP User Stories

1. **Ask & See Answers**
   As a *curious user*, I want to type a short question and see how multiple LLMs answer it, so I can compare their outputs.

2. **See Consensus Score**
   As a *researcher*, I want to see a consensus score between 0–100% so I can quickly assess how much the models agree.

3. **View Model-wise Breakdown**
   As a *developer*, I want to see each model’s answer labeled by model name (e.g., GPT-4.1, Gemini 2.0, Claude 3.5 Sonnet), so I can reason about differences.

4. **Understand the Score**
   As a *non-technical user*, I want a simple textual label (e.g., “Strong Consensus”, “Partial Consensus”, “Disagreement”) so I understand what the score means.

5. **See My Recent Questions**
   As a *user*, I want to see the recent questions I asked and their consensus levels, without creating an account, so I can explore patterns.

6. **Deterministic Behavior**
   As a *researcher*, I want the system to use deterministic decoding settings so that repeated queries are as stable as possible.

7. **Error Handling**
   As a *user*, I want clear error messages if a model call fails (e.g., rate limit, timeout), so I understand what happened.

### 5.2 Stretch User Stories

8. **Leaderboard of Questions**
   As a *researcher*, I want to see a leaderboard of “most agreed” and “most disagreed” questions so I can explore interesting cases.

9. **Tagging Question Types**
   As a *user*, I want to know if my question is factual, opinion-based, or predictive, so I can interpret consensus appropriately.

10. **Vote on Best Answer**
    As a *user*, I want to upvote the answer I believe is best, so the system can compare human and model consensus.

11. **Export Data**
    As a *researcher*, I want to export a CSV/JSON of questions, answers, and consensus scores for offline analysis.

12. **API Access**
    As a *developer*, I want to call an API endpoint with a question and receive a consensus score and per-model answers.

---

## 6. User Journey & Flows

### 6.1 High-Level Journey (MVP)

1. **Landing**

   * User opens the website.
   * Sees a brief tagline and a single prominent input: “Ask a short question”.

2. **Question Entry**

   * User types a question (e.g., “What is the capital of France?”).
   * Clicks “Ask” or hits Enter.

3. **Processing State**

   * UI shows a loading state (e.g., spinner or skeleton).
   * Optionally displays which models are currently being queried.

4. **Result Display**

   * Shows:

     * Question
     * Consensus score (0–100%) as a visual meter
     * Consensus label (Strong / Partial / Disagreement)
     * List of answers per model, with model badges.
   * Optionally highlights portions of text that are similar.

5. **Exploration**

   * User scrolls down to see recent questions and their consensus scores.
   * User might refine the question or ask a new one.

6. **Repeat or Share (future)**

   * User may screenshot or share the result (e.g., link sharing in later versions).

### 6.2 Detailed Flow (Ask Question)

1. **Input validation**

   * Check length (e.g., 5–200 characters).
   * Basic profanity / abuse filtering.

2. **Backend request**

   * Frontend sends POST `/api/ask` with `{ question }`.

3. **Backend execution**

   * For each configured model:

     * Call provider API with deterministic settings.
     * Enforce timeouts.
   * Normalize each answer (text only in MVP).
   * Compute similarity matrix and consensus score.
   * Derive label based on thresholds.

4. **Response**

   * Backend returns JSON with question, answers, consensus score, label, metadata (latency, model names).

5. **Render**

   * Frontend displays consensus meter and answers.

6. **History update**

   * Frontend adds this question to recent history (session-based).

---

## 7. User Map (MVP)

### 7.1 Actions & Steps

* **Discover**

  * Land on site → Read tagline → Understand concept.
* **Ask**

  * Type question → Submit.
* **Wait**

  * See loading → Maybe see per-model loading status.
* **See Results**

  * View consensus score → Interpret label → Compare answers.
* **Reflect / Iterate**

  * Ask variants of the question → Observe changes in consensus.
* **Review**

  * Scroll history → Revisit earlier questions.

### 7.2 Emotions & Needs

* Curiosity: “Do AI models agree?”
* Surprise: “Wow, they all say the same thing here.”
* Insight: “On this controversial question, they disagree a lot.”
* Trust: “System is transparent about where models diverge.”

---

## 8. Core Features & Requirements

### 8.1 Feature: Multi-Model Deterministic Answering

**Description**: For each user question, query multiple LLMs in parallel with deterministic decoding settings and display each answer.

**Requirements**:

* Support at least **2 models** in MVP (ideally 3–4), prioritizing speed and cost:

  * Example: **Gemini 3.0 Flash Lite**, **Claude 4 Haiku**, **Llama 4** (via Vertex AI).
* **Parallel Execution**: All model API calls must be initiated simultaneously (e.g., `Promise.all`) to minimize total wait time.
* Use deterministic settings per provider:

  * `temperature = 0`
  * `top_p = 1` / full probability mass
  * `top_k = 1` or equivalent greedy decoding if available
* Handle provider-specific constraints gracefully (e.g., defaults that can’t be changed).

### 8.2 Feature: Consensus Scoring

**Description**: Compute a consensus score between 0–100% representing cross-model agreement.

**Requirements**:

* Normalization step:

  * Lowercase text
  * Strip punctuation and extra whitespace
* Exact-match fast path:

  * If all normalized outputs are identical → consensus = 100%.
* Otherwise:

  * Use an embedding model to generate vector for each answer.
  * Compute pairwise cosine similarity.
  * Average the pairwise similarities → base consensus score.
* Map consensus score to label:

  * `>= 0.9` → **Strong Consensus**
  * `0.7–0.9` → **Partial Consensus**
  * `< 0.7` → **Disagreement**
* Ensure the score and label are returned in the API response.

### 8.3 Feature: Question History (Session-based)

**Description**: Show the last N questions asked in the current browser session with simplified summary.

**Requirements**:

* Store recent questions and metadata (in-memory or localStorage on frontend):

  * Question text
  * Consensus score
  * Label
  * Timestamp
* Display a simple table/list of recent entries below the main interaction area.
* Allow clicking a history entry to re-open its answers and details (optional for MVP).

### 8.4 Feature: Clear, Explainer UI

**Description**: Make results understandable to both technical and non-technical users.

**Requirements**:

* Consensus meter visualization (e.g., horizontal bar or gauge).
* Simple label text under the meter explaining the result.
* One-sentence explanation text, e.g.:

  * "Strong Consensus: The models gave almost identical answers."
  * "Partial Consensus: The models overlap but differ in details."
  * "Disagreement: The models gave noticeably different answers."
* Model answers displayed in clearly separated cards, each labeled with model name and provider.

### 8.5 Feature: Error Handling & Timeouts

**Description**: Make model failures visible and non-breaking.

**Requirements**:

* If a single provider fails:

  * Mark that model’s answer as “Error / Unavailable”.
  * Still compute consensus using the remaining models (with a note!).
* If all providers fail:

  * Show a clear error message and suggest retry.
* Enforce per-model timeouts (e.g., 10s max) to keep UI responsive.

---

## 9. Non-Functional Requirements

### 9.1 Performance

* Target end-to-end latency: **< 3 seconds** for 3 models on typical questions (achieved via parallel execution and lightweight models).
* UI should feel responsive with clear loading indicators.

### 9.2 Reliability

* Handle partial outages by degrading gracefully.
* Log errors server-side for debugging.

### 9.3 Security & Privacy

* Do not log user IPs or PII in a detailed way (keep minimal metrics).
* Do not expose API keys to the frontend.
* For hackathon, environment variables in server-side runtime are acceptable.

### 9.4 Scalability (Hackathon Level)

* Support at least low hundreds of requests per day.
* No need for complex autoscaling in MVP.

### 9.5 UX Quality

* Simple, minimalistic design suitable for demoing on a projector.
* Mobile-friendly basic layout.

---

## 10. Technical Architecture (High-level)

### 10.1 Frontend

* Framework: React / Next.js (or similar; flexible).
* Components:

  * Question input form
  * Results view (consensus meter + model answer cards)
  * Recent history panel
  * Error banner / toast system

### 10.2 Backend

* Environment: Node.js + TypeScript (ideal), or any serverless runtime.
* Single main endpoint: `POST /api/ask`

  * Request: `{ question: string }`
  * Response:

    ```json
    {
      "question": "...",
      "models": [
        { "name": "gemini-3.0-flash-lite", "provider": "google", "answer": "...", "latencyMs": 600 },
        { "name": "claude-4-haiku", "provider": "anthropic", "answer": "...", "latencyMs": 500 },
        { "name": "llama-4-8b", "provider": "meta", "answer": "...", "latencyMs": 550 }
      ],
      "consensusScore": 0.93,
      "consensusLabel": "strong_consensus",
      "errorModels": [],
      "createdAt": "2025-11-21T12:00:00Z"
    }
    ```

### 10.3 External Services

* LLM Providers (via Vertex AI where possible):

  * **Google**: Gemini 3.0 Flash Lite (Fast, efficient)
  * **Anthropic**: Claude 4 Haiku (Fastest in class)
  * **Meta**: Llama 4 (via Vertex Model Garden)
* Embedding Provider:

  * Vertex AI `text-embedding-004` (one model for all answers).

---

## 11. Metrics & Success Criteria

### 11.1 Hackathon Success

* ✅ Live demo successfully shows:

  * Consistent behavior across multiple real-time questions.
  * Clear visual difference between high-consensus and low-consensus questions.
* ✅ At least **5–10 interesting curated examples** ready to show judges.

### 11.2 Product Metrics (if continued)

* Daily active users (DAU) exploring questions.
* Number of questions asked per session.
* Distribution of consensus scores (how many High vs Low consensus questions).
* Most frequently revisited or shared questions (if shares/bookmarks exist later).

---

## 12. Risks & Open Questions

### 12.1 Risks

1. **APIs & Cost**

   * Multiple model calls per question may be expensive.
   * Mitigation: limit to lightweight models (Flash, Haiku); add rate limiting; cache repeated questions.

2. **Interpretation Risk**

   * Users might mistake consensus for truth.
   * Mitigation: clear disclaimer; phrasing like "consensus" not "truth".

3. **Latency**

   * Multiple external calls may be slow.
   * Mitigation: **parallelize requests**; pick faster models (Gemini Flash, Haiku).

4. **Model Policy Changes**

   * Provider behavior might change over time.
   * Mitigation: expose model version, and expect some drift.

### 12.2 Open Questions

1. **Naming**

   * Final product name: Consensus Oracle? Priorscope? Many Minds? Something else?

2. **Scope of Questions**

   * Do we need to limit to short, factual questions in MVP, or allow open-ended (e.g., jokes, advice)?

3. **Embeddings Model Choice**

   * Should we use a single general embedding model or specialized ones per provider?

4. **Public vs Private Logging**

   * Do we show other users’ questions on the homepage (privacy vs discovery trade-off)?

5. **Research Extension**

   * Do we want to design the schema from day one to support future research (e.g., exportable dataset)?

---

## 13. MVP Cut (Strict)

To ensure we can finish this in a short hackathon timeframe, the **strict MVP** includes only:

1. Single-page web UI with:

   * Question input box
   * Results panel (consensus meter + answers)
   * Recent session history

2. Backend endpoint `POST /api/ask` that:

   * Calls 2–3 LLMs deterministically
   * Computes a consensus score using embeddings
   * Returns JSON for the UI

3. Basic error handling + simple visual states.

Everything else (leaderboard, user accounts, tagging, exports) is **out of scope for MVP**, but we can mention them as future directions in the hackathon pitch.

---

## 14. Narrative for Hackathon Pitch

> "We built a Consensus Oracle for LLMs. You ask any short question, and we send it to multiple frontier models — GPT, Gemini, Claude — in a fully deterministic way (temperature zero, greedy decoding). We compute how similar their answers are, and show you a consensus score.
>
> When the score is high, it means the models share a strong prior — like the universal chicken joke. When the score is low, you’ve found an area of ambiguity or disagreement in the collective AI mind. It’s not a truth machine, but it’s a new lens on how AI systems encode human knowledge and culture."

This PRD defines the scope, flows, and feature set necessary to build a compelling MVP in a hackathon setting, while leaving clear paths for deeper research and productization afterwards.
