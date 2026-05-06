import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AthleteService, type Athlete, type AthleteCreate } from './athlete.services';

export const useAthletes = () => {
  return useQuery({
    queryKey: ['athletes'],
    queryFn: AthleteService.getAll,
    // Auto-retry up to 3 times if backend returns empty (Render cold-start)
    refetchInterval: (query) => {
      const count = query.state.dataUpdateCount ?? 0;
      if (count < 3 && query.state.data?.length === 0) return 3000;
      return false;
    },
  });
};

export const useAthlete = (id: number) => {
  return useQuery({
    queryKey: ['athletes', id],
    queryFn: () => AthleteService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAthlete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AthleteCreate) => AthleteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });
};

export const useUpdateAthlete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Athlete> }) =>
      AthleteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });
};

export const useDeleteAthlete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => AthleteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });
};