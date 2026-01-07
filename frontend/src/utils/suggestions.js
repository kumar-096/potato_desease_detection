export const getSuggestions = (prediction) => {
  if (!prediction) return [];

  const p = prediction.toLowerCase();

  if (p.includes("healthy")) {
    return [
      "Crop is healthy 🌱",
      "Continue regular monitoring",
      "Maintain proper irrigation",
      "Use preventive fungicide if required",
    ];
  }

  if (p.includes("early")) {
    return [
      "Remove infected leaves immediately",
      "Apply recommended fungicide",
      "Avoid overhead irrigation",
      "Practice crop rotation",
    ];
  }

  if (p.includes("late")) {
    return [
      "Destroy severely infected plants",
      "Apply strong fungicide urgently",
      "Avoid excess moisture",
      "Do not compost infected plants",
    ];
  }

  return ["Consult a local agriculture expert"];
};
