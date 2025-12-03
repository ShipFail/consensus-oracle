/**
 * Meta Llama API Types
 *
 * Type definitions for Meta Llama models via Vertex AI Model Garden.
 * Uses a similar format to OpenAI's Chat Completions API.
 *
 * Official Documentation:
 * - Llama on Vertex AI: https://cloud.google.com/vertex-ai/generative-ai/docs/open-models/use-llama
 * - Llama Models: https://cloud.google.com/vertex-ai/generative-ai/docs/open-models/llama-models
 * - Model Garden: https://cloud.google.com/model-garden
 */

/**
 * Message role in a conversation
 */
export type MetaRole = 'system' | 'user' | 'assistant';

/**
 * Message in a conversation
 */
export interface MetaMessage {
  /** Role of the message sender */
  role: MetaRole;

  /** Content of the message */
  content: string;
}

/**
 * Meta Llama API request configuration
 */
export interface MetaRequestConfig {
  /** Array of messages in the conversation */
  messages: MetaMessage[];

  /** Maximum tokens to generate */
  max_tokens?: number;

  /** Temperature (0.0-2.0). Lower = more deterministic. */
  temperature?: number;

  /** Top-P (nucleus) sampling (0.0-1.0) */
  top_p?: number;

  /** Top-K sampling */
  top_k?: number;

  /** Stop sequences */
  stop?: string[];

  /** Enable streaming responses */
  stream?: boolean;
}

/**
 * Choice object in the response
 */
export interface MetaChoice {
  /** Index of this choice */
  index: number;

  /** The generated message */
  message: {
    role: 'assistant';
    content: string;
  };

  /** Reason generation stopped */
  finish_reason: 'stop' | 'length' | string;
}

/**
 * Token usage information
 */
export interface MetaUsage {
  /** Number of tokens in the prompt */
  prompt_tokens: number;

  /** Number of tokens in the completion */
  completion_tokens: number;

  /** Total tokens used */
  total_tokens: number;
}

/**
 * Complete response from Meta Llama API
 */
export interface MetaResponse {
  /** Unique identifier for this completion */
  id?: string;

  /** Object type */
  object?: string;

  /** Unix timestamp of when the completion was created */
  created?: number;

  /** Model used for completion */
  model?: string;

  /** Array of completion choices */
  choices: MetaChoice[];

  /** Token usage statistics */
  usage?: MetaUsage;
}

/**
 * Error response from Meta Llama API
 */
export interface MetaError {
  error: {
    message: string;
    type?: string;
    code?: string;
  };
}
