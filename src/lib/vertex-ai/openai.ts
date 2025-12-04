/**
 * OpenAI GPT OSS Models via Vertex AI Model Garden
 *
 * This module provides direct access to OpenAI's open-weight GPT models through Vertex AI.
 * Supports gpt-oss models (120B and 20B parameter versions).
 *
 * Official Documentation:
 * - OpenAI on Vertex AI: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai
 * - GPT-OSS 120B: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai/gpt-oss-120b
 * - generateContent Endpoint: https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent
 *
 * Authentication:
 * - Requires Application Default Credentials (ADC)
 * - Setup: gcloud auth application-default login
 * - See: https://cloud.google.com/docs/authentication/application-default-credentials
 *
 * Note: OpenAI models use the native Vertex AI generateContent endpoint.
 *       These are open-weight models released under Apache 2.0 license, NOT GPT-4 or GPT-3.5
 */

import { getAccessToken, PROJECT_ID, LOCATION } from './config';
import type { GenerationConfig } from './types';
import type {
  OpenAIGenerateContentRequest,
  OpenAIGenerateContentResponse
} from './openai.types';

/**
 * Available OpenAI open-weight models via Vertex AI Model Garden
 *
 * Note: These are open-weight models (Apache 2.0 license), NOT OpenAI's proprietary models
 * Model availability varies by Vertex AI region.
 * For latest models: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai
 */
export const MODELS = {
  // GPT-OSS (Open-weight models released under Apache 2.0)
  GPT_OSS_120B: 'openai/gpt-oss-120b-maas',
  GPT_OSS_20B: 'openai/gpt-oss-20b-maas'
} as const;

/**
 * Generate content using OpenAI GPT models via Vertex AI
 *
 * This function calls the OpenAI GPT models via Vertex AI's native generateContent endpoint.
 * It supports text generation with configurable parameters.
 *
 * @param model - OpenAI model ID (use MODELS constants or custom string)
 * @param prompt - Text prompt to send to the model
 * @param config - Optional generation configuration (temperature, topK, etc.)
 * @returns Generated text content as a string
 * @throws Error if API call fails, authentication fails, or response is invalid
 *
 * @example
 * ```typescript
 * import { generateContent, MODELS } from '@/lib/vertex-ai/openai';
 *
 * // Simple generation
 * const response = await generateContent(
 *   MODELS.GPT_OSS_120B,
 *   'Tell me a joke'
 * );
 *
 * // With deterministic settings
 * const deterministicResponse = await generateContent(
 *   MODELS.GPT_OSS_120B,
 *   'What is the capital of France?',
 *   { temperature: 0 }
 * );
 *
 * // With smaller model for edge deployment
 * const edgeResponse = await generateContent(
 *   MODELS.GPT_OSS_20B,
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
  // Get authentication token
  const accessToken = await getAccessToken();

  // Normalize model name (strip openai/ for endpoint path)
  const fullModelName = model.startsWith('openai/') ? model : `openai/${model}`;
  const cleanModelName = fullModelName.replace(/^openai\//, '');

  // Build Vertex AI endpoint URL for OpenAI models (native generateContent)
  // Format: https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/openai/models/{model}:generateContent
  const endpoint = [
    `https://${LOCATION}-aiplatform.googleapis.com`,
    `/v1/projects/${PROJECT_ID}`,
    `/locations/${LOCATION}`,
    `/publishers/openai/models/${cleanModelName}:generateContent`
  ].join('');

  const stopSequences = config?.stopSequences
    ? Array.isArray(config.stopSequences) ? config.stopSequences : [config.stopSequences]
    : undefined;

  // Construct OpenAI generateContent request body
  const requestBody: OpenAIGenerateContentRequest = {
    contents: [{
      role: 'user',
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: config?.temperature ?? 1.0,
      topP: config?.topP,
      maxOutputTokens: config?.maxOutputTokens || 1024,
      stopSequences,
      seed: config?.seed
    }
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
      `OpenAI GPT API error (${response.status}): ${errorText}\n` +
      `Model: ${fullModelName}\n` +
      `Endpoint: ${endpoint}\n` +
      `Note: OpenAI open-weight models may not be available in all Vertex AI regions.\n` +
      `Check model availability: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai`
    );
  }

  // Parse response
  const data = await response.json() as OpenAIGenerateContentResponse;

  // Validate response structure
  if (!data.candidates || data.candidates.length === 0) {
    // Check if prompt was blocked
    if (data.promptFeedback?.blockReason) {
      throw new Error(
        `Prompt was blocked by safety filters: ${data.promptFeedback.blockReason}\n` +
        `Model: ${fullModelName}`
      );
    }
    throw new Error(
      `No candidates returned from OpenAI GPT API\n` +
      `Model: ${fullModelName}\n` +
      `Response: ${JSON.stringify(data)}`
    );
  }

  const candidate = data.candidates[0];

  // Validate content structure
  if (!candidate.content?.parts) {
    throw new Error(
      `Invalid response structure from OpenAI GPT API\n` +
      `Model: ${fullModelName}\n` +
      `Candidate: ${JSON.stringify(candidate)}`
    );
  }

  // Check finish reason
  if (candidate.finishReason === 'MAX_TOKENS') {
    console.warn(
      `Warning: Response truncated at maxOutputTokens limit for model ${fullModelName}\n` +
      `Consider increasing maxOutputTokens in config.`
    );
  }

  const text = candidate.content.parts
    .filter(part => part.text)
    .map(part => part.text)
    .join('');

  return text;
}
