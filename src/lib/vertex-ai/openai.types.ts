/**
 * OpenAI GPT-OSS API Types (Vertex AI native generateContent schema)
 *
 * Official Documentation:
 * - https://cloud.google.com/vertex-ai/generative-ai/docs/maas/openai
 */

/** Message role */
export type OpenAIRole = 'system' | 'user' | 'assistant';

/** Content part (text only for GPT-OSS) */
export interface OpenAIPart {
  text?: string;
}

/** Message content */
export interface OpenAIContent {
  role: OpenAIRole;
  parts: OpenAIPart[];
}

/** Generation configuration */
export interface OpenAIGenerationConfig {
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  seed?: number;
}

/** Request payload for generateContent */
export interface OpenAIGenerateContentRequest {
  contents: OpenAIContent[];
  generationConfig?: OpenAIGenerationConfig;
}

/** Candidate in response */
export interface OpenAICandidate {
  content: OpenAIContent;
  finishReason?: string;
}

/** Response payload for generateContent */
export interface OpenAIGenerateContentResponse {
  candidates?: OpenAICandidate[];
  promptFeedback?: {
    blockReason?: string;
  };
}
