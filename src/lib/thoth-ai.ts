'use server';

import { generateContent } from '@/lib/vertex-client';
import { generateGoldenTruthAnswer } from '@/lib/golden-truth';
import type { ModelAnswer, GoldenTruthResult } from '@/lib/types';

const modelNames = [
  'googleai/gemini-2.5-flash',
  'googleai/gemini-pro',
];

async function getSingleAnswer(
  question: string,
  modelName: string
): Promise<ModelAnswer> {
  try {
    const prompt = `You are an AI Model. In one or two sentences, provide the best possible answer for the following question. Be direct and concise. Question: ${question}`;
    
    const output = await generateContent(modelName, prompt, { temperature: 0, topK: 1 });
    
    return {
      modelName: modelName.replace('googleai/', ''),
      answer: output || 'No answer could be generated.',
    };
  } catch (error) {
    console.error(`Error getting answer from ${modelName}:`, error);
    return {
      modelName: modelName,
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
