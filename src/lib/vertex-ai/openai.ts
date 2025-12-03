/**
 * OpenAI GPT OSS Models via Vertex AI Model Garden
 *
 * This module provides direct access to OpenAI's open-weight GPT models through Vertex AI.
 * Supports gpt-oss models (120B and 20B parameter versions).
 *
 * Official Documentation:
 * - OpenAI on Vertex AI: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai
 * - GPT-OSS 120B: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/openai/gpt-oss-120b
 * - rawPredict Endpoint: https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/rawPredict
 *
 * Authentication:
 * - Requires Application Default Credentials (ADC)
 * - Setup: gcloud auth application-default login
 * - See: https://cloud.google.com/docs/authentication/application-default-credentials
 *
 * Note: OpenAI models use the rawPredict endpoint (not generateContent)
 *       These are open-weight models released under Apache 2.0 license, NOT GPT-4 or GPT-3.5
 */

import { getAccessToken, PROJECT_ID, LOCATION } from './config';
import type { GenerationConfig } from './types';
import type { OpenAIRequestConfig, OpenAIResponse } from './openai.types';

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
 * This function calls the OpenAI Chat Completions API via Vertex AI's rawPredict endpoint.
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

  // Ensure model name has openai/ prefix
  const fullModelName = model.startsWith('openai/') ? model : `openai/${model}`;

  // Build Vertex AI endpoint URL for OpenAI models
  // Format: https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/endpoints/openapi/chat/completions
  const endpoint = [
    `https://${LOCATION}-aiplatform.googleapis.com`,
    `/v1/projects/${PROJECT_ID}`,
    `/locations/${LOCATION}`,
    `/endpoints/openapi/chat/completions`
  ].join('');

  // Construct OpenAI Chat Completions API request body
  // Note: OpenAI doesn't support topK parameter
  const requestBody: OpenAIRequestConfig = {
    model: fullModelName,
    messages: [{
      role: 'user',
      content: prompt
    }],
    max_tokens: config?.maxOutputTokens || 1024,
    temperature: config?.temperature ?? 1.0, // OpenAI default is 1.0
    top_p: config?.topP,
    stop: config?.stopSequences
    // Note: topK is not supported by OpenAI
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
  const data = await response.json() as OpenAIResponse;

  // Validate response structure
  if (!data.choices || data.choices.length === 0) {
    throw new Error(
      `No choices returned from OpenAI GPT API\n` +
      `Model: ${fullModelName}\n` +
      `Response: ${JSON.stringify(data)}`
    );
  }

  // Extract the first choice
  const choice = data.choices[0];

  // Validate message structure
  if (!choice.message || !choice.message.content) {
    throw new Error(
      `Invalid message structure from OpenAI GPT API\n` +
      `Model: ${fullModelName}\n` +
      `Choice: ${JSON.stringify(choice)}`
    );
  }

  // Check finish reason
  if (choice.finish_reason === 'length') {
    console.warn(
      `Warning: Response truncated at max_tokens limit for model ${fullModelName}\n` +
      `Consider increasing maxOutputTokens in config.`
    );
  } else if (choice.finish_reason === 'content_filter') {
    throw new Error(
      `Response blocked by content filter (model: ${fullModelName})\n` +
      `The content was flagged by OpenAI's safety system.`
    );
  }

  return choice.message.content;
}
