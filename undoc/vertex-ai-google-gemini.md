# Google Gemini API

**Last Verified**: December 2025

## Endpoint

Use this endpoint format:

```
POST https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/google/models/{model}:generateContent
```

Variables:
- `{location}`: Region (e.g., `us-central1`)
- `{project}`: Your GCP project ID
- `{model}`: Model name from verified list below

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent

## Request Schema

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/GenerationConfig

```typescript
import { z } from 'zod';

// Part Schema
const GeminiPartSchema = z.object({
  text: z.string().optional()
    .describe("Text content of the message"),
  inlineData: z.object({
    mimeType: z.string()
      .describe("MIME type (e.g., image/png, audio/mp3)"),
    data: z.string()
      .describe("Base64-encoded media data")
  }).optional()
    .describe("Inline media data embedded in request"),
  fileData: z.object({
    mimeType: z.string()
      .describe("MIME type of the file"),
    fileUri: z.string()
      .describe("Cloud Storage URI (gs://bucket/path)")
  }).optional()
    .describe("Reference to file in Cloud Storage"),
  thought: z.boolean().optional()
    .describe("Mark this part as extended thinking content"),
  thoughtSignature: z.string().optional()
    .describe("Signature for thought verification")
});

// Content Schema
const GeminiContentSchema = z.object({
  role: z.enum(['user', 'model']).optional()
    .describe("Message sender role (defaults to 'user')"),
  parts: z.array(GeminiPartSchema)
    .describe("Array of content parts (text, images, files)")
});

// Safety Setting Schema
const GeminiSafetySettingSchema = z.object({
  category: z.enum([
    'HARM_CATEGORY_HATE_SPEECH',
    'HARM_CATEGORY_DANGEROUS_CONTENT',
    'HARM_CATEGORY_HARASSMENT',
    'HARM_CATEGORY_SEXUALLY_EXPLICIT'
  ]).describe("Harm category to configure blocking threshold for"),
  threshold: z.enum([
    'BLOCK_NONE',
    'BLOCK_ONLY_HIGH',
    'BLOCK_MEDIUM_AND_ABOVE',
    'BLOCK_LOW_AND_ABOVE'
  ]).describe("Threshold for blocking harmful content")
});

// Generation Config Schema
const GeminiGenerationConfigSchema = z.object({
  temperature: z.number().min(0).max(2).optional()
    .describe("Randomness in token selection. 0=deterministic, 2=creative. Default: 1.0"),
  topK: z.number().int().positive().optional()
    .describe("Limit token selection to top K most probable tokens"),
  topP: z.number().min(0).max(1).optional()
    .describe("Nucleus sampling: select tokens with cumulative probability P"),
  candidateCount: z.number().int().min(1).max(8).optional()
    .describe("Number of response variations to generate (1-8)"),
  maxOutputTokens: z.number().int().positive().optional()
    .describe("Maximum tokens in generated response"),
  presencePenalty: z.number().min(-2).max(2).optional()
    .describe("Penalty for tokens that appear in output. Range: -2 to 2"),
  frequencyPenalty: z.number().min(-2).max(2).optional()
    .describe("Penalty based on token frequency in output. Range: -2 to 2"),
  stopSequences: z.array(z.string()).max(5).optional()
    .describe("Stop generation when any of these strings appear (max 5)"),
  responseMimeType: z.enum(['text/plain', 'application/json']).optional()
    .describe("Output format: plain text or JSON"),
  responseSchema: z.object({}).passthrough().optional()
    .describe("JSON Schema to enforce structured JSON output"),
  seed: z.number().int().optional()
    .describe("Integer for deterministic generation. Gemini 2.5+ only"),
  responseLogprobs: z.boolean().optional()
    .describe("Include log probabilities for each token in response"),
  logprobs: z.number().int().min(1).max(20).optional()
    .describe("Number of top alternative tokens to include (1-20)"),
  audioTimestamp: z.boolean().optional()
    .describe("Include timestamps for audio output"),
  mediaResolution: z.enum(['MEDIA_RESOLUTION_HIGH', 'MEDIA_RESOLUTION_MEDIUM', 'MEDIA_RESOLUTION_LOW']).optional()
    .describe("Quality of input media processing"),
  thinkingConfig: z.object({
    thinkingBudget: z.number().int().optional()
      .describe("Max tokens allocated for extended thinking"),
    thinkingLevel: z.enum(['THINKING_LEVEL_UNSPECIFIED', 'THINKING_LEVEL_BASIC', 'THINKING_LEVEL_EXTENDED']).optional()
      .describe("Reasoning depth level for complex tasks")
  }).optional()
    .describe("Extended thinking configuration for reasoning models")
});

// Tool Config Schema
const GeminiToolConfigSchema = z.object({
  functionCallingConfig: z.object({
    mode: z.enum(['AUTO', 'ANY', 'NONE']).optional()
      .describe("AUTO=model decides, ANY=force tool call, NONE=no tools"),
    allowedFunctionNames: z.array(z.string()).optional()
      .describe("Restrict to specific function names when mode=ANY")
  }).optional()
    .describe("Configure function calling behavior")
});

// Complete Request Schema
const GeminiRequestSchema = z.object({
  contents: z.array(GeminiContentSchema)
    .describe("Conversation history (required)"),
  systemInstruction: GeminiContentSchema.optional()
    .describe("System-level instructions for model behavior"),
  tools: z.array(z.object({
    functionDeclarations: z.array(z.object({
      name: z.string()
        .describe("Function name"),
      description: z.string()
        .describe("What the function does"),
      parameters: z.object({}).passthrough()
        .describe("JSON Schema for function parameters")
    }))
  })).optional()
    .describe("Functions the model can call"),
  toolConfig: GeminiToolConfigSchema.optional()
    .describe("Function calling configuration"),
  safetySettings: z.array(GeminiSafetySettingSchema).optional()
    .describe("Configure content filtering thresholds"),
  generationConfig: GeminiGenerationConfigSchema.optional()
    .describe("Generation parameters (temperature, topK, etc.)"),
  cachedContent: z.string().optional()
    .describe("Resource name of cached context to reuse"),
  labels: z.record(z.string()).optional()
    .describe("Custom labels for request tracking")
});
```

## Response Schema

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/GenerateContentResponse

```typescript
// Safety Rating Schema
const GeminiSafetyRatingSchema = z.object({
  category: z.string()
    .describe("Harm category being rated"),
  probability: z.enum(['NEGLIGIBLE', 'LOW', 'MEDIUM', 'HIGH'])
    .describe("Likelihood of harmful content"),
  blocked: z.boolean().optional()
    .describe("Whether content was blocked by this category"),
  severityScore: z.number().optional()
    .describe("Numeric severity score for harm category")
});

// Citation Source Schema
const GeminiCitationSourceSchema = z.object({
  startIndex: z.number().int().optional()
    .describe("Start position of cited content in response"),
  endIndex: z.number().int().optional()
    .describe("End position of cited content in response"),
  uri: z.string().optional()
    .describe("Source URL for citation"),
  license: z.string().optional()
    .describe("License of cited source")
});

// Candidate Schema
const GeminiCandidateSchema = z.object({
  index: z.number().int()
    .describe("Index of this candidate (when candidateCount > 1)"),
  content: GeminiContentSchema
    .describe("Generated response content"),
  finishReason: z.enum([
    'FINISH_REASON_UNSPECIFIED',
    'STOP',
    'MAX_TOKENS',
    'SAFETY',
    'RECITATION',
    'OTHER',
    'BLOCKLIST',
    'PROHIBITED_CONTENT',
    'SPII',
    'MALFORMED_FUNCTION_CALL'
  ]).optional()
    .describe("Why generation stopped"),
  finishMessage: z.string().optional()
    .describe("Human-readable explanation of finishReason"),
  safetyRatings: z.array(GeminiSafetyRatingSchema).optional()
    .describe("Safety ratings for generated content"),
  citationMetadata: z.object({
    citations: z.array(GeminiCitationSourceSchema)
      .describe("Sources cited in response")
  }).optional()
    .describe("Attribution metadata for grounded content"),
  avgLogprobs: z.number().optional()
    .describe("Average log probability across all tokens"),
  logprobsResult: z.object({}).passthrough().optional()
    .describe("Detailed log probabilities per token"),
  groundingMetadata: z.object({}).passthrough().optional()
    .describe("Metadata from grounding/search features")
});

// Usage Metadata Schema
const GeminiUsageMetadataSchema = z.object({
  promptTokenCount: z.number().int()
    .describe("Tokens in input prompt"),
  candidatesTokenCount: z.number().int()
    .describe("Tokens in all generated candidates"),
  totalTokenCount: z.number().int()
    .describe("Total tokens (prompt + candidates)"),
  thoughtsTokenCount: z.number().int().optional()
    .describe("Tokens used for extended thinking"),
  cachedContentTokenCount: z.number().int().optional()
    .describe("Tokens from cached content reuse"),
  toolUsePromptTokenCount: z.number().int().optional()
    .describe("Tokens in tool/function declarations")
});

// Prompt Feedback Schema
const GeminiPromptFeedbackSchema = z.object({
  blockReason: z.enum(['BLOCK_REASON_UNSPECIFIED', 'SAFETY', 'OTHER', 'BLOCKLIST', 'PROHIBITED_CONTENT']).optional()
    .describe("Why the prompt was blocked"),
  blockReasonMessage: z.string().optional()
    .describe("Human-readable block explanation"),
  safetyRatings: z.array(GeminiSafetyRatingSchema).optional()
    .describe("Safety ratings for the input prompt")
});

// Complete Response Schema
const GeminiResponseSchema = z.object({
  candidates: z.array(GeminiCandidateSchema)
    .describe("Generated response candidates"),
  promptFeedback: GeminiPromptFeedbackSchema.optional()
    .describe("Feedback about the input prompt"),
  usageMetadata: GeminiUsageMetadataSchema.optional()
    .describe("Token usage statistics"),
  modelVersion: z.string().optional()
    .describe("Exact model version used"),
  createTime: z.string().optional()
    .describe("ISO 8601 timestamp of generation"),
  responseId: z.string().optional()
    .describe("Unique identifier for this response")
});

// Extract text from response
const text = response.candidates[0].content.parts[0].text;
```

## Verified Model Names

**Official Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models

Use these exact model names:

```
gemini-3-pro              (Preview - reasoning-first model)
gemini-3-pro-image        (Preview - image generation)
gemini-2.5-pro            (GA - high-capability, 1M context)
gemini-2.5-flash          (GA - fast and capable)
gemini-2.5-flash-lite     (GA - efficient for scale)
gemini-2.5-flash-image    (GA - image generation)
gemini-2.0-flash          (Cost-effective multimodal)
gemini-2.0-flash-lite     (Ultra-efficient)
```

## Critical Rules

- **seed parameter**: Only supported on Gemini 2.5+ family (GA)
- **contents field**: REQUIRED - Must include at least one Content object
- Set `temperature=0` and `topK=1` for deterministic generation (add `seed=42` on 2.5+)
