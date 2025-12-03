/**
 * Anthropic Claude Models via Vertex AI
 *
 * This module provides direct access to Anthropic's Claude models through Vertex AI.
 * Supports Claude 4.5, 4.1, 4, and 3 model families.
 *
 * Official Documentation:
 * - Claude on Vertex AI: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude
 * - Request Predictions: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude/use-claude
 * - Claude Models Overview: https://docs.anthropic.com/en/docs/about-claude/models
 * - Messages API: https://docs.anthropic.com/en/api/messages
 * - rawPredict Endpoint: https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/rawPredict
 * - Anthropic API Versioning: https://docs.anthropic.com/en/api/versioning
 *
 * Authentication:
 * - Requires Application Default Credentials (ADC)
 * - Setup: gcloud auth application-default login
 * - See: https://cloud.google.com/docs/authentication/application-default-credentials
 *
 * Note: Claude models use the rawPredict endpoint (not generateContent)
 */

import { getAccessToken, PROJECT_ID, LOCATION } from './config';
import type { GenerationConfig } from './types';
import type { AnthropicRequestConfig, AnthropicResponse } from './anthropic.types';

/**
 * Available Claude models via Vertex AI
 *
 * Model IDs can be used directly without provider prefixes.
 * Note: Model availability varies by Vertex AI region.
 * For latest models and pricing: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude
 */
export const MODELS = {
  // Claude 4.5 (Latest - 2025) — versioned per official curl example
  CLAUDE_OPUS_4_5: 'claude-opus-4-5@20251001',
  CLAUDE_SONNET_4_5: 'claude-sonnet-4-5@20251001',
  CLAUDE_HAIKU_4_5: 'claude-haiku-4-5@20251001'
} as const;

// Anthropic models are region-limited; default to "global" per official curl
const CLAUDE_LOCATION =
  process.env.ANTHROPIC_LOCATION ||
  process.env.CLAUDE_LOCATION ||
  process.env.GCP_LOCATION ||
  'global';

/**
 * Anthropic API version required by Vertex AI
 * See: https://docs.anthropic.com/en/api/versioning
 */
const ANTHROPIC_VERSION = 'vertex-2023-10-16';

/**
 * Generate content using Anthropic Claude models via Vertex AI
 *
 * This function calls the Claude rawPredict REST API endpoint.
 * Claude uses the Messages API format with user/assistant message structure.
 *
 * @param model - Claude model ID (use MODELS constants or custom string)
 * @param prompt - Text prompt to send to the model
 * @param config - Optional generation configuration (temperature, topK, etc.)
 * @returns Generated text content as a string
 * @throws Error if API call fails, authentication fails, or response is invalid
 *
 * @example
 * ```typescript
 * import { generateContent, MODELS } from '@/lib/vertex-ai/anthropic';
 *
 * // Simple generation
 * const response = await generateContent(
 *   MODELS.CLAUDE_HAIKU_4_5,
 *   'Tell me a joke'
 * );
 *
 * // With deterministic settings
 * const deterministicResponse = await generateContent(
 *   MODELS.CLAUDE_SONNET_4_5,
 *   'What is the capital of France?',
 *   { temperature: 0, topK: 1 }
 * );
 *
 * // With max tokens control
 * const shortResponse = await generateContent(
 *   MODELS.CLAUDE_OPUS_4_5,
 *   'Explain quantum computing',
 *   { maxOutputTokens: 100 }
 * );
 * ```
 */
export async function generateContent(
  model: string,
  prompt: string,
  config?: GenerationConfig
): Promise<string> {
  if (!model) {
    throw new Error('Model name is required for Anthropic Claude generation');
  }
  // Get authentication token
  const accessToken = await getAccessToken();

  // Clean model name (remove anthropic/ prefix if present)
  const cleanModel = model.replace(/^anthropic\//, '');

  // Determine prediction method (streaming vs unary)
  const predictionMethod = config?.stream ? 'streamRawPredict' : 'rawPredict';

  // Build Vertex AI endpoint URL for Anthropic models
  // Format: https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/anthropic/models/{model}:{predictionMethod}
  const host = CLAUDE_LOCATION === 'global'
    ? 'https://aiplatform.googleapis.com'
    : `https://${CLAUDE_LOCATION}-aiplatform.googleapis.com`;

  const endpoint = [
    host,
    `/v1/projects/${PROJECT_ID}`,
    `/locations/${CLAUDE_LOCATION}`,
    `/publishers/anthropic`,
    `/models/${cleanModel}:${predictionMethod}`
  ].join('');

  // Construct Anthropic Messages API request body
  // Note: max_tokens is REQUIRED by Anthropic API
  const requestBody: AnthropicRequestConfig = {
    anthropic_version: ANTHROPIC_VERSION,
    messages: [{
      role: 'user',
      content: prompt
    }],
    max_tokens: config?.maxOutputTokens || 1024,
    temperature: config?.temperature,
    top_p: config?.topP,
    top_k: config?.topK,
    stop_sequences: config?.stopSequences,
    stream: config?.stream
  };

  // Make API call
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  // Handle HTTP errors
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Anthropic Claude API error (${response.status}): ${errorText}\n` +
      `Model: ${cleanModel}\n` +
      `Endpoint: ${endpoint}\n` +
      `This may indicate invalid model name, authentication issues, or API quota limits.\n` +
      `See: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude/use-claude#troubleshooting`
    );
  }

  // Parse response
  const data = await response.json() as AnthropicResponse;

  // Validate response structure
  if (!data.content || data.content.length === 0) {
    throw new Error(
      `No content returned from Anthropic Claude API\n` +
      `Model: ${cleanModel}\n` +
      `Response: ${JSON.stringify(data)}`
    );
  }

  // Check stop reason
  if (data.stop_reason === 'max_tokens') {
    console.warn(
      `Warning: Response truncated at max_tokens limit for model ${cleanModel}\n` +
      `Consider increasing maxOutputTokens in config.`
    );
  }

  // Concatenate all text content blocks
  const text = data.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');

  return text;
}
