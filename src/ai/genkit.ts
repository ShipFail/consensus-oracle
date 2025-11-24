import {genkit, GenerationCommonConfig} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const deterministicConfig: GenerationCommonConfig = {
  temperature: 0,
  topK: 1,
};

export const ai = genkit({
  plugins: [
    googleAI({
      models: [
        'gemini-2.5-flash',
        'gemini-pro',
      ],
    }),
  ],
});
