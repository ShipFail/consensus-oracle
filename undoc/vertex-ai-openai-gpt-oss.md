# OpenAI GPT-OSS API

**Last Verified**: December 2025

## Endpoint

Use this endpoint format (native Vertex AI generateContent):

```
POST https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/openai/models/{model}:generateContent
```

Variables:
- `{location}`: Region (e.g., `us-central1`)
- `{project}`: Your GCP project ID
- `{model}`: OpenAI model ID without the `openai/` prefix (e.g., `gpt-oss-20b-maas`)

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/call-open-model-apis

## Request Schema

```typescript
import { z } from 'zod';

// Content/parts schema (Vertex generateContent)
const OpenAIContentSchema = z.object({
  role: z.enum(['system', 'user', 'assistant'])
    .describe("Message role. First message MUST be 'user'"),
  parts: z.array(z.object({
    text: z.string().optional()
  }))
    .describe("Content parts; text-only supported here")
});

// Generation config schema
const OpenAIGenerationConfigSchema = z.object({
  temperature: z.number().min(0).max(2).optional()
    .describe("Randomness. 0=deterministic, 2=creative. Default: 1.0"),
  topP: z.number().min(0).max(1).optional()
    .describe("Nucleus sampling: cumulative probability threshold"),
  maxOutputTokens: z.number().int().positive().optional()
    .describe("Maximum tokens to generate"),
  stopSequences: z.array(z.string()).optional()
    .describe("Stop generation when any of these strings appear"),
  seed: z.number().int().optional()
    .describe("Random seed for best-effort determinism; default is random")
  // Note: topK is NOT supported by OpenAI GPT-OSS
});

// Complete request schema
const OpenAIRequestSchema = z.object({
  contents: z.array(OpenAIContentSchema)
    .describe("Conversation history (required). First message MUST be 'user'"),
  generationConfig: OpenAIGenerationConfigSchema.optional()
    .describe("Generation parameters (temperature, topP, etc.)")
});
```

## Response Schema

```typescript
// Candidate schema
const OpenAICandidateSchema = z.object({
  content: OpenAIContentSchema
    .describe("Generated assistant content"),
  finishReason: z.string().nullable().optional()
    .describe("Why generation stopped (e.g., STOP, MAX_TOKENS)")
});

// Complete response schema
const OpenAIResponseSchema = z.object({
  candidates: z.array(OpenAICandidateSchema).optional()
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

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai

Use these exact model names with `openai/` prefix (strip the prefix when constructing the endpoint path):

```
openai/gpt-oss-120b-maas         (120B parameter, Apache 2.0 license, reasoning optimized)
openai/gpt-oss-20b-maas          (20B parameter, Apache 2.0 license, edge deployment)
```

## Critical Rules

- **Model prefix**: Use `openai/...` for public IDs; omit the prefix in the endpoint path.
- **-maas suffix**: Required for GPT-OSS models.
- **First message role**: First message MUST be `role='user'`.
- **topK**: Not supported by GPT-OSS; use `topP` instead.
- **Determinism**: Use `temperature=0`, `topP=1`, `seed=42` for best-effort determinism.
- **Seed**: Supported (best effort). Default is random.
- **Proprietary models NOT available**: GPT-4/4o/4 Turbo/3.5 are not exposed here.
