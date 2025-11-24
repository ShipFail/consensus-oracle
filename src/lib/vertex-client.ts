import { GenerationConfig } from './vertex-ai/types';
import { generateGoogleContent } from './vertex-ai/google';
import { generateAnthropicContent } from './vertex-ai/anthropic';

export type { GenerationConfig };

export async function generateContent(
  model: string,
  prompt: string,
  config?: GenerationConfig
): Promise<string> {
  if (model.startsWith('anthropic/') || model.includes('claude')) {
    return generateAnthropicContent(model, prompt, config);
  } else {
    return generateGoogleContent(model, prompt, config);
  }
}
