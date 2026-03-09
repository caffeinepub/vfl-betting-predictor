import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Prediction {
    id: bigint;
    homeTeam: string;
    note: string;
    homeScore: bigint;
    timestamp: Time;
    awayTeam: string;
    awayScore: bigint;
}
export interface Team {
    goalDiff: bigint;
    played: bigint;
    name: string;
    wins: bigint;
    goalsFor: bigint;
    losses: bigint;
    goalsAgainst: bigint;
    position: bigint;
    draws: bigint;
    points: bigint;
}
export interface backendInterface {
    deletePrediction(id: bigint): Promise<boolean>;
    getPredictions(): Promise<Array<Prediction>>;
    getTeams(): Promise<Array<Team>>;
    savePrediction(homeTeam: string, awayTeam: string, homeScore: bigint, awayScore: bigint, note: string): Promise<bigint>;
}
