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
  clearNotifications,
}) {
  const [open, setOpen] = useState(false);
  const stats = getUserStats(history);

  /* USAGE TREND (confidence over time) */
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
        backgroundColor: "rgba(76, 175, 80, 0.15)",
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

        {/* PROFILE ICON */}
        <div className="profile-wrapper">
          <button
            className="profile-icon"
            onClick={() => setOpen(!open)}
            aria-label="Profile"
          >
            👤
            {notifications > 0 && (
              <span className="notif-badge">{notifications}</span>
            )}
          </button>

          {open && user && (
            <div className="profile-dropdown">
              {/* ACCOUNT */}
              <section className="account-section">
                <div className="account-header">
                  <div className="avatar-static">👤</div>
                  <div>
                    <div className="account-email">
                      {user.email ?? "Loading…"}
                    </div>
                    <div className="account-role">
                      {user.role ?? "Loading…"}
                    </div>
                  </div>
                </div>
              </section>

              {/* USAGE SUMMARY */}
              <section className="profile-section">
                <h4>📊 Usage Summary</h4>
                <div className="profile-row">
                  <span>Total scans</span>
                  <strong>{stats.totalScans}</strong>
                </div>
                <div className="profile-row">
                  <span>Last scan</span>
                  <strong>{stats.lastScan}</strong>
                </div>
                <div className="profile-row">
                  <span>Top disease</span>
                  <strong>{stats.mostCommon}</strong>
                </div>
                <div className="profile-row">
                  <span>Avg confidence</span>
                  <strong>{stats.avgConfidence}</strong>
                </div>
              </section>

              {/* USAGE TREND */}
              {history.length > 1 && (
                <section className="profile-section">
                  <h4>📈 Usage Trend</h4>
                  <Line data={trendData} />
                </section>
              )}

              {/* PREFERENCES */}
              <section className="profile-section">
                <h4>⚙️ Preferences</h4>
                <div className="profile-row">
                  <span>Dark mode</span>
                  <strong>{darkMode ? "On" : "Off"}</strong>
                </div>
                <div className="profile-row">
                  <span>Auto crop</span>
                  <strong>{settings.autoCrop ? "On" : "Off"}</strong>
                </div>
                <div className="profile-row">
                  <span>Notifications</span>
                  <strong>
                    {settings.enableNotifications ? "On" : "Off"}
                  </strong>
                </div>
              </section>

              {/* ADMIN ONLY */}
              {user.role === "admin" && (
                <section className="profile-section admin">
                  <h4>🧑‍💼 Admin Tools</h4>
                  <button className="admin-btn">Manage Users</button>
                  <button className="admin-btn">System Logs</button>
                </section>
              )}

              {/* ACTIONS */}
              {notifications > 0 && (
                <button
                  className="clear-notif-btn"
                  onClick={clearNotifications}
                >
                  Clear Notifications
                </button>
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
