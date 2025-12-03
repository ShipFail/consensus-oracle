'use server';

import * as Google from '@/lib/vertex-ai/google';
import * as Anthropic from '@/lib/vertex-ai/anthropic';
import { generateGoldenTruthAnswer } from '@/lib/consensus/golden-truth';
import { MODEL_IDS } from '@/lib/vertex-ai/config';
import type { ModelAnswer, GoldenTruthResult } from '@/lib/types';

const modelNames = Object.values(MODEL_IDS);

async function getSingleAnswer(
  question: string,
  modelName: string
): Promise<ModelAnswer> {
  try {
    const prompt = `You are an AI Model. In one or two sentences, provide the best possible answer for the following question. Be direct and concise. Question: ${question}`;

    let output: string;

    // Route to appropriate provider based on model name
    if (modelName.startsWith('anthropic/') || modelName.includes('claude')) {
      // Anthropic Claude model
      const cleanModel = modelName.replace(/^anthropic\//, '');
      output = await Anthropic.generateContent(cleanModel, prompt, { temperature: 0, topK: 1 });
    } else {
      // Google Gemini model (default)
      const cleanModel = modelName.replace(/^googleai\//, '');
      output = await Google.generateContent(cleanModel, prompt, { temperature: 0, topK: 1 });
    }

    return {
      modelName: modelName.replace(/^(googleai|anthropic)\//, ''),
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
