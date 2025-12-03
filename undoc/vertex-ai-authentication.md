# Vertex AI Authentication

**Last Verified**: December 2025

## Application Default Credentials (ADC)

Use google-auth-library to obtain access tokens:

```typescript
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});
const client = await auth.getClient();
const { token } = await client.getAccessToken();
```

## Environment Setup

```bash
export GOOGLE_CLOUD_PROJECT=your-project-id
gcloud auth application-default login
```

## HTTP Headers

```typescript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

## Verification

```bash
gcloud auth application-default print-access-token
```

**Official Reference**: https://cloud.google.com/docs/authentication/application-default-credentials
