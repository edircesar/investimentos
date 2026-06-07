import { useState, useEffect } from 'react';
import { HistoryEntry } from '@/types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('@investiragora:history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const addEntry = (entry: Omit<HistoryEntry, 'id' | 'date'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: Date.now(),
    };
    const newHistory = [newEntry, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('@investiragora:history', JSON.stringify(newHistory));
  };

  const removeEntry = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('@investiragora:history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('@investiragora:history');
  };

  return { history, addEntry, removeEntry, clearHistory };
}
