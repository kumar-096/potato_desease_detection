export function getUserStats(history = []) {
  if (!Array.isArray(history) || history.length === 0) {
    return {
      totalScans: 0,
      lastScan: "N/A",
      mostCommon: "N/A",
      avgConfidence: "N/A",
    };
  }

  const totalScans = history.length;
  const lastScan = history[0]?.date || "N/A";

  const diseaseCount = {};
  history.forEach((h) => {
    if (!h?.prediction) return;
    diseaseCount[h.prediction] =
      (diseaseCount[h.prediction] || 0) + 1;
  });

  const mostCommon =
    Object.entries(diseaseCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  const avgConfidence =
    (
      history.reduce((sum, h) => sum + (h.confidence || 0), 0) /
      totalScans
    ).toFixed(1) + "%";

  return {
    totalScans,
    lastScan,
    mostCommon,
    avgConfidence,
  };
}
