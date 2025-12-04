# Meta Llama API

**Last Verified**: December 2025

## Endpoint

Use this endpoint format (native Vertex AI generateContent):

```
POST https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/meta/models/{model}:generateContent
```

Variables:
- `{location}`: Region (e.g., `us-central1`)
- `{project}`: Your GCP project ID
- `{model}`: Meta model ID without the `meta/` prefix (e.g., `llama-4-maverick-17b-128e-instruct-maas`)

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama/use-llama

## Request Schema

```typescript
import { z } from 'zod';

// Message Schema (Vertex contents/parts)
const LlamaContentSchema = z.object({
  role: z.enum(['system', 'user', 'assistant'])
    .describe("Message role. First message MUST be 'user'"),
  parts: z.array(z.object({
    text: z.string().optional()
  }))
    .describe("Content parts; text-only supported here")
});

// Generation Config
const LlamaGenerationConfigSchema = z.object({
  temperature: z.number().min(0).max(2).optional()
    .describe("Randomness. 0=deterministic, 2=creative. Default: 1.0"),
  topP: z.number().min(0).max(1).optional()
    .describe("Nucleus sampling: cumulative probability threshold"),
  topK: z.number().int().positive().optional()
    .describe("Limit selection to top K tokens"),
  maxOutputTokens: z.number().int().positive().optional()
    .describe("Maximum tokens to generate"),
  stopSequences: z.array(z.string()).optional()
    .describe("Stop generation when any of these strings appear"),
  seed: z.number().int().optional()
    .describe("Random seed for best-effort determinism; default is random")
});

// Complete Request Schema
const LlamaRequestSchema = z.object({
  contents: z.array(LlamaContentSchema)
    .describe("Conversation history. First message MUST be 'user' role"),
  generationConfig: LlamaGenerationConfigSchema.optional()
    .describe("Sampling and limit configuration")
});
```

## Response Schema

```typescript
// Candidate Schema
const LlamaCandidateSchema = z.object({
  content: LlamaContentSchema
    .describe("Generated assistant content"),
  finishReason: z.string().nullable().optional()
    .describe("Why generation stopped (e.g., STOP, MAX_TOKENS)")
});

// Complete Response Schema
const LlamaResponseSchema = z.object({
  candidates: z.array(LlamaCandidateSchema).optional()
    .describe("Array of generated candidates"),
  promptFeedback: z.object({
    blockReason: z.string().optional()
  }).optional()
    .describe("Safety block feedback when applicable")
});

// Extract text from first candidate
const text = response.candidates?.[0]?.content?.parts
  ?.map(part => part.text || '')
  .join('') || '';
```

## Verified Model Names

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama

Use these exact model names with `meta/` prefix and `-maas` suffix:

```
meta/llama-4-maverick-17b-128e-instruct-maas    (Llama 4 with MoE architecture, 400B total params)
meta/llama-4-scout-17b-16e-instruct-maas        (Llama 4 optimized for retrieval tasks)
meta/llama-3.3-70b-instruct-maas                (Llama 3.3 70B, enhanced over 3.1)
meta/llama-3.2-90b-vision-instruct-maas         (Llama 3.2 with vision capabilities)
meta/llama-3.2-11b-vision-instruct-maas         (Llama 3.2 11B vision)
meta/llama-3.2-3b-instruct-maas                 (Llama 3.2 3B)
meta/llama-3.2-1b-instruct-maas                 (Llama 3.2 1B)
meta/llama-3.1-405b-instruct-maas               (Llama 3.1 405B)
meta/llama-3.1-70b-instruct-maas                (Llama 3.1 70B)
meta/llama-3.1-8b-instruct-maas                 (Llama 3.1 8B)
```

## Critical Rules

- **Model prefix**: MUST include `meta/` prefix
- **-maas suffix**: ALL Llama models MUST include `-maas` suffix (Model-as-a-Service)
- **Endpoint path**: For `.../publishers/meta/models/{model}:generateContent`, use the model ID *without* the `meta/` prefix (the helper normalizes this).
- **First message role**: First message in array MUST have `role='user'` (not system)
- **Llama Guard**: Enabled by default on all predictions
- Set `temperature=0`, `top_k=1`, and `seed=42` for best-effort deterministic generation
- **seed parameter**: Supported (best effort determinism). Default is random seed.
