import { useEffect, useState } from "react";

export function useNotifications(user) {
  const key = user ? `notifications_${user.email}` : null;

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!key) return;
    const stored = localStorage.getItem(key);
    setNotifications(stored ? JSON.parse(stored) : []);
  }, [key]);

  useEffect(() => {
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(notifications));
  }, [notifications, key]);

  const addNotification = (message, type = "info") => {
    if (!key) return;
    setNotifications((prev) => [
      {
        id: Date.now(),
        message,
        type,
        read: false,
        date: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
  };
}
