# Vertex AI Module

This module provides flat, direct access to multiple LLM providers through Google Cloud Vertex AI. Each provider has its own independent module with a consistent, declarative API.

## 📚 Overview

The vertex-ai module gives you direct access to:
- **Google Gemini** - Latest Gemini 3.0, 2.0, 1.5, and 1.0 models
- **Anthropic Claude** - Claude 4, Claude 3.5, and Claude 3 models
- **OpenAI GPT** - GPT-4o, GPT-4 Turbo, GPT-4, and GPT-3.5 models
- **Meta Llama** - Llama 3.3, 3.2, and 3.1 models

All providers use Google Cloud's Vertex AI infrastructure with Application Default Credentials (ADC) for authentication.

## 🎯 Design Principles

- **Flat Design** - No abstraction layers, direct imports
- **Declarative API** - Simple function calls with clear parameters
- **REST-based** - Uses fetch() to call Google Cloud REST APIs
- **Well-documented** - Every module has links to official documentation
- **Type-safe** - Full TypeScript support
- **Tested** - Unit tests for each provider

## 🚀 Quick Start

### Prerequisites

1. **Google Cloud Project** with Vertex AI API enabled
2. **Application Default Credentials (ADC)** configured:
   ```bash
   gcloud auth application-default login
   gcloud config set project YOUR_PROJECT_ID
   ```
3. **Environment Variable** (if not using ADC default project):
   ```bash
   export GOOGLE_CLOUD_PROJECT=your-project-id
   ```

### Installation

The module is already part of the project. No additional installation needed.

### Basic Usage

```typescript
// Import directly from the provider you want to use
import * as Google from '@/lib/vertex-ai/google';
import * as Anthropic from '@/lib/vertex-ai/anthropic';
import * as OpenAI from '@/lib/vertex-ai/openai';
import * as Meta from '@/lib/vertex-ai/meta';

// Google Gemini
const geminiResponse = await Google.generateContent(
  Google.MODELS.GEMINI_3_FLASH_LITE,
  'Tell me a joke',
  { temperature: 0, topK: 1 }
);

// Anthropic Claude
const claudeResponse = await Anthropic.generateContent(
  Anthropic.MODELS.CLAUDE_HAIKU_4_5,
  'Explain quantum computing',
  { temperature: 0.7, maxOutputTokens: 500 }
);

// OpenAI GPT
const gptResponse = await OpenAI.generateContent(
  OpenAI.MODELS.GPT_4O_MINI,
  'Write a haiku about AI',
  { temperature: 1.0 }
);

// Meta Llama
const llamaResponse = await Meta.generateContent(
  Meta.MODELS.LLAMA_3_3_70B_INSTRUCT,
  'Summarize the theory of relativity',
  { temperature: 0, maxOutputTokens: 200 }
);
```

## 📖 API Reference

### Common Interface

All providers export:
- `generateContent(model, prompt, config)` - Main generation function
- `MODELS` - Constants for available models

### Configuration Options

```typescript
interface GenerationConfig {
  temperature?: number;        // 0.0-2.0 (0 = deterministic, higher = creative)
  topK?: number;               // Number of top tokens to sample from
  topP?: number;               // Cumulative probability threshold (0.0-1.0)
  seed?: number;               // Random seed for best-effort reproducibility
  maxOutputTokens?: number;    // Maximum tokens to generate
  stopSequences?: string | string[]; // Sequences that stop generation
  stream?: boolean;            // Enable streaming responses when supported
}
```

**Note:** Not all parameters are supported by all providers:
- OpenAI doesn't support `topK`
- Google supports additional `responseMimeType` for JSON output

### Provider-Specific Docs

Each provider module includes comprehensive documentation:

**Google Gemini** (`google.ts`):
- Gemini API: https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini
- 10+ models including Gemini 3.0 Flash Lite, Gemini 1.5 Pro

**Anthropic Claude** (`anthropic.ts`):
- Claude on Vertex AI: https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude
- Claude 4 Haiku, Claude 3.5 Sonnet, Claude 3 Opus

**OpenAI GPT** (`openai.ts`):
- OpenAI on Vertex AI: https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-openai
- GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo

**Meta Llama** (`meta.ts`):
- Llama on Vertex AI: https://cloud.google.com/vertex-ai/generative-ai/docs/open-models/use-llama
- Llama 3.3 70B, Llama 3.2 Vision, Llama 3.1 405B

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Individual Provider Tests

```bash
node --test src/lib/vertex-ai/google.test.ts
node --test src/lib/vertex-ai/anthropic.test.ts
node --test src/lib/vertex-ai/openai.test.ts
node --test src/lib/vertex-ai/meta.test.ts
```

**Note:** Tests make real API calls to Vertex AI and will incur costs. Ensure ADC is configured before running tests.

## 📁 File Structure

```
src/lib/vertex-ai/
├── README.md                    # This file
├── config.ts                    # Shared auth & project config
├── types.ts                     # Common types
│
├── google.ts                    # Google Gemini provider
├── google.types.ts              # Google-specific types
├── google.test.ts               # Google tests
│
├── anthropic.ts                 # Anthropic Claude provider
├── anthropic.types.ts           # Anthropic-specific types
├── anthropic.test.ts            # Anthropic tests
│
├── openai.ts                    # OpenAI GPT provider
├── openai.types.ts              # OpenAI-specific types
├── openai.test.ts               # OpenAI tests
│
├── meta.ts                      # Meta Llama provider
├── meta.types.ts                # Meta-specific types
└── meta.test.ts                 # Meta tests
```

## 💡 Usage Examples

### Deterministic Generation (for consensus)

```typescript
import * as Google from '@/lib/vertex-ai/google';

const result = await Google.generateContent(
  Google.MODELS.GEMINI_3_FLASH_LITE,
  'What is 2+2?',
  {
    temperature: 0,  // Most deterministic
    topK: 1          // Only sample from top token
  }
);
```

### Creative Generation

```typescript
import * as Anthropic from '@/lib/vertex-ai/anthropic';

const story = await Anthropic.generateContent(
  Anthropic.MODELS.CLAUDE_3_5_SONNET,
  'Write a creative short story about AI',
  {
    temperature: 1.2,        // High creativity
    maxOutputTokens: 1500    // Longer output
  }
);
```

### JSON Output (Google only)

```typescript
import * as Google from '@/lib/vertex-ai/google';
import type { GoogleGenerationConfig } from '@/lib/vertex-ai/google.types';

const config: GoogleGenerationConfig = {
  temperature: 0,
  responseMimeType: 'application/json'
};

const jsonResult = await Google.generateContent(
  Google.MODELS.GEMINI_3_FLASH,
  'List 3 colors with their hex codes in JSON format',
  config as any  // Cast needed for Google-specific field
);

const parsed = JSON.parse(jsonResult);
```

### Parallel Multi-Model Query

```typescript
import * as Google from '@/lib/vertex-ai/google';
import * as Anthropic from '@/lib/vertex-ai/anthropic';
import * as OpenAI from '@/lib/vertex-ai/openai';

const question = 'What is the capital of France?';
const config = { temperature: 0, topK: 1 };

// Query all models in parallel
const [geminiAnswer, claudeAnswer, gptAnswer] = await Promise.all([
  Google.generateContent(Google.MODELS.GEMINI_3_FLASH_LITE, question, config),
  Anthropic.generateContent(Anthropic.MODELS.CLAUDE_HAIKU_4_5, question, config),
  OpenAI.generateContent(OpenAI.MODELS.GPT_4O_MINI, question, config)
]);

console.log('Gemini:', geminiAnswer);
console.log('Claude:', claudeAnswer);
console.log('GPT:', gptAnswer);
```

## 🔧 Troubleshooting

### Authentication Errors

```
Error: GOOGLE_CLOUD_PROJECT environment variable is required
```

**Solution:** Set your project ID:
```bash
export GOOGLE_CLOUD_PROJECT=your-project-id
# Or authenticate with:
gcloud auth application-default login
```

### Model Not Available

```
Error: OpenAI GPT API error (404): Model not found
```

**Solution:** Check model availability in your region:
- Not all models are available in all Vertex AI regions
- OpenAI and Meta models have limited regional availability
- Try switching to a supported region or use a different model

### API Quota Exceeded

```
Error: API error (429): Quota exceeded
```

**Solution:**
- Check your Vertex AI quotas in Google Cloud Console
- Request quota increases if needed
- Implement rate limiting in your application

### Max Tokens Truncation

```
Warning: Response truncated at max_tokens limit
```

**Solution:** Increase `maxOutputTokens` in your config:
```typescript
const config = { maxOutputTokens: 2048 };
```

## 📊 Cost Considerations

Each provider has different pricing. Check current rates:
- **Google Gemini**: https://cloud.google.com/vertex-ai/pricing#generative-ai-models
- **Anthropic Claude**: https://cloud.google.com/vertex-ai/pricing#anthropic-claude
- **OpenAI GPT**: https://cloud.google.com/vertex-ai/pricing#openai
- **Meta Llama**: https://cloud.google.com/vertex-ai/pricing#meta-llama

**Cost-saving tips:**
- Use Flash/Lite models for simple tasks (cheaper than Pro/Opus)
- Set `maxOutputTokens` to limit generation length
- Use deterministic settings (`temperature: 0`) for consistent results
- Cache common queries at application level

## 🔒 Security Best Practices

1. **Never commit credentials** - Use ADC, not API keys in code
2. **Limit token counts** - Set maxOutputTokens to prevent abuse
3. **Validate inputs** - Sanitize user prompts before sending
4. **Monitor usage** - Track API calls and costs
5. **Use least privilege** - Grant minimal IAM permissions needed

## 📝 Migration from Old API

If migrating from `vertex-client.ts`:

**Old (with router):**
```typescript
import { generateContent } from '@/lib/vertex-client';
await generateContent('anthropic/claude-haiku-4.5', prompt, config);
```

**New (explicit provider):**
```typescript
import * as Anthropic from '@/lib/vertex-ai/anthropic';
await Anthropic.generateContent(
  Anthropic.MODELS.CLAUDE_HAIKU_4_5,
  prompt,
  config
);
```

## 🤝 Contributing

When adding new providers or models:

1. Follow the established pattern (see existing providers)
2. Add comprehensive documentation with official links
3. Create corresponding `.types.ts` file
4. Write tests with "Tell me a joke" deterministic test
5. Update this README.md
6. Ensure TypeScript types are correct

## 📚 Additional Resources

- **Vertex AI Overview**: https://cloud.google.com/vertex-ai/docs
- **Generative AI on Vertex AI**: https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview
- **Authentication Guide**: https://cloud.google.com/docs/authentication
- **Vertex AI Quotas**: https://cloud.google.com/vertex-ai/docs/quotas
- **Regional Availability**: https://cloud.google.com/vertex-ai/docs/general/locations

## ⚖️ License

MIT - See project root LICENSE file

---

**Built for the Thoth project** - Where all answers are written.
