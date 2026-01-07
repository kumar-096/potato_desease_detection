import { getSuggestions } from "../utils/suggestions";

export default function ResultCard({ result }) {
  if (!result) return null;

  const isHealthy = result.prediction.toLowerCase().includes("healthy");

  // 🧠 Explainable AI text mapping
  const explanationMap = {
    "Early Blight":
      "The model focused on small brown lesions scattered across the leaf surface, which are typical symptoms of early blight.",
    "Late Blight":
      "The model focused on large dark regions near the leaf edges, indicating tissue decay commonly seen in late blight.",
    Healthy:
      "The model observed a uniform green texture with no abnormal disease patterns.",
  };

  return (
    <div className={`card result ${isHealthy ? "healthy" : "diseased"}`}>
      <h2>{isHealthy ? "✅ Healthy Leaf" : "⚠️ Disease Detected"}</h2>

      <p>
        <strong>Prediction:</strong> {result.prediction}
      </p>

      {/* ===============================
          CONFIDENCE
      =============================== */}
      <div className="confidence-box">
        <div className="confidence-text">
          <strong>Confidence:</strong>{" "}
          {(result.confidence * 100).toFixed(2)}%
        </div>

        <div className="confidence-bar">
          <div
            className={`confidence-fill ${
              result.confidence >= 0.8
                ? "high"
                : result.confidence >= 0.5
                ? "medium"
                : "low"
            }`}
            style={{ width: `${result.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* ===============================
          GRAD-CAM HEATMAP
      =============================== */}
      {result.heatmap && (
        <div className="heatmap-section">
          <h3>🧠 Model Explanation (Grad-CAM)</h3>
          <img
            src={result.heatmap}
            alt="Grad-CAM Heatmap"
            className="heatmap-img"
          />
          <p className="explanation-text">
            {explanationMap[result.prediction]}
          </p>
        </div>
      )}

      {/* ===============================
          TREATMENT SUGGESTIONS
      =============================== */}
      <div className="suggestions">
        <h3>🧪 Treatment Suggestions</h3>
        <ul>
          {getSuggestions(result.prediction).map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
