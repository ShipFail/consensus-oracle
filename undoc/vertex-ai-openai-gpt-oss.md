# OpenAI GPT-OSS API

**Last Verified**: December 2025

## Endpoint

Use this endpoint format:

```
POST https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/endpoints/openapi/chat/completions
```

**Global Endpoint**:
```
POST https://aiplatform.googleapis.com/v1/projects/{project}/locations/global/endpoints/openapi/chat/completions
```

Variables:
- `{location}`: Region (e.g., `us-central1`) or `global`
- `{project}`: Your GCP project ID

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/call-open-model-apis

## Request Schema

```typescript
import { z } from 'zod';

// Message Schema
const OpenAIMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant'])
    .describe("Message role: system for instructions, user for inputs, assistant for responses"),
  content: z.string()
    .describe("Message text content")
});

// Complete Request Schema
const OpenAIRequestSchema = z.object({
  model: z.string()
    .describe("Model name with provider prefix (e.g., 'openai/gpt-oss-120b')"),
  messages: z.array(OpenAIMessageSchema)
    .describe("Conversation history (required)"),
  max_tokens: z.number().int().positive().optional()
    .describe("Maximum tokens to generate"),
  temperature: z.number().min(0).max(2).optional()
    .describe("Randomness. 0=deterministic, 2=creative. Default: 1.0"),
  top_p: z.number().min(0).max(1).optional()
    .describe("Nucleus sampling: cumulative probability threshold"),
  stop: z.union([z.string(), z.array(z.string())]).optional()
    .describe("Stop generation when any of these strings appear"),
  stream: z.boolean().optional()
    .describe("Enable streaming response")
  // Note: top_k is NOT supported by OpenAI
});
```

## Response Schema

```typescript
// Message Response Schema
const OpenAIMessageResponseSchema = z.object({
  role: z.literal('assistant')
    .describe("Responder role (always 'assistant')"),
  content: z.string()
    .describe("Generated text content")
});

// Choice Schema
const OpenAIChoiceSchema = z.object({
  index: z.number().int()
    .describe("Index of this choice"),
  message: OpenAIMessageResponseSchema
    .describe("Generated message"),
  finish_reason: z.enum(['stop', 'length', 'content_filter']).nullable()
    .describe("Why generation stopped: stop=natural end, length=max_tokens hit, content_filter=blocked")
});

// Usage Schema
const OpenAIUsageSchema = z.object({
  prompt_tokens: z.number().int()
    .describe("Tokens in input prompt"),
  completion_tokens: z.number().int()
    .describe("Tokens in generated completion"),
  total_tokens: z.number().int()
    .describe("Total tokens (prompt + completion)")
});

// Complete Response Schema
const OpenAIResponseSchema = z.object({
  id: z.string()
    .describe("Unique completion ID"),
  object: z.literal('chat.completion')
    .describe("Object type (always 'chat.completion')"),
  created: z.number().int()
    .describe("Unix timestamp of generation"),
  model: z.string()
    .describe("Model that generated the response"),
  choices: z.array(OpenAIChoiceSchema)
    .describe("Array of generated choices"),
  usage: OpenAIUsageSchema
    .describe("Token usage statistics")
});

// Extract text from response
const text = response.choices[0].message.content;
```

## Verified Model Names

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai

Use these exact model names with `openai/` prefix:

```
openai/gpt-oss-120b-maas         (120B parameter, Apache 2.0 license, reasoning optimized)
openai/gpt-oss-20b-maas          (20B parameter, Apache 2.0 license, edge deployment)
```

## Critical Rules

- **Model prefix**: MUST include `openai/` prefix (e.g., `openai/gpt-oss-120b`)
- **top_k parameter**: NOT supported - Use `top_p` instead
- **Proprietary models NOT available**: GPT-4, GPT-4o, GPT-4 Turbo, GPT-3.5 are NOT available on Vertex AI (only gpt-oss models)
- Set `temperature=0` and `top_p=0.1` for deterministic generation
- **seed parameter**: NOT supported on OpenAI models
