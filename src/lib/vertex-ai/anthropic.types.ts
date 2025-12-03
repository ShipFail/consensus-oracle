/**
 * Anthropic Claude API Types
 *
 * Type definitions for Anthropic Claude models via Vertex AI.
 * Claude uses the Messages API format.
 *
 * Official Documentation:
 * - Anthropic Messages API: https://docs.anthropic.com/en/api/messages
 * - Claude on Vertex AI: https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude
 * - API Reference: https://docs.anthropic.com/en/api/messages#body
 */

/**
 * Message role in a conversation
 */
export type AnthropicRole = 'user' | 'assistant';

/**
 * Content block type
 */
export type AnthropicContentBlockType = 'text' | 'image';

/**
 * Text content block
 */
export interface AnthropicTextBlock {
  type: 'text';
  text: string;
}

/**
 * Image content block (for vision models)
 */
export interface AnthropicImageBlock {
  type: 'image';
  source: {
    type: 'base64';
    media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    data: string;
  };
}

/**
 * Content can be string or array of blocks
 */
export type AnthropicContent = string | Array<AnthropicTextBlock | AnthropicImageBlock>;

/**
 * Message in a conversation
 */
export interface AnthropicMessage {
  /** Role: 'user' or 'assistant' */
  role: AnthropicRole;

  /** Message content (text or blocks) */
  content: AnthropicContent;
}

/**
 * Anthropic API request configuration
 * Used in the rawPredict endpoint body
 */
export interface AnthropicRequestConfig {
  /** Anthropic API version (required by Vertex AI) */
  anthropic_version: string;

  /** Array of messages in the conversation */
  messages: AnthropicMessage[];

  /** Maximum tokens to generate (required) */
  max_tokens: number;

  /** Model name (usually included in endpoint, but can be in body) */
  model?: string;

  /** System prompt (instructions for the model) */
  system?: string;

  /** Temperature (0.0-1.0). Lower = more deterministic. */
  temperature?: number;

  /** Top-P (nucleus) sampling (0.0-1.0) */
  top_p?: number;

  /** Top-K sampling */
  top_k?: number;

  /** Stop sequences */
  stop_sequences?: string[];

  /** Enable streaming responses */
  stream?: boolean;

  /** Metadata for the request */
  metadata?: {
    user_id?: string;
  };
}

/**
 * Content block in the response
 */
export interface AnthropicResponseContentBlock {
  /** Block type (usually 'text') */
  type: 'text';

  /** Generated text content */
  text: string;
}

/**
 * Token usage information
 */
export interface AnthropicUsage {
  /** Number of input tokens */
  input_tokens: number;

  /** Number of output tokens */
  output_tokens: number;
}

/**
 * Stop reason for generation
 */
export type AnthropicStopReason =
  | 'end_turn'      // Model decided to end
  | 'max_tokens'    // Hit max_tokens limit
  | 'stop_sequence' // Hit a stop sequence
  | 'tool_use';     // Model wants to use a tool (for tool use feature)

/**
 * Complete response from Anthropic Claude API
 */
export interface AnthropicResponse {
  /** Unique response ID */
  id: string;

  /** Type (always 'message') */
  type: 'message';

  /** Role (always 'assistant') */
  role: 'assistant';

  /** Array of content blocks (text, etc.) */
  content: AnthropicResponseContentBlock[];

  /** Model that generated the response */
  model: string;

  /** Why generation stopped */
  stop_reason: AnthropicStopReason | null;

  /** Stop sequence that triggered stop (if applicable) */
  stop_sequence?: string | null;

  /** Token usage information */
  usage: AnthropicUsage;
}

/**
 * Error response from Anthropic API
 */
export interface AnthropicError {
  type: 'error';
  error: {
    type: string;
    message: string;
  };
}
