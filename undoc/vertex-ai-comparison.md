# Provider Comparison Table

| Feature | Google Gemini | Anthropic Claude | OpenAI GPT-OSS | Meta Llama |
|---------|--------------|------------------|----------------|------------|
| **Endpoint** | `:generateContent` | `:rawPredict` | `/openapi/chat/completions` | `/openapi/chat/completions` |
| **Publisher Path** | `/publishers/google/` | `/publishers/anthropic/` | `/endpoints/openapi/` | `/endpoints/openapi/` |
| **topK Support** | ✅ Yes | ✅ Yes (top_k) | ❌ No (use top_p) | ✅ Yes (top_k) |
| **seed Support** | ✅ Yes (Gemini 2.5+) | ❌ Not documented | ❌ Not documented | ❌ Not documented |
| **max_tokens** | Optional | ✅ REQUIRED | Optional | Optional |
| **Version Field** | Not needed | ✅ anthropic_version REQUIRED | Not needed | Not needed |
| **Model Suffix** | None | `@YYYYMMDD` for v3.x | None | `-maas` REQUIRED |
| **Response Path** | `.candidates[0].content.parts[0].text` | `.content[0].text` | `.choices[0].message.content` | `.choices[0].message.content` |
| **Safety Features** | SafetySettings | Built-in | content_filter | Llama Guard (default enabled) |
