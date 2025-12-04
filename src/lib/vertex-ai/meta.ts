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
 * - generateContent Endpoint: https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent
 *
 * Authentication:
 * - Requires Application Default Credentials (ADC)
 * - Setup: gcloud auth application-default login
 * - See: https://cloud.google.com/docs/authentication/application-default-credentials
 *
 * Note: Meta Llama models use the native Vertex AI generateContent endpoint.
 *       Model availability may vary by Vertex AI region.
 */

import { getAccessToken, PROJECT_ID, LOCATION } from './config';
import type { GenerationConfig } from './types';
import type {
  MetaGenerateContentRequest,
  MetaGenerateContentResponse
} from './meta.types';

/**
 * Available Meta Llama models via Vertex AI Model Garden
 *
 * Note: Model availability varies by Vertex AI region.
 * For latest models: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama
 */
export const MODELS = {
  // Llama 4 (Latest - Mixture-of-Experts architecture)
  LLAMA_4_MAVERICK_17B_128E_INSTRUCT: 'meta/llama-4-maverick-17b-128e-instruct-maas',
  LLAMA_4_SCOUT_17B_16E_INSTRUCT: 'meta/llama-4-scout-17b-16e-instruct-maas',
  // Llama 3.3
  LLAMA_3_3_70B_INSTRUCT: 'meta/llama-3.3-70b-instruct-maas',
  // Llama 3.2
  LLAMA_3_2_90B_VISION_INSTRUCT: 'meta/llama-3.2-90b-vision-instruct-maas',
  LLAMA_3_2_11B_VISION_INSTRUCT: 'meta/llama-3.2-11b-vision-instruct-maas',
  LLAMA_3_2_3B_INSTRUCT: 'meta/llama-3.2-3b-instruct-maas',
  LLAMA_3_2_1B_INSTRUCT: 'meta/llama-3.2-1b-instruct-maas',
  // Llama 3.1
  LLAMA_3_1_405B_INSTRUCT: 'meta/llama-3.1-405b-instruct-maas',
  LLAMA_3_1_70B_INSTRUCT: 'meta/llama-3.1-70b-instruct-maas',
  LLAMA_3_1_8B_INSTRUCT: 'meta/llama-3.1-8b-instruct-maas'
} as const;

/**
 * Generate content using Meta Llama models via Vertex AI
 *
 * This function calls Llama models via Vertex AI's native generateContent endpoint.
 * Llama uses the standard Vertex AI contents/parts format.
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
 *   { temperature: 0, topK: 1, seed: 42 }
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

  // Normalize model name
  const fullModelName = model.startsWith('meta/') ? model : `meta/${model}`;
  const cleanModelName = fullModelName.replace(/^meta\//, '');

  // Build Vertex AI endpoint URL for Meta Llama models (native generateContent)
  // Format: https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/meta/models/{model}:generateContent
  const endpoint = [
    `https://${LOCATION}-aiplatform.googleapis.com`,
    `/v1/projects/${PROJECT_ID}`,
    `/locations/${LOCATION}`,
    `/publishers/meta/models/${cleanModelName}:generateContent`
  ].join('');

  const stopSequences = config?.stopSequences
    ? Array.isArray(config.stopSequences) ? config.stopSequences : [config.stopSequences]
    : undefined;

  // Construct Meta Llama API request body
  const requestBody: MetaGenerateContentRequest = {
    contents: [{
      role: 'user',
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: config?.temperature,
      topK: config?.topK,
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
      `Meta Llama API error (${response.status}): ${errorText}\n` +
      `Model: ${fullModelName}\n` +
      `Endpoint: ${endpoint}\n` +
      `Note: Llama models may not be available in all Vertex AI regions.\n` +
      `Check model availability: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama`
    );
  }

  // Parse response
  const data = await response.json() as MetaGenerateContentResponse;

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
      `No candidates returned from Meta Llama API\n` +
      `Model: ${fullModelName}\n` +
      `Response: ${JSON.stringify(data)}`
    );
  }

  const candidate = data.candidates[0];

  // Validate content structure
  if (!candidate.content?.parts) {
    throw new Error(
      `Invalid response structure from Meta Llama API\n` +
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
