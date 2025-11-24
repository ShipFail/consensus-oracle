# Project PRD: Thoth — Golden Truth from Cross‑Model Agreement

> A web app that asks multiple frontier AI models the same question, treats each model's highest‑confidence answer as its vote, and when they agree, returns a **single golden truth answer plus a confidence signal** that people and agents can rely on as today's best practical source of truth.

---

## 1. Background & Motivation

### 1.1 Problem

When people want a **truthful answer they can trust**, they usually:

- Search the web, read blogs, ask friends or experts — and get **conflicting answers**.
- Or ask **one** AI assistant (often ChatGPT) and **trust it blindly**, even when other strong models might disagree.

In reality:

- Different information sources (web pages, experts, tools, single models) regularly **contradict each other**.
- It is hard for non‑experts to tell which answer is **most trustworthy**.
- There is **no single place** that says:
   > "Here is the golden truth answer, backed by agreement from the best models available today."

At the same time, modern AI models:

- Are trained on **vast overlapping slices** of human knowledge.
- Already act as the **default information source** for millions of people.
- Are often treated as **authorities**, especially when people consult one model and accept its output as fact.

This leads to a central pain point:

> People and agents want a **golden truth answer with the highest confidence available today**, but they have no structured way to compare strong models, measure agreement, and know **when to trust** an answer.

### 1.2 Opportunity

We can turn this into a product that:

- Treats **frontier AI models** as today's strongest information sources.
- Interprets each model's answer (under consistent, deterministic settings) as its **highest‑confidence vote**.
- **Cross‑checks** these votes across models from different providers.
- When they agree, surfaces a **single golden truth answer** and a **confidence signal** representing how strong that agreement is.

This becomes:

- A **place to ask for the golden truth answer** to a question.
- A **source‑of‑truth layer** for agents and workflows that need a high‑confidence check before taking action.
- A **lens on disagreement**, showing users where models diverge instead of pretending there is one stable answer.

---

## 2. Vision & Product Statement

> **Vision**: Give humans and AI agents a single, trusted place to ask for the **golden truth answer** — the answer that today's strongest models independently converge on — along with a clear signal of how confident that truth is.

> **Product Statement**: **Thoth** is a web app that asks multiple frontier AI models the same question, interprets each models response as its highest‑confidence answer, and measures how strongly those answers agree. When they converge, Thoth returns a **golden truth answer plus a confidence score and label**; when they diverge, Thoth exposes the disagreement instead of pretending there is one truth.

---

## 3. Goals & Non‑Goals

### 3.1 Goals (MVP)

1. **Golden Truth Answering from Multiple Models**  
   For any short question, gather top answers from multiple strong models and present them in a way that makes agreement and disagreement obvious.

2. **Truth Confidence Measurement & Golden Truth Answer**  
   Compute and display a **truth‑confidence score** and an interpretable label, and when confidence is high, select and return a **single golden truth answer**.

3. **Source‑of‑Truth UI**  
   Provide a clean **Ask Thoth** interface that:  
   - Shows the **golden truth answer** prominently when it exists.  
   - Explains the truth confidence score and label in simple language.  
   - Exposes per‑model answers (votes) for transparency.

4. **Basic Question History**  
   Show recent questions and their golden truth answers / confidence signals, with persistence for signed‑in users.

5. **Clear Positioning Around Trust**  
   Frame Thoth as a **practical golden truth signal** based on model agreement — not as an infallible oracle.

### 3.2 Stretch Goals (Post‑MVP)

1. **Public Leaderboard** of questions with the **highest** and **lowest** truth confidence scores.
2. **Question Type Classification** (e.g., Fact / Opinion / Prediction / Value) to help users interpret why consensus is high or low.
3. **Human Voting** to compare golden truth answers vs human consensus.
4. **Export / Research Mode** for downloading questions, answers, and consensus data for offline analysis.
5. **SDKs** (e.g., TypeScript, Python) for easy Thoth API integration in agents and tools.

### 3.3 Non‑Goals

- Being a **philosophical or metaphysical truth oracle** or solving deep epistemology.  
- Providing a full‑blown **safety / alignment** system.  
- Serving large‑scale enterprise traffic, multi‑region reliability, or strict SLOs in the MVP.  
- Implementing complex analytics pipelines beyond simple logging, exports, and basic dashboards.

Thoth is a **practical golden‑truth signal derived from current models**, not an absolute arbiter of reality.

---

## 4. Target Users & Personas

### 4.1 Primary Personas

1. **Agent / Infra Engineer (Alex)**  
   - Builds agents or workflows that act on AI outputs.  
   - Wants a **cheap, fast golden truth check** before triggering high‑impact actions (e.g., sending emails, executing trades, updating records).  
   - Integrates Thoth as a gate: only proceed automatically when there is a **high‑confidence golden truth answer**.

2. **AI Researcher / Evaluator (Riley)**  
   - Studies hallucinations, robustness, and cross‑model behavior.  
   - Uses Thoth to find questions where models strongly **converge** vs clearly **disagree**.  
   - Analyzes patterns in golden truth answers vs disagreement regions, and exports data for deeper study.

3. **Educator / Explainer (Sam)**  
   - Teaches people how AI models work and how to reason about trust.  
   - Uses Thoth live in classrooms, talks, or content to show when models **agree on a truth** and when they do not.  
   - Needs a clear golden truth answer view, confidence explanation, and per‑model answers to illustrate the concept.

---

## 5. User Journey & Flows

### 5.1 High‑Level Journey (MVP)

1. **Landing**  
   The user opens Thoth and sees:  
   - A concise tagline that frames Thoth as a **golden truth answer oracle built from multiple models**.  
   - A single prominent input: **"Ask Thoth"**.

2. **Question Entry**  
   The user types a short question (e.g., "Who wrote *1984*?" or "What is the recommended daily protein intake?") and submits.

3. **Processing State**  
   The interface shows that Thoth is **collecting answers from multiple models**, reinforcing that more than one model is being consulted.

4. **Result Display**  
   Thoth shows:  
   - A **golden truth answer** in a highlighted box when confidence is high, or an explicit statement that **no golden truth answer** is available when models disagree.  
   - A **truth confidence score** and label (e.g., Strong agreement / Partial agreement / Disagreement).  
   - A short explanation of what that label means for trust.  
   - Individual **per‑model answer cards** so users can see how each model responded.

5. **Interpretation & Iteration**  
   The user reads the golden truth answer and explanation, then may:  
   - Ask a follow‑up question.  
   - Explore another topic.  
   - Drill into disagreement cases to understand why no golden truth answer was produced.

6. **History**  
   Recent questions and results appear in a **history panel**, with richer, persistent history for signed‑in users.  
   Users can click a past question to reopen its golden truth answer, confidence score, and per‑model answers.

---

## 6. Core Features & Product Requirements

### 6.1 Feature: Multi‑Model Truth Gathering

**Description**: For each user question, Thoth gathers answers from multiple strong AI models and treats each answer as that model's **truth vote**.

**Requirements (Product‑Level)**:

- For every question, Thoth collects a **set of independent answers** from multiple models.  
- The UI makes it clear that each answer comes from a **distinct model** (with model names or labels shown).  
- The system surfaces both **where answers align** and **where they differ**.

### 6.2 Feature: Truth Confidence Scoring & Labels

**Description**: Convert multiple model answers into a **truth confidence score** and a label that reflects how tightly the models agree.

**Requirements (Conceptual)**:

- Thoth computes a single **truth confidence score** based on how similar the model answers are.  
- That score is mapped into at least three bands, for example:  
  - **Strong agreement**: the models give nearly identical answers.  
  - **Partial agreement**: the models overlap but differ in details or framing.  
  - **Disagreement**: the models give meaningfully different answers.
- The UI and any integrations always receive both the **numeric score** and the **label**.

### 6.3 Feature: Golden Truth Answer Selection

**Description**: When models strongly agree, Thoth selects a **single golden truth answer** to surface as the primary output.

**Requirements (Product‑Level)**:

- When the truth confidence label indicates **strong agreement**:  
  - Thoth surfaces a **single golden truth answer** as the main result.  
  - The golden truth answer is accompanied by an explicit statement that it is based on **agreement across multiple strong models**.  
- When the label indicates **partial agreement**:  
  - Thoth may still offer a synthesized golden truth answer, but it must clearly state that confidence is **limited** and that models differ in some details.  
  - Per‑model answers are always visible so users can inspect differences.  
- When the label indicates **disagreement**:  
  - Thoth does **not** present a golden truth answer.  
  - The primary message explains that **models disagree**, and users should not treat any single answer as definitive.  
  - All per‑model answers are shown as separate views of the question.

### 6.4 Feature: Question History (Guest + Auth)

**Description**: Show recent queries and their truth outcomes, and persist them for signed‑in users.

**Requirements (Product‑Level)**:

- **Guest mode**:  
  - Maintain a **short, session‑based history** of recent questions and results.  
  - Allow quick re‑opening of a previous question to review its golden truth answer and confidence.
- **Signed‑in users**:  
  - See an extended **personal history** of past questions and results.  
  - Can browse, search, or filter their history (e.g., by high vs low confidence).  
- History entries show at least: **question**, **whether a golden truth answer was produced**, the **confidence label**, and a timestamp.

### 6.5 Feature: Clear Explanation & Trust UI

**Description**: Present Thoth's outputs in a way that makes trust decisions easy for non‑experts.

**Requirements (Product‑Level)**:

- A highlighted **golden truth answer box** at the top of the results when available, or an explicit **"no golden truth answer"** message when not.  
- A **truth confidence meter** or visual indicator with a numeric score.  
- Short, label‑specific explanations under the meter, for example:  
   - **Strong agreement** — "Several strong models gave essentially the same answer. This is a high‑confidence golden truth answer."  
   - **Partial agreement** — "Models overlap but differ in details. Treat this as a plausible answer and use judgment."  
   - **Disagreement** — "Models gave noticeably different answers. Thoth cannot surface a single truth here."  
- **Per‑model answer cards** that show each models answer, name/label, and any relevant meta‑info (e.g., whether an answer was skipped or unavailable).

### 6.6 Feature: Robust User Experience on Failures

**Description**: Keep the experience understandable when some models or requests fail.

**Requirements (Product‑Level)**:

- If some models fail to answer a question:  
  - Thoth clearly marks those models as **unavailable** for that query.  
  - It computes truth confidence using only the **successful** answers, and notes that **fewer models participated**.  
- If all models fail:  
  - Thoth shows a **clear error state** explaining that no answer could be generated.  
  - It suggests simple next steps (e.g., "Try again" or "Change your question").

---

## 7. Non‑Functional Product Expectations

> Note: These are experience‑level expectations rather than technical implementation details.

### 7.1 Performance (Perceived)

- Users should feel that Thoth responds **quickly enough** for interactive use.  
- The interface should communicate clearly when it is **waiting on model answers** vs when something has gone wrong.

### 7.2 Reliability (Perceived)

- Thoth should handle **partial model failures** gracefully without confusing users.  
- The system should avoid leaving users in ambiguous loading states.

### 7.3 Security & Privacy (User‑Facing)

- Users should understand that their questions and answers are **not automatically public**.  
- Any public exposure of questions (e.g., leaderboards, feeds) must be **explicitly opt‑in**.

### 7.4 Scalability (MVP)

- The MVP is intended for **early‑stage usage** (hackathons, prototypes, small teams) rather than heavy enterprise loads.  
- The product copy should set expectations accordingly.

### 7.5 UX & Accessibility

- The interface should be **readable and usable on mobile** as well as desktop.  
- The layout and typography should be suitable for **live demos or presentations**.  
- Basic accessibility practices should be followed (e.g., clear focus states, sufficient contrast, understandable labels).

---

## 8. Metrics & Success Criteria

### 8.1 Hackathon / MVP Success

For an initial release or hackathon demo, Thoth is successful if:

- The live demo reliably shows Thoth returning **golden truth answers with clear confidence signals** for curated examples.  
- Observers can see clear differences between:  
  - High‑confidence truth questions (e.g., simple facts, well‑agreed recommendations).  
  - Low‑confidence or disagreement questions (e.g., controversial topics, speculative predictions).  
- Judges and users can explain Thoth in **one sentence**, such as:  
   > "It's a place where multiple AI models vote on an answer, and when they strongly agree, you get a golden truth answer you can trust."

### 8.2 Early Product Metrics

If extended beyond MVP, Thoth can track:

- Number of unique users / agents asking Thoth questions.  
- Questions per session or per integration.  
- Distribution of **truth confidence scores** across questions.  
- Percentage of queries that result in a **golden truth answer** vs **no truth** (disagreement).  
- Most frequently revisited or bookmarked questions.

---

## 9. Risks & Open Questions

### 9.1 Risks

1. **Over‑trust in Golden Truth Answers**  
   - Users may treat high‑confidence golden truth answers as **absolute facts**, even when underlying models share similar blind spots.  
   - Mitigation: Consistently frame Thoth as a **practical truth signal**, add copy reminding users that all answers come from current models with limitations.

2. **Cost & Access to Strong Models**  
   - Reliance on multiple strong models may be **expensive or rate‑limited**.  
   - Mitigation: Set expectations about usage limits; consider staged rollouts and clear messaging for heavy users.

3. **Latency & User Frustration**  
   - Aggregating multiple answers may be slower than single‑model tools.  
   - Mitigation: Invest in good loading states, partial results explanations, and set expectations about tradeoffs between **speed and trust**.

4. **Model Drift & Changing Truths**  
   - As models evolve, their behavior and apparent consensus can **change over time**.  
   - Mitigation: Clearly position Thoth as reflecting **today's best available consensus**, not eternal truth; consider exposing that behavior may evolve.

### 9.2 Open Questions

1. **How many models are enough for a useful truth signal?**  
   - Is a small, diverse set sufficient, or do we need many models for higher confidence?

2. **How should golden truth answers be presented for nuanced or probabilistic topics?**  
   - For example, predictions or value questions where there may never be a single simple answer.

3. **Should users see other peoples questions and truths?**  
   - Options include: private by default, public leaderboard, opt‑in sharing, or community curation.

4. **Long‑term positioning**  
   - Should Thoth remain narrowly focused on **golden truth answers**, or expand into broader evaluation, monitoring, or governance tooling around AI outputs?

---

## 10. MVP Cut (Strict)

To ship Thoth in a short timeframe, the strict MVP includes:

1. **Single Ask Thoth Page**  
   - Question input.  
   - Golden truth answer box (or explicit "no golden truth answer" state).  
   - Truth confidence meter + label.  
   - Per‑model answer cards.  
   - Recent queries list (session‑based, with simple persistence for signed‑in users).

2. **Basic Multi‑Model Truth Gathering Flow**  
   - For each question, collect answers from multiple models.  
   - Compute a truth confidence score and label based on agreement.  
   - Decide whether to surface a golden truth answer or a disagreement view.

3. **History & Copy for Trust**  
   - Minimal personal history so users can revisit prior questions.  
   - Clear, concise copy that explains what golden truth answers mean and what their limits are.

4. **Simple, Demo‑Ready UI**  
   - Clean layout suitable for **live demos**, with dark‑mode or high‑contrast styling.  
   - Focus on clarity of the golden truth answer, trust signal, and disagreement cases.

Everything else (leaderboards, rich exports, sophisticated filters, SDKs) is explicitly **out of scope for the strict MVP**, but plausible as follow‑up work.
