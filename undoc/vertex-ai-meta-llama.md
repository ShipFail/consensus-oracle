# Meta Llama API

**Last Verified**: December 2025

## Endpoint

Use this endpoint format:

```
POST https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/endpoints/openapi/chat/completions
```

Variables:
- `{location}`: Region (e.g., `us-central1`)
- `{project}`: Your GCP project ID

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama/use-llama

## Request Schema

```typescript
import { z } from 'zod';

// Message Schema
const LlamaMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant'])
    .describe("Message role. First message MUST be 'user'"),
  content: z.string()
    .describe("Message text content")
});

// Safety Settings Schema
const LlamaSafetySettingsSchema = z.object({
  enabled: z.boolean()
    .describe("Enable Llama Guard 3 safety filtering"),
  llama_guard_settings: z.object({}).passthrough().optional()
    .describe("Additional Llama Guard configuration")
});

// Complete Request Schema
const LlamaRequestSchema = z.object({
  model: z.string()
    .describe("Model name with provider prefix (e.g., 'meta/llama-3.3-70b-instruct-maas')"),
  messages: z.array(LlamaMessageSchema)
    .describe("Conversation history. First message MUST be 'user' role"),
  max_tokens: z.number().int().positive().optional()
    .describe("Maximum tokens to generate"),
  temperature: z.number().min(0).max(2).optional()
    .describe("Randomness. 0=deterministic, 2=creative. Default: 1.0"),
  top_p: z.number().min(0).max(1).optional()
    .describe("Nucleus sampling: cumulative probability threshold"),
  top_k: z.number().int().positive().optional()
    .describe("Limit selection to top K tokens"),
  stop: z.union([z.string(), z.array(z.string())]).optional()
    .describe("Stop generation when any of these strings appear"),
  stream: z.boolean().optional()
    .describe("Enable streaming response"),
  extra_body: z.object({
    google: z.object({
      model_safety_settings: LlamaSafetySettingsSchema.optional()
        .describe("Google Cloud safety settings (Llama Guard)")
    }).optional()
      .describe("Google-specific configurations")
  }).optional()
    .describe("Additional request body parameters")
});
```

## Response Schema

```typescript
// Message Response Schema
const LlamaMessageResponseSchema = z.object({
  role: z.literal('assistant')
    .describe("Responder role (always 'assistant')"),
  content: z.string()
    .describe("Generated text content")
});

// Choice Schema
const LlamaChoiceSchema = z.object({
  index: z.number().int()
    .describe("Index of this choice"),
  message: LlamaMessageResponseSchema
    .describe("Generated message"),
  finish_reason: z.enum(['stop', 'length']).nullable()
    .describe("Why generation stopped: stop=natural end, length=max_tokens hit")
});

// Usage Schema
const LlamaUsageSchema = z.object({
  prompt_tokens: z.number().int()
    .describe("Tokens in input prompt"),
  completion_tokens: z.number().int()
    .describe("Tokens in generated completion"),
  total_tokens: z.number().int()
    .describe("Total tokens (prompt + completion)")
});

// Complete Response Schema
const LlamaResponseSchema = z.object({
  id: z.string()
    .describe("Unique completion ID"),
  object: z.literal('chat.completion')
    .describe("Object type (always 'chat.completion')"),
  created: z.number().int()
    .describe("Unix timestamp of generation"),
  model: z.string()
    .describe("Model that generated the response"),
  choices: z.array(LlamaChoiceSchema)
    .describe("Array of generated choices"),
  usage: LlamaUsageSchema
    .describe("Token usage statistics")
});

// Extract text from response
const text = response.choices[0].message.content;
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
- **First message role**: First message in array MUST have `role='user'` (not system)
- **Llama Guard**: Enabled by default on all predictions
- Set `temperature=0` and `top_k=1` for deterministic generation
- **seed parameter**: NOT supported on Llama models
