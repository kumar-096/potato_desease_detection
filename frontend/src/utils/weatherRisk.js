const API_KEY = "YOUR_OPENWEATHER_API_KEY";

export const fetchWeatherRisk = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    // ❌ API error or invalid response
    if (!data || !data.main) {
      return {
        risk: "Unknown",
        message: "Weather data unavailable.",
      };
    }

    const humidity = data.main.humidity ?? 0;
    const temp = data.main.temp ?? 0;
    const rain = data.rain ? true : false;

    let risk = "Low";
    let message = "Weather conditions are safe.";

    if (humidity > 80 && rain) {
      risk = "High";
      message =
        "High risk of fungal disease. Avoid overhead irrigation and monitor crops closely.";
    } else if (humidity > 65) {
      risk = "Medium";
      message =
        "Moderate disease risk. Ensure good air circulation.";
    }

    return {
      temp,
      humidity,
      risk,
      message,
    };
  } catch (error) {
    return {
      risk: "Unknown",
      message: "Unable to fetch weather data.",
    };
  }
};
