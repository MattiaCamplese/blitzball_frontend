import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HallOfFameService } from './hall_of_fame.services';
import type { HallOfFame } from './hall_of_fame.type';

export const useHallOfFame = () => {
  return useQuery<HallOfFame[]>({
    queryKey: ['hall-of-fame'],
    queryFn: HallOfFameService.getAll,
  });
};

export const useDeleteHallOfFame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => HallOfFameService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hall-of-fame'] }),
  });
};