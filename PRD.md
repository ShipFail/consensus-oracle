# Product Requirements Document (PRD)

## Thoth — Golden Truth from Cross‑Model Agreement

> A web app that asks multiple frontier AI models the same question, treats each model’s answer as its vote, and when they strongly agree, returns a **single golden truth answer plus a confidence signal** that people can rely on as today’s best practical source of truth.

---

## 1. Background & Motivation

### 1.1 Problem

When people want a **truthful answer they can trust**, they usually:

- Search the web, read blogs, ask friends or experts — and get **conflicting answers**.
- Or ask **one** AI assistant and **trust it blindly**, even when other strong models might disagree.

In reality:

- Different information sources (web pages, experts, tools, single models) regularly **contradict each other**.
- It is hard for non‑experts to tell which answer is **most trustworthy**.
- There is **no single place** that says:
  > “Here is the golden truth answer, backed by agreement from today’s best models.”

At the same time, modern AI models:

- Are trained on **vast overlapping slices** of human knowledge.
- Already act as the **default information source** for millions of people.
- Are often treated as **authorities**, especially when people consult one model and accept its output as fact.

This leads to a central pain point:

> People want a **golden truth answer with the highest confidence available today**, but they have no structured way to compare strong models, measure agreement, and know **when to trust** an answer.

### 1.2 Opportunity

We can turn this into a product that:

- Treats **frontier AI models** as today’s strongest information sources.
- Interprets each model’s answer (under consistent settings) as its **truth vote**.
- **Cross‑checks** these votes across models from different providers.
- When they agree, surfaces a **single golden truth answer** and a **confidence signal** representing how strong that agreement is.

This becomes:

- A **place to ask for the golden truth answer** to a question.
- A **source‑of‑truth layer** for people’s decisions and, later, for agents and workflows.
- A **lens on disagreement**, showing users where models diverge instead of pretending there is one stable answer.

---

## 2. Vision & Product Statement

### 2.1 Vision

> Give humans a single, trusted place to ask for the **golden truth answer** — the answer that today’s strongest models independently converge on — along with a clear signal of how confident that truth is.

### 2.2 Product Statement

> **Thoth** is a web app that asks multiple frontier AI models the same question, interprets each model’s response as a truth vote, and measures how strongly those answers agree. When they converge, Thoth returns a **golden truth answer plus a confidence score and label**; when they diverge, Thoth exposes the disagreement instead of pretending there is one truth.

---

## 3. Goals & Non‑Goals

### 3.1 Goals (MVP)

1. **Golden truth answering from multiple models**  
   For any user question, gather answers from multiple strong models and present them in a way that makes agreement and disagreement obvious.

2. **Truth confidence measurement & golden truth answer**  
   Compute and display a **truth‑confidence score** and an interpretable label, and when confidence is high, select and return a **single golden truth answer**.

3. **One‑question–one‑card experience**  
   For each question, create a **dedicated URL** that stores and displays a golden truth card (answer, confidence, per‑model votes, timestamp) that can be revisited and shared.

4. **Source‑of‑truth UI**  
   Provide a clean interface that:  
   - Centers the golden truth answer when it exists.  
   - Explains the confidence score and label in simple language.  
   - Exposes per‑model answers (votes) for transparency.  
   - Makes it **easy and fun to share** a question card with others.

5. **Basic history for individuals**  
   Allow users to see and revisit their recent questions and golden truth cards, with richer persistence for signed‑in users.

6. **Clear positioning around trust**  
   Frame Thoth as a **practical golden truth signal** based on model agreement — not as an infallible oracle or moral authority.

### 3.2 Stretch Goals (Post‑MVP)

1. **Public leaderboard** of questions with the **highest** and **lowest** truth confidence scores.  
2. **Question type classification** (e.g., Fact / Opinion / Prediction / Value) to help users interpret why consensus is high or low.  
3. **Human voting** to compare golden truth answers vs human consensus.  
4. **Export / research mode** for downloading questions, answers, and consensus data for offline analysis.  
5. **SDKs** (e.g., TypeScript, Python) and APIs for agents and tools.  
6. **Richer question history and collections**, such as saved decks of interesting questions.

### 3.3 Non‑Goals (MVP)

- Being a **philosophical or metaphysical truth oracle** or solving deep epistemology.  
- Providing a full‑blown **safety / alignment** system.  
- Serving large‑scale enterprise traffic, multi‑region reliability, or strict SLOs in the MVP.  
- Implementing complex analytics pipelines beyond simple logging, exports, and basic dashboards.  
- Supporting batch/grid input or large‑scale benchmarking in the initial UI.

Thoth is a **practical golden‑truth signal derived from current models**, not an absolute arbiter of reality.

---

## 4. Target Users & Personas

Thoth’s MVP focuses on **human‑scale, lifestyle‑adjacent usage**: settling arguments, testing intuitions, sharing surprising answers, and exploring what AI models have absorbed from human data. It uses **per‑question URLs** and character limits that vary by user tier, but those limits are discovered naturally through use rather than being the core brand.

### 4.1 User Tiers & Question Length (Conceptual)

- **Guest users**  
  - Can ask questions up to **17 characters**.  
  - When they hit this limit, the input quietly stops accepting more characters or shows a small hint encouraging sign‑in for longer questions.

- **Registered users**  
  - Can ask questions up to **31 characters**.  
  - When they reach this limit, the UI suggests upgrading to a subscription for longer questions.

- **Future subscribers**  
  - Will unlock **higher length limits** (e.g., 140, 280, or more characters) as part of paid plans.  
  - Longer questions are especially relevant for exploratory, opinionated, or creative prompts.

These limits are **not the main product story**; they are part of the UX and monetization model. Users simply "ask a question" and learn through interaction how to phrase it within their current tier.

### 4.2 Primary Personas

1. **Arguer / Debater (Alex & Jamie)**  
   - Two friends, partners, or colleagues who are **arguing about a fact** and want a quick, credible way to settle it.  
   - Typical questions:  
     - "Grad % population?"  
     - "Median age US?"  
     - "Obesity rate UK?"  
   - Pain:  
     - They usually rely on gut feeling or a quick search that either confirms their bias or leads to conflicting sources.  
   - How they use Thoth:  
     - One person opens Thoth (often as a guest), types a compact question, and submits.  
     - Thoth returns a **golden truth answer** with a confidence label, plus per‑model answers.  
     - They use the **question URL** as a neutral artifact they can both look at and share in chat.  
   - Value:  
     - A fun, surprising, and low‑effort way to ground everyday arguments in a consensus signal from multiple strong models.

2. **Curious Intuition Tester (Casey)**  
   - An individual who enjoys **testing their beliefs** about the world and learning when their intuition is off.  
   - Typical questions:  
     - "World literacy rate?"  
     - "CO₂ per capita US?"  
     - "Life expectancy Japan?"  
   - Pain:  
     - Checking these facts usually requires context switching into search, skimming long pages, or never checking at all.  
   - How they use Thoth:  
     - Asks questions alone, often signed in to get slightly longer phrasing.  
     - Compares the golden truth answer to their mental guess, and occasionally revisits or bookmarks interesting question URLs.  
   - Value:  
     - Thoth becomes a **lightweight habit** for calibrating "common sense" against a multi‑model consensus without heavy research overhead.

3. **Social Sharer / Storyteller (Sam)**  
   - A content creator, newsletter writer, or community organizer who uses **surprising facts** to drive engagement.  
   - Typical questions:  
     - "Obesity rate US?"  
     - "Median income US?"  
     - "Largest city Africa?"  
   - Pain:  
     - Finding small, trustworthy, well‑formatted facts suitable for posts takes time.  
   - How they use Thoth:  
     - Asks questions when preparing content or reacting to news.  
     - Uses the **question URL** and the visual result card as a ready‑made snippet: link in a post, screenshot in a slide, etc.  
   - Value:  
     - A source of **clean, shareable truth cards** backed by multiple models, which can be dropped directly into social feeds, newsletters, or presentations.

4. **Human‑Knowledge Explorer (Nia)**  
   - A curious user interested in **what AI has learned from humanity’s data** — not just factual truths, but the most common or representative patterns.  
   - Typical questions:  
     - "Most beautiful color?"  
     - "Tell me a joke."  
     - "Best comfort food?"  
   - Motivation:  
     - Wants to see what emerges when powerful models, trained on vast human data, are asked to pick a **single answer** that best represents what they have seen.  
   - How they use Thoth:  
     - Usually signed in, and in the future may subscribe to unlock longer and more expressive prompts.  
     - Asks questions where the answer reflects a **distribution of human preferences or culture**, and reads the golden truth card as a window into that learned distribution (e.g., "blue" as the most common answer for "most beautiful color").  
   - Value:  
     - Thoth becomes a tool for **exploring how human knowledge and taste are encoded in models**, producing intriguing artifacts (colors, jokes, phrases) that people often share.

### 4.3 Secondary Personas (Future‑Facing)

5. **Agent / Infra Engineer (Future API User)**  
   - Will use Thoth’s future API to perform short, high‑confidence checks inside automated workflows.  
   - Not a primary focus of the first consumer‑facing MVP UI, but the **per‑question URL and stored result** structure supports later API access and auditability.

6. **Researcher / Evaluator (Future Export User)**  
   - May later analyze collections of questions and consensus patterns across models.  
   - For the MVP, they can still manually inspect and share individual question URLs, with richer export and analytics deferred to post‑MVP.

---

## 5. User Journey & UX Flow (MVP, One Question – One Card)

The MVP journey is based on a simple pattern: **a user asks a question, Thoth runs multiple models once, stores the result, and creates a stable, shareable question URL that shows the same answer with a timestamp on future visits.**

### 5.1 High‑Level Journey

1. **Landing: Ask a Question**  
   The user opens Thoth and sees:  
   - A concise tagline framing Thoth as a place to get a **golden truth answer backed by multiple models**, without emphasizing question length.  
   - A single, central input field inviting them to **"Ask a question"**.  
   - A discreet character counter (e.g., "0 / 17" for guests, "0 / 31" for signed‑in users), but no prominent copy about limits.

2. **Question Entry & Tier‑Based Limits**  
   As the user types:  
   - **Guests** can enter up to 17 characters.  
     - Upon reaching 17 characters, further input is either blocked or gently truncated.  
     - A small hint appears, such as: "Sign in to ask longer questions."  
   - **Registered users** can enter up to 31 characters.  
     - Upon reaching 31 characters, a hint appears: "Upgrade to ask longer questions."  
   - **Future subscribers** will see higher limits in their counter (e.g., "0 / 140") as part of their plan.  
   - If a user attempts to paste or type a much longer question, the UI suggests simplifying or splitting it, but the public product copy does not frame Thoth as only for "tiny" questions.

3. **Question Submission & URL Creation**  
   When the user submits a question:  
   - Thoth normalizes the text (e.g., trimming whitespace).  
   - It computes or looks up a **stable question ID** and redirects the user to a dedicated **question URL**, such as `/q/abc123`.  
   - This URL is the canonical location for that question’s answer.

4. **First Visit to a Question URL: Answer Generation**  
   If this is the **first time** this exact question has been asked:  
   - The question page shows a loading state that emphasizes that **multiple models are being consulted**.  
   - Thoth sends the question to the configured frontier models, collects their answers, and:  
     - Treats each as a **truth vote**.  
     - Computes a **truth confidence score** and **label** based on agreement.  
     - Selects a **golden truth answer** when appropriate, or determines that models meaningfully disagree.  
   - Thoth **stores the result**, including:  
     - Question text.  
     - Golden truth answer (or a disagreement/no‑truth state).  
     - Per‑model answers.  
     - A generation timestamp.

5. **Question Page: Golden Truth Card**  
   Once answers are ready, the question URL shows a **shareable result card**:  
   - At the top:  
     - The **question** in large type.  
     - A **golden truth answer box** as the focal element when models sufficiently agree.  
     - If models disagree, a clear message such as:  
       > "Models disagree in meaningful ways. There is no single golden truth answer for this question."  
   - Adjacent to the answer:  
     - A **truth confidence meter** with a numeric score and label (e.g., Strong agreement / Partial agreement / Disagreement).  
     - A short, label‑specific explanation about what that means for trust and interpretation.  
     - A visible **timestamp** (e.g., "Answer generated on 2025‑11‑24 13:42 UTC").  
   - Below:  
     - Compact **per‑model answer cards** showing each model’s response, name/label, and any helper text (e.g., "model unavailable" when a call failed).  
   - At the bottom or side:  
     - A **share section** with a "Copy link" button and optional social sharing hooks so users can easily send the question URL to others.

6. **Returning to a Question URL: Stored Answers**  
   When **any user** (including the original asker or someone who received a link) visits the question URL later:  
   - Thoth does **not** automatically re‑query the models.  
   - Instead, it loads the **stored result** and displays:  
     - The same golden truth answer (or disagreement state).  
     - The original timestamp, clearly visible.  
   - This makes each question URL a stable, revisitable **truth card** that can be used in arguments, content, or exploration.  
   - Post‑MVP, Thoth may support explicit re‑runs or history of multiple snapshots, but the strict MVP supports a **single stored answer per question**.

7. **Interpretation, Surprise, and Sharing**  
   From the question page, users can:  
   - Compare the answer to their prior belief or argument position.  
   - Use the result to settle a discussion (Arguer / Debater), recalibrate intuition (Curious Tester), or capture a snippet for content (Sharer).  
   - For more exploratory questions (Human‑Knowledge Explorer), read the answer as a window into what the models consider the most probable completion or representative example.  
   - Click an "Ask another question" control that takes them back to the main input, preserving their sign‑in/subscription context and associated length limit.

### 5.2 Error & Edge Cases

- **Length overflows**  
  - When users attempt to exceed their tier’s length limit (17, 31, etc.), the UI:  
    - Prevents further character entry and/or gracefully truncates.  
    - Provides a gentle suggestion to sign in or upgrade for longer questions, without making length the dominant concept of the product.

- **Partial model failures**  
  - If some models fail to respond for a given question:  
    - Their cards are marked as **unavailable** for that run.  
    - The truth confidence score is computed from the remaining models.  
    - A short note indicates how many models participated (e.g., "3 of 5 models responded").

- **Complete model failure**  
  - If no models can answer a question:  
    - The question page shows a friendly error state explaining that no answer could be generated.  
    - A "Try again" button allows the user to rerun the query later.

- **Disagreement / no golden truth**  
  - When models meaningfully disagree:  
    - Thoth does not present a golden truth answer.  
    - It shows the disagreement message prominently, plus all per‑model answers side‑by‑side.  
    - This outcome is itself valuable and shareable: "Even strong models don’t agree on this."

### 5.3 Experience Goals

Across all flows, the MVP aims to:

- Feel **natural and inviting** ("ask a question") rather than constrained around length, while quietly guiding users into concise prompts.  
- Create frequent moments of **surprise and insight** where users realize their intuition or "common sense" was off.  
- Make each question URL a **share‑worthy artifact** that fits smoothly into people’s digital lives — in chats, social feeds, newsletters, and casual conversations.

---

## 6. Core Features & Product Requirements

### 6.1 Feature: Multi‑Model Truth Gathering

**Description**: For each user question, Thoth gathers answers from multiple strong AI models and treats each answer as that model’s **truth vote**.

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

**Description**: Present Thoth’s outputs in a way that makes trust decisions easy for non‑experts.

**Requirements (Product‑Level)**:

- A highlighted **golden truth answer box** at the top of the results when available, or an explicit **"no golden truth answer"** message when not.  
- A **truth confidence meter** or visual indicator with a numeric score.  
- Short, label‑specific explanations under the meter, for example:  
  - **Strong agreement** — "Several strong models gave essentially the same answer. This is a high‑confidence golden truth answer."  
  - **Partial agreement** — "Models overlap but differ in details. Treat this as a plausible answer and use judgment."  
  - **Disagreement** — "Models gave noticeably different answers. Thoth cannot surface a single truth here."  
- **Per‑model answer cards** that show each model’s answer, name/label, and any relevant meta‑info (e.g., whether an answer was skipped or unavailable).

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

> These are experience‑level expectations rather than technical implementation details.

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
  > "It’s a place where multiple AI models vote on an answer, and when they strongly agree, you get a golden truth answer you can trust."

### 8.2 Early Product Metrics

If extended beyond MVP, Thoth can track:

- Number of unique users asking Thoth questions.  
- Questions per session.  
- Distribution of **truth confidence scores** across questions.  
- Percentage of queries that result in a **golden truth answer** vs **no truth** (disagreement).  
- Most frequently revisited or shared questions (by URL).

---

## 9. Risks & Open Questions

### 9.1 Risks

1. **Over‑trust in golden truth answers**  
   - Users may treat high‑confidence golden truth answers as **absolute facts**, even when underlying models share similar blind spots.  
   - Mitigation: Consistently frame Thoth as a **practical truth signal**, add copy reminding users that all answers come from current models with limitations.

2. **Cost & access to strong models**  
   - Reliance on multiple strong models may be **expensive or rate‑limited**.  
   - Mitigation: Set expectations about usage limits; consider staged rollouts and clear messaging for heavy users.

3. **Latency & user frustration**  
   - Aggregating multiple answers may be slower than single‑model tools.  
   - Mitigation: Invest in good loading states, partial results explanations, and set expectations about tradeoffs between **speed and trust**.

4. **Model drift & changing truths**  
   - As models evolve, their behavior and apparent consensus can **change over time**.  
   - Mitigation: Clearly position Thoth as reflecting **today’s best available consensus**, not eternal truth; consider exposing that behavior may evolve.

5. **Misuse of subjective questions**  
   - Users may over‑interpret consensus on taste or value questions (e.g., "most beautiful color") as universal truth rather than a model‑learned distribution.  
   - Mitigation: Add copy that distinguishes **factual** vs **taste/distributional** questions and clarifies how to interpret answers.

### 9.2 Open Questions

1. **How many models are enough for a useful truth signal?**  
   - Is a small, diverse set sufficient, or do we need many models for higher confidence?

2. **How should golden truth answers be presented for nuanced or probabilistic topics?**  
   - For example, predictions or value questions where there may never be a single simple answer.

3. **Should users see other people’s questions and truths?**  
   - Options include: private by default, public leaderboard, opt‑in sharing, or community curation.

4. **Long‑term positioning**  
   - Should Thoth remain narrowly focused on **golden truth answers**, or expand into broader evaluation, monitoring, or governance tooling around AI outputs?

5. **Tier design & monetization**  
   - How quickly should users be pushed toward registration or subscription for longer questions, and what limits feel natural versus frustrating?

---

## 10. MVP Cut (Strict)

To ship Thoth in a short timeframe, the strict MVP includes:

1. **Single Ask Thoth page**  
   - Question input.  
   - Golden truth answer box (or explicit "no golden truth answer" state).  
   - Truth confidence meter + label.  
   - Per‑model answer cards.  
   - Recent queries list (session‑based, with simple persistence for signed‑in users).

2. **Basic multi‑model truth gathering flow**  
   - For each question, collect answers from multiple models.  
   - Compute a truth confidence score and label based on agreement.  
   - Decide whether to surface a golden truth answer or a disagreement view.

3. **Stable question URLs & stored answers**  
   - Each distinct question is mapped to a dedicated URL.  
   - On first visit, Thoth runs models and stores the result with a timestamp.  
   - On later visits, Thoth shows the stored answer instead of rerunning models by default.

4. **History & copy for trust**  
   - Minimal personal history so users can revisit prior questions.  
   - Clear, concise copy that explains what golden truth answers mean and what their limits are.

5. **Simple, demo‑ready UI**  
   - Clean layout suitable for **live demos**, with dark‑mode or high‑contrast styling.  
   - Focus on clarity of the golden truth answer, trust signal, disagreement cases, and shareability of question URLs.

Everything else (leaderboards, rich exports, sophisticated filters, SDKs, batch input, advanced analytics) is explicitly **out of scope for the strict MVP**, but plausible as follow‑up work.
