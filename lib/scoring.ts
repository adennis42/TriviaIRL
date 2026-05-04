/**
 * Server-authoritative scoring functions.
 * These run ONLY on the server (/api/scoring route).
 * Never import these in client components.
 */

export function calculatePoints(
  pointValue: number,
  timerSeconds: number,
  timeRemaining: number, // seconds left when answered
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;
  if (timeRemaining <= 0) return Math.floor(pointValue * 0.4);
  const ratio = timeRemaining / timerSeconds;
  const earned = Math.round(pointValue * (1 - ratio * 0.6));
  const minimum = Math.floor(pointValue * 0.4);
  return Math.max(earned, minimum);
}

export function calculateTeamScore(memberScores: number[]): number {
  if (memberScores.length === 0) return 0;
  const total = memberScores.reduce((sum, s) => sum + s, 0);
  return Math.floor(total / memberScores.length) * memberScores.length;
}
