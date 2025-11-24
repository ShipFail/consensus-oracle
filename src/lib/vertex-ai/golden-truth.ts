import { generateContent } from '../vertex-client';
import { GOLDEN_TRUTH_MODEL } from './config';

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
    // Using gemini-3.0-flash-lite as a good balance of speed and reasoning for this aggregation task
    // We request JSON output via responseMimeType
    const responseText = await generateContent(
      GOLDEN_TRUTH_MODEL, 
      prompt, 
      { 
        temperature: 0.5, 
        responseMimeType: 'application/json' 
      }
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
