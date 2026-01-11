import { useState } from "react";
import { getUserStats } from "../utils/userStats";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Header.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Header({
  darkMode,
  toggleDark,
  onLogout,
  user,
  history,
  settings,
  notifications,
  unreadCount,
  markAllRead,
}) {
  const [open, setOpen] = useState(false);
  const stats = getUserStats(history);

  const trendData = {
    labels: history
      .slice()
      .reverse()
      .map((h) => h.date.split(",")[0]),
    datasets: [
      {
        label: "Confidence %",
        data: history.slice().reverse().map((h) => h.confidence),
        borderColor: "#4caf50",
        backgroundColor: "rgba(76,175,80,0.15)",
        tension: 0.35,
      },
    ],
  };

  return (
    <header className="header">
      <h2 className="logo">🌿 Crop Health AI</h2>

      <div className="header-actions">
        <button onClick={toggleDark}>
          {darkMode ? "🌞" : "🌙"}
        </button>

        <div className="profile-wrapper">
          <button
            className="profile-icon"
            onClick={() => setOpen((p) => !p)}
          >
            👤
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {open && user && (
            <div className="profile-dropdown">
              {/* ACCOUNT */}
              <section className="account-section">
                <div className="account-header">
                  <div className="avatar-static">👤</div>
                  <div>
                    <div className="account-email">{user.email}</div>
                    <div className="account-role">{user.role}</div>
                  </div>
                </div>
              </section>

              {/* NOTIFICATIONS */}
              <section className="profile-section">
                <h4>🔔 Notifications</h4>
                {notifications.length === 0 && (
                  <p className="empty-text">No notifications</p>
                )}
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${
                      n.read ? "read" : "unread"
                    }`}
                  >
                    <span>{n.message}</span>
                    <small>{n.time}</small>
                  </div>
                ))}
                {notifications.length > 0 && (
                  <button
                    className="clear-notif-btn"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </button>
                )}
              </section>

              {/* USAGE */}
              <section className="profile-section">
                <h4>📊 Usage</h4>
                <div className="profile-row">
                  <span>Total scans</span>
                  <strong>{stats.totalScans}</strong>
                </div>
                <div className="profile-row">
                  <span>Avg confidence</span>
                  <strong>{stats.avgConfidence}</strong>
                </div>
              </section>

              {history.length > 1 && (
                <section className="profile-section">
                  <h4>📈 Trend</h4>
                  <Line data={trendData} />
                </section>
              )}

              {user.role === "admin" && (
                <section className="profile-section admin">
                  <h4>🧑‍💼 Admin</h4>
                  <button className="admin-btn">Manage Users</button>
                  <button className="admin-btn">System Logs</button>
                </section>
              )}

              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
