export default function WeatherRiskCard({ weather }) {
  if (!weather || weather.risk === "Unknown") {
    return (
      <div className="card result">
        <h3>🌦️ Weather Disease Risk</h3>
        <p>Weather data not available.</p>
      </div>
    );
  }

  return (
    <div className={`card result ${weather.risk.toLowerCase()}`}>
      <h3>🌦️ Weather Disease Risk</h3>

      <p><strong>Temperature:</strong> {weather.temp}°C</p>
      <p><strong>Humidity:</strong> {weather.humidity}%</p>

      <p>
        <strong>Risk Level:</strong>{" "}
        {weather.risk === "High"
          ? "🔴 High"
          : weather.risk === "Medium"
          ? "🟡 Medium"
          : "🟢 Low"}
      </p>

      <p>{weather.message}</p>
    </div>
  );
}
