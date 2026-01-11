import { useEffect, useState } from "react";

const getKey = (user) =>
  user ? `scan_history_${user.email}` : null;

export function useScanHistory(user) {
  const storageKey = getKey(user);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    setHistory(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(history));
  }, [history, storageKey]);

  const addToHistory = (entry) => {
    setHistory((prev) => [entry, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
    if (storageKey) localStorage.removeItem(storageKey);
  };

  return { history, addToHistory, clearHistory };
}
