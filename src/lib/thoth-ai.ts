'use server';

import { ai } from '@/ai/genkit';
import { generateGoldenTruthAnswer } from '@/ai/flows/generate-golden-truth-answer';
import type { ModelAnswer, GoldenTruthResult } from '@/lib/types';

const modelNames = ['Model Alpha', 'Model Beta', 'Model Gamma'];

async function getSingleAnswer(
  question: string,
  modelName: string
): Promise<ModelAnswer> {
  try {
    const { output } = await ai.generate({
      model: ai.model,
      prompt: `You are AI Model ${modelName}. In one or two sentences, provide the best possible answer for the following question. Be direct and concise. Question: ${question}`,
      output: { format: 'text' },
    });
    return {
      modelName,
      answer: output || 'No answer could be generated.',
    };
  } catch (error) {
    console.error(`Error getting answer from ${modelName}:`, error);
    return {
      modelName,
      answer: 'Model unavailable for this query.',
    };
  }
}

export async function getThothAnswer(
  question: string,
  id: string
): Promise<GoldenTruthResult> {
  const answerPromises = modelNames.map((name) => getSingleAnswer(question, name));
  const modelAnswers = await Promise.all(answerPromises);

  const validAnswers = modelAnswers
    .filter((a) => a.answer !== 'Model unavailable for this query.')
    .map((a) => a.answer);

  if (validAnswers.length < 2) {
    return {
      id,
      question,
      goldenTruthAnswer: 'Not enough model responses to determine a golden truth.',
      confidenceScore: 0,
      confidenceLabel: 'Disagreement',
      summary: 'Most models failed to provide an answer.',
      modelAnswers,
      timestamp: new Date().toISOString(),
    };
  }

  const goldenTruthGenResult = await generateGoldenTruthAnswer({
    question,
    modelAnswers: validAnswers,
  });

  return {
    id,
    question,
    ...goldenTruthGenResult,
    modelAnswers,
    timestamp: new Date().toISOString(),
  };
}
