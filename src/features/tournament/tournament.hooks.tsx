import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BracketService, TournamentService } from './tournament.services';
import type { BracketGenerate, GameUpdate, TournamentCreate } from './tournament.type';


// Hooks per Tournament
export const useTournaments = () => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: TournamentService.getAll,
  });
};

export const useTournament = (id: number) => {
  return useQuery({
    queryKey: ['tournaments', id],
    queryFn: () => TournamentService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TournamentCreate) => TournamentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TournamentCreate> }) =>
      TournamentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
};

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => TournamentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
};

// Hooks per Bracket Generator
export const useGenerateBracket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BracketGenerate) => BracketService.generate(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      if (variables.tournament_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['bracket', variables.tournament_id] 
        });
      }
    },
  });
};

export const useBracket = (tournamentId: number) => {
  return useQuery({
    queryKey: ['bracket', tournamentId],
    queryFn: () => BracketService.getByTournament(tournamentId),
    enabled: !!tournamentId,
  });
};

export const useTournamentFinal = (tournamentId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['tournament-final', tournamentId],
    queryFn: () => BracketService.getFinal(tournamentId),
    enabled: !!tournamentId && enabled,
    retry: false,
    // Non generare errore se la finale non è disponibile
    throwOnError: false,
  });
};

export const useUpdateGameResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, scores, tournamentId }: { 
      gameId: number; 
      scores: GameUpdate;
      tournamentId: number;
    }) => BracketService.updateGame(gameId, scores),
    onSuccess: (_, variables) => {
      // Invalida tutte le query relative al torneo
      queryClient.invalidateQueries({ 
        queryKey: ['bracket', variables.tournamentId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['tournament-final', variables.tournamentId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['tournaments', variables.tournamentId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['teams'] 
      });
    },
  });
};