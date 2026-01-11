import { useEffect } from "react";

export function useSessionTracker(user) {
  useEffect(() => {
    if (!user) return;

    const key = `sessions_${user.email}`;
    const start = Date.now();

    return () => {
      const sessions = JSON.parse(localStorage.getItem(key) || "[]");
      sessions.push({
        start,
        end: Date.now(),
        durationMin: Math.round((Date.now() - start) / 60000),
      });
      localStorage.setItem(key, JSON.stringify(sessions));
    };
  }, [user]);
}

