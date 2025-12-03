# SOP: Converting Official Documentation to AI-Optimized Markdown

**Last Updated**: December 2025

## Core Principle

Never trust AI memory. Always verify against official sources.

## Problem

Official documentation is:
- Scattered across multiple pages
- Prose-heavy (inefficient for AI tokens)
- Lacks clear decision trees
- Mixes tutorials, references, examples without structure

## Solution

Convert to decision tree structure with verified information.

---

## 8-Step Process

### 1. ANALYZE

Determine scope and decision points:
- Single endpoint? Multiple services? Multiple providers?
- What choices do users make?
- Critical info needed:
  - Endpoints and HTTP methods
  - Request/response schemas
  - Authentication requirements
  - Valid values (model names, enums, ranges)
  - Provider-specific quirks

### 2. SEARCH

Find official documentation:
```
# Use site-specific search
site:docs.example.com API reference [service name]
site:docs.example.com authentication guide
site:docs.example.com [model/service] availability
```

Steps:
- Locate canonical sources (avoid blogs, Stack Overflow)
- Find: API reference, model lists, auth guides, troubleshooting
- Verify every URL loads correctly
- Cross-reference multiple sources (main docs, SDK docs, changelogs)

### 3. EXTRACT

Pull critical information from each page:

**Endpoints**
- Full URL template with `{variables}` marked
- HTTP method (GET, POST, etc.)
- Required headers

**Schemas**
- Request: all fields with types, constraints, defaults
- Response: all fields with types, meanings
- Mark REQUIRED vs OPTIONAL explicitly

**Valid Values**
- Enum values (exact strings)
- Model/service names (exact, including prefixes/suffixes)
- Numeric ranges (min/max)

**Special Rules**
- Conditional requirements ("field X required when Y=true")
- Version-specific features ("seed supported in v2.5+")
- Provider-specific naming ("topK vs top_k vs top_p")
- Common mistakes to avoid

### 4. TEST

Verify with real API calls:
- Test endpoints with minimal examples
- Test each parameter (does it accept/reject? boundaries?)
- Test naming conventions (with/without prefixes, suffixes)
- Document failures:
  - What you tried
  - Error message received
  - What fixed it

**Example Discoveries**:
- Tested `claude-3-opus` → 404
- Tested `claude-3-opus@20240229` → Success!
- **Rule**: Claude 3.x models REQUIRE `@YYYYMMDD` suffix

### 5. DESIGN STRUCTURE

Create decision tree file structure:

```
docs/
├── main.md           # Decision router (minimal)
├── auth.md           # Shared authentication (if applicable)
├── option-a.md       # Complete reference for option A
├── option-b.md       # Complete reference for option B
├── comparison.md     # Feature matrix table
└── best-practices.md # Cross-cutting guidance (optional)
```

**Decision Logic Example**:
```
IF model_name.startsWith('gemini-')
  THEN read google-gemini.md
ELSE IF model_name.startsWith('claude-')
  THEN read anthropic-claude.md
ELSE IF model_name.startsWith('llama-')
  THEN read meta-llama.md
```

**Why This Works**:
- Token efficiency: AI reads only what it needs
- Maintainability: Update one service without touching others
- Scalability: Easy to add new options
- Discovery: Decision tree guides to right file

### 6. WRITE

AI-optimized format rules:

**Use Imperatives**
- ✅ "Use this endpoint"
- ✅ "Set temperature=0 for deterministic"
- ❌ "You might want to consider..."

**Be Explicit**
- ✅ "REQUIRED field"
- ✅ "Range: 0-2"
- ✅ "Gemini 2.5+ only"
- ❌ "Usually required"

**Code Over Prose**
- Show working examples
- No lengthy explanations
- Inline comments for clarity

**Schemas with Descriptions**
```typescript
// Good: Actionable, specific, includes constraints
temperature: z.number().min(0).max(2).optional()
  .describe("Randomness. 0=deterministic, 2=creative. Default: 1.0")

// Bad: Vague, no actionable info
temperature: z.number().optional()
  .describe("Controls temperature")
```

**File Template** (per option):
```markdown
# [Service/Provider Name]

**Last Verified**: [Date]

## Endpoint

[Full URL template with variables]

**Official Reference**: [URL]

## Request Schema

[Zod schema with .describe() on every field]

## Response Schema

[Zod schema with .describe() on every field]

## Verified [Model/Service] Names

[Exact names in scannable list]

## Critical Rules

- [Rule 1 with explicit constraint]
- [Rule 2 with version-specific info]
- [Rule 3 with quirks/gotchas]
```

### 7. VERIFY

Final checklist before publishing:
- [ ] All URLs visited and content verified
- [ ] All endpoints tested with real API calls
- [ ] All required fields explicitly marked
- [ ] All valid values (models, enums) listed
- [ ] All constraints documented (min/max, types)
- [ ] Decision tree logic tested with examples
- [ ] Quirks documented in "Critical Rules" section
- [ ] Comparison table complete (if multi-option)
- [ ] "Last Verified" timestamp added

### 8. INTEGRATE

Add single-line reference to main instructions file (AGENTS.md, README.md):

```markdown
## Documentation References

When working with [service/API name], read [docs/main.md](docs/main.md).
```

**Why One Line?**
- Single clear entry point
- Decision tree handles all routing
- Easy to maintain
- "Stupidly simple is best"

---

## Case Study: Vertex AI

**Problem**: Hallucinated model names, endpoints, required fields.

**Applied SOP**:
1. **Analyzed**: 4 providers (Google, Claude, OpenAI, Llama), decision by model name pattern
2. **Searched**: `site:docs.cloud.google.com vertex ai [provider] api`
3. **Extracted**: Endpoints, schemas, model lists, version-specific rules
4. **Tested**: Discovered Claude needs `@YYYYMMDD`, Llama needs `-maas` suffix
5. **Designed**: Main router + 4 provider files + comparison + best practices
6. **Wrote**: Imperative language, Zod schemas with descriptions
7. **Verified**: All URLs, endpoints, parameters tested
8. **Integrated**: One line in AGENTS.md

**Result**: `undoc/vertex-ai*.md` files (working example of this SOP)

**Structure Created**:
```
undoc/
├── vertex-ai.md                    # Main router (decision tree)
├── vertex-ai-authentication.md     # Shared auth
├── vertex-ai-google-gemini.md      # Google-specific
├── vertex-ai-anthropic-claude.md   # Claude-specific
├── vertex-ai-openai-gpt-oss.md     # OpenAI-specific
├── vertex-ai-meta-llama.md         # Llama-specific
├── vertex-ai-comparison.md         # Feature matrix
└── vertex-ai-best-practices.md     # Cross-cutting rules
```

**Key Discoveries**:
- Claude 3.x: MUST use `@YYYYMMDD` suffix (e.g., `claude-3-opus@20240229`)
- Llama: MUST use `-maas` suffix (e.g., `llama-3.3-70b-instruct-maas`)
- Seed parameter: Only Gemini 2.5+ (use `temperature=0, topK=1` for others)
- Required fields: Claude needs `anthropic_version` + `max_tokens`

---

## Quick Reference

| Step | Action | Output |
|------|--------|--------|
| 1. ANALYZE | Identify scope, decisions, critical info | Requirements list |
| 2. SEARCH | Find official docs with site search | Verified URLs |
| 3. EXTRACT | Pull endpoints, schemas, values, rules | Raw documentation |
| 4. TEST | Verify with real API calls | Confirmed facts |
| 5. DESIGN | Create decision tree structure | File structure plan |
| 6. WRITE | Convert to AI-optimized format | Markdown files |
| 7. VERIFY | Check all claims against reality | Quality assurance |
| 8. INTEGRATE | Add one-line reference | Complete system |

---

**This SOP applies to ANY documentation source**: AWS, Azure, Stripe, databases, frameworks, etc.
