import { getUserStats } from "../utils/userStats";

export default function Profile({ user, history }) {
  const stats = getUserStats(history);

  return (
    <div className="card">
      <h3>👤 Profile</h3>

      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <hr />

      <h4>📈 Usage</h4>
      <p>Total scans: {stats.totalScans}</p>
      <p>Last scan: {stats.lastScan}</p>
      <p>Top disease: {stats.mostCommon}</p>
      <p>Avg confidence: {stats.avgConfidence}</p>
    </div>
  );
}
