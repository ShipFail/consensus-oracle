# 🪬 Thoth

> _"Where all answers are written."_

<div align="center">
<img src="./docs/consensus-oracle-logo.webp" alt="AI Consensus Oracle Logo" width=256 height=256/>
</div>

**Thoth** is a web app + API that asks multiple frontier LLMs the same question with **deterministic decoding**, measures how strongly they agree, and returns a **single golden answer plus a consensus score**, so humans and agents can treat it as a practical **source‑of‑truth signal** instead of trusting a single model.

> Mental model: **One question → many models → one golden answer + consensus score.**

---

## ✨ Why Thoth

When people want the truth today, they usually:

- Ask friends or search the web and get conflicting answers, or
- Ask **one** LLM (often ChatGPT) and trust it blindly.

Meanwhile:

- Different sources often **disagree**.
- LLMs sometimes **hallucinate**.
- There is **no canonical place** that says:
  > "Here is what the best models in the world all agree is the answer."

Thoth turns the models themselves into a **modern oracle**:

1. Use **greedy, deterministic decoding** so each model gives its **highest‑confidence answer**.
2. Ask multiple **frontier models from different vendors** the same question.
3. Only speak with authority when they **strongly agree**.

The result is a **golden answer** plus a **consensus score** that reflects how stable that answer is across models.

---

## 🧩 What Thoth Does

1. You (or your agent) send a **short question** to Thoth.
2. Thoth calls multiple LLMs via **Vertex AI** with deterministic decoding, for example:
   - Gemini 3.0 Flash Lite
   - Claude 4 Haiku
   - Llama 4 (via Model Garden)
3. Thoth **compares their answers** (exact match + embeddings).
4. Thoth computes a **consensus score** in `[0, 1]` and a label:
   - **Strong consensus** — models strongly agree; safe to treat as golden answer
   - **Partial consensus** — some agreement, some variation; use with caution
   - **Disagreement** — models diverge; no single golden answer
5. Thoth returns:
   - A **golden answer** when consensus is strong
   - Each model’s raw answer for transparency
   - The consensus score + label

You can:

- Use the web UI as a **truth‑prior checker**.
- Integrate the API into **agents, eval pipelines, or internal tools**.

---

## 🏗️ Architecture

Thoth is deliberately built on a focused, opinionated stack:

- **Framework**: Next.js (App Router) — frontend and backend in one codebase.
- **Backend & Hosting**: Firebase
  - Firebase Hosting for serving the Next.js app.
  - Firebase Auth for user sign‑in (optional but recommended).
  - Firestore for logging questions, answers, and consensus scores.
- **LLM Gateway**: Vertex AI
  - Access Gemini, Claude, Llama (and others) through a single, managed interface.
  - Use **Application Default Credentials (ADC)** instead of hard‑coding provider keys.
- **Styling**: Tailwind CSS

**Core components (MVP):**

- `app/page.tsx` — main **Ask Thoth** page.
- `app/api/thoth/route.ts` — API route that:
  - Validates the question.
  - Calls Vertex AI for multiple models in parallel with `temperature = 0`, `top_k = 1`.
  - Computes the consensus score and label.
  - Selects a golden answer when appropriate.
- Firestore collections for:
  - `questions` (question text, user, timestamp)
  - `answers` (per‑model answers, latencies)
  - `consensus` (score, label, golden answer)

---

## ⚙️ Setup & Development

> These steps describe the intended setup for the Next.js + Firebase + Vertex AI implementation.

### 1. Prerequisites

- **Node.js** and **npm** installed.
- A **Google Cloud** project with **Vertex AI** enabled.
- A **Firebase** project linked to that Google Cloud project.
- `gcloud` CLI installed and authenticated.

### 2. Clone and Install

```bash
git clone https://github.com/ShipFail/consensus-oracle.git
cd consensus-oracle
npm install
```

### 3. Configure Google Cloud ADC

Set up **Application Default Credentials** so the Next.js backend can call Vertex AI:

```bash
gcloud auth application-default login
```

Ensure your active configuration points to the correct project.

### 4. Environment Variables

Create `.env.local` in the project root (if it does not exist yet):

```bash
cp .env.example .env.local
```

Then configure at least:

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
FIREBASE_PROJECT_ID=your-firebase-project-id
# Any other Firebase/Next.js config as needed
```

### 5. Run the Dev Server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Ask questions like:

- `Tell me a joke`
- `What is the capital of France?`
- `Who wrote 1984?`

…and watch Thoth return a golden answer and a consensus score.

---

## 🔌 API Shape (MVP)

**Endpoint**

```http
POST /api/thoth
```

**Request**

```json
{
  "question": "Who wrote 1984?"
}
```

**Response (example)**

```json
{
  "question": "Who wrote 1984?",
  "goldenAnswer": "1984 was written by George Orwell.",
  "consensusScore": 0.98,
  "consensusLabel": "strong_consensus",
  "models": [
    { "name": "gemini-3.0-flash-lite", "provider": "google", "answer": "1984 was written by George Orwell.", "latencyMs": 530 },
    { "name": "claude-4-haiku", "provider": "anthropic", "answer": "The novel '1984' was written by George Orwell.", "latencyMs": 610 },
    { "name": "llama-4", "provider": "meta", "answer": "1984 was written by George Orwell.", "latencyMs": 700 }
  ]
}
```

Agents can treat `goldenAnswer` as the action plan when `consensusLabel` is strong, and fall back to other strategies when it is not.

---

## 🧠 Interpreting Thoth’s Answers

- **High consensus** means:
  - Multiple large, independently‑trained LLMs, under deterministic decoding, produced **very similar answers**.
  - There is likely a strong **shared prior** in human training data.

- **Low consensus** means:
  - The question is ambiguous, controversial, or under‑specified, or
  - Models are trained/aligned differently on this topic.

Thoth is explicit about what it is doing: it is not discovering metaphysical truth; it is surfacing the **best aggregate signal** we can get from the models we already rely on.

---

## 🗺️ Roadmap Ideas

- Better consensus metrics (NLI, task‑aware scoring).
- User accounts and saved Thoth sessions in Firestore.
- Export mode for research (CSV of questions + answers + scores).
- Fine‑grained control over which models participate.
- Simple SDKs (TypeScript, Python) for calling the Thoth API.

---

## 🤝 Contributing

Ideas, issues, and pull requests are welcome.

- If you care about evals, safety, or epistemology, help us design better consensus metrics.
- If you build agents, help define what a **good truth‑prior check** looks like in real workflows.

Basic dev loop:

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

When you remove randomness and ask **many strong models** the same question, you start to see where the world’s written knowledge has a **stable answer** and where it does not.

**Thoth** is a small step toward giving humans and agents a **single place to ask for the best available answer**, with the humility to say when the models themselves disagree.