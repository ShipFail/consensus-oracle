/**
 * OpenAI GPT API Types
 *
 * Type definitions for OpenAI GPT models via Vertex AI Model Garden.
 * Uses OpenAI's Chat Completions API format.
 *
 * Official Documentation:
 * - OpenAI Chat Completions API: https://platform.openai.com/docs/api-reference/chat
 * - OpenAI on Vertex AI: https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-openai
 */

/**
 * Message role in a chat conversation
 */
export type OpenAIRole = 'system' | 'user' | 'assistant' | 'function' | 'tool';

/**
 * Message in a chat conversation
 */
export interface OpenAIMessage {
  /** Role of the message sender */
  role: OpenAIRole;

  /** Content of the message */
  content: string;

  /** Name of the author (optional) */
  name?: string;

  /** Function call (for function calling feature) */
  function_call?: {
    name: string;
    arguments: string;
  };

  /** Tool calls (for tool use feature) */
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

/**
 * OpenAI Chat Completions API request configuration
 */
export interface OpenAIRequestConfig {
  /** ID of the model to use */
  model: string;

  /** Array of messages in the conversation */
  messages: OpenAIMessage[];

  /** Maximum tokens to generate */
  max_tokens?: number;

  /** Temperature (0-2). Lower = more deterministic. */
  temperature?: number;

  /** Top-P (nucleus) sampling (0-1) */
  top_p?: number;

  /** Number of completions to generate */
  n?: number;

  /** Enable streaming responses */
  stream?: boolean;

  /** Stop sequences */
  stop?: string | string[];

  /** Presence penalty (-2.0 to 2.0) */
  presence_penalty?: number;

  /** Frequency penalty (-2.0 to 2.0) */
  frequency_penalty?: number;

  /** Logit bias (modify likelihood of specified tokens) */
  logit_bias?: Record<string, number>;

  /** User identifier for tracking */
  user?: string;

  /** Response format (for structured output) */
  response_format?: {
    type: 'text' | 'json_object';
  };

  /** Seed for deterministic sampling */
  seed?: number;

  /** Tools available to the model */
  tools?: Array<{
    type: 'function';
    function: {
      name: string;
      description?: string;
      parameters?: Record<string, unknown>;
    };
  }>;

  /** Tool choice behavior */
  tool_choice?: 'none' | 'auto' | string;
}

/**
 * Choice object in the response
 */
export interface OpenAIChoice {
  /** Index of this choice */
  index: number;

  /** The generated message */
  message: {
    role: 'assistant';
    content: string;
    function_call?: {
      name: string;
      arguments: string;
    };
    tool_calls?: Array<{
      id: string;
      type: 'function';
      function: {
        name: string;
        arguments: string;
      };
    }>;
  };

  /** Reason generation stopped */
  finish_reason: 'stop' | 'length' | 'function_call' | 'tool_calls' | 'content_filter' | null;

  /** Log probabilities (if requested) */
  logprobs?: {
    content: Array<{
      token: string;
      logprob: number;
      bytes: number[] | null;
      top_logprobs: Array<{
        token: string;
        logprob: number;
        bytes: number[] | null;
      }>;
    }> | null;
  };
}

/**
 * Token usage information
 */
export interface OpenAIUsage {
  /** Number of tokens in the prompt */
  prompt_tokens: number;

  /** Number of tokens in the completion */
  completion_tokens: number;

  /** Total tokens used */
  total_tokens: number;
}

/**
 * Complete response from OpenAI Chat Completions API
 */
export interface OpenAIResponse {
  /** Unique identifier for this completion */
  id: string;

  /** Object type (always 'chat.completion') */
  object: 'chat.completion';

  /** Unix timestamp of when the completion was created */
  created: number;

  /** Model used for completion */
  model: string;

  /** Array of completion choices */
  choices: OpenAIChoice[];

  /** Token usage statistics */
  usage: OpenAIUsage;

  /** System fingerprint (for reproducibility) */
  system_fingerprint?: string;
}

/**
 * Error response from OpenAI API
 */
export interface OpenAIError {
  error: {
    message: string;
    type: string;
    param?: string;
    code?: string;
  };
}
