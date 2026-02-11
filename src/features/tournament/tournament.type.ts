export type Tournament = {
  id: number;
  name: string;
  start_date: string;
  is_active: boolean;
  location: string;
  number_of_teams?: number;
  created_at: string;
  updated_at: string;
}

export type TournamentCreate = Omit<Tournament, 'id' | 'created_at' | 'updated_at' | 'is_active'> & {
  is_active?: boolean;
};

export type GameUpdate = {
  home_score: number;
  away_score: number;
};

export type BracketGenerate = {
  team_ids: number[];              
  name?: string;                   
  start_date?: string;             
  is_active?: boolean;             
  number_of_teams?: number;        
  location?: string;               
  tournament_id?: number;          
};