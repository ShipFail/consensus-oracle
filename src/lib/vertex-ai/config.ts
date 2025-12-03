import 'dotenv/config';

/**
 * Vertex AI Configuration and Authentication
 *
 * This module provides shared authentication and configuration for all Vertex AI providers.
 * Uses Application Default Credentials (ADC) for authentication.
 *
 * Official Documentation:
 * - Vertex AI Overview: https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform
 * - Authentication: https://cloud.google.com/vertex-ai/docs/authentication
 * - Application Default Credentials: https://cloud.google.com/docs/authentication/application-default-credentials
 * - Supported Regions: https://cloud.google.com/vertex-ai/docs/general/locations
 * - REST API Reference: https://cloud.google.com/vertex-ai/docs/reference/rest
 *
 * Setup Instructions:
 * 1. Install and initialize gcloud CLI: https://cloud.google.com/sdk/docs/install
 * 2. Authenticate: gcloud auth application-default login
 * 3. Set project: gcloud config set project YOUR_PROJECT_ID
 * 4. Set environment variable: export GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
 */

import { GoogleAuth } from 'google-auth-library';

/**
 * Google Auth instance with Cloud Platform scope
 * Uses Application Default Credentials (ADC) from environment
 */
export const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

/**
 * Google Cloud project ID from environment variable
 * Required for all Vertex AI API calls
 */
export const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;

/**
 * Google Cloud region for Vertex AI endpoints
 * Defaults to us-central1 if not specified
 */
export const LOCATION = process.env.GCP_LOCATION || 'us-central1';

/**
 * List of supported Vertex AI regions
 * See: https://cloud.google.com/vertex-ai/docs/general/locations
 */
export const SUPPORTED_LOCATIONS = [
  'us-central1',
  'us-east4',
  'us-west1',
  'us-west4',
  'europe-west1',
  'europe-west4',
  'asia-northeast1',
  'asia-southeast1',
  'asia-south1'
] as const;

// Validate required configuration
if (!PROJECT_ID) {
  throw new Error(
    'GOOGLE_CLOUD_PROJECT environment variable is required.\n' +
    'Set it to your Google Cloud project ID:\n' +
    '  export GOOGLE_CLOUD_PROJECT=your-project-id\n' +
    'Or authenticate with Application Default Credentials:\n' +
    '  gcloud auth application-default login\n' +
    'See: https://cloud.google.com/docs/authentication/application-default-credentials'
  );
}

/**
 * Helper function to get access token for API calls
 *
 * @returns Access token string
 * @throws Error if authentication fails
 */
export async function getAccessToken(): Promise<string> {
  try {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();

    if (!tokenResponse.token) {
      throw new Error('Failed to obtain access token from Google Auth');
    }

    return tokenResponse.token;
  } catch (error) {
    throw new Error(
      `Failed to get access token: ${error instanceof Error ? error.message : String(error)}\n` +
      'Ensure you have authenticated with: gcloud auth application-default login'
    );
  }
}

/**
 * Legacy model IDs with provider prefixes
 * @deprecated Use provider-specific MODELS constants instead
 *
 * These are kept for backward compatibility but will be removed in a future version.
 * Migrate to:
 *   import { MODELS } from './google' or './anthropic'
 */
export const MODEL_IDS = {
  geminiFlashLite: 'googleai/gemini-3.0-flash-lite',
  claudeHaiku: 'anthropic/claude-haiku-4.5',
};

/**
 * Model used for golden truth computation
 * @deprecated Move to consensus module
 */
export const GOLDEN_TRUTH_MODEL = MODEL_IDS.geminiFlashLite.replace('googleai/', '');
