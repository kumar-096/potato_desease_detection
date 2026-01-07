export default function HistoryCard({ prediction, confidence, date }) {
  if (!prediction) return null;

  return (
    <div className="history-item">
      <strong>{prediction}</strong>
      <span>{confidence}%</span>
      <small>{date}</small>
    </div>
  );
}
