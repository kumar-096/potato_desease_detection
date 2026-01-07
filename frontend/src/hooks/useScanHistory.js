import { useEffect, useState } from "react";

export function useScanHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scanHistory")) || [];
    setHistory(saved);
  }, []);

  const addToHistory = (entry) => {
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("scanHistory", JSON.stringify(updated));
  };

  const clearHistory = () => {
    localStorage.removeItem("scanHistory");
    setHistory([]);
  };

  return { history, addToHistory, clearHistory };
}
