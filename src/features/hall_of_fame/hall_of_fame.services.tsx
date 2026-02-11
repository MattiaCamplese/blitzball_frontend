import { myFetch } from '@/lib/beckend';
import myEnv from '@/lib/env';
import type { HallOfFame } from './hall_of_fame.type';


export const HallOfFameService = {
  getAll: async (): Promise<HallOfFame[]> => {
    return myFetch<HallOfFame[]>(`${myEnv.backEndApiUrl}/halls_of_fame`);
  },

  delete: async (id: number): Promise<void> => {
    await myFetch<void>(`${myEnv.backEndApiUrl}/halls_of_fame/${id}`, { method: 'DELETE' });
  },
};