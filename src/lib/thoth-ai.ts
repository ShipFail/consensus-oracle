'use server';

import { ai, deterministicConfig } from '@/ai/genkit';
import { generateGoldenTruthAnswer } from '@/ai/flows/generate-golden-truth-answer';
import type { ModelAnswer, GoldenTruthResult } from '@/lib/types';
import { model } from 'genkit';

const modelReferences = [
  model('googleai/gemini-2.5-flash'),
  model('googleai/gemini-pro'),
];

async function getSingleAnswer(
  question: string,
  modelRef: (typeof modelReferences)[number]
): Promise<ModelAnswer> {
  try {
    const { output } = await ai.generate({
      model: modelRef,
      prompt: `You are an AI Model. In one or two sentences, provide the best possible answer for the following question. Be direct and concise. Question: ${question}`,
      output: { format: 'text' },
      config: deterministicConfig,
    });
    return {
      modelName: modelRef.name.replace('googleai/',''),
      answer: output || 'No answer could be generated.',
    };
  } catch (error) {
    console.error(`Error getting answer from ${modelRef.name}:`, error);
    return {
      modelName: modelRef.name,
      answer: 'Model unavailable for this query.',
    };
  }
}

export async function getThothAnswer(
  question: string,
  id: string
): Promise<GoldenTruthResult> {
  const answerPromises = modelReferences.map((ref) => getSingleAnswer(question, ref));
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
