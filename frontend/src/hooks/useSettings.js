import { useEffect, useState } from "react";

const STORAGE_KEY = "user_settings";

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          enableNotifications: true,
          highQualityCamera: true,
          autoCrop: true,
        };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return { settings, setSettings };
}

