/**
 * Common Types for Vertex AI Providers
 *
 * This module contains only shared types used across multiple providers.
 * Provider-specific types are defined in their respective *.types.ts files.
 *
 * Official Documentation:
 * - Vertex AI API Reference: https://cloud.google.com/vertex-ai/docs/reference/rest
 */

/**
 * Common generation configuration parameters
 *
 * Not all parameters are supported by all providers. Check provider-specific
 * documentation for parameter support and valid ranges.
 *
 * @property temperature - Controls randomness (0.0-2.0). Lower = more deterministic. Default varies by provider.
 * @property topK - Number of highest probability tokens to consider. Lower = more focused.
 * @property topP - Nucleus sampling threshold (0.0-1.0). Cumulative probability cutoff.
 * @property maxOutputTokens - Maximum number of tokens to generate. Default varies by provider.
 * @property stopSequences - Array of strings that will stop generation when encountered.
 */
export interface GenerationConfig {
  /** Temperature (0.0-2.0). Lower values = more deterministic. */
  temperature?: number;

  /** Top-K sampling. Number of highest probability tokens to consider. */
  topK?: number;

  /** Top-P (nucleus) sampling (0.0-1.0). Cumulative probability threshold. */
  topP?: number;

  /** Maximum number of tokens to generate. */
  maxOutputTokens?: number;

  /** Stop sequences to end generation early. */
  stopSequences?: string[];

  /** Enable streaming responses (true for streaming, false for single response). */
  stream?: boolean;
}

/**
 * Common usage metadata structure
 * Token counts from API responses
 */
export interface UsageMetadata {
  /** Number of tokens in the input prompt */
  inputTokens: number;

  /** Number of tokens in the generated output */
  outputTokens: number;

  /** Total tokens (input + output) */
  totalTokens: number;
}
