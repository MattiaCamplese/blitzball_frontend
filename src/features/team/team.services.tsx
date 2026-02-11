import { z } from 'zod';
import myEnv from '@/lib/env';
import { myFetch } from '@/lib/beckend';


export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  tournaments_won: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Team = z.infer<typeof teamSchema>;

export const teamCreateSchema = teamSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  tournaments_won: z.number().default(0).optional(),
  logo: z.string().optional().nullable(),
});

export type TeamCreate = z.infer<typeof teamCreateSchema>;

export const TeamService = {
  getAll: async (): Promise<Team[]> => {
    const url = `${myEnv.backEndApiUrl}/teams`;
    console.log('Chiamando URL:', url); // DEBUG
    const data = await myFetch<Team[]>(url);
    console.log('Dati ricevuti:', data); // DEBUG
    return data;
  },

  getById: async (id: number): Promise<Team> => {
    const data = await myFetch<Team>(`${myEnv.backEndApiUrl}/teams/${id}`);
    return teamSchema.parse(data);
  },

  getByName: async (name: string): Promise<Team> => {
    const data = await myFetch<Team>(`${myEnv.backEndApiUrl}/teams/fiscal-code/${name}`);
    return teamSchema.parse(data);
  },

  create: async (teamData: TeamCreate): Promise<Team> => {
    const data = await myFetch<Team>(`${myEnv.backEndApiUrl}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    return data;
  },

  update: async (id: number, teamData: Partial<TeamCreate>): Promise<Team> => {
    const data = await myFetch<Team>(`${myEnv.backEndApiUrl}/teams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await myFetch<void>(`${myEnv.backEndApiUrl}/teams/${id}`, {
      method: 'DELETE',
    });
  },
};