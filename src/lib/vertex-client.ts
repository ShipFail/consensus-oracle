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

  // Handle model names that might have prefixes like 'googleai/' or 'models/'
  const cleanModel = model.replace(/^googleai\//, '').replace(/^models\//, '');

  const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${cleanModel}:generateContent`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: config
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vertex AI API Error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as GenerateContentResponse;
  
  if (!data.candidates || data.candidates.length === 0) {
      return "";
  }
  
  // Combine all text parts if there are multiple
  return data.candidates[0].content.parts.map(p => p.text).join('');
}
