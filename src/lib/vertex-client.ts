import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = process.env.GCP_LOCATION || 'us-central1'; // Keeping GCP_LOCATION for flexibility as it's not a standard Google variable

if (!PROJECT_ID) {
  console.warn("Warning: GOOGLE_CLOUD_PROJECT environment variable is not set. Vertex AI calls may fail.");
}

export interface GenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  candidateCount?: number;
  stopSequences?: string[];
  responseMimeType?: string;
}

interface GenerateContentResponse {
  candidates?: {
    content: {
      parts: { text: string }[];
    };
    finishReason?: string;
  }[];
  usageMetadata?: {
      promptTokenCount: number;
      candidatesTokenCount: number;
      totalTokenCount: number;
  }
}

interface AnthropicResponse {
  content?: {
    text: string;
    type: string;
  }[];
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export async function generateContent(
  model: string,
  prompt: string,
  config?: GenerationConfig
): Promise<string> {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  if (!PROJECT_ID) {
    throw new Error("GCP_PROJECT_ID is missing.");
  }

  // Determine publisher and clean model name
  let publisher = 'google';
  let cleanModel = model;
  let isAnthropic = false;

  if (model.startsWith('anthropic/') || model.includes('claude')) {
    publisher = 'anthropic';
    isAnthropic = true;
    cleanModel = model.replace(/^anthropic\//, '');
  } else {
    cleanModel = model.replace(/^googleai\//, '').replace(/^models\//, '');
  }

  const method = isAnthropic ? 'rawPredict' : 'generateContent';
  const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/${publisher}/models/${cleanModel}:${method}`;

  let body: any;

  if (isAnthropic) {
    // Anthropic (Claude) Request Format
    body = {
      anthropic_version: "vertex-2023-10-16",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: config?.maxOutputTokens || 1024,
      temperature: config?.temperature,
      top_p: config?.topP,
      top_k: config?.topK,
    };
  } else {
    // Google (Gemini) Request Format
    body = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: config
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vertex AI API Error (${response.status}) for ${model}: ${errorText}`);
  }

  if (isAnthropic) {
    const data = (await response.json()) as AnthropicResponse;
    if (!data.content || data.content.length === 0) {
      return "";
    }
    return data.content.map(c => c.text).join('');
  } else {
    const data = (await response.json()) as GenerateContentResponse;
    if (!data.candidates || data.candidates.length === 0) {
        return "";
    }
    // Combine all text parts if there are multiple
    return data.candidates[0].content.parts.map(p => p.text).join('');
  }
}
