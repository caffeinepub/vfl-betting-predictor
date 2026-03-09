import type { Team } from "../backend.d";

export interface PredictionResult {
  homeScore: number;
  awayScore: number;
  homeExpected: number;
  awayExpected: number;
  homeAttackRating: number;
  homeDefenseRating: number;
  awayAttackRating: number;
  awayDefenseRating: number;
  homePositionFactor: number;
  awayPositionFactor: number;
  verdict: "Home Win" | "Away Win" | "Draw";
}

function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export function generatePrediction(
  homeTeam: Team,
  awayTeam: Team,
): PredictionResult {
  const homePlayed = Number(homeTeam.played) || 1;
  const awayPlayed = Number(awayTeam.played) || 1;

  const homeAttackRating = Number(homeTeam.goalsFor) / homePlayed;
  const homeDefenseRating = Number(homeTeam.goalsAgainst) / homePlayed;
  const awayAttackRating = Number(awayTeam.goalsFor) / awayPlayed;
  const awayDefenseRating = Number(awayTeam.goalsAgainst) / awayPlayed;

  const homePositionFactor = (21 - Number(homeTeam.position)) / 20;
  const awayPositionFactor = (21 - Number(awayTeam.position)) / 20;

  let homeExpected = homeAttackRating * awayDefenseRating + 0.3;
  homeExpected = homeExpected * (0.8 + homePositionFactor * 0.4);

  let awayExpected = awayAttackRating * homeDefenseRating;
  awayExpected = awayExpected * (0.8 + awayPositionFactor * 0.4);

  // Ensure minimums
  homeExpected = Math.max(homeExpected, 0.3);
  awayExpected = Math.max(awayExpected, 0.3);

  const homeScore = Math.min(poissonRandom(homeExpected), 7);
  const awayScore = Math.min(poissonRandom(awayExpected), 7);

  let verdict: "Home Win" | "Away Win" | "Draw";
  if (homeScore > awayScore) verdict = "Home Win";
  else if (awayScore > homeScore) verdict = "Away Win";
  else verdict = "Draw";

  return {
    homeScore,
    awayScore,
    homeExpected,
    awayExpected,
    homeAttackRating,
    homeDefenseRating,
    awayAttackRating,
    awayDefenseRating,
    homePositionFactor,
    awayPositionFactor,
    verdict,
  };
}
