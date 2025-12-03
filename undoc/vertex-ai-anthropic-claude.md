# Anthropic Claude API

**Last Verified**: December 2025

## Endpoint

Use this endpoint format:

```
POST https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/anthropic/models/{model}:rawPredict
```

**Streaming Endpoint**:
```
POST https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/anthropic/models/{model}:streamRawPredict
```

Variables:
- `{location}`: Region (e.g., `us-east5`, `europe-west1`) or `global` (check availability)
- `{project}`: Your GCP project ID
- `{model}`: Model name from verified list below

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude/use-claude

## Request Schema

**Official Reference**: https://docs.anthropic.com/en/api/messages

```typescript
import { z } from 'zod';

// Message Schema
const ClaudeMessageSchema = z.object({
  role: z.enum(['user', 'assistant'])
    .describe("Message sender: 'user' for inputs, 'assistant' for Claude's responses"),
  content: z.string()
    .describe("Message text content")
});

// Tool Schema
const ClaudeToolSchema = z.object({
  name: z.string()
    .describe("Tool/function name"),
  description: z.string()
    .describe("What the tool does"),
  input_schema: z.object({
    type: z.literal('object')
      .describe("Must be 'object'"),
    properties: z.record(z.any())
      .describe("Tool parameters as JSON Schema properties"),
    required: z.array(z.string()).optional()
      .describe("List of required parameter names")
  }).describe("JSON Schema for tool inputs")
});

// Thinking Config Schema
const ClaudeThinkingConfigSchema = z.object({
  type: z.literal('enabled')
    .describe("Must be 'enabled' to activate extended thinking"),
  budget_tokens: z.number().int().positive()
    .describe("Max tokens allocated for thinking process")
});

// Complete Request Schema
const ClaudeRequestSchema = z.object({
  anthropic_version: z.literal('vertex-2023-10-16')
    .describe("API version (REQUIRED). Must be 'vertex-2023-10-16'"),
  messages: z.array(ClaudeMessageSchema)
    .describe("Conversation history (required)"),
  max_tokens: z.number().int().positive()
    .describe("Maximum tokens to generate (REQUIRED)"),
  temperature: z.number().min(0).max(1).optional()
    .describe("Randomness. 0=deterministic, 1=creative. Default: 1.0"),
  top_p: z.number().min(0).max(1).optional()
    .describe("Nucleus sampling: cumulative probability threshold"),
  top_k: z.number().int().positive().optional()
    .describe("Limit selection to top K tokens"),
  stop_sequences: z.array(z.string()).optional()
    .describe("Stop generation when any of these strings appear"),
  stream: z.boolean().optional()
    .describe("Enable streaming response (must use streamRawPredict endpoint)"),
  tools: z.array(ClaudeToolSchema).optional()
    .describe("Functions Claude can call"),
  thinking: ClaudeThinkingConfigSchema.optional()
    .describe("Enable extended thinking for complex reasoning")
});
```

## Response Schema

**Official Reference**: https://docs.anthropic.com/en/api/messages

```typescript
// Content Block Schema
const ClaudeContentBlockSchema = z.object({
  type: z.literal('text')
    .describe("Content type (always 'text')"),
  text: z.string()
    .describe("Generated text content")
});

// Usage Schema
const ClaudeUsageSchema = z.object({
  input_tokens: z.number().int()
    .describe("Tokens in input prompt"),
  output_tokens: z.number().int()
    .describe("Tokens in generated response")
});

// Complete Response Schema
const ClaudeResponseSchema = z.object({
  id: z.string()
    .describe("Unique message ID"),
  type: z.literal('message')
    .describe("Response type (always 'message')"),
  role: z.literal('assistant')
    .describe("Responder role (always 'assistant')"),
  content: z.array(ClaudeContentBlockSchema)
    .describe("Array of content blocks"),
  model: z.string()
    .describe("Model that generated the response"),
  stop_reason: z.enum(['end_turn', 'max_tokens', 'stop_sequence']).nullable()
    .describe("Why generation stopped"),
  stop_sequence: z.string().nullable().optional()
    .describe("The specific stop sequence that was matched"),
  usage: ClaudeUsageSchema
    .describe("Token usage statistics")
});

// Extract text from response
const text = response.content[0].text;
```

## Verified Model Names

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude

Use these exact model names with `@20251001` version suffix:

```
claude-opus-4-5@20251001         (Latest flagship - 2025)
claude-sonnet-4-5@20251001       (Latest Sonnet - 2025)
claude-haiku-4-5@20251001        (Latest Haiku - 2025)
```

## Critical Rules

- **anthropic_version field**: REQUIRED - Must be `'vertex-2023-10-16'`
- **max_tokens field**: REQUIRED - Must provide positive integer
- **Version Suffix**: MUST include `@20251001` for Claude 4.5 family models
- Set `temperature=0` and `top_k=1` for deterministic generation
- **seed parameter**: NOT supported on Claude models
