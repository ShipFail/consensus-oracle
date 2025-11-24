import { GoogleAuth } from 'google-auth-library';

export const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

export const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
export const LOCATION = process.env.GCP_LOCATION || 'us-central1';

if (!PROJECT_ID) {
  console.warn("Warning: GOOGLE_CLOUD_PROJECT environment variable is not set. Vertex AI calls may fail.");
}

export const MODEL_IDS = {
  geminiFlashLite: 'googleai/gemini-3.0-flash-lite',
  claudeHaiku: 'anthropic/claude-haiku-4.5',
};

export const GOLDEN_TRUTH_MODEL = MODEL_IDS.geminiFlashLite.replace('googleai/', '');