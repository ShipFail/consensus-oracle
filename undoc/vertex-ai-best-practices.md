# Vertex AI Best Practices

**Last Verified**: December 2025

## HTTP Headers

```typescript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

**Reference**: https://cloud.google.com/docs/authentication

## Error Codes

```
200  - Success
400  - Invalid request (check request schema)
401  - Missing or invalid authentication credentials
403  - Permission denied (check IAM roles and API enablement)
404  - Model not found or not available in region
429  - Rate limit exceeded (implement exponential backoff)
500  - Internal server error (retry with backoff)
503  - Service temporarily unavailable (retry)
```

**Reference**: https://cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent#response-body

## Deterministic Configuration

**Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/content-generation-parameters

```typescript
// Google Gemini (seed supported on Gemini 2.5+)
const geminiDeterministicConfig = {
  temperature: 0,
  topK: 1,
  seed: 42  // GA on Gemini 2.5 family
};

// Anthropic Claude (seed NOT documented)
const claudeDeterministicConfig = {
  temperature: 0,
  top_k: 1
  // No seed parameter available
};

// OpenAI GPT-OSS (seed and topK NOT supported)
const openaiDeterministicConfig = {
  temperature: 0,
  top_p: 0.1  // Use top_p instead of topK
};

// Meta Llama (seed NOT documented)
const llamaDeterministicConfig = {
  temperature: 0,
  top_k: 1
  // No seed parameter available
};
```

## Do These Things

1. Verify model names against official documentation before deployment
2. Use `docs.cloud.google.com` for all Google Cloud documentation URLs
3. Include `-maas` suffix for ALL Llama model names
4. Include `@YYYYMMDD` version suffix for Claude 3.x models
5. Use `:generateContent` endpoint for Google Gemini models only
6. Use `:rawPredict` endpoint for Anthropic Claude models
7. Use `/endpoints/openapi/chat/completions` for OpenAI and Llama models
8. Include `max_tokens` (REQUIRED) in all Claude requests
9. Include `anthropic_version: "vertex-2023-10-16"` (REQUIRED) for Claude
10. Check model availability in your target region before deployment
11. Validate all requests/responses with Zod schemas for type safety
12. Implement exponential backoff for rate limits (429 errors)
13. Use `seed` parameter (where supported) for reproducible outputs
14. Check `finishReason` to detect truncation or safety blocks

## Avoid These Mistakes

1. Assuming GPT-4, GPT-4o, GPT-4 Turbo, or GPT-3.5 are available on Vertex AI
2. Omitting `-maas` suffix from Llama model names
3. Omitting `@YYYYMMDD` version from Claude 3.x model names
4. Using `:generateContent` for non-Google models
5. Using `topK` parameter with OpenAI models (use `top_p` instead)
6. Forgetting `max_tokens` in Claude requests (REQUIRED)
7. Forgetting `anthropic_version` in Claude requests (REQUIRED)
8. Using `cloud.google.com` instead of `docs.cloud.google.com` for documentation
9. Hallucinating model names without verification via documentation

## Testing Pattern

```typescript
import { z } from 'zod';

// Test with deterministic settings
const prompt = 'Tell me a joke';
const config = { temperature: 0, topK: 1 };

// Make request
const result = await generateContent(model, prompt, config);

// Validate response type
assert(typeof result === 'string');
assert(result.length > 0);

// Validate with Zod (example for Gemini)
const validatedResponse = GeminiResponseSchema.parse(apiResponse);
console.log(`Tokens used: ${validatedResponse.usageMetadata?.totalTokenCount}`);
```

## Documentation Index

### Google Gemini
- **Model List**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models
- **API Reference**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference
- **GenerateContent REST**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent
- **GenerationConfig**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/GenerationConfig
- **GenerateContentResponse**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/GenerateContentResponse
- **Content Object**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/Content
- **Content Parameters**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/content-generation-parameters

### Anthropic Claude
- **Model Overview**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude
- **Usage Guide**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude/use-claude
- **Anthropic Messages API**: https://docs.anthropic.com/en/api/messages
- **Model Versions**: https://docs.anthropic.com/en/docs/about-claude/models
- **API Versioning**: https://docs.anthropic.com/en/api/versioning

### OpenAI GPT-OSS
- **Model Overview**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai
- **GPT-OSS 120B**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai/gpt-oss-120b
- **API Guide**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/call-open-model-apis

### Meta Llama
- **Model Overview**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama
- **Usage Guide**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama/use-llama
- **Llama 4 Maverick**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama/llama4-maverick
- **Llama 3.3**: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama/llama3-3

### Authentication & General
- **Application Default Credentials**: https://cloud.google.com/docs/authentication/application-default-credentials
- **REST API Reference**: https://docs.cloud.google.com/vertex-ai/docs/reference/rest
- **rawPredict Endpoint**: https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.endpoints/rawPredict
