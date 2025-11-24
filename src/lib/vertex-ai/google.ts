import { auth, PROJECT_ID, LOCATION } from './config';
import { GenerationConfig, GenerateContentResponse } from './types';

export async function generateGoogleContent(
  model: string,
  prompt: string,
  config?: GenerationConfig
): Promise<string> {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  if (!PROJECT_ID) {
    throw new Error("GCP_PROJECT_ID is missing.");
  }

  // Clean model name for Google
  const cleanModel = model.replace(/^googleai\//, '').replace(/^models\//, '');

  const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${cleanModel}:generateContent`;

  const body = {
    contents: [{
      role: 'user',
      parts: [{ text: prompt }]
    }],
    generationConfig: config
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

  const data = (await response.json()) as GenerateContentResponse;
  
  if (!data.candidates || data.candidates.length === 0) {
      return "";
  }
  
  return data.candidates[0].content.parts.map(p => p.text).join('');
}
