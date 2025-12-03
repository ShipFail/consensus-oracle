/**
 * Google Gemini Models via Vertex AI
 *
 * This module provides direct access to Google's Gemini models through Vertex AI.
 * Supports Gemini 3, 2.5, and 2.0 model families.
 *
 * Official Documentation:
 * - Gemini Models Overview: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models
 * - Gemini 2.5 Pro: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro
 * - Gemini 2.5 Flash: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash
 * - REST API Reference: https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent
 * - Multimodal Prompts: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/send-multimodal-prompts
 *
 * Authentication:
 * - Requires Application Default Credentials (ADC)
 * - Setup: gcloud auth application-default login
 * - See: https://cloud.google.com/docs/authentication/application-default-credentials
 */

import { getAccessToken, PROJECT_ID, LOCATION } from './config';
import type { GenerationConfig } from './types';
import type {
  GoogleGenerationConfig,
  GoogleGenerateContentRequest,
  GoogleGenerateContentResponse
} from './google.types';

/**
 * Available Gemini models via Vertex AI
 *
 * Model IDs can be used directly without provider prefixes.
 * For model capabilities and limits, see: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models
 */
export const MODELS = {
  // Gemini 3 (Preview - Latest reasoning-first model)
  GEMINI_3_PRO: 'gemini-3-pro',
  GEMINI_3_PRO_IMAGE: 'gemini-3-pro-image',

  // Gemini 2.5 (Generally Available)
  GEMINI_2_5_PRO: 'gemini-2.5-pro',
  GEMINI_2_5_FLASH: 'gemini-2.5-flash',
  GEMINI_2_5_FLASH_LITE: 'gemini-2.5-flash-lite',
  GEMINI_2_5_FLASH_IMAGE: 'gemini-2.5-flash-image',

  // Gemini 2.0
  GEMINI_2_0_FLASH: 'gemini-2.0-flash',
  GEMINI_2_0_FLASH_LITE: 'gemini-2.0-flash-lite'
} as const;

/**
 * Generate content using Google Gemini models via Vertex AI
 *
 * This function calls the Gemini generateContent REST API endpoint.
 * It supports text generation with configurable parameters like temperature and topK.
 *
 * @param model - Gemini model ID (use MODELS constants or custom string)
 * @param prompt - Text prompt to send to the model
 * @param config - Optional generation configuration (temperature, topK, etc.)
 * @returns Generated text content as a string
 * @throws Error if API call fails, authentication fails, or response is invalid
 *
 * @example
 * ```typescript
 * import { generateContent, MODELS } from '@/lib/vertex-ai/google';
 *
 * // Simple generation
 * const response = await generateContent(
 *   MODELS.GEMINI_2_5_FLASH,
 *   'Tell me a joke'
 * );
 *
 * // With deterministic settings
 * const deterministicResponse = await generateContent(
 *   MODELS.GEMINI_2_5_FLASH_LITE,
 *   'What is the capital of France?',
 *   { temperature: 0, topK: 1 }
 * );
 *
 * // With JSON output
 * const jsonResponse = await generateContent(
 *   MODELS.GEMINI_2_5_PRO,
 *   'List 3 colors in JSON format',
 *   { responseMimeType: 'application/json' }
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

  // Clean model name (remove any prefixes if present)
  const cleanModel = model
    .replace(/^googleai\//, '')
    .replace(/^models\//, '')
    .replace(/^publishers\/google\/models\//, '');

  // Build Vertex AI endpoint URL
  // Format: https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/google/models/{model}:generateContent
  const endpoint = [
    `https://${LOCATION}-aiplatform.googleapis.com`,
    `/v1/projects/${PROJECT_ID}`,
    `/locations/${LOCATION}`,
    `/publishers/google`,
    `/models/${cleanModel}:generateContent`
  ].join('');

  // Map common config to Google-specific format
  const generationConfig: GoogleGenerationConfig | undefined = config ? {
    temperature: config.temperature,
    topK: config.topK,
    topP: config.topP,
    maxOutputTokens: config.maxOutputTokens,
    stopSequences: config.stopSequences,
    // Note: responseMimeType is Google-specific, cast config if needed
    responseMimeType: (config as GoogleGenerationConfig).responseMimeType
  } : undefined;

  // Construct request body following Gemini API format
  const requestBody: GoogleGenerateContentRequest = {
    contents: [{
      role: 'user',
      parts: [{ text: prompt }]
    }],
    generationConfig
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
      `Google Gemini API error (${response.status}): ${errorText}\n` +
      `Model: ${cleanModel}\n` +
      `Endpoint: ${endpoint}\n` +
      `This may indicate invalid model name, authentication issues, or API quota limits.\n` +
      `See: https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent#response-body`
    );
  }

  // Parse response
  const data = await response.json() as GoogleGenerateContentResponse;

  // Validate response structure
  if (!data.candidates || data.candidates.length === 0) {
    // Check if prompt was blocked
    if (data.promptFeedback?.blockReason) {
      throw new Error(
        `Prompt was blocked by safety filters: ${data.promptFeedback.blockReason}\n` +
        `Model: ${cleanModel}`
      );
    }
    // No candidates but no block reason - return empty string
    return '';
  }

  // Extract text from the first candidate
  const candidate = data.candidates[0];

  // Check finish reason
  if (candidate.finishReason === 'SAFETY') {
    throw new Error(
      `Response blocked by safety filters (model: ${cleanModel})\n` +
      `Safety ratings: ${JSON.stringify(candidate.safetyRatings || [])}`
    );
  }

  // Validate content structure
  if (!candidate.content || !candidate.content.parts) {
    throw new Error(
      `Invalid response structure from Google Gemini API\n` +
      `Model: ${cleanModel}\n` +
      `Candidate: ${JSON.stringify(candidate)}`
    );
  }

  // Concatenate all text parts
  const text = candidate.content.parts
    .filter(part => part.text) // Only include parts with text
    .map(part => part.text)
    .join('');

  return text;
}
