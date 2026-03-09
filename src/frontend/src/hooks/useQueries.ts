import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Prediction, Team } from "../backend.d";
import { useActor } from "./useActor";

export function useGetTeams() {
  const { actor, isFetching } = useActor();
  return useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTeams();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetPredictions() {
  const { actor, isFetching } = useActor();
  return useQuery<Prediction[]>({
    queryKey: ["predictions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPredictions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePrediction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      note,
    }: {
      homeTeam: string;
      awayTeam: string;
      homeScore: bigint;
      awayScore: bigint;
      note: string;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.savePrediction(
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        note,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
  });
}

export function useDeletePrediction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor available");
      return actor.deletePrediction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
  });
}

export type { Team, Prediction };
