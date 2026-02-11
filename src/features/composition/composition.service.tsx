import { z } from 'zod';
import myEnv from '@/lib/env';
import { myFetch } from '@/lib/beckend';

export const compositionSchema = z.object({
  id: z.number(),
  athlete_fk: z.number(),
  team_fk: z.number(),
  start_date: z.string(),
  end_date: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  jersey_number: z.number().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Composition = z.infer<typeof compositionSchema>;

// Risposta arricchita di getByAthlete — include nome squadra
export const compositionWithTeamSchema = compositionSchema.extend({
  team_name: z.string().optional().nullable(),
  team_logo: z.string().optional().nullable(),
});
export type CompositionWithTeam = z.infer<typeof compositionWithTeamSchema>;

// Risposta arricchita di getByTeam — include dati atleta
export const compositionWithAthleteSchema = compositionSchema.extend({
  athlete_first_name: z.string().optional().nullable(),
  athlete_last_name: z.string().optional().nullable(),
  athlete_fiscal_code: z.string().optional().nullable(),
  athlete_tournaments_won: z.number().optional().nullable(),
});
export type CompositionWithAthlete = z.infer<typeof compositionWithAthleteSchema>;

// Schema create
export const compositionCreateSchema = z.object({
  athlete_fk: z.number(),
  team_fk: z.number(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  role: z.string().min(1).max(30).optional(),
  jersey_number: z.number().min(1).max(99).optional(),
});
export type CompositionCreate = z.infer<typeof compositionCreateSchema>;

export const compositionUpdateSchema = compositionCreateSchema
  .omit({ athlete_fk: true, team_fk: true })
  .partial();
export type CompositionUpdate = z.infer<typeof compositionUpdateSchema>;

// ─── Service ──────────────────────────────────────────────────────────────────

const BASE = `${myEnv.backEndApiUrl}/compositions`;

export const CompositionService = {

  /** GET /api/compositions */
  getAll: async (): Promise<Composition[]> => {
    const data = await myFetch<Composition[]>(BASE);
    return z.array(compositionSchema).parse(data);
  },

  /** GET /api/compositions/athlete/{id} — include team_name, team_logo */
  getByAthlete: async (athleteId: number): Promise<CompositionWithTeam[]> => {
    const data = await myFetch<CompositionWithTeam[]>(`${BASE}/athlete/${athleteId}`);
    return z.array(compositionWithTeamSchema).parse(data);
  },

  /** GET /api/compositions/team/{id} — include dati atleta */
  getByTeam: async (teamId: number): Promise<CompositionWithAthlete[]> => {
    const data = await myFetch<CompositionWithAthlete[]>(`${BASE}/team/${teamId}`);
    return z.array(compositionWithAthleteSchema).parse(data);
  },

  /** POST /api/compositions — assegna atleta a squadra (duplicati gestiti lato server) */
  create: async (payload: CompositionCreate): Promise<Composition> => {
    const data = await myFetch<Composition>(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return compositionSchema.parse(data);
  },

  /** PATCH /api/compositions/{id}/terminate — imposta end_date = oggi */
  terminate: async (id: number): Promise<Composition> => {
    const data = await myFetch<Composition>(`${BASE}/${id}/terminate`, {
      method: 'PATCH',
    });
    return compositionSchema.parse(data);
  },

  /** PUT /api/compositions/{id} */
  update: async (id: number, payload: CompositionUpdate): Promise<Composition> => {
    const data = await myFetch<Composition>(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return compositionSchema.parse(data);
  },

  /** DELETE /api/compositions/{id} */
  delete: async (id: number): Promise<void> => {
    await myFetch<void>(`${BASE}/${id}`, { method: 'DELETE' });
  },
};