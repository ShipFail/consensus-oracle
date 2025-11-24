'use server';

/**
 * @fileOverview A flow that generates a golden truth answer based on multiple AI model responses.
 *
 * - generateGoldenTruthAnswer - A function that generates the golden truth answer.
 * - GenerateGoldenTruthAnswerInput - The input type for the generateGoldenTruthAnswer function.
 * - GenerateGoldenTruthAnswerOutput - The return type for the generateGoldenTruthAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGoldenTruthAnswerInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  modelAnswers: z
    .array(z.string())
    .describe('An array of answers from different AI models.'),
});
export type GenerateGoldenTruthAnswerInput =
  z.infer<typeof GenerateGoldenTruthAnswerInputSchema>;

const GenerateGoldenTruthAnswerOutputSchema = z.object({
  goldenTruthAnswer: z.string().describe('The single, agreed-upon answer.'),
  confidenceScore: z.number().describe('A score representing the confidence.'),
  confidenceLabel: z
    .string()
    .describe('A label describing the confidence level.'),
  summary: z.string().describe('A summary of the model consensus.'),
});
export type GenerateGoldenTruthAnswerOutput =
  z.infer<typeof GenerateGoldenTruthAnswerOutputSchema>;

export async function generateGoldenTruthAnswer(
  input: GenerateGoldenTruthAnswerInput
): Promise<GenerateGoldenTruthAnswerOutput> {
  return generateGoldenTruthAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGoldenTruthAnswerPrompt',
  input: {schema: GenerateGoldenTruthAnswerInputSchema},
  output: {schema: GenerateGoldenTruthAnswerOutputSchema},
  prompt: `You are an AI expert in determining consensus among different AI models.

You will be given a question and an array of answers from different AI models.

Your goal is to determine if there is a strong agreement among the answers and to provide a single, \'golden truth\' answer if the confidence is high enough.

If the models disagree, you should clearly indicate that there is no single golden truth answer.

Question: {{{question}}}
Model Answers:
{{#each modelAnswers}}
- {{{this}}}
{{/each}}

Consider these answers and provide:

- A single \"goldenTruthAnswer\" representing the agreed-upon answer when models strongly agree. If models disagree, return \"Models disagree in meaningful ways. There is no single golden truth answer for this question.\"
- A \"confidenceScore\" between 0 and 1 representing the confidence in the golden truth answer.
- A \"confidenceLabel\" which is either \"Strong agreement\", \"Partial agreement\", or \"Disagreement\" based on the confidence score.
- A \"summary\" which summarizes the overall consensus among the models.

Please ensure the \"goldenTruthAnswer\" directly answers the \"question\" based on the \"modelAnswers\".

Output in JSON format.
`,
});

const generateGoldenTruthAnswerFlow = ai.defineFlow(
  {
    name: 'generateGoldenTruthAnswerFlow',
    inputSchema: GenerateGoldenTruthAnswerInputSchema,
    outputSchema: GenerateGoldenTruthAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
