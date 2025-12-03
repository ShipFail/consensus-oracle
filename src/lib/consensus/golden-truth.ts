/**
 * Golden Truth Consensus Computation
 *
 * This module uses a meta-LLM approach to determine consensus among multiple model answers.
 * It analyzes responses from different models and returns a "golden truth" answer when they agree.
 */

import * as Google from '../vertex-ai/google';
import type { GoogleGenerationConfig } from '../vertex-ai/google.types';

export interface GenerateGoldenTruthAnswerInput {
  question: string;
  modelAnswers: string[];
}

export interface GenerateGoldenTruthAnswerOutput {
  goldenTruthAnswer: string;
  confidenceScore: number;
  confidenceLabel: string;
  summary: string;
}

/**
 * Generate a golden truth answer by analyzing consensus among multiple model responses
 *
 * Uses Gemini 2.5 Flash Lite as a meta-judge to evaluate agreement between models.
 *
 * @param input - Question and array of model answers
 * @returns Golden truth answer with confidence score and label
 */
export async function generateGoldenTruthAnswer(
  input: GenerateGoldenTruthAnswerInput
): Promise<GenerateGoldenTruthAnswerOutput> {
  const prompt = `You are an AI expert in determining consensus among different AI models.

You will be given a question and an array of answers from different AI models.

Your goal is to determine if there is a strong agreement among the answers and to provide a single, 'golden truth' answer if the confidence is high enough.

If the models disagree, you should clearly indicate that there is no single golden truth answer.

Question: ${input.question}
Model Answers:
${input.modelAnswers.map(a => `- ${a}`).join('\n')}

Consider these answers and provide a JSON object with the following fields:

- "goldenTruthAnswer": A single string representing the agreed-upon answer when models strongly agree. If models disagree, return "Models disagree in meaningful ways. There is no single golden truth answer for this question."
- "confidenceScore": A number between 0 and 1 representing the confidence in the golden truth answer.
- "confidenceLabel": A string which is either "Strong agreement", "Partial agreement", or "Disagreement" based on the confidence score.
- "summary": A string which summarizes the overall consensus among the models.

Please ensure the "goldenTruthAnswer" directly answers the "question" based on the "modelAnswers".
`;

  try {
    // Using gemini-2.5-flash-lite as a good balance of speed and reasoning for this aggregation task
    // We request JSON output via responseMimeType
    const config: GoogleGenerationConfig = {
      temperature: 0.5,
      responseMimeType: 'application/json'
    };

    const responseText = await Google.generateContent(
      Google.MODELS.GEMINI_2_5_FLASH_LITE,
      prompt,
      config as any  // Cast needed due to Google-specific field
    );

    const result = JSON.parse(responseText) as GenerateGoldenTruthAnswerOutput;
    return result;

  } catch (error) {
    console.error("Error generating golden truth answer:", error);
    // Fallback in case of parsing error or API failure
    return {
      goldenTruthAnswer: "Error determining consensus.",
      confidenceScore: 0,
      confidenceLabel: "Error",
      summary: "Failed to process model answers."
    };
  }
}
