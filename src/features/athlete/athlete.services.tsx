import { z } from 'zod';
import myEnv from '@/lib/env';
import { myFetch } from '@/lib/beckend';


export const athleteSchema = z.object({
  id: z.number(),
  fiscal_code: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  birth_place: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  img: z.string().optional().nullable(),
  tournaments_won: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Athlete = z.infer<typeof athleteSchema>;

export const athleteCreateSchema = athleteSchema.omit({
  id: true,
  tournaments_won: true,
  created_at: true,
  updated_at: true,
}).extend({
  tournaments_won: z.number().default(0).optional(),
  img: z.string().optional().nullable(),
});

export type AthleteCreate = z.infer<typeof athleteCreateSchema>;

export const AthleteService = {
  getAll: async (): Promise<Athlete[]> => {
    const url = `${myEnv.backEndApiUrl}/athletes`;
    console.log('Chiamando URL:', url); // DEBUG
    const data = await myFetch<Athlete[]>(url);
    console.log('Dati ricevuti:', data); // DEBUG
    return data;
  },

  getById: async (id: number): Promise<Athlete> => {
    const data = await myFetch<Athlete>(`${myEnv.backEndApiUrl}/athletes/${id}`);
    return athleteSchema.parse(data);
  },

  getByFiscalCode: async (fiscalCode: string): Promise<Athlete> => {
    const data = await myFetch<Athlete>(`${myEnv.backEndApiUrl}/athletes/fiscal-code/${fiscalCode}`);
    return athleteSchema.parse(data);
  },

  create: async (athleteData: AthleteCreate): Promise<Athlete> => {
    const data = await myFetch<Athlete>(`${myEnv.backEndApiUrl}/athletes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(athleteData),
    });
    return data;
  },

  update: async (id: number, athleteData: Partial<AthleteCreate>): Promise<Athlete> => {
    const data = await myFetch<Athlete>(`${myEnv.backEndApiUrl}/athletes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(athleteData),
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await myFetch<void>(`${myEnv.backEndApiUrl}/athletes/${id}`, {
      method: 'DELETE',
    });
  },
};