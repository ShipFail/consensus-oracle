/**
 * Meta Llama API Types (Vertex AI native generateContent schema)
 *
 * Official Documentation:
 * - https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/llama/use-llama
 */

/** Message role */
export type MetaRole = 'system' | 'user' | 'assistant';

/** Content part (text only for now) */
export interface MetaPart {
  text?: string;
}

/** Message content */
export interface MetaContent {
  role: MetaRole;
  parts: MetaPart[];
}

/** Generation config */
export interface MetaGenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  seed?: number;
}

/** Request payload for generateContent */
export interface MetaGenerateContentRequest {
  contents: MetaContent[];
  generationConfig?: MetaGenerationConfig;
}

/** Candidate in response */
export interface MetaCandidate {
  content: MetaContent;
  finishReason?: string;
}

/** Response payload for generateContent */
export interface MetaGenerateContentResponse {
  candidates?: MetaCandidate[];
  promptFeedback?: {
    blockReason?: string;
  };
}
