import React from "react";
import "./ResultCard.css";

function ResultCard({ result }) {
  // ✅ Guard clause (MOST IMPORTANT)
  if (!result || !result.prediction) {
    return null; // or a placeholder UI
  }

  const prediction = result.prediction.toLowerCase();
  const confidence = (result.confidence * 100).toFixed(2);

  return (
    <div className={`result-card ${prediction}`}>
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
