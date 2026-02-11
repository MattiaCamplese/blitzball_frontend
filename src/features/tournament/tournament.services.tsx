import myEnv from '@/lib/env';
import { myFetch } from '@/lib/beckend';
import type { BracketGenerate, GameUpdate, Tournament, TournamentCreate } from './tournament.type';
import type { Game } from '../game/game.type';



// Tournament Service
export const TournamentService = {
  getAll: async (): Promise<Tournament[]> => {
    const data = await myFetch<Tournament[]>(`${myEnv.backEndApiUrl}/tournaments`);
    return data;
  },

  getById: async (id: number): Promise<Tournament> => {
    const data = await myFetch<Tournament>(`${myEnv.backEndApiUrl}/tournaments/${id}`);
    return data;
  },

  create: async (tournamentData: TournamentCreate): Promise<Tournament> => {
    const data = await myFetch<Tournament>(`${myEnv.backEndApiUrl}/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournamentData),
    });
    return data;
  },

  update: async (id: number, tournamentData: Partial<TournamentCreate>): Promise<Tournament> => {
    const data = await myFetch<Tournament>(`${myEnv.backEndApiUrl}/tournaments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournamentData),
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await myFetch<void>(`${myEnv.backEndApiUrl}/tournaments/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bracket Generator Service
export const BracketService = {
  // Genera un nuovo bracket
  generate: async (data: BracketGenerate): Promise<Game[]> => {
    console.log('Generazione bracket con dati:', data);
    
    try {
      const games = await myFetch<Game[]>(`${myEnv.backEndApiUrl}/brackets_generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Bracket generato con successo:', games);
      return games;
    } catch (error) {
      console.error('Errore nella generazione del bracket:', error);
      throw error;
    }
  },

  // Ottieni tutte le partite di un torneo
  getByTournament: async (tournamentId: number): Promise<Game[]> => {
    const data = await myFetch<Game[]>(
      `${myEnv.backEndApiUrl}/brackets_generator/${tournamentId}`
    );
    return data;
  },

  // Ottieni la finale
  getFinal: async (tournamentId: number): Promise<{
    final_game_id: number;
    winner_team_id: number;
    score: string;
  }> => {
    const data = await myFetch<{
      final_game_id: number;
      winner_team_id: number;
      score: string;
    }>(`${myEnv.backEndApiUrl}/brackets_generator/${tournamentId}/final`);
    return data;
  },

  // Aggiorna il risultato di una partita
  updateGame: async (gameId: number, scores: GameUpdate): Promise<{ winner_team_id: number }> => {
    const data = await myFetch<{ winner_team_id: number }>(
      `${myEnv.backEndApiUrl}/brackets_generator/${gameId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scores),
      }
    );
    return data;
  },
};
