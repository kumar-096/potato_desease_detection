import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Analytics({ history }) {
  if (!history.length) {
    return <div className="card">No analytics data yet</div>;
  }

  const diseaseCounts = {};
  history.forEach((h) => {
    diseaseCounts[h.prediction] =
      (diseaseCounts[h.prediction] || 0) + 1;
  });

  const data = {
    labels: Object.keys(diseaseCounts),
    datasets: [
      {
        data: Object.values(diseaseCounts),
        backgroundColor: [
          "#4caf50",
          "#ff9800",
          "#2196f3",
          "#e91e63",
        ],
      },
    ],
  };

  return (
    <div className="card">
      <h3>📊 Analytics Overview</h3>
      <Pie data={data} />
    </div>
  );
}
