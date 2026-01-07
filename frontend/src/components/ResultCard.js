import React from "react";
import "./ResultCard.css";

function ResultCard({ result }) {
  if (!result || !result.prediction) return null;

  const confidence =
    typeof result.confidence === "number"
      ? (result.confidence * 100).toFixed(2)
      : "—";

  return (
    <div className={`result-card ${result.prediction.toLowerCase()}`}>
      <h2>Prediction Result</h2>
      <p>
        <strong>Disease:</strong> {result.prediction}
      </p>
      <p>
        <strong>Confidence:</strong> {confidence}%
      </p>
    </div>
  );
}

export default ResultCard;
