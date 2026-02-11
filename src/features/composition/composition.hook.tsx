import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompositionService, type CompositionCreate, type CompositionUpdate } from './composition.service';

 
export const compositionKeys = {
  all: ['compositions'] as const,
  byAthlete: (athleteId: number) => ['compositions', 'athlete', athleteId] as const,
  byTeam: (teamId: number) => ['compositions', 'team', teamId] as const,
};

export const useCompositions = () =>
  useQuery({
    queryKey: compositionKeys.all,
    queryFn: CompositionService.getAll,
  });

export const useCompositionsByAthlete = (athleteId: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: compositionKeys.byAthlete(athleteId),
    queryFn: () => CompositionService.getByAthlete(athleteId),
    enabled: (options?.enabled ?? true) && !!athleteId,
  });

export const useCompositionsByTeam = (teamId: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: compositionKeys.byTeam(teamId),
    queryFn: () => CompositionService.getByTeam(teamId),
    enabled: (options?.enabled ?? true) && !!teamId,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateComposition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CompositionCreate) => CompositionService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: compositionKeys.all });
      queryClient.invalidateQueries({ queryKey: compositionKeys.byAthlete(variables.athlete_fk) });
      queryClient.invalidateQueries({ queryKey: compositionKeys.byTeam(variables.team_fk) });
    },
  });
};

/** Termina una composizione attiva (setta end_date = oggi) */
export const useTerminateComposition = (athleteId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CompositionService.terminate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compositionKeys.all });
      if (athleteId) {
        queryClient.invalidateQueries({ queryKey: compositionKeys.byAthlete(athleteId) });
      }
    },
  });
};

export const useUpdateComposition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CompositionUpdate }) =>
      CompositionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compositionKeys.all });
    },
  });
};

export const useDeleteComposition = (athleteId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CompositionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compositionKeys.all });
      if (athleteId) {
        queryClient.invalidateQueries({ queryKey: compositionKeys.byAthlete(athleteId) });
      }
    },
  });
};