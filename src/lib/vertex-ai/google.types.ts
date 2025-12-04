/**
 * Google Gemini API Types
 *
 * Type definitions for Google Gemini models via Vertex AI.
 *
 * Official Documentation:
 * - Gemini API Reference: https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini
 * - Request/Response Format: https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini#request_body
 * - Content Structure: https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/send-multimodal-prompts
 */

/**
 * Google-specific generation configuration
 * Extends the common GenerationConfig with Google-specific options
 */
export interface GoogleGenerationConfig {
  /** Temperature (0.0-2.0). Controls randomness. */
  temperature?: number;

  /** Top-K sampling. Number of tokens to consider. */
  topK?: number;

  /** Top-P (nucleus) sampling (0.0-1.0). */
  topP?: number;

  /** Maximum output tokens to generate. */
  maxOutputTokens?: number;

  /** Number of response candidates to generate. Default: 1 */
  candidateCount?: number;

  /** Sequences that stop generation. */
  stopSequences?: string[];

  /** Random seed for best-effort deterministic generation (Gemini 2.5+). */
  seed?: number;

  /** Response MIME type. Use 'application/json' for structured output. */
  responseMimeType?: string;
}

/**
 * Part of a content message
 * Can contain text or inline data (images, etc.)
 */
export interface GooglePart {
  /** Text content */
  text?: string;

  /** Inline binary data (e.g., base64 encoded images) */
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

/**
 * Content message with role and parts
 */
export interface GoogleContent {
  /** Role: 'user', 'model', or 'function' */
  role: string;

  /** Array of content parts (text, images, etc.) */
  parts: GooglePart[];
}

/**
 * Safety rating for a candidate response
 */
export interface GoogleSafetyRating {
  /** Safety category (e.g., HARM_CATEGORY_HATE_SPEECH) */
  category: string;

  /** Probability of harm: NEGLIGIBLE, LOW, MEDIUM, HIGH */
  probability: string;

  /** Whether content was blocked */
  blocked?: boolean;
}

/**
 * Single candidate response from the model
 */
export interface GoogleCandidate {
  /** Generated content */
  content: GoogleContent;

  /** Reason generation stopped */
  finishReason?: 'FINISH_REASON_UNSPECIFIED' | 'STOP' | 'MAX_TOKENS' | 'SAFETY' | 'RECITATION' | 'OTHER';

  /** Index of this candidate */
  index?: number;

  /** Safety ratings for this candidate */
  safetyRatings?: GoogleSafetyRating[];

  /** Citation metadata (if content includes citations) */
  citationMetadata?: {
    citations: Array<{
      startIndex?: number;
      endIndex?: number;
      uri?: string;
      title?: string;
      license?: string;
      publicationDate?: string;
    }>;
  };
}

/**
 * Token usage metadata from the response
 */
export interface GoogleUsageMetadata {
  /** Number of tokens in the prompt */
  promptTokenCount: number;

  /** Number of tokens in the candidates */
  candidatesTokenCount: number;

  /** Total token count */
  totalTokenCount: number;
}

/**
 * Complete response from Gemini generateContent API
 */
export interface GoogleGenerateContentResponse {
  /** Array of candidate responses */
  candidates?: GoogleCandidate[];

  /** Token usage information */
  usageMetadata?: GoogleUsageMetadata;

  /** Model version that generated the response */
  modelVersion?: string;

  /** Prompt feedback (safety ratings for the prompt itself) */
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: GoogleSafetyRating[];
  };
}

/**
 * Request body for generateContent API
 */
export interface GoogleGenerateContentRequest {
  /** Array of content messages (conversation history + current prompt) */
  contents: GoogleContent[];

  /** Generation configuration */
  generationConfig?: GoogleGenerationConfig;

  /** Safety settings */
  safetySettings?: Array<{
    category: string;
    threshold: 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_LOW_AND_ABOVE';
  }>;

  /** System instruction (available in some models) */
  systemInstruction?: GoogleContent;
}
