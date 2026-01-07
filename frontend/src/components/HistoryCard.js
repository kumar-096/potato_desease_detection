export default function HistoryCard({ history, onClear }) {
  if (!history.length) return null;

  return (
    <div className="card history">
      <div className="history-header">
        <h3>📜 Scan History</h3>
        <button onClick={onClear}>Clear</button>
      </div>

      <ul>
        {history.map((h, i) => (
          <li key={i}>
            <strong>{h.prediction}</strong>
            <span>{(h.confidence * 100).toFixed(1)}%</span>
            <small>{h.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
