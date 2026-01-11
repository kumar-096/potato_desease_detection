export function getUserStats(history = []) {
  if (!history.length) {
    return {
      totalScans: 0,
      lastScan: "N/A",
      mostCommon: "N/A",
      avgConfidence: "N/A",
      trend: [],
    };
  }

  const totalScans = history.length;
  const lastScan = history[0].date;

  const diseaseCount = {};
  history.forEach((h) => {
    diseaseCount[h.prediction] =
      (diseaseCount[h.prediction] || 0) + 1;
  });

  const mostCommon = Object.entries(diseaseCount)
    .sort((a, b) => b[1] - a[1])[0][0];

  const avgConfidence =
    (
      history.reduce((s, h) => s + h.confidence, 0) / totalScans
    ).toFixed(1) + "%";

  const trend = history
    .slice()
    .reverse()
    .map((h, i) => ({
      x: i + 1,
      y: h.confidence,
    }));

  return { totalScans, lastScan, mostCommon, avgConfidence, trend };
}
