import type { NutritionKey, ResultScores } from "@/types/test";

type NutritionRadarChartProps = {
  keys: NutritionKey[];
  labels: Record<NutritionKey, string>;
  scores: ResultScores;
  maxScore?: number;
};

const center = 120;
const radius = 72;
const labelRadius = 100;

function getPoint(index: number, total: number, pointRadius: number) {
  const angle = ((Math.PI * 2) / total) * index - Math.PI / 2;

  return {
    x: center + Math.cos(angle) * pointRadius,
    y: center + Math.sin(angle) * pointRadius
  };
}

function toPoints(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
}

export function NutritionRadarChart({ keys, labels, scores, maxScore = 6 }: NutritionRadarChartProps) {
  const total = keys.length;
  const gridPolygons = [1, 2, 3].map((level) => {
    const levelRadius = (radius / 3) * level;
    return toPoints(keys.map((_, index) => getPoint(index, total, levelRadius)));
  });
  const axes = keys.map((_, index) => getPoint(index, total, radius));
  const scorePoints = keys.map((key, index) => {
    const ratio = Math.max(0, Math.min(1, (scores[key] || 0) / maxScore));
    return getPoint(index, total, radius * ratio);
  });

  return (
    <div className="nutrition-radar" aria-label="내게 필요한 영양소 점수">
      <svg className="nutrition-radar-chart" viewBox="0 0 240 240" role="img" aria-labelledby="nutrition-radar-title">
        <title id="nutrition-radar-title">내게 필요한 영양소 레이더 차트</title>
        <g className="nutrition-radar-grid">
          {gridPolygons.map((points, index) => (
            <polygon key={index} points={points} />
          ))}
          {axes.map((point, index) => (
            <line key={keys[index]} x1={center} y1={center} x2={point.x} y2={point.y} />
          ))}
        </g>
        <polygon className="nutrition-radar-shape" points={toPoints(scorePoints)} />
        <polyline className="nutrition-radar-line" points={`${toPoints(scorePoints)} ${scorePoints[0].x.toFixed(2)},${scorePoints[0].y.toFixed(2)}`} />
        {scorePoints.map((point, index) => (
          <circle className="nutrition-radar-point" key={keys[index]} cx={point.x} cy={point.y} r="4" />
        ))}
        {keys.map((key, index) => {
          const point = getPoint(index, total, labelRadius);

          return (
            <text className="nutrition-radar-label" key={key} x={point.x} y={point.y}>
              {labels[key]}
            </text>
          );
        })}
      </svg>
      <div className="nutrition-radar-legend">
        {keys.map((key) => (
          <div className="nutrition-radar-legend-item" key={key}>
            <span>{labels[key]}</span>
            <b>{scores[key] || 0}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
