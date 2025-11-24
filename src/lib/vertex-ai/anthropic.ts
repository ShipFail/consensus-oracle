import { auth, PROJECT_ID, LOCATION } from './config';
import { GenerationConfig, AnthropicResponse } from './types';

export async function generateAnthropicContent(
  model: string,
  prompt: string,
  config?: GenerationConfig
): Promise<string> {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  if (!PROJECT_ID) {
    throw new Error("GCP_PROJECT_ID is missing.");
  }

  // Clean model name for Anthropic
  const cleanModel = model.replace(/^anthropic\//, '');

  const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/anthropic/models/${cleanModel}:rawPredict`;

  const body = {
    anthropic_version: "vertex-2023-10-16",
    messages: [
      { role: "user", content: prompt }
    ],
    max_tokens: config?.maxOutputTokens || 1024,
    temperature: config?.temperature,
    top_p: config?.topP,
    top_k: config?.topK,
  };

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

  const data = (await response.json()) as AnthropicResponse;
  if (!data.content || data.content.length === 0) {
    return "";
  }
  return data.content.map(c => c.text).join('');
}
