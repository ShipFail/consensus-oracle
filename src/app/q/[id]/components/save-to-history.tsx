'use client';

import { useEffect } from 'react';
import type { GoldenTruthResult, HistoryItem } from '@/lib/types';
import { useHistory } from '@/hooks/use-history';

type SaveToHistoryProps = {
  result: GoldenTruthResult;
};

export function SaveToHistory({ result }: SaveToHistoryProps) {
  const { addHistoryItem } = useHistory();

  useEffect(() => {
    const historyItem: HistoryItem = {
      id: result.id,
      question: result.question,
      goldenTruthAnswer: result.goldenTruthAnswer,
      confidenceLabel: result.confidenceLabel,
      timestamp: result.timestamp,
    };
    addHistoryItem(historyItem);
  }, [result, addHistoryItem]);

  return null;
}
