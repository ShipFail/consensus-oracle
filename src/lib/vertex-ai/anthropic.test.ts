/**
 * Anthropic Claude Provider Tests
 *
 * Run with: node --test src/lib/vertex-ai/anthropic.test.ts
 * Or: npm test
 *
 * Prerequisites:
 * - GOOGLE_CLOUD_PROJECT environment variable set
 * - Application Default Credentials configured (gcloud auth application-default login)
 * - Vertex AI API enabled in your Google Cloud project
 * - Claude models enabled in your Vertex AI region
 *
 * Note: These tests make real API calls to Vertex AI and will incur costs.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateContent, MODELS } from './anthropic';

describe('Anthropic Claude Provider', () => {
  it('should generate content with deterministic settings ("Tell me a joke")', async (t) => {
    // Test configuration as specified
    const prompt = 'Tell me a joke';
    const config = {
      temperature: 0,
      topK: 1,
      topP: 1,
      maxOutputTokens: 128
    };

    console.log(`\n🧪 Testing Anthropic Claude: ${MODELS.CLAUDE_HAIKU_4_5}`);
    console.log(`📝 Prompt: "${prompt}"`);
    console.log(`⚙️  Config: ${JSON.stringify(config)}`);

    let result: string;
    try {
      result = await generateContent(MODELS.CLAUDE_HAIKU_4_5, prompt, config);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // Skip when the model is not available in the configured region
      if (message.includes('404')) {
        t.skip(
          `Claude model unavailable in region ${process.env.CLAUDE_LOCATION || process.env.GCP_LOCATION || 'global'}: ${message}`
        );
        return;
      }
      throw error;
    }

    // Assertions
    assert.ok(result, 'Result should not be empty');
    assert.strictEqual(typeof result, 'string', 'Result should be a string');
    assert.ok(result.length > 10, 'Result should have meaningful content (>10 chars)');

    // Log the response
    console.log(`\n✅ Anthropic Claude test PASSED`);
    console.log(`📤 Response (${result.length} chars):`);
    console.log(`   ${result.substring(0, 200)}${result.length > 200 ? '...' : ''}`);
    console.log('');
  });

  it('should throw error for invalid model name', async () => {
    console.log('\n🧪 Testing Anthropic Claude error handling (invalid model)');

    await assert.rejects(
      async () => {
        await generateContent(
          'invalid-claude-model-xyz',
          'test',
          { temperature: 0 }
        );
      },
      /API error/,
      'Should throw API error for invalid model'
    );

    console.log('✅ Error handling test PASSED\n');
  });
});
