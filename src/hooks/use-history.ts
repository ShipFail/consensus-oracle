'use client';

import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '@/lib/types';

const HISTORY_KEY = 'thoth_history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage', error);
    }
  }, []);
  
  const addHistoryItem = useCallback((item: HistoryItem) => {
    if (!isMounted) return;
    try {
        setHistory(prevHistory => {
            const newHistory = [item, ...prevHistory.filter(h => h.id !== item.id)].slice(0, 50);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    } catch (error) {
        console.error('Failed to save history to localStorage', error);
    }
  }, [isMounted]);

  return { history, addHistoryItem };
}
