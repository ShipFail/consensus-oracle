'use server';

/**
 * @fileOverview Summarizes the agreement between different AI models' responses.
 *
 * - summarizeModelAgreement - A function that summarizes the model agreement.
 * - SummarizeModelAgreementInput - The input type for the summarizeModelAgreement function.
 * - SummarizeModelAgreementOutput - The return type for the summarizeModelAgreement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeModelAgreementInputSchema = z.object({
  answers: z
    .array(
      z.object({
        modelName: z.string(),
        answer: z.string(),
      })
    )
    .describe('An array of answers from different AI models.'),
});
export type SummarizeModelAgreementInput = z.infer<typeof SummarizeModelAgreementInputSchema>;

const SummarizeModelAgreementOutputSchema = z.object({
  summary: z.string().describe('A summary of the agreement between the models.'),
  confidenceLevel: z
    .enum(['Strong agreement', 'Partial agreement', 'Disagreement'])
    .describe('The confidence level of the agreement.'),
});
export type SummarizeModelAgreementOutput = z.infer<typeof SummarizeModelAgreementOutputSchema>;

export async function summarizeModelAgreement(
  input: SummarizeModelAgreementInput
): Promise<SummarizeModelAgreementOutput> {
  return summarizeModelAgreementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeModelAgreementPrompt',
  input: {
    schema: SummarizeModelAgreementInputSchema,
  },
  output: {
    schema: SummarizeModelAgreementOutputSchema,
  },
  prompt: `You are an expert in determining the agreement between different AI models' responses. Analyze the following answers and determine the level of agreement between them.  Then respond with a summary of the models' agreement or disagreement.

Answers:
{{#each answers}}
Model: {{this.modelName}}
Answer: {{this.answer}}
{{/each}}

Based on the level of agreement, set the confidenceLevel to one of the following values:
- Strong agreement: the models give nearly identical answers.
- Partial agreement: the models overlap but differ in details or framing.
- Disagreement: the models give meaningfully different answers.
`,
});

const summarizeModelAgreementFlow = ai.defineFlow(
  {
    name: 'summarizeModelAgreementFlow',
    inputSchema: SummarizeModelAgreementInputSchema,
    outputSchema: SummarizeModelAgreementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
