# 🧠 LLM Consensus Oracle — Pitch

> Many models. One answer. How strong is the world’s prior?

---

## ⚡ One-liner (Primary)

**LLM Consensus Oracle shows you how strongly multiple frontier LLMs agree on an answer under deterministic decoding, so humans and agents can instantly tell if a response reflects a strong shared prior or a shaky hallucination.**

---

### 🎯 One-liner Variants

**YC-flavored (problem/solution angle)**  
> We’re building LLM Consensus Oracle, which turns Gemini, Claude, and Llama into a single “consensus API” that scores how much they agree on an answer, so you can trust outputs before you ship them to users or agents.

**Hackathon-flavored (demo angle)**  
> LLM Consensus Oracle is a live dashboard that asks multiple LLMs the same question and shows a consensus meter, so in one glance you see if the models really agree—or are just hallucinating in different directions.

Pick the one that feels most natural for you on stage.

---

## 🚀 30-Second YC-Style Elevator Pitch

Today everyone treats a single LLM’s output as ground truth, but models hallucinate and vendors often disagree—and you have no way to see that.  
**LLM Consensus Oracle** fixes this by asking multiple frontier models like Gemini, Claude, and Llama the same question with deterministic settings, comparing their answers, and returning a simple **consensus score** and label: strong agreement, partial agreement, or disagreement.  

You get a web UI and an API that tell you, in one call, whether many independent models converge on the same answer—so you and your agents can treat it as a strong prior, and flag everything else as risky.

---

## 🎤 45–60s Hackathon Demo Pitch

We built **LLM Consensus Oracle** to answer a simple question:  
> “Do different LLMs really agree on this answer, or is this just one model’s hallucination?”

Instead of calling a single model, we hit **Gemini, Claude, and Llama** with **deterministic decoding** for the same question, then compute how similar their answers are. We turn that into a **consensus meter**: green for strong agreement, yellow for partial, red for disagreement.

In the demo, we’ll show three questions:

1. **“Tell me a joke”** → models collapse to the same classic joke → strong consensus.  
2. **“What is the capital of France?”** → identical answers → strong consensus.  
3. **“When will AGI arrive?”** → wildly different outputs → clear disagreement.

In under a minute, you see exactly what this does, why it’s real, and how you could plug this “consensus API” into agents, evals, or any app that needs a quick truth-prior check.

---

## 🧭 One-Sentence Summary (For Slides)

> **LLM Consensus Oracle is a web app and API that measures cross-model agreement between Gemini, Claude, and Llama under deterministic decoding, giving you a fast consensus score to tell strong shared priors from shaky hallucinations.**