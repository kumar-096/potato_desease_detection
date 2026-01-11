import { Bar } from "react-chartjs-2";

export default function AdminDashboard({ history }) {
  const counts = {};
  history.forEach(h => {
    counts[h.prediction] = (counts[h.prediction] || 0) + 1;
  });

  return (
    <div className="card">
      <h3>📊 Admin Analytics</h3>
      <Bar
        data={{
          labels: Object.keys(counts),
          datasets: [
            {
              label: "Scans",
              data: Object.values(counts),
              backgroundColor: "#4caf50",
            },
          ],
        }}
      />
    </div>
  );
}
