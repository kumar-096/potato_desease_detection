// src/utils/weatherRisk.js

// 🔐 Load API key from environment (BEST PRACTICE)
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export const fetchWeatherRisk = async (lat, lon) => {
  try {
    // ❌ Safety check
    if (!API_KEY) {
      throw new Error("OpenWeather API key missing");
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
      throw new Error("Weather API request failed");
    }

    const data = await res.json();

    // ❌ Invalid API response guard
    if (!data || !data.main) {
      return {
        risk: "Unknown",
        message: "Weather data unavailable.",
      };
    }

    // ✅ Extract features
    const temp = data.main.temp ?? 0;
    const humidity = data.main.humidity ?? 0;
    const rain = Boolean(data.rain); // true if rain exists

    // 🌱 Disease risk logic
    let risk = "Low";
    let message = "Weather conditions are safe for potato crops.";

    if (humidity > 80 && rain) {
      risk = "High";
      message =
        "High risk of fungal disease. Avoid overhead irrigation and monitor crops closely.";
    } else if (humidity > 65) {
      risk = "Medium";
      message =
        "Moderate disease risk. Ensure good air circulation and preventive spraying.";
    }

    return {
      temp,
      humidity,
      risk,
      message,
    };
  } catch (error) {
    console.error("❌ Weather fetch error:", error.message);
    return {
      risk: "Unknown",
      message: "Unable to fetch weather data.",
    };
  }
};
