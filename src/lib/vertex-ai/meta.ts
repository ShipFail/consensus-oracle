/**
 * Meta Llama Models via Vertex AI Model Garden
 *
 * This module provides direct access to Meta's Llama models through Vertex AI.
 * Supports Llama 4, 3.3, 3.2, and 3.1 model families.
 *
 * Official Documentation:
 * - Llama on Vertex AI: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama
 * - Request Predictions: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama/use-llama
 * - Llama 4 Maverick: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama/llama4-maverick
 * - Llama 3.3: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama/llama3-3
 * - rawPredict Endpoint: https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/rawPredict
 *
 * Authentication:
 * - Requires Application Default Credentials (ADC)
 * - Setup: gcloud auth application-default login
 * - See: https://cloud.google.com/docs/authentication/application-default-credentials
 *
 * Note: Meta Llama models use the rawPredict endpoint (not generateContent)
 *       Model availability may vary by Vertex AI region
 */

import { getAccessToken, PROJECT_ID, LOCATION } from './config';
import type { GenerationConfig } from './types';
import type { MetaRequestConfig, MetaResponse } from './meta.types';

/**
 * Available Meta Llama models via Vertex AI Model Garden
 *
 * Note: Model availability varies by Vertex AI region.
 * For latest models: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama
 */
export const MODELS = {
  // Llama 4 (Latest - Mixture-of-Experts architecture)
  LLAMA_4_MAVERICK_17B_128E_INSTRUCT: 'meta/llama-4-maverick-17b-128e-instruct-maas',
  LLAMA_4_SCOUT_17B_16E_INSTRUCT: 'meta/llama-4-scout-17b-16e-instruct-maas'
} as const;

/**
 * Generate content using Meta Llama models via Vertex AI
 *
 * This function calls Llama models via Vertex AI's rawPredict endpoint.
 * Llama uses a chat format similar to OpenAI's API.
 *
 * @param model - Llama model ID (use MODELS constants or custom string)
 * @param prompt - Text prompt to send to the model
 * @param config - Optional generation configuration (temperature, topK, etc.)
 * @returns Generated text content as a string
 * @throws Error if API call fails, authentication fails, or response is invalid
 *
 * @example
 * ```typescript
 * import { generateContent, MODELS } from '@/lib/vertex-ai/meta';
 *
 * // Simple generation with Llama 4
 * const response = await generateContent(
 *   MODELS.LLAMA_4_MAVERICK_17B_128E_INSTRUCT,
 *   'Tell me a joke'
 * );
 *
 * // With deterministic settings
 * const deterministicResponse = await generateContent(
 *   MODELS.LLAMA_3_3_70B_INSTRUCT,
 *   'What is the capital of France?',
 *   { temperature: 0, topK: 1 }
 * );
 *
 * // With smaller model for faster response
 * const fastResponse = await generateContent(
 *   MODELS.LLAMA_3_2_3B_INSTRUCT,
 *   'Summarize this in 3 words: Artificial Intelligence',
 *   { maxOutputTokens: 10 }
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

  // Ensure model name has meta/ prefix
  const fullModelName = model.startsWith('meta/') ? model : `meta/${model}`;

  // Build Vertex AI endpoint URL for Meta Llama models
  // Format: https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/endpoints/openapi/chat/completions
  const endpoint = [
    `https://${LOCATION}-aiplatform.googleapis.com`,
    `/v1/projects/${PROJECT_ID}`,
    `/locations/${LOCATION}`,
    `/endpoints/openapi/chat/completions`
  ].join('');

  // Construct Meta Llama API request body
  const requestBody: MetaRequestConfig = {
    model: fullModelName,
    messages: [{
      role: 'user',
      content: prompt
    }],
    max_tokens: config?.maxOutputTokens || 1024,
    temperature: config?.temperature,
    top_p: config?.topP,
    top_k: config?.topK,
    stop: config?.stopSequences,
    stream: config?.stream // Add stream parameter
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
      `Meta Llama API error (${response.status}): ${errorText}\n` +
      `Model: ${fullModelName}\n` +
      `Endpoint: ${endpoint}\n` +
      `Note: Llama models may not be available in all Vertex AI regions.\n` +
      `Check model availability: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama`
    );
  }

  // Parse response
  const data = await response.json() as MetaResponse;

  // Validate response structure
  if (!data.choices || data.choices.length === 0) {
    throw new Error(
      `No choices returned from Meta Llama API\n` +
      `Model: ${fullModelName}\n` +
      `Response: ${JSON.stringify(data)}`
    );
  }

  // Extract the first choice
  const choice = data.choices[0];

  // Validate message structure
  if (!choice.message || !choice.message.content) {
    throw new Error(
      `Invalid message structure from Meta Llama API\n` +
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
  }

  return choice.message.content;
}
