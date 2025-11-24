export type ModelAnswer = {
  modelName: string;
  answer: string;
};

export type GoldenTruthResult = {
  question: string;
  goldenTruthAnswer: string;
  confidenceScore: number;
  confidenceLabel: 'Strong agreement' | 'Partial agreement' | 'Disagreement' | string;
  summary: string;
  modelAnswers: ModelAnswer[];
  timestamp: string;
  id: string;
};

export type HistoryItem = Pick<
  GoldenTruthResult,
  'id' | 'question' | 'goldenTruthAnswer' | 'confidenceLabel' | 'timestamp'
>;
